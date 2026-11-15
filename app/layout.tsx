import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Nerooga Hospital | Staff Sign In',
  description: 'Staff sign-in portal for Nerooga Hospital in Monaragala.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">

      <body>
          <Toaster position="top-right" />
          {children}
      </body>
    </html>
  );
}
