// Signup.tsx
// 회원가입 페이지
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { postSignup } from '../apis/authApi';

const emailSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
});

const passwordSchema = z
  .object({
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: '비밀번호가 일치하지 않습니다.',
  });

const nameSchema = z.object({
  name: z.string().min(2, '이름을 입력해주세요.'),
});

export default function Signup() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, isValid: isEmailValid },
  } = useForm({ resolver: zodResolver(emailSchema), mode: 'onChange' });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isValid: isPasswordValid },
  } = useForm({ resolver: zodResolver(passwordSchema), mode: 'onChange' });

  const {
    register: registerName,
    handleSubmit: handleNameSubmit,
    formState: { isValid: isNameValid },
  } = useForm({ resolver: zodResolver(nameSchema), mode: 'onChange' });

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-black text-white relative">
      {/* 왼쪽 상단: 뒤로가기 */}
      <button className="absolute top-4 left-4" onClick={() => navigate(-1)}>
        &lt;
      </button>

      {/* 오른쪽 상단: 로그인 이동 */}
      <div className="absolute top-4 right-4">
        <Link
          to="/login"
          className="text-sm bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800 transition"
        >
          로그인
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">회원가입</h1>

      {step === 1 && (
        <form
          onSubmit={handleEmailSubmit((data) => {
            setEmail(data.email);
            setStep(2);
          })}
          className="w-80 flex flex-col gap-4"
        >
          <input
            type="email"
            placeholder="이메일을 입력해주세요!"
            className="p-3 rounded text-black bg-zinc-100"
            {...registerEmail('email')}
            autoComplete="email"
          />
          {emailErrors.email && (
            <p className="text-red-400 text-sm">{emailErrors.email.message}</p>
          )}
          <button
            type="submit"
            disabled={!isEmailValid}
            className={`p-2 rounded ${isEmailValid ? 'bg-pink-500' : 'bg-gray-700'}`}
          >
            다음
          </button>
        </form>
      )}

      {step === 2 && (
        <form
          onSubmit={handlePasswordSubmit((data) => {
            setPassword(data.password);
            setStep(3);
          })}
          className="w-80 flex flex-col gap-4"
        >
          <p className="text-left mb-1">📧 {email}</p>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호를 입력해주세요!"
              className="p-3 rounded w-full text-black bg-zinc-100"
              {...registerPassword('password')}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁️
            </button>
          </div>
          {passwordErrors.password && (
            <p className="text-red-400 text-sm">{passwordErrors.password.message}</p>
          )}

          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호를 다시 한 번 입력해주세요!"
            className="p-3 rounded text-black bg-zinc-100"
            {...registerPassword('confirmPassword')}
            autoComplete="new-password"
          />
          {passwordErrors.confirmPassword && (
            <p className="text-red-400 text-sm">{passwordErrors.confirmPassword.message}</p>
          )}

          <button
            type="submit"
            disabled={!isPasswordValid}
            className={`p-2 rounded ${isPasswordValid ? 'bg-pink-500' : 'bg-gray-700'}`}
          >
            다음
          </button>
        </form>
      )}

      {step === 3 && (
        <form
          onSubmit={handleNameSubmit(async (data) => {
            const signupData = {
              email,
              password,
              name: data.name,
              bio: '자기소개 없음', // 선택적으로 빈 문자열 또는 기본값
              avatar: 'https://avatars.githubusercontent.com/u/1?v=4', 
            };
            

            console.log('회원가입 요청 바디:', signupData);

            try {
              await postSignup(signupData);
              alert(`회원가입 완료! 이름: ${data.name}`);
              navigate('/login');
            } catch (err: any) {
              console.error('회원가입 실패 응답:', err);
              alert(
                '회원가입 실패: ' +
                  (err.response?.data?.message || '알 수 없는 오류')
              );
            }
          })}
          className="w-80 flex flex-col gap-4 items-center"
        >
          <img
            src="/avatar-placeholder.png"
            alt="avatar"
            className="w-20 h-20 rounded-full mb-2"
          />
          <input
            placeholder="이름을 입력해주세요!"
            className="p-3 rounded text-black w-full bg-zinc-100"
            {...registerName('name')}
            autoComplete="name"
          />
          <button
            type="submit"
            disabled={!isNameValid}
            className={`p-2 w-full rounded ${isNameValid ? 'bg-pink-500' : 'bg-gray-700'}`}
          >
            회원가입 완료
          </button>
        </form>
      )}
    </div>
  );
}
