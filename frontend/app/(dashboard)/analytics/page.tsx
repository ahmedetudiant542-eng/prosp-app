"use client";
import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#f97316"];

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics-dashboard"],
    queryFn: () => analyticsApi.dashboard().then((r) => r.data.data),
  });

  const { data: trends } = useQuery({
    queryKey: ["analytics-trends"],
    queryFn: () => analyticsApi.trends(30).then((r) => r.data.data),
  });

  const statusData = data?.prospectsByStatus?.map((item: any) => ({
    name: item.status,
    value: item._count,
  })) || [];

  const trendData = (() => {
    if (!trends?.length) return [];
    const counts: Record<string, number> = {};
    trends.forEach((p: any) => {
      const d = new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      counts[d] = (counts[d] || 0) + 1;
    });
    return Object.entries(counts).map(([date, count]) => ({ date, count })).slice(-14);
  })();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Prospects", value: data?.stats?.totalProspects ?? 0, color: "text-blue-600" },
          { label: "Total Campaigns", value: data?.stats?.totalCampaigns ?? 0, color: "text-purple-600" },
          { label: "Active Campaigns", value: data?.stats?.activeCampaigns ?? 0, color: "text-green-600" },
          { label: "Conversion Rate", value: `${data?.stats?.conversionRate ?? 0}%`, color: "text-orange-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">New Prospects (Last 14 days)</h2>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex items-center justify-center text-gray-400 text-sm">
              {isLoading ? "Loading..." : "No data yet"}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Prospects by Status</h2>
          {statusData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                    {statusData.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {statusData.map((item: any, i: number) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-gray-600 flex-1">{item.name}</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-52 flex items-center justify-center text-gray-400 text-sm">
              {isLoading ? "Loading..." : "No data yet"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
