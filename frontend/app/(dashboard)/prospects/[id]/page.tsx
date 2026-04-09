"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { prospectsApi } from "@/lib/api";
import { ArrowLeft, Mail, Phone, Globe, Linkedin } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ProspectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: prospect, isLoading } = useQuery({
    queryKey: ["prospect", id],
    queryFn: () => prospectsApi.get(id).then((r) => r.data.data),
  });

  if (isLoading) return <div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-1/3" /><div className="h-48 bg-gray-200 rounded" /></div>;
  if (!prospect) return <div className="text-center py-12 text-gray-500">Prospect not found</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="text-2xl font-bold text-gray-900">{prospect.firstName} {prospect.lastName}</h1>
        <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">{prospect.status}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Info</h2>
          <div className="space-y-3">
            {prospect.email && <div className="flex items-center gap-3 text-sm"><Mail className="h-4 w-4 text-gray-400" /><a href={`mailto:${prospect.email}`} className="text-blue-600 hover:underline">{prospect.email}</a></div>}
            {prospect.phone && <div className="flex items-center gap-3 text-sm"><Phone className="h-4 w-4 text-gray-400" /><span>{prospect.phone}</span></div>}
            {prospect.website && <div className="flex items-center gap-3 text-sm"><Globe className="h-4 w-4 text-gray-400" /><a href={prospect.website} target="_blank" rel="noopener" className="text-blue-600 hover:underline">{prospect.website}</a></div>}
            {prospect.linkedinUrl && <div className="flex items-center gap-3 text-sm"><Linkedin className="h-4 w-4 text-gray-400" /><a href={prospect.linkedinUrl} target="_blank" rel="noopener" className="text-blue-600 hover:underline">LinkedIn Profile</a></div>}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Company</span><span className="font-medium">{prospect.company || "—"}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Job Title</span><span className="font-medium">{prospect.jobTitle || "—"}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Source</span><span className="font-medium">{prospect.source || "—"}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Added</span><span className="font-medium">{formatDate(prospect.createdAt)}</span></div>
          </div>
        </div>
      </div>

      {prospect.notes && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Notes</h2>
          <p className="text-gray-600 text-sm whitespace-pre-wrap">{prospect.notes}</p>
        </div>
      )}

      {prospect.activities?.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity</h2>
          <div className="space-y-3">
            {prospect.activities.map((a: any) => (
              <div key={a.id} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-700">{a.description}</p>
                  <p className="text-xs text-gray-400">{formatDate(a.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
