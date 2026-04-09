"use client";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { authApi } from "@/lib/api";

export function useAuth() {
  const router = useRouter();
  const { user, setAuth, logout, isAuthenticated } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) => authApi.login(data),
    onSuccess: (res) => {
      const { user, accessToken, refreshToken } = res.data.data;
      setAuth(user, accessToken, refreshToken);
      router.push("/dashboard");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: any) => authApi.register(data),
    onSuccess: (res) => {
      const { user, accessToken, refreshToken } = res.data.data;
      setAuth(user, accessToken, refreshToken);
      router.push("/dashboard");
    },
  });

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return {
    user,
    isAuthenticated: isAuthenticated(),
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: handleLogout,
    loginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
    registerLoading: registerMutation.isPending,
    registerError: registerMutation.error,
  };
}
