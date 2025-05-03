import { useNavigate } from "react-router-dom";
import { useState , useCallback } from "react";
import { Eye, EyeOff } from "lucide-react";
import useForm from "../hooks/useForm"; 
import { postSignup } from "../apis/auth";

interface FormValues {
  email: string;
  password: string;
  passwordCheck: string;
  name: string;
}

export const SignupPage = () => {
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
  
    if (values.passwordCheck !== values.password) {
      errors.passwordCheck = "비밀번호가 일치하지 않습니다.";
    }
  
    if (!values.name.trim()) {
      errors.name = "이름을 입력해주세요.";
    }
  
    return errors;
  }, []);

  const { values, errors, touched, getInputProps } = useForm<FormValues>({
    initialValue: {
      email: "",
      password: "",
      passwordCheck: "",
      name: "",
    },
    validate,
  });
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasError = Object.keys(errors).length > 0;
    if (hasError) return;

    const { passwordCheck, ...signupData } = values;

    try {
      const response = await postSignup(signupData);
      console.log("회원가입 성공:", response);
      navigate("/login");
    } catch (error) {
      console.error("회원가입 실패:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-[300px] flex items-center justify-center h-12">
        <h1 className="text-xl font-bold">회원가입</h1>
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
        {touched?.email && errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}

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
        {touched?.password && errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}

        {/* 비밀번호 확인 */}
        <div className="relative">
          <input
            {...getInputProps("passwordCheck")}
            className={`border w-full p-[10px] rounded-sm ${
              touched?.passwordCheck && errors.passwordCheck ? "border-red-500 bg-red-200" : "border-gray-300"
            }`}
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호 확인"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {touched?.passwordCheck && errors.passwordCheck && (
          <div className="text-red-500 text-sm">{errors.passwordCheck}</div>
        )}

        {/* 이름 */}
        <input
          {...getInputProps("name")}
          className={`border p-[10px] rounded-sm ${
            touched?.name && errors.name ? "border-red-500 bg-red-200" : "border-gray-300"
          }`}
          type="text"
          placeholder="이름"
        />
        {touched?.name && errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-800 transition-colors cursor-pointer"
        >
          회원가입
        </button>
      </form>
    </div>
  );
};
