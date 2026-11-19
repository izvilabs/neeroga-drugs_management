'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  ArrowLeftRight,
  BarChart3,
  Building2,
  ClipboardList,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Pill,
  Users,
  X,
} from 'lucide-react';

const navigation = [
  { label: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
  { label: 'User Management', href: '/dashboard/admin/users', icon: Users },
  { label: 'Department Management', href: '/dashboard/admin/departments', icon: Building2 },
  { label: 'Drugs Management', href: '/dashboard/admin/drugs', icon: Pill },
  { label: 'Stationery Management', href: '/dashboard/admin/stationery', icon: Package },
  { label: 'Requests', href: '/dashboard/admin/drugs-requests', icon: ClipboardList },
  { label: 'Manual Distributions', href: '/dashboard/admin/manual-distributions', icon: ArrowLeftRight },
  { label: 'Reports', href: '/dashboard/admin/reports', icon: BarChart3 },
  { label: 'History', href: '/dashboard/admin/history', icon: History },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Logout failed');
      router.replace('/auth/login');
      router.refresh();
    } catch {
      toast.error('Unable to log out. Please try again.');
      setIsLoggingOut(false);
    }
  }
  
  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#e7eeea] bg-white px-4 py-3 lg:hidden">
        <Link href="/dashboard/admin" aria-label="Nerooga Hospital admin dashboard" className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="Nerooga Hospital" width={42} height={44} className="size-10 rounded-lg object-contain" />
          <span className="text-sm font-semibold text-[#183b33]">Nerooga Admin</span>
        </Link>
        <button type="button" onClick={() => setIsOpen(true)} aria-label="Open navigation" className="rounded-lg p-2 text-[#31584c] hover:bg-[#f0f6f3]">
          <Menu className="size-5" />
        </button>
      </div>

      {isOpen && <button aria-label="Close navigation overlay" onClick={() => setIsOpen(false)} className="fixed inset-0 z-40 bg-[#102e28]/45 lg:hidden" />}

      <aside className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 flex w-[min(84vw,290px)] flex-col bg-[#174e43] text-white shadow-2xl transition-transform duration-200 lg:sticky lg:top-0 lg:z-20 lg:h-screen lg:w-[280px] lg:shrink-0 lg:translate-x-0 lg:shadow-none`}>
        <div className="flex min-h-[100px] items-center justify-between border-b border-white/10 px-5 py-4">
          <Link href="/dashboard/admin" onClick={() => setIsOpen(false)} className="flex min-w-0 items-center gap-3">
            <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
              <Image src="/logo.jpg" alt="Nerooga Hospital logo" width={56} height={59} priority className="size-full object-contain" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">Nerooga Hospital</span>
              <span className="mt-1 block text-xs text-white/60">Admin control panel</span>
            </span>
          </Link>
          <button type="button" onClick={() => setIsOpen(false)} aria-label="Close navigation" className="rounded-lg p-2 text-white/70 hover:bg-white/10 lg:hidden">
            <X className="size-5" />
          </button>
        </div>

        <nav aria-label="Admin navigation" className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">Management</p>
          {navigation.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== '/dashboard/admin' && pathname.startsWith(`${href}/`));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition ${active ? 'bg-white text-[#174e43] shadow-sm' : 'text-white/75 hover:bg-white/10 hover:text-white'}`}
              >
                <Icon aria-hidden="true" className="size-[18px] shrink-0" strokeWidth={1.8} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="border-t border-white/10 p-3">
          <button type="button" onClick={handleLogout} disabled={isLoggingOut} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-[13px] font-medium text-white/75 transition hover:bg-white/10 hover:text-white disabled:opacity-60">
            <LogOut aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
            {isLoggingOut ? 'Signing out…' : 'Log out'}
          </button>
          <p className="px-3 pb-2 pt-3 text-[10px] text-white/40">Nerooga Hospital · Monaragala</p>
        </div>
      </aside>
    </>
  );
}
