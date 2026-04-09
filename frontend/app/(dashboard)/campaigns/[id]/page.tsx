"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { campaignsApi } from "@/lib/api";
import { ArrowLeft, Play, Pause, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700", ACTIVE: "bg-green-100 text-green-700",
  PAUSED: "bg-yellow-100 text-yellow-700", COMPLETED: "bg-blue-100 text-blue-700",
};

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();

  const { data: campaign, isLoading } = useQuery({
    queryKey: ["campaign", id],
    queryFn: () => campaignsApi.get(id).then((r) => r.data.data),
  });

  const launchMutation = useMutation({ mutationFn: () => campaignsApi.launch(id), onSuccess: () => qc.invalidateQueries({ queryKey: ["campaign", id] }) });
  const pauseMutation = useMutation({ mutationFn: () => campaignsApi.pause(id), onSuccess: () => qc.invalidateQueries({ queryKey: ["campaign", id] }) });

  if (isLoading) return <div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-1/3" /><div className="h-64 bg-gray-200 rounded" /></div>;
  if (!campaign) return <p className="text-center py-12 text-gray-500">Campaign not found</p>;

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[campaign.status] || "bg-gray-100 text-gray-700"}`}>{campaign.status}</span>
        <div className="ml-auto flex gap-2">
          {(campaign.status === "DRAFT" || campaign.status === "PAUSED") && (
            <button onClick={() => launchMutation.mutate()} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
              <Play className="h-4 w-4" /> Launch
            </button>
          )}
          {campaign.status === "ACTIVE" && (
            <button onClick={() => pauseMutation.mutate()} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
              <Pause className="h-4 w-4" /> Pause
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-gray-900">{campaign.prospects?.length || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Prospects</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-gray-900">{campaign.sequences?.length || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Sequences</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <p className="text-lg font-bold text-gray-900">{campaign.type}</p>
          <p className="text-sm text-gray-500 mt-1">Type</p>
        </div>
      </div>

      {campaign.sequences?.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sequence Steps</h2>
          <div className="space-y-3">
            {campaign.sequences.map((s: any, i: number) => (
              <div key={s.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</div>
                <div>
                  <p className="font-medium text-gray-900">{s.name}</p>
                  <p className="text-sm text-gray-500">{s.type} · Wait {s.delay} {s.delayUnit}</p>
                  {s.subject && <p className="text-sm text-gray-600 mt-1">Subject: {s.subject}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {campaign.prospects?.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Enrolled Prospects</h2>
          <div className="space-y-2">
            {campaign.prospects.map((cp: any) => (
              <div key={cp.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="font-medium text-gray-900">{cp.prospect.firstName} {cp.prospect.lastName}</span>
                <span className="text-sm text-gray-500">{cp.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
