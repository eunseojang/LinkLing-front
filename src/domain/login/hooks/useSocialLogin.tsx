//import { useHandleLogin } from "./useHandleLogin";

export const useSocialLogin= () => {
 // const handleLogin = useHandleLogin();
  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    // const onSubmit = async () => {
    //   const token = "dummy-token";
    //   await handleLogin(token, values.id, values.rememberMe);
    // };
  };

  const handleNaverLogin = () => {
    console.log("Naver login clicked");
  };

  const handleKakaoLogin = () => {
    console.log("Kakao login clicked");
  };

  return {
    handleGoogleLogin,
    handleNaverLogin,
    handleKakaoLogin,
  };
};
