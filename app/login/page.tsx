'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, TicketIcon } from 'lucide-react';
import Cookies from 'js-cookie';

import { loginSchema, type LoginFormValues } from '@/lib/validations';
import { AppFooter } from '@/components/AppFooter';

// ─── Constants ────────────────────────────────────────────────────────────────

const AUTH_COOKIE = 'auth-token';
const AUTH_COOKIE_EXPIRES_DAYS = 8 / 24;
const MOCK_TOKEN = 'mock-auth-token-internal-ticket-system';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (_data: LoginFormValues): Promise<void> => {
    setServerError(null);
    await new Promise((resolve) => setTimeout(resolve, 600));
    try {
      Cookies.set(AUTH_COOKIE, MOCK_TOKEN, {
        expires: AUTH_COOKIE_EXPIRES_DAYS,
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production',
      });
      router.push('/tickets');
    } catch {
      setServerError('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">

      {/* ── Header minimal ── */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
              <TicketIcon className="h-4 w-4 text-white" />
            </span>
            <span className="text-sm font-semibold text-slate-800">Ticket Manager</span>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">

          {/* Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

            {/* Heading */}
            <div className="mb-7 text-center">
              <h1 className="text-xl font-bold text-slate-900">Đăng nhập</h1>
              <p className="mt-1 text-sm text-slate-500">
                Nhập tài khoản nội bộ của bạn
              </p>
            </div>

            {/* Form */}
            <form
              id="login-form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-4"
            >
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  {...register('email')}
                  className={[
                    'w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900',
                    'bg-white outline-none transition-all duration-150 placeholder:text-slate-400',
                    'focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100',
                    errors.email
                      ? 'border-red-400 bg-red-50 focus:ring-red-100'
                      : 'border-slate-300 hover:border-slate-400',
                  ].join(' ')}
                />
                {errors.email && (
                  <p id="email-error" role="alert" className="text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Mật khẩu
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  {...register('password')}
                  className={[
                    'w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900',
                    'bg-white outline-none transition-all duration-150 placeholder:text-slate-400',
                    'focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100',
                    errors.password
                      ? 'border-red-400 bg-red-50 focus:ring-red-100'
                      : 'border-slate-300 hover:border-slate-400',
                  ].join(' ')}
                />
                {errors.password && (
                  <p id="password-error" role="alert" className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Server error */}
              {serverError && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {serverError}
                </div>
              )}

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                disabled={isSubmitting}
                className={[
                  'mt-1 w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white',
                  'bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98]',
                  'transition-all duration-150 shadow-sm',
                  'disabled:opacity-60 disabled:cursor-not-allowed',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2',
                ].join(' ')}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang đăng nhập…
                  </span>
                ) : (
                  'Đăng nhập'
                )}
              </button>
            </form>

            {/* Hint */}
            <p className="mt-6 text-center text-xs text-slate-400">
              Đây là công cụ nội bộ. Vui lòng dùng tài khoản công ty.
            </p>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <AppFooter />
    </div>
  );
}
