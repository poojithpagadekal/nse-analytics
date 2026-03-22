import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";

export function useLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/stocks");
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/stocks");
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();

  return () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
}

export function getStoredUser() {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}
