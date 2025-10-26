
import { useAuthStore } from "../../stores/authStore";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const clientId = "YOUR_GOOGLE_CLIENT_ID"; // replace with your Google OAuth client ID

function GoogleOAuth() {
  const login = useAuthStore((state) => state.login);

  const handleSuccess = (credentialResponse) => {
    console.log("Google OAuth Success:", credentialResponse);

    // You can send credentialResponse.credential to your backend to verify & get user info
    // For demo, storing dummy user
    const user = { name: "Google User" };
    const token = credentialResponse.credential;
    login(user, token);
  };

  const handleError = () => {
    console.log("Google OAuth Failed");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
      />
    </GoogleOAuthProvider>
  );
}

export default GoogleOAuth;
