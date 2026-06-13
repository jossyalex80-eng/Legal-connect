export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const caseData = await prisma.case.findFirst({
      where: { id: params?.id, clientId: session.user.id },
    });

    if (!caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    // Update status to analyzing
    await prisma.case.update({
      where: { id: caseData.id },
      data: { status: 'analyzing' },
    });

    // Get all approved lawyers with profiles
    const lawyers: any[] = await prisma.user.findMany({
      where: {
        role: 'lawyer',
        lawyerProfile: { isNot: null, verificationStatus: 'approved' as any },
      },
      include: { lawyerProfile: true },
    });

    if ((lawyers?.length ?? 0) === 0) {
      await prisma.case.update({ where: { id: caseData.id }, data: { status: 'submitted' } });
      return NextResponse.json({ error: 'No lawyers available for matching' }, { status: 404 });
    }

    // Build lawyer summaries for LLM
    const lawyerSummaries = lawyers.map((l: any, idx: number) => {
      const p = l?.lawyerProfile;
      return `Lawyer ${idx + 1} (ID: ${l?.id}):\n- Name: ${l?.name}\n- Practice Areas: ${JSON.stringify(p?.practiceAreas ?? [])}\n- Experience: ${p?.yearsExperience ?? 0} years\n- Location: ${l?.city ?? ''}, ${l?.state ?? ''}, ${l?.country ?? ''}\n- Rating: ${p?.rating ?? 5}/5\n- Fee: ${p?.consultationFee ?? 'Not specified'}\n- Bio: ${p?.bio ?? 'N/A'}`;
    }).join('\n\n');

    const systemPrompt = `You are a legal AI matchmaker. Given a client's case and available lawyers, select the top 3 best-matched lawyers and explain why each is a good match.

IMPORTANT: You MUST respond with valid JSON only, no markdown or code blocks. The JSON schema:
{
  "matches": [
    {
      "lawyerId": "the lawyer ID string",
      "matchPercentage": 85,
      "reason": "Explanation of why this lawyer is a good match",
      "rank": 1
    }
  ]
}

Scoring criteria (weight order):
1. Practice area match with case category (highest)
2. Years of experience relevant to case complexity
3. Location proximity to client
4. Rating and track record
5. Budget compatibility

Always return exactly 3 matches ranked 1-3. Match percentages should be between 70-99.`;

    const userPrompt = `Case Details:\n- Title: ${caseData?.title}\n- Description: ${caseData?.description}\n- Category: ${caseData?.legalCategory}\n- Urgency: ${caseData?.urgencyLevel}\n- Budget: ${caseData?.budgetRange ?? 'Not specified'}\n- Location: ${caseData?.city ?? ''}, ${caseData?.state ?? ''}, ${caseData?.country ?? ''}\n- Consultation Preference: ${caseData?.preferredConsultationMethod ?? 'Any'}\n\nAvailable Lawyers:\n${lawyerSummaries}\n\nSelect the top 3 best-matched lawyers and return JSON.`;

    // Call LLM API with streaming
    const llmResponse = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-5.4-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        stream: true,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!llmResponse?.ok) {
      await prisma.case.update({ where: { id: caseData.id }, data: { status: 'submitted' } });
      return NextResponse.json({ error: 'AI matching service unavailable' }, { status: 502 });
    }

    // Stream and buffer
    const reader = llmResponse.body?.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let partialRead = '';
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await (reader as any).read();
            if (done) break;
            partialRead += decoder.decode(value, { stream: true });
            const lines = partialRead.split('\n');
            partialRead = lines.pop() ?? '';
            for (const line of lines) {
              if (line?.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  // Process the buffered result
                  try {
                    const parsed = JSON.parse(buffer);
                    const matches = parsed?.matches ?? [];

                    // Delete existing recommendations
                    await prisma.caseRecommendation.deleteMany({ where: { caseId: caseData.id } });

                    // Create recommendations
                    for (const match of matches) {
                      const lawyer = lawyers.find((l: any) => l?.id === match?.lawyerId);
                      if (lawyer?.lawyerProfile) {
                        await prisma.caseRecommendation.create({
                          data: {
                            caseId: caseData.id,
                            lawyerId: match.lawyerId,
                            lawyerProfileId: lawyer.lawyerProfile.id,
                            matchPercentage: match?.matchPercentage ?? 80,
                            matchReason: match?.reason ?? 'Good match based on practice area and experience',
                            rank: match?.rank ?? 1,
                          },
                        });
                      }
                    }

                    await prisma.case.update({ where: { id: caseData.id }, data: { status: 'recommended' } });

                    const finalData = JSON.stringify({ status: 'completed', message: 'Matching complete' });
                    controller.enqueue(encoder.encode(`data: ${finalData}\n\n`));
                  } catch (parseErr) {
                    console.error('Parse error:', parseErr);
                    const errData = JSON.stringify({ status: 'error', message: 'Failed to parse AI response' });
                    controller.enqueue(encoder.encode(`data: ${errData}\n\n`));
                  }
                  controller.close();
                  return;
                }
                try {
                  const parsed = JSON.parse(data);
                  buffer += parsed?.choices?.[0]?.delta?.content ?? '';
                  const progressData = JSON.stringify({ status: 'processing', message: 'AI is analyzing your case...' });
                  controller.enqueue(encoder.encode(`data: ${progressData}\n\n`));
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
          controller.close();
        } catch (err) {
          console.error('Stream error:', err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('AI match error:', error);
    return NextResponse.json({ error: 'AI matching failed' }, { status: 500 });
  }
}
