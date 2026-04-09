"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function RegisterPage() {
  const { register, registerLoading, registerError } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", organizationName: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(form);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Create account</h1>
        <p className="text-gray-500 mt-2">Start your free ProspApp trial</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { key: "name", label: "Full name", type: "text", placeholder: "John Doe" },
          { key: "email", label: "Email", type: "email", placeholder: "you@example.com" },
          { key: "password", label: "Password", type: "password", placeholder: "••••••••" },
          { key: "organizationName", label: "Company (optional)", type: "text", placeholder: "Acme Corp" },
        ].map(({ key, label, type, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type={type}
              value={(form as any)[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={placeholder}
              required={key !== "organizationName"}
            />
          </div>
        ))}

        {registerError && (
          <p className="text-red-500 text-sm">Registration failed. Try again.</p>
        )}

        <button
          type="submit"
          disabled={registerLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
        >
          {registerLoading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
