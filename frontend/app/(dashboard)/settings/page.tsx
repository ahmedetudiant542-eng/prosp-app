"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";

export default function SettingsPage() {
  const { user, setAuth, accessToken, refreshToken } = useAuthStore();
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [saved, setSaved] = useState(false);

  const updateMutation = useMutation({
    mutationFn: (data: any) =>
      fetch("/api/v1/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: (res) => {
      if (res.success && accessToken && refreshToken) {
        setAuth(res.data, accessToken, refreshToken);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    },
  });

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => updateMutation.mutate(form)}
          disabled={updateMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          {updateMutation.isPending ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Integrations</h2>
        {[
          { name: "Google OAuth", desc: "Sign in with Google", status: user?.provider === "google" ? "Connected" : "Not connected", color: user?.provider === "google" ? "text-green-600" : "text-gray-400" },
          { name: "LinkedIn", desc: "LinkedIn outreach & OAuth", status: "Configure in .env", color: "text-yellow-600" },
          { name: "OpenAI", desc: "AI message generation", status: "Configure OPENAI_API_KEY", color: "text-yellow-600" },
          { name: "WhatsApp (Twilio)", desc: "WhatsApp messaging", status: "Configure Twilio keys", color: "text-yellow-600" },
          { name: "SMTP Email", desc: "Email outreach", status: "Configure SMTP settings", color: "text-yellow-600" },
        ].map(({ name, desc, status, color }) => (
          <div key={name} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div>
              <p className="font-medium text-gray-900">{name}</p>
              <p className="text-sm text-gray-400">{desc}</p>
            </div>
            <span className={`text-sm font-medium ${color}`}>{status}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Account</h2>
        <p className="text-sm text-gray-500 mb-4">Your account details</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Role</span><span className="font-medium">{user?.role}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">User ID</span><span className="font-mono text-xs text-gray-400">{user?.id}</span></div>
        </div>
      </div>
    </div>
  );
}
