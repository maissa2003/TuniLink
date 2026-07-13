export type SessionData = {
  token: string;
  role: string;
  username: string;
  status?: string;
  profilePicture?: string | null;
};

export function persistSession(data: SessionData) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);
  localStorage.setItem("username", data.username);
  if (data.status) {
    localStorage.setItem("status", data.status);
  }
  if (data.profilePicture) {
    localStorage.setItem("profilePicture", data.profilePicture);
  } else {
    localStorage.removeItem("profilePicture");
  }
  window.dispatchEvent(new Event("profilechange"));
}

export function getSettingsPath(role: string) {
  return role === "ADMIN" ? "/admin/settings" : "/workspace/settings";
}

export function getDashboardPath(role: string) {
  return role === "ADMIN" ? "/admin/dashboard" : "/workspace";
}
