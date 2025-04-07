import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { UserSigninInformation, validateSignin } from "../utils/validate";
import { postSignin } from "../apis/auts";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

const LoginPage = () => {
  const {setItem} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
    initialValue: {
      email: "",
      password: "",
    },
    validate: validateSignin,
  });
  const navigate = useNavigate();
  
  const handleSubmit = async () => {
    console.log(values);
    const response = await postSignin(values);
    try {
      setItem(response.data.accessToken); // 로그인 성공 시 accessToken을 localStorage에 저장
    } catch (error: any) {
      alert(error?.message);
    }
    console.log(response);
  };
  
  // 오류가 하나라도 있거나, 입력값이 비어있으면 버튼을 활성화
  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) || // 오류가 있으면 true
    Object.values(values).some((value) => value === ""); // 입력값이 비어있으면 true

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-[300px] flex items-center justify-center h-12">
        <button onClick={() => navigate(-1)} className="absolute left-0 text-xl pl-4">{"<"}</button>
        <h1 className="text-xl bold font-bold">로그인</h1>
      </div>
      <div className="flex flex-col gap-3">
        <input
          {...getInputProps("email")}
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm ${errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
          type={"email"}
          placeholder="이메일"
        />
        {errors?.email && touched?.email && (
          <div className="text-red-500 text-sm">{errors.email}</div>
        )}
        <input
          {...getInputProps("password")}
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm ${errors?.password && touched?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
          type={"password"}
          placeholder="비밀번호"
        />
        {errors?.password && touched?.password && (
          <div className="text-red-500 text-sm">{errors.password}</div>
        )}
        <button
          className="w-full bg-black text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default LoginPage;