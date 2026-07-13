import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Camera, KeyRound, Languages, ShieldCheck, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import api from "@/api/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GoogleSignInButton from "@/components/shared/GoogleSignInButton";
import { GOOGLE_CLIENT_ID } from "@/lib/google";
import { LanguageCode, languages } from "@/lib/i18n";
import { getProfilePicture, persistProfilePicture, resizeProfileImage } from "@/lib/profile";
import { useLanguage } from "@/lib/useLanguage";

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const mustChangePassword =
    Boolean((location.state as { mustChangePassword?: boolean } | null)?.mustChangePassword) ||
    sessionStorage.getItem("mustChangePassword") === "1" ||
    localStorage.getItem("status") === "PENDING";

  useEffect(() => {
    if (localStorage.getItem("status") !== "PENDING") {
      sessionStorage.removeItem("mustChangePassword");
    }
  }, []);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState(() => localStorage.getItem("username") ?? "User");
  const [profilePicture, setProfilePicture] = useState(() => getProfilePicture());
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [googleError, setGoogleError] = useState("");
  const [saving, setSaving] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showGoogleConnect, setShowGoogleConnect] = useState(false);
  const [accountActive, setAccountActive] = useState(() => localStorage.getItem("status") !== "PENDING");

  useEffect(() => {
    api.get("/profile").then((response) => {
      setDisplayName(response.data.username ?? "User");
      setProfilePicture(response.data.profilePicture ?? "");
      persistProfilePicture(response.data.profilePicture ?? null);
    }).catch(() => {}).finally(() => setProfileLoading(false));
  }, []);

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setPasswordError("");
    if (newPassword !== confirmPassword) {
      setPasswordError(t("settings.passwordMismatch"));
      return;
    }
    setSaving(true);
    try {
      const response = await api.post("/auth/change-password", { currentPassword, newPassword });
      localStorage.setItem("status", "ACTIVE");
      setAccountActive(true);
      const successMessage = response.data.message || t("settings.passwordUpdated");
      setMessage(successMessage);
      toast.success(successMessage);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ??
        (err?.response?.status === 401 || err?.response?.status === 403
          ? t("settings.passwordAuthError")
          : t("settings.passwordError"));
      setPasswordError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const connectGoogle = async (credentialResponse: any) => {
    setMessage("");
    setGoogleError("");
    try {
      const response = await api.post("/auth/connect-google", { credential: credentialResponse.credential });
      setMessage(response.data.message);
      setShowGoogleConnect(false);
    } catch (err: any) {
      setGoogleError(err?.response?.data?.message ?? t("settings.googleError"));
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    setError("");
    try {
      const response = await api.put("/profile", {
        username: displayName.trim() || "User",
        profilePicture,
      });
      localStorage.setItem("username", response.data.username);
      setProfilePicture(response.data.profilePicture ?? "");
      persistProfilePicture(response.data.profilePicture ?? null);
      setMessage(t("settings.profileSaved"));
      toast.success(t("settings.profileSaved"));
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message ?? t("settings.profileError");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const removePhoto = async () => {
    setProfilePicture("");
    try {
      const response = await api.put("/profile", { profilePicture: "" });
      persistProfilePicture(response.data.profilePicture ?? null);
      toast.success(t("settings.profileSaved"));
    } catch {
      persistProfilePicture(null);
    }
  };

  const updatePhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const value = await resizeProfileImage(file);
      setProfilePicture(value);
      const response = await api.put("/profile", { profilePicture: value });
      persistProfilePicture(response.data.profilePicture ?? value);
      toast.success(t("settings.profileSaved"));
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? t("settings.profileError"));
    }
  };

  return <div className="max-w-4xl space-y-6">
    <div>
      <p className="text-sm font-medium text-blue-700">{t("settings.account")}</p>
      <h1 className="text-3xl font-bold text-slate-900">{t("settings.title")}</h1>
      <p className="mt-2 text-slate-600">{t("settings.subtitle")}</p>
    </div>
    {message && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p>}
    {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {mustChangePassword && (
      <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{t("settings.pendingBanner")}</p>
    )}

    <Card>
      <CardHeader>
        <UserRound className="h-7 w-7 text-blue-700" />
        <CardTitle className="mt-2">{t("settings.profile")}</CardTitle>
        <CardDescription>{t("settings.profileDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar className="size-20">
            <AvatarImage src={profilePicture} alt={displayName} />
            <AvatarFallback>{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-wrap gap-2">
            <Label htmlFor="profile-picture" className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <Camera className="h-4 w-4" />
              {t("settings.uploadPhoto")}
            </Label>
            <input id="profile-picture" type="file" accept="image/*" className="hidden" onChange={updatePhoto} />
            <Button type="button" variant="outline" onClick={removePhoto} className="gap-2">
              <Trash2 className="h-4 w-4" />
              {t("settings.removePhoto")}
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="display-name">{t("settings.displayName")}</Label>
            <Input id="display-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t("settings.language")}</Label>
            <Select value={language} onValueChange={(value) => setLanguage(value as LanguageCode)}>
              <SelectTrigger className="h-10 w-full">
                <Languages className="h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((item) => <SelectItem key={item.code} value={item.code}>{item.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="button" onClick={saveProfile} disabled={saving || profileLoading}>
          {saving ? t("settings.savingProfile") : t("settings.saveProfile")}
        </Button>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <KeyRound className="h-7 w-7 text-blue-700" />
        <CardTitle className="mt-2">{t("settings.password")}</CardTitle>
        <CardDescription>{t("settings.passwordDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={changePassword} className="space-y-4">
          <Input type="password" placeholder={t("settings.currentPassword")} value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required />
          <Input type="password" placeholder={t("settings.newPassword")} minLength={8} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
          <Input type="password" placeholder={t("settings.confirmPassword")} minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
          {passwordError && <p className="text-sm text-red-700">{passwordError}</p>}
          <Button type="submit" disabled={saving}>
            {saving ? t("settings.updating") : t("settings.updatePassword")}
          </Button>
        </form>
      </CardContent>
    </Card>

    {accountActive && GOOGLE_CLIENT_ID && (
      <Card>
        <CardHeader>
          <ShieldCheck className="h-7 w-7 text-blue-700" />
          <CardTitle className="mt-2">{t("settings.google")}</CardTitle>
          <CardDescription>{t("settings.googleDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!showGoogleConnect ? (
            <Button type="button" variant="outline" onClick={() => setShowGoogleConnect(true)}>
              {t("settings.google")}
            </Button>
          ) : (
            <GoogleSignInButton
              text="continue_with"
              onSuccess={connectGoogle}
              onError={() => setGoogleError(t("settings.googleCancelled"))}
            />
          )}
          {googleError && <p className="text-sm text-red-700">{googleError}</p>}
        </CardContent>
      </Card>
    )}
  </div>;
}
