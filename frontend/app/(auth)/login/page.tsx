"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const { login, loginLoading, loginError } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(form);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-gray-500 mt-2">Sign in to your ProspApp account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            required
          />
        </div>

        {loginError && (
          <p className="text-red-500 text-sm">Invalid email or password</p>
        )}

        <button
          type="submit"
          disabled={loginLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
        >
          {loginLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <a
          href="/api/v1/auth/google"
          className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded-lg py-2 px-4 hover:bg-gray-50 transition text-sm font-medium"
        >
          Sign in with Google
        </a>
      </div>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}
