'use client';

import { useState } from 'react';
import { approveDocumentAction, submitEiaReportAction } from '@/app/actions/cms';

export default function AdminDocumentsPage() {
  const [loadingDocId, setLoadingDocId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const pendingDocuments = [
    { id: 'doc-101', name: 'Environmental Impact Baseline Analysis.pdf' },
    { id: 'doc-102', name: 'Field Desk Site Assessment Form.pdf' },
  ];

  const currentAdminId = 'admin-user-01';

  const handleApprove = async (docId: string) => {
    setLoadingDocId(docId);
    setStatusMessage('');

    const response = await approveDocumentAction(docId, currentAdminId);

    if (response.success) {
      setStatusMessage(`Successfully approved document: ${docId}`);
    } else {
      setStatusMessage(`Approval failed: ${response.error}`);
    }
    setLoadingDocId(null);
  };

  const handleFormSubmit = async (formData: FormData) => {
    formData.append('authorId', currentAdminId);
    
    const response = await submitEiaReportAction(formData);

    if (response.success) {
      setStatusMessage('EIA Report submitted successfully!');
    } else {
      setStatusMessage(`Submission failed: ${response.error}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Admin CMS & Document Control</h1>

      {statusMessage && (
        <div className="p-3 bg-blue-50 text-blue-700 rounded border border-blue-200">
          {statusMessage}
        </div>
      )}

      <section className="p-4 border rounded-lg bg-white shadow-sm space-y-4">
        <h2 className="text-lg font-semibold">Pending Approvals</h2>
        <div className="space-y-3">
          {pendingDocuments.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 border rounded">
              <span>{doc.name}</span>
              <button
                onClick={() => handleApprove(doc.id)}
                disabled={loadingDocId === doc.id}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loadingDocId === doc.id ? 'Approving...' : 'Approve Document'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="p-4 border rounded-lg bg-white shadow-sm space-y-4">
        <h2 className="text-lg font-semibold">Submit New EIA Report</h2>
        <form action={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Report Title</label>
            <input
              type="text"
              name="title"
              required
              className="w-full p-2 border rounded"
              placeholder="e.g., Regional Water Resource Audit"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Project Scope</label>
            <textarea
              name="projectScope"
              required
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="Describe the technical and spatial scope..."
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
          >
            Submit EIA Report
          </button>
        </form>
      </section>
    </div>
  );
}