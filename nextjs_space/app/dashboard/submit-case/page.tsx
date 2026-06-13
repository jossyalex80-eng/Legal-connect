'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Loader2, Upload, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PRACTICE_AREAS, URGENCY_LEVELS, BUDGET_RANGES, CONSULTATION_METHODS } from '@/lib/constants';

export default function SubmitCasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<Array<{ name: string; path: string; isPublic: boolean }>>([]);

  const [form, setForm] = useState({
    title: '', description: '', legalCategory: '', urgencyLevel: 'Normal',
    budgetRange: '', country: 'Nigeria', state: '', city: '',
    preferredConsultationMethod: '',
  });

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e?.target?.files;
    if (!files || files.length === 0) return;

    setUploadingFiles(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file) continue;

        // Get presigned URL
        const presignedRes = await fetch('/api/upload/presigned', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type || 'application/octet-stream',
            isPublic: false,
          }),
        });

        if (!presignedRes.ok) {
          toast.error(`Failed to upload ${file.name}`);
          continue;
        }

        const { uploadUrl, cloud_storage_path } = await presignedRes.json();

        // Upload to S3
        const uploadRes = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type || 'application/octet-stream' },
          body: file,
        });

        if (uploadRes.ok) {
          setUploadedDocs((prev) => [...prev, { name: file.name, path: cloud_storage_path, isPublic: false }]);
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
      }
    } catch (err) {
      toast.error('File upload failed');
    } finally {
      setUploadingFiles(false);
    }
  };

  const removeDoc = (index: number) => {
    setUploadedDocs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.legalCategory) {
      toast.error('Please fill in case title, description, and legal category');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          supportingDocuments: uploadedDocs.map((d: any) => ({ name: d?.name, cloud_storage_path: d?.path, isPublic: d?.isPublic })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? 'Failed to submit case');
        setLoading(false);
        return;
      }

      toast.success('Case submitted! Starting AI matching...');

      // Trigger AI matching
      const caseId = data?.case?.id;
      if (caseId) {
        try {
          const matchRes = await fetch(`/api/cases/${caseId}/match`, { method: 'POST' });
          if (matchRes.ok && matchRes.body) {
            const reader = matchRes.body.getReader();
            const decoder = new TextDecoder();
            let partialRead = '';

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              partialRead += decoder.decode(value, { stream: true });
              const lines = partialRead.split('\n');
              partialRead = lines.pop() ?? '';

              for (const line of lines) {
                if (line?.startsWith('data: ')) {
                  const dataStr = line.slice(6);
                  try {
                    const parsed = JSON.parse(dataStr);
                    if (parsed?.status === 'completed') {
                      toast.success('AI matching complete! View your recommendations.');
                      router.replace(`/dashboard/my-cases/${caseId}`);
                      return;
                    } else if (parsed?.status === 'error') {
                      toast.error(parsed?.message ?? 'Matching failed');
                    }
                  } catch (e) {
                    // Skip
                  }
                }
              }
            }
          }
        } catch (matchErr) {
          console.error('AI matching error:', matchErr);
        }
      }

      router.replace('/dashboard/my-cases');
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-blue-900">Submit a New Case</h1>
        <p className="mt-1 text-sm text-gray-500">Describe your legal issue and our AI will match you with the best lawyers.</p>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Case Title *</Label>
            <Input id="title" value={form.title} onChange={(e: any) => updateForm('title', e?.target?.value ?? '')} placeholder="Brief title for your case" className="mt-1" />
          </div>

          <div>
            <Label htmlFor="description">Case Description *</Label>
            <Textarea id="description" value={form.description} onChange={(e: any) => updateForm('description', e?.target?.value ?? '')} placeholder="Describe your legal issue in detail. Include relevant facts, timeline, and what outcome you are seeking." rows={6} className="mt-1" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Legal Category *</Label>
              <select
                value={form.legalCategory}
                onChange={(e) => updateForm('legalCategory', e?.target?.value ?? '')}
                className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                {PRACTICE_AREAS.map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Urgency Level</Label>
              <select
                value={form.urgencyLevel}
                onChange={(e) => updateForm('urgencyLevel', e?.target?.value ?? '')}
                className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {URGENCY_LEVELS.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Budget Range</Label>
              <select
                value={form.budgetRange}
                onChange={(e) => updateForm('budgetRange', e?.target?.value ?? '')}
                className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select budget</option>
                {BUDGET_RANGES.map((range) => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Consultation Method</Label>
              <select
                value={form.preferredConsultationMethod}
                onChange={(e) => updateForm('preferredConsultationMethod', e?.target?.value ?? '')}
                className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Any method</option>
                {CONSULTATION_METHODS.map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label>Country</Label>
              <Input value={form.country} onChange={(e: any) => updateForm('country', e?.target?.value ?? '')} placeholder="Nigeria" className="mt-1" />
            </div>
            <div>
              <Label>State</Label>
              <Input value={form.state} onChange={(e: any) => updateForm('state', e?.target?.value ?? '')} placeholder="Lagos" className="mt-1" />
            </div>
            <div>
              <Label>City</Label>
              <Input value={form.city} onChange={(e: any) => updateForm('city', e?.target?.value ?? '')} placeholder="Lagos" className="mt-1" />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <Label>Supporting Documents</Label>
            <div className="mt-2 rounded-lg border-2 border-dashed border-gray-200 p-6 text-center">
              <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-500">Upload relevant documents</p>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="mt-3 text-sm"
                disabled={uploadingFiles}
              />
              {uploadingFiles && <p className="mt-2 text-xs text-blue-600"><Loader2 className="mr-1 inline h-3 w-3 animate-spin" />Uploading...</p>}
            </div>
            {(uploadedDocs?.length ?? 0) > 0 && (
              <div className="mt-3 space-y-2">
                {uploadedDocs.map((doc: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="flex-1 truncate text-green-800">{doc?.name}</span>
                    <button type="button" onClick={() => removeDoc(i)} className="text-gray-400 hover:text-red-500">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" disabled={loading} className="bg-blue-900 text-white hover:bg-blue-800">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
            {loading ? 'Submitting & Matching...' : 'Submit Case & Find Lawyers'}
          </Button>
        </form>
      </div>
    </div>
  );
}
