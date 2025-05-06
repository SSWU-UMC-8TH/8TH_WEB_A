// src/pages/Login.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit, formState: { errors, isValid } } =
    useForm<LoginFormInputs>({ mode: 'onChange' });
  const { login } = useAuth();
  const navigate = useNavigate(); // ✅ navigate 추가

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data);       // ✅ 로그인 성공 후
      navigate('/my');         // ✅ 마이페이지로 이동
    } catch (err: any) {
      alert('로그인 실패: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      `${import.meta.env.VITE_SERVER_API_URL}/v1/auth/google/login`;
  };

  return (
    <AuthLayout
      title="로그인"
      altLink={{ to: '/signup', label: '회원가입' }}
    >
      {/* 구글 로그인 */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex items-center gap-3 border rounded-md px-4 py-2 mb-4 w-full justify-center hover:bg-white/10 transition"
      >
        <FcGoogle size={24} />
        <span>구글 로그인</span>
      </button>

      {/* OR 구분선 */}
      <div className="flex items-center gap-3 mb-4">
        <hr className="flex-grow border-gray-600" />
        <span className="text-gray-400 text-sm">OR</span>
        <hr className="flex-grow border-gray-600" />
      </div>

      {/* 이메일/비밀번호 로그인 폼 */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="이메일을 입력해주세요!"
          className="w-full px-4 py-2 rounded-md bg-zinc-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
          {...register('email', {
            required: '이메일을 입력해주세요',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: '올바른 이메일 형식을 입력해주세요.',
            },
          })}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="비밀번호를 입력해주세요!"
          className="w-full px-4 py-2 rounded-md bg-zinc-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
          {...register('password', {
            required: '비밀번호를 입력해주세요.',
            minLength: { value: 8, message: '비밀번호는 8자 이상이어야 합니다.' },
          })}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-2 rounded-md font-semibold transition ${
            isValid
              ? 'bg-pink-500 hover:bg-pink-600 text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          로그인
        </button>
      </form>
    </AuthLayout>
  );
}
