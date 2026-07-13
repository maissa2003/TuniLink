import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "@/lib/google";

interface Props {
  onSuccess: (response: CredentialResponse) => void;
  onError?: () => void;
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
}

export default function GoogleSignInButton({ onSuccess, onError, text = "signin_with" }: Props) {
  if (!GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onError}
      text={text}
      useOneTap={false}
      auto_select={false}
    />
  );
}
