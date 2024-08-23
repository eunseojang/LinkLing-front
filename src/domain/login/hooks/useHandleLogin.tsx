import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../common/store/AuthStore";
import { useToastMessage } from "../../../common/components/useToastMessage";

export const useHandleLogin = () => {
  const navigate = useNavigate();
  const { showToast } = useToastMessage();
  const { login } = useAuthStore();

  const handleLogin = async (accessToken: string, refreshToken: string) => {
    try {
      login(accessToken, refreshToken);
      showToast("login.successTitle", "login.successDescription", "success");
      navigate(`/`, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      showToast("login.failTitle", "login.failDescription", "error");
    }
  };

  return handleLogin;
};
