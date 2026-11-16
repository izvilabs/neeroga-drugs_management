'use client';

import Image from 'next/image';
import { redirect, useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { Role } from '@/app/generated/prisma/enums';

export default function LoginPage() {

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    const normalizedEmail = email.trim();

    // Validate inputs
    if (!normalizedEmail || !password) {
      toast.error('Enter your email address and password.');
      return;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      toast.error('Enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

    const result = await response.json();

    // Handle authentication errors
    if (!response.ok) {
      toast.error(
        result.message ?? 'Invalid email or password.'
      );
      return;
    }

    // Get authenticated user's role
    const role = result.role;

    // Navigate according to user role
    switch (role) {
      case Role.ADMIN:
        router.push('/dashboard/admin');
        break;

      case Role.DEPARTMENT_MANAGER:
        router.push('/dashboard/department-managers');
        break;

      default:
        toast.error('Unauthorized user role.');
        break;
    }

  } catch (error) {
    console.error('Login error:', error);
    toast.error('Unable to connect. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
}

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f7f5] px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-[1080px] overflow-hidden rounded-[28px] bg-white shadow-[0_28px_80px_-32px_rgba(19,58,49,0.22)] ring-1 ring-[#183d35]/[0.07] lg:min-h-[650px] lg:grid-cols-[0.92fr_1.08fr]">
        <section className="relative flex min-h-[248px] flex-col justify-between overflow-hidden bg-[#174e43] px-7 py-7 text-white sm:px-10 sm:py-9 lg:min-h-[650px] lg:px-12 lg:py-11">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 size-[360px] rounded-full border border-white/[0.08]" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-16 size-[260px] rounded-full border border-white/[0.08]" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 -left-28 size-[360px] rounded-full bg-[#80b6a0]/[0.10] blur-2xl" />

          <div className="relative z-10 flex items-center gap-4">
            <div className="flex size-[66px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm sm:size-[74px]">
              <Image src="/logo.jpg" alt="Nerooga Healthcare logo" width={74} height={78} priority className="size-full object-contain" />
            </div>
            <div>
              <p className="text-[15px] font-semibold tracking-[0.01em] sm:text-base">Nerooga Hospital</p>
              <p className="mt-1 text-xs tracking-wide text-white/65">Monaragala, Sri Lanka</p>
            </div>
          </div>

          <div className="relative z-10 mt-10 max-w-[390px] lg:mt-0">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c4e5d7]">
              <span className="size-1.5 rounded-full bg-[#8ad2ab] shadow-[0_0_10px_rgba(138,210,171,0.65)]" />
              Inventory managment workspaec            </div>
            <h1 className="max-w-[380px] text-[29px] font-semibold leading-[1.16] tracking-[-0.04em] sm:text-[36px] lg:text-[40px]">
              Care moves better when teams are connected.
            </h1>
            <p className="mt-4 max-w-[350px] text-sm leading-6 text-white/70 sm:text-[15px]">
              A dedicated workspace for the people who keep Nerooga Hospital moving every day.
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              {['Drugs', 'Inventory', 'Operations'].map((item) => (
                <span key={item} className="rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 text-xs font-medium text-white/85">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-8 flex items-center gap-2 text-xs text-white/55 lg:mt-0">
            <span aria-hidden="true" className="inline-block size-1 rounded-full bg-[#8ad2ab]" />
            Here for the Monaragala community
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-12 sm:py-14 lg:px-14">
          <div className="w-full max-w-[390px]">
            <div className="mb-9">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#37836d]">Secure staff access</p>
              <h2 className="mt-3 text-[32px] font-semibold tracking-[-0.045em] text-[#183b33] sm:text-[36px]">Welcome back</h2>
              <p className="mt-2 text-sm leading-6 text-[#71827c]">Sign in to continue to your hospital workspace.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-[13px] font-medium text-[#29453e]">Email address</label>
                <div className="group flex h-[52px] items-center gap-3 rounded-xl border border-[#dce6e1] bg-white px-4 transition focus-within:border-[#39836e] focus-within:ring-4 focus-within:ring-[#39836e]/10">
                  <span className="text-[#94a49e] transition group-focus-within:text-[#39836e]"><Mail aria-hidden="true" className="size-5" strokeWidth={1.7} /></span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@nerooga.lk"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#1e3932] outline-none placeholder:text-[#a4b0ac]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-[13px] font-medium text-[#29453e]">Password</label>
                <div className="group flex h-[52px] items-center gap-3 rounded-xl border border-[#dce6e1] bg-white px-4 transition focus-within:border-[#39836e] focus-within:ring-4 focus-within:ring-[#39836e]/10">
                  <span className="text-[#94a49e] transition group-focus-within:text-[#39836e]"><LockKeyhole aria-hidden="true" className="size-5" strokeWidth={1.7} /></span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#1e3932] outline-none placeholder:text-[#a4b0ac]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="rounded-md p-1 text-[#94a49e] transition hover:text-[#367b67] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#39836e]"
                  >
                    {showPassword ? (
                      <EyeOff aria-hidden="true" className="size-5" strokeWidth={1.7} />
                    ) : (
                      <Eye aria-hidden="true" className="size-5" strokeWidth={1.7} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center pt-0.5">
                <label className="inline-flex cursor-pointer items-center gap-2.5 text-[13px] text-[#667a73]">
                  <input name="remember" type="checkbox" className="size-4 rounded border-[#cbd8d2] accent-[#28745e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#39836e]" />
                  Keep me signed in
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#28745e] px-5 text-sm font-semibold text-white shadow-[0_8px_18px_-9px_rgba(40,116,94,0.75)] transition hover:bg-[#205f4d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#28745e] disabled:cursor-wait disabled:opacity-70"
              >
                {isSubmitting ? 'Signing in…' : 'Sign in'}
                {!isSubmitting && <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.8} />}
              </button>
            </form>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#82918b]">
              <span className="text-[#4e8e77]"><ShieldCheck aria-hidden="true" className="size-4" strokeWidth={1.7} /></span>
              <span>Your sign-in is protected</span>
            </div>
            <div className="mt-8 border-t border-[#edf1ef] pt-5 text-center text-[11px] text-[#9aa7a2]">
              Nerooga Hospital <span className="mx-1.5 text-[#c5cfca]">·</span> Monaragala
            </div>
          </div>
        </section>
      </div>
    </main>
  )

}
