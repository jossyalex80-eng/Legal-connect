export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, subject, message } = data ?? {};

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await prisma.contactSubmission.create({
      data: { name, email, subject, message },
    });

    // Send email notification
    try {
      const appUrl = process.env.NEXTAUTH_URL ?? '';
      const appName = appUrl ? new URL(appUrl).hostname?.split('.')?.[0] : 'Legal Connect';

      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3a8a; border-bottom: 2px solid #d4a843; padding-bottom: 10px;">New Contact Form Submission</h2>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
            <p style="margin: 10px 0;"><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #1e3a8a;">${message}</div>
          </div>
          <p style="color: #666; font-size: 12px;">Submitted at: ${new Date().toLocaleString()}</p>
        </div>
      `;

      await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deployment_token: process.env.ABACUSAI_API_KEY,
          app_id: process.env.WEB_APP_ID,
          notification_id: process.env.NOTIF_ID_CONTACT_FORM_SUBMISSION,
          subject: `New Contact: ${subject}`,
          body: htmlBody,
          is_html: true,
          recipient_email: 'jossyalex80@gmail.com',
          reply_to: email,
          sender_email: appUrl ? `noreply@${new URL(appUrl).hostname}` : undefined,
          sender_alias: 'Legal Connect',
        }),
      });
    } catch (emailErr) {
      console.error('Email notification error:', emailErr);
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to submit message' }, { status: 500 });
  }
}
