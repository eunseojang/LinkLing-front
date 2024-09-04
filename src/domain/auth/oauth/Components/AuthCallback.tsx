import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchAuthToken = () => {
      //redirect_uri?isLogin=true&accessToken="dsff"&refreshToken="sdfsdfsfsdfsdf"
      //redirect_uri?isLogin=false&email="sdfsdf"

      const urlParams = new URLSearchParams(location.search);

      const isLogin = urlParams.get("isLogin") === "true";
      const accessToken = urlParams.get("accessToken");
      const refreshToken = urlParams.get("refreshToken");
      const email = urlParams.get("email");
      console.log(location.search, isLogin, email);

      if (isLogin && accessToken && refreshToken) {
        try {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          navigate("/");
        } catch (error) {
          console.error("Error storing tokens", error);
        }
      } else {
        navigate(`/signup/oauth?${email}`);
      }
    };

    fetchAuthToken();
  }, [location.search, navigate]);

  return (
    <div>
      <h2>Loading...</h2>
    </div>
  );
};

export default AuthCallback;
