import { Role } from '@/app/generated/prisma/enums';
import AdminSidebar from '@/app/dashboard/admin/layout';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import { Suspense } from 'react';

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f3f7f5]" />}>
      <AdminDashboardContent />
    </Suspense>
  );
}

async function AdminDashboardContent() {
  const token = (await cookies()).get('login-token')?.value;
  const secret = process.env.JWT_KEY;
  if (!token || !secret) redirect('/auth/login');

  let userId = '';
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), { algorithms: ['HS256'] });
    userId = typeof payload.id === 'string' ? payload.id : '';
  } catch {
    redirect('/auth/login');
  }
  if (!userId) redirect('/auth/login');

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { firstName: true, lastName: true, role: true, status: true } });
  if (!user || user.status !== 'ACTIVE') redirect('/auth/login');
  if (user.role !== Role.ADMIN) redirect(`/dashboard/${user.role.toLowerCase().replaceAll('_', '-')}`);

  return (
    <div className="min-h-screen bg-[#f3f7f5] lg:flex">
      <AdminSidebar />
      <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#37836d]">Admin workspace</p>
        <h1 className="mt-2 text-2xl font-semibold text-[#183b33] sm:text-3xl">Welcome, {user.firstName}</h1>
        <p className="mt-2 text-sm text-[#71827c]">Use the control panel to manage Nerooga Hospital operations.</p>
      </main>
    </div>
  );
}
