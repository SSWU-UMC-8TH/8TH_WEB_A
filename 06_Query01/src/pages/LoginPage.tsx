import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import { Eye, EyeOff } from "lucide-react";
import { postSignin } from "../apis/auth";
import useForm from "../hooks/useForm"; 


interface FormValues {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const validate = useCallback((values: FormValues) => {
    const errors: Record<string, string> = {};

    if (!values.email.includes("@")) {
      errors.email = "올바른 이메일 형식이 아닙니다.";
    }

    if (values.password.length < 3 || values.password.length > 10) {
      errors.password = "비밀번호는 3~10자 사이여야 합니다.";
    }

    return errors;
  }, []);

  const { values, errors, touched, getInputProps } = useForm<FormValues>({
    initialValue: {
      email: "",
      password: "",
    },
    validate,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const hasError = Object.keys(errors).length > 0;
    if (hasError) return;
  
    try {
      const response = await postSignin(values);
      console.log("로그인 성공:", response);
  
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("username", response.data.name);
  
      navigate("/home");
  
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_SERVER_API_URL}/v1/auth/google/login`;
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-[300px] flex items-center justify-center h-12">
        <h1 className="text-xl font-bold">로그인</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-6 w-[300px]">
        {/* 이메일 */}
        <input
          {...getInputProps("email")}
          className={`border p-[10px] rounded-sm ${
            touched?.email && errors.email ? "border-red-500 bg-red-200" : "border-gray-300"
          }`}
          type="email"
          placeholder="이메일"
        />
        {touched?.email && errors.email && (
          <div className="text-red-500 text-sm">{errors.email}</div>
        )}

        {/* 비밀번호 */}
        <div className="relative">
          <input
            {...getInputProps("password")}
            className={`border w-full p-[10px] rounded-sm ${
              touched?.password && errors.password ? "border-red-500 bg-red-200" : "border-gray-300"
            }`}
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {touched?.password && errors.password && (
          <div className="text-red-500 text-sm">{errors.password}</div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
        >
          로그인
        </button>
      </form>
      <div className="w-[300px] mt-3">
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full bg-white text-gray-700 border border-gray-300 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition-colors cursor-pointer"
    >
      <div className="flex items-center justify-center gap-2">
        <img src="./../assets/ic_google.png" alt="Google 아이콘" className="w-5 h-5" />
        <span>Google로 로그인</span>
      </div>
    </button>
  </div>
    </div>
  );
};
