"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { prospectsApi } from "@/lib/api";
import { Plus, Search, Trash2, ExternalLink } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-yellow-100 text-yellow-700",
  QUALIFIED: "bg-purple-100 text-purple-700",
  INTERESTED: "bg-green-100 text-green-700",
  NOT_INTERESTED: "bg-red-100 text-red-700",
  CONVERTED: "bg-emerald-100 text-emerald-700",
  ARCHIVED: "bg-gray-100 text-gray-700",
};

export default function ProspectsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", company: "", jobTitle: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["prospects", search],
    queryFn: () => prospectsApi.list({ search }).then((r) => r.data.data),
  });

  const createMutation = useMutation({
    mutationFn: (d: any) => prospectsApi.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["prospects"] }); setShowForm(false); setForm({ firstName: "", lastName: "", email: "", company: "", jobTitle: "" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => prospectsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["prospects"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Prospects</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          <Plus className="h-4 w-4" /> Add Prospect
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search prospects..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">New Prospect</h2>
          <div className="grid grid-cols-2 gap-4">
            {[["firstName", "First Name"], ["lastName", "Last Name"], ["email", "Email"], ["company", "Company"], ["jobTitle", "Job Title"]].map(([key, label]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => createMutation.mutate(form)} disabled={createMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50">
              {createMutation.isPending ? "Saving..." : "Save"}
            </button>
            <button onClick={() => setShowForm(false)} className="border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {["Name", "Company", "Email", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  {[...Array(5)].map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-200 rounded animate-pulse" /></td>
                  ))}
                </tr>
              ))
            ) : data?.data?.length ? (
              data.data.map((p: any) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.firstName} {p.lastName}</td>
                  <td className="px-4 py-3 text-gray-500 text-sm">{p.company || "—"}</td>
                  <td className="px-4 py-3 text-gray-500 text-sm">{p.email || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[p.status] || "bg-gray-100 text-gray-700"}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/prospects/${p.id}`} className="text-blue-600 hover:text-blue-800"><ExternalLink className="h-4 w-4" /></Link>
                      <button onClick={() => deleteMutation.mutate(p.id)} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="text-center py-12 text-gray-400">No prospects yet. Add your first one!</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
