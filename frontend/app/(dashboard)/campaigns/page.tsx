"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { campaignsApi } from "@/lib/api";
import { Plus, Play, Pause, Trash2, Users } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  ACTIVE: "bg-green-100 text-green-700",
  PAUSED: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  ARCHIVED: "bg-red-100 text-red-700",
};

export default function CampaignsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => campaignsApi.list().then((r) => r.data.data),
  });

  const launchMutation = useMutation({ mutationFn: (id: string) => campaignsApi.launch(id), onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }) });
  const pauseMutation = useMutation({ mutationFn: (id: string) => campaignsApi.pause(id), onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }) });
  const deleteMutation = useMutation({ mutationFn: (id: string) => campaignsApi.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }) });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
        <Link href="/dashboard/campaigns/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          <Plus className="h-4 w-4" /> New Campaign
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse h-40" />)}
        </div>
      ) : data?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.map((c: any) => (
            <div key={c.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <Link href={`/dashboard/campaigns/${c.id}`} className="font-semibold text-gray-900 hover:text-blue-600">{c.name}</Link>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[c.status]}`}>{c.status}</span>
              </div>
              {c.description && <p className="text-gray-500 text-sm mb-4 line-clamp-2">{c.description}</p>}
              <div className="flex items-center gap-1 text-sm text-gray-400 mb-4">
                <Users className="h-4 w-4" /><span>{c._count?.prospects || 0} prospects</span>
                <span className="mx-2">·</span><span>{c.type}</span>
              </div>
              <div className="flex items-center gap-2">
                {c.status === "DRAFT" || c.status === "PAUSED" ? (
                  <button onClick={() => launchMutation.mutate(c.id)} className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-medium"><Play className="h-4 w-4" />Launch</button>
                ) : c.status === "ACTIVE" ? (
                  <button onClick={() => pauseMutation.mutate(c.id)} className="flex items-center gap-1 text-yellow-600 hover:text-yellow-800 text-sm font-medium"><Pause className="h-4 w-4" />Pause</button>
                ) : null}
                <button onClick={() => deleteMutation.mutate(c.id)} className="ml-auto text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">No campaigns yet</p>
          <Link href="/dashboard/campaigns/new" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            <Plus className="h-4 w-4" /> Create your first campaign
          </Link>
        </div>
      )}
    </div>
  );
}
