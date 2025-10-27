
import { useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";
import { GoogleLogin } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ""; // read from env

function GoogleOAuth() {
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    // Helpful debug logs so you can verify the runtime clientId and page origin
    console.info('GoogleOAuth init - clientId:', clientId)
    console.info('GoogleOAuth init - origin:', window.location.origin)

    if (!clientId) {
      console.warn('VITE_GOOGLE_CLIENT_ID not found. Make sure you set it in client/.env and restart the dev server.')
    } else {
      // Recommend checking Google OAuth Console if you get the origin not allowed error
      console.info('If you see "The given origin is not allowed for the given client ID", add this origin to the OAuth client in Google Cloud Console: ', window.location.origin)
    }
  }, [])

  const handleSuccess = (credentialResponse) => {
    console.log("Google OAuth Success:", credentialResponse);

    // Send credential to backend or handle sign-in
    const token = credentialResponse?.credential
    if (token) {
      // Backend exchange should happen here in production. For now just store user/token via store
      // You likely already call backend in Login page; this component logs the credential for debugging.
      login({ name: 'Google User' }, token)
    }
  };

  const handleError = () => {
    console.log("Google OAuth Failed");
  };

  // If clientId is missing, don't render the button to avoid confusing GSI errors
  if (!clientId) {
    return null
  }

  return (
    <div>
      {/* Render the GoogleLogin button. The provider is created in main.jsx so we only render the button here. */}
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
}

export default GoogleOAuth;
