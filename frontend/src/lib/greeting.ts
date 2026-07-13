import { LanguageCode, translate } from "@/lib/i18n";

function greetingKey(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "admin.dashboard.goodMorning";
  if (hour < 18) return "admin.dashboard.goodAfternoon";
  return "admin.dashboard.goodEvening";
}

export function getDashboardGreeting(language?: LanguageCode) {
  const username =
    (typeof window !== "undefined" ? localStorage.getItem("username") : null)?.trim() ||
    translate("common.user", language);
  return `${translate(greetingKey(), language)}, ${username}`;
}
