"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { campaignsApi } from "@/lib/api";
import { ArrowLeft } from "lucide-react";

const CAMPAIGN_TYPES = ["EMAIL", "LINKEDIN", "WHATSAPP", "MULTICHANNEL"];

export default function NewCampaignPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", description: "", type: "EMAIL" });

  const createMutation = useMutation({
    mutationFn: (d: any) => campaignsApi.create(d),
    onSuccess: (res) => router.push(`/dashboard/campaigns/${res.data.data.id}`),
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="text-2xl font-bold text-gray-900">New Campaign</h1>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name *</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Q1 Outreach Campaign" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Describe your campaign goals..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Type</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            {CAMPAIGN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={() => createMutation.mutate(form)} disabled={createMutation.isPending || !form.name} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50">
            {createMutation.isPending ? "Creating..." : "Create Campaign"}
          </button>
          <button onClick={() => router.back()} className="border border-gray-300 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
        </div>
      </div>
    </div>
  );
}
