import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { postSignup } from "../apis/auts";
import { useState } from "react";
import { Eye, EyeOff, User } from "lucide-react";

const schema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하이어야 합니다." }),
    passwordCheck: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하이어야 합니다." }),
    name: z.string().min(1, { message: "이름을 입력해주세요." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

export const SignupPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(0);
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { passwordCheck, ...rest } = data;
    const response = await postSignup(rest);
    console.log(response);
  };

  const handleNext = async () => {
    const fields = ["email", "password", "passwordCheck", "name"];
    const currentField = fields[step];
    const valid = await trigger(currentField as keyof FormFields);
    if (valid) setStep((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-[300px] flex items-center justify-center h-12">
        <button
          onClick={() => step === 0 ? navigate(-1) : setStep((prev) => prev - 1)}
          className="absolute left-0 text-xl pl-4"
        >
          {"<"}
        </button>
        <h1 className="text-xl bold font-bold">회원가입</h1>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        {step === 0 && (
          <>
            <input
              {...register("email")}
              className={`border w-[300px] p-[10px] rounded-sm ${errors?.email ? "border-red-500 bg-red-200" : "border-gray-300"
                }`}
              type="email"
              placeholder="이메일"
            />
            {errors?.email && <div className="text-red-500 text-sm">{errors.email.message}</div>}
          </>
        )}

        {step === 1 && (
          <>
            <h4> 💌 {getValues("email")}</h4>
            <div className="relative w-[300px]">
              <input
                {...register("password")}
                className={`border w-[300px] p-[10px] rounded-sm ${errors?.password ? "border-red-500 bg-red-200" : "border-gray-300"
                  }`}
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력해주세요"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors?.password && <div className="text-red-500 text-sm">{errors.password.message}</div>}

            <div className="relative w-[300px]">
              <input
                {...register("passwordCheck")}
                className={`border w-[300px] p-[10px] rounded-sm ${errors?.passwordCheck ? "border-red-500 bg-red-200" : "border-gray-300"
                  }`}
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 다시 한 번 입력해주세요"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors?.passwordCheck && <div className="text-red-500 text-sm">{errors.passwordCheck.message}</div>}
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex flex-col items-center">
              <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <User size={64} className="text-gray-500" />
              </div>
            </div>
            <input
              {...register("name")}
              className={`border w-[300px] p-[10px] rounded-sm ${errors?.name ? "border-red-500 bg-red-200" : "border-gray-300"
                }`}
              type="text"
              placeholder="이름"
            />
            {errors?.name && <div className="text-red-500 text-sm">{errors.name.message}</div>}
          </>
        )}

        <button
          className="w-full bg-black text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
          type="button"
          onClick={step === 2 ? handleSubmit(onSubmit) : handleNext}
          disabled={isSubmitting}
        >
          {step === 2 ? "완료" : "다음"}
        </button>
      </div>
    </div>
  );
};
