// src/pages/Signup.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { postSignup } from '../apis/authApi';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';

const emailSchema = z.object({ email: z.string().email('올바른 이메일 형식입니다.') });
const passwordSchema = z
  .object({
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: '비밀번호가 일치하지 않습니다.',
  });
const nameSchema = z.object({ name: z.string().min(2, '이름을 입력해주세요.') });

type EmailForm = z.infer<typeof emailSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;
type NameForm = z.infer<typeof nameSchema>;

export default function Signup() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState({ pwd: false, confirm: false });
  const navigate = useNavigate();

  const {
    register: regEmail,
    handleSubmit: onSubmitEmail,
    formState: { errors: emailErr, isValid: emailOk },
  } = useForm<EmailForm>({ resolver: zodResolver(emailSchema), mode: 'onChange' });

  const {
    register: regPwd,
    handleSubmit: onSubmitPwd,
    formState: { errors: pwdErr, isValid: pwdOk },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema), mode: 'onChange' });

  const {
    register: regName,
    handleSubmit: onSubmitName,
    formState: { isValid: nameOk },
  } = useForm<NameForm>({ resolver: zodResolver(nameSchema), mode: 'onChange' });

  return (
    <AuthLayout title="회원가입" altLink={{ to: '/login', label: '로그인' }}>
      {/* 1: 이메일 입력 */}
      {step === 1 && (
        <form onSubmit={onSubmitEmail((d) => { setEmail(d.email); setStep(2); })} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="이메일을 입력해주세요!"
            className="p-3 rounded text-black bg-zinc-100"
            {...regEmail('email')}
            autoComplete="email"
          />
          {emailErr.email && <p className="text-red-400 text-sm">{emailErr.email.message}</p>}
          <button type="submit" disabled={!emailOk} className={`p-2 rounded ${emailOk ? 'bg-pink-500' : 'bg-gray-700'}`}>
            다음
          </button>
        </form>
      )}

      {/* 2: 비밀번호 입력 */}
      {step === 2 && (
        <form onSubmit={onSubmitPwd((d) => { setPassword(d.password); setStep(3); })} className="flex flex-col gap-4">
          <p className="text-left mb-1">📧 {email}</p>
          <div className="relative">
            <input
              type={show.pwd ? 'text' : 'password'}
              placeholder="비밀번호를 입력해주세요!"
              className="p-3 rounded text-black bg-zinc-100"
              {...regPwd('password')}
              autoComplete="new-password"
            />
            <button type="button" className="absolute right-3 top-3" onClick={() => setShow((s) => ({ ...s, pwd: !s.pwd }))}>
              👁️
            </button>
          </div>
          {pwdErr.password && <p className="text-red-400 text-sm">{pwdErr.password.message}</p>}

          <div className="relative">
            <input
              type={show.confirm ? 'text' : 'password'}
              placeholder="비밀번호 확인"
              className="p-3 rounded text-black bg-zinc-100"
              {...regPwd('confirmPassword')}
              autoComplete="new-password"
            />
            <button type="button" className="absolute right-3 top-3" onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}>
              👁️
            </button>
          </div>
          {pwdErr.confirmPassword && <p className="text-red-400 text-sm">{pwdErr.confirmPassword.message}</p>}

          <button type="submit" disabled={!pwdOk} className={`p-2 rounded ${pwdOk ? 'bg-pink-500' : 'bg-gray-700'}`}>
            다음
          </button>
        </form>
      )}

      {/* 3: 이름 입력 및 API 호출 */}
      {step === 3 && (
        <form
          onSubmit={onSubmitName(async (d) => {
            try {
              await postSignup({ email, password, name: d.name});
              alert('회원가입 완료!');
              navigate('/login');
            } catch (e: any) {
              alert('회원가입 실패: ' + (e.response?.data?.message || e.message));
            }
          })}
          className="flex flex-col gap-4 items-center"
        >
          <img src="/default-avatar.png" alt="avatar" className="w-20 h-20 rounded-full mb-2" />
          <input
            placeholder="이름을 입력해주세요!"
            className="p-3 rounded text-black w-full bg-zinc-100"
            {...regName('name')}
            autoComplete="name"
          />
          <button type="submit" disabled={!nameOk} className={`p-2 w-full rounded ${nameOk ? 'bg-pink-500' : 'bg-gray-700'}`}>
            회원가입 완료
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
