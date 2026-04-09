"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { authApi } from "@/lib/api";

export default function CallbackPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = params.get("token");
    const refresh = params.get("refresh");
    if (token && refresh) {
      localStorage.setItem("access_token", token);
      authApi.me().then((res) => {
        setAuth(res.data.data, token, refresh);
        router.push("/dashboard");
      });
    } else {
      router.push("/auth/login");
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Signing you in...</p>
      </div>
    </div>
  );
}
