// src/components/layout/AuthLayout.tsx
import React, { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  title: string;
  altLink: { to: string; label: string };
  avatarUrl?: string;
}

export default function AuthLayout({
  title,
  altLink,
  avatarUrl,
  children,
}: PropsWithChildren<AuthLayoutProps>) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 relative">
      {/* 뒤로가기 */}
      <button
        className="absolute top-4 left-4 text-3xl"
        onClick={() => window.history.back()}
      >
        &lt;
      </button>

      {/* 로그인/회원가입 링크 */}
      <div className="absolute top-4 right-4">
        <Link
          to={altLink.to}
          className="text-sm bg-gray-700 px-3 py-1 rounded hover:bg-gray-800 transition"
        >
          {altLink.label}
        </Link>
      </div>

      {avatarUrl && (
        <img
          src={avatarUrl}
          alt="avatar"
          className="w-16 h-16 rounded-full mb-4"
        />
      )}

      <h1 className="text-2xl font-bold mb-6">{title}</h1>

      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
