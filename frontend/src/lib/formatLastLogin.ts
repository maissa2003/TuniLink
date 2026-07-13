import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";

/** API timestamps are UTC; older responses may omit the offset suffix. */
function parseApiTimestamp(value: string) {
  const trimmed = value.trim();
  if (!/[zZ]|[+-]\d{2}:\d{2}$/.test(trimmed)) {
    return parseISO(`${trimmed}Z`);
  }
  return parseISO(trimmed);
}

export function formatLastLogin(value: string | null | undefined, neverLabel: string) {
  if (!value) return neverLabel;

  const date = parseApiTimestamp(value);
  if (!isValid(date)) return value;

  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatLastLoginDetailed(value: string | null | undefined) {
  if (!value) return "";

  const date = parseApiTimestamp(value);
  if (!isValid(date)) return value;

  return format(date, "PPpp");
}
