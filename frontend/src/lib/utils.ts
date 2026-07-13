type ClassInput =
  | string
  | false
  | null
  | undefined
  | ((state: any) => string | false | null | undefined);

export function cn(...classes: ClassInput[]) {
  return classes
    .filter((entry): entry is string => typeof entry === "string")
    .join(" ");
}
