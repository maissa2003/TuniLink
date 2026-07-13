export const PROFILE_PICTURE_KEY = "profilePicture";

export function getProfilePicture() {
  return localStorage.getItem(PROFILE_PICTURE_KEY) ?? "";
}

export function persistProfilePicture(value: string | null | undefined) {
  if (value) {
    localStorage.setItem(PROFILE_PICTURE_KEY, value);
  } else {
    localStorage.removeItem(PROFILE_PICTURE_KEY);
  }
  window.dispatchEvent(new Event("profilechange"));
}

export function clearSession() {
  ["token", "role", "username", "status"].forEach((key) => localStorage.removeItem(key));
}

export async function resizeProfileImage(file: File, maxSize = 256): Promise<string> {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);
  const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return dataUrl;
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.85);
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}
