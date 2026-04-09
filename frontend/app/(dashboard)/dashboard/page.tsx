"use client";
import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api";
import { Users, Megaphone, TrendingUp, Activity } from "lucide-react";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics-dashboard"],
    queryFn: () => analyticsApi.dashboard().then((r) => r.data.data),
  });

  const stats = [
    { label: "Total Prospects", value: data?.stats?.totalProspects ?? 0, icon: Users, color: "bg-blue-500" },
    { label: "Campaigns", value: data?.stats?.totalCampaigns ?? 0, icon: Megaphone, color: "bg-purple-500" },
    { label: "Active Campaigns", value: data?.stats?.activeCampaigns ?? 0, icon: Activity, color: "bg-green-500" },
    { label: "Conversion Rate", value: `${data?.stats?.conversionRate ?? 0}%`, icon: TrendingUp, color: "bg-orange-500" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse h-28" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
              </div>
              <div className={`${color} p-3 rounded-xl`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Prospects by Status</h2>
          {data?.prospectsByStatus?.length ? (
            <div className="space-y-3">
              {data.prospectsByStatus.map((item: any) => (
                <div key={item.status} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.status}</span>
                  <span className="font-semibold text-gray-900">{item._count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No data yet</p>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Prospects</h2>
          {data?.recentProspects?.length ? (
            <div className="space-y-3">
              {data.recentProspects.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.firstName} {p.lastName}</p>
                    <p className="text-xs text-gray-400">{p.company || "—"}</p>
                  </div>
                  <span className="text-xs text-gray-400">{p.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No prospects yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
