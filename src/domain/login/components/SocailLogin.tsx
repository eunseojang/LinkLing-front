import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa"; // 애플과 페이스북 아이콘 임포트
import SocialLoginButton from "./SocialLoginButton";

export const SocialLogin = () => {
  return (
    <>
      <SocialLoginButton
        // onClick={handleGoogleLogin}
        icon={FcGoogle}
        text="Google"
        colorScheme="gray" // 구글 버튼 색상
      />
      <SocialLoginButton
        // onClick={handleFacebookLogin}
        icon={FaFacebook}
        text="Facebook"
        bg="#3b5998" // 페이스북 버튼 색상
        color="white" // 텍스트 색상
      />{" "}
      <SocialLoginButton
        // onClick={handleAppleLogin}
        icon={FaApple}
        text="Apple"
        bg="#000000" // 애플 버튼 색상 (검정색)
        color="white" // 텍스트 색상
      />
    </>
  );
};
