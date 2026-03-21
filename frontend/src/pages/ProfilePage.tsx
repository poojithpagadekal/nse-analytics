import { useState } from "react";
import { User, Mail, Lock, Save } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { getStoredUser } from "../hooks/useAuth";
import { getErrorMessage } from "../lib/getErrorMessage";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export function ProfilePage() {
  const queryClient = useQueryClient();
  const storedUser = getStoredUser();

  // fetch fresh profile data
  const { data: user } = useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<UserProfile> => {
      const { data } = await apiClient.get("/auth/me");
      return data;
    },
  });

  const [name, setName] = useState(storedUser?.name ?? "");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    password: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const updateUsername = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.patch("/auth/profile", { name });
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      showSuccess("Username updated successfully");
    },
  });

  const changePassword = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.patch("/auth/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      return data;
    },
    onSuccess: () => {
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showSuccess("Password changed successfully");
    },
  });

  const changeEmail = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.patch("/auth/email", emailForm);
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setEmailForm({ newEmail: "", password: "" });
      showSuccess("Email updated successfully");
    },
  });

  const passwordMismatch =
    passwordForm.newPassword.length > 0 &&
    passwordForm.confirmPassword.length > 0 &&
    passwordForm.newPassword !== passwordForm.confirmPassword;

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <User size={20} className="text-emerald-500" />
          <h1 className="text-xl font-bold text-gray-900">Profile</h1>
        </div>
        <p className="text-sm text-gray-400 ml-7">
          Manage your account settings
        </p>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 text-emerald-600 text-sm px-4 py-3 rounded-xl mb-6 border border-emerald-100">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <User size={18} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {user?.name ?? storedUser?.name}
            </p>
            <p className="text-xs text-gray-400">
              {user?.email ?? storedUser?.email}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3 ml-13">
          Member since{" "}
          {user?.createdAt
            ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "—"}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <User size={15} className="text-gray-400" />
          Update Username
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New username"
            className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all"
          />
          <button
            onClick={() => updateUsername.mutate()}
            disabled={updateUsername.isPending || !name.trim()}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={14} />
            {updateUsername.isPending ? "Saving..." : "Save"}
          </button>
        </div>
        {updateUsername.isError && (
          <p className="text-xs text-red-500 mt-2">
            {getErrorMessage(updateUsername.error, "Update failed")}
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Mail size={15} className="text-gray-400" />
          Change Email
        </h2>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="New email address"
            value={emailForm.newEmail}
            onChange={(e) =>
              setEmailForm((f) => ({ ...f, newEmail: e.target.value }))
            }
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all"
          />
          <input
            type="password"
            placeholder="Confirm with your password"
            value={emailForm.password}
            onChange={(e) =>
              setEmailForm((f) => ({ ...f, password: e.target.value }))
            }
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all"
          />
          <button
            onClick={() => changeEmail.mutate()}
            disabled={
              changeEmail.isPending ||
              !emailForm.newEmail ||
              !emailForm.password
            }
            className="w-full py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {changeEmail.isPending ? "Updating..." : "Update Email"}
          </button>
        </div>
        {changeEmail.isError && (
          <p className="text-xs text-red-500 mt-2">
            {getErrorMessage(changeEmail.error, "Email update failed")}
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Lock size={15} className="text-gray-400" />
          Change Password
        </h2>
        <div className="space-y-3">
          <input
            type="password"
            placeholder="Current password"
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm((f) => ({
                ...f,
                currentPassword: e.target.value,
              }))
            }
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all"
          />
          <input
            type="password"
            placeholder="New password (min 8 characters)"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))
            }
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm((f) => ({
                ...f,
                confirmPassword: e.target.value,
              }))
            }
            className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none focus:ring-2 transition-all ${
              passwordMismatch
                ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                : "border-gray-200 focus:border-emerald-400 focus:ring-emerald-50"
            }`}
          />
          {passwordMismatch && (
            <p className="text-xs text-red-500">Passwords do not match</p>
          )}
          <button
            onClick={() => changePassword.mutate()}
            disabled={
              changePassword.isPending ||
              !passwordForm.currentPassword ||
              !passwordForm.newPassword ||
              passwordMismatch
            }
            className="w-full py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {changePassword.isPending ? "Changing..." : "Change Password"}
          </button>
        </div>
        {changePassword.isError && (
          <p className="text-xs text-red-500 mt-2">
            {getErrorMessage(changePassword.error, "Password change failed")}
          </p>
        )}
      </div>
    </div>
  );
}
