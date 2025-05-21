import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google'; // Changed to Inter for a clean sans-serif look
import './globals.css';
import { cn } from "@/lib/utils";
import { Header } from '@/components/Header';
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans", // Changed to match common ShadCN setup
});

export const metadata: Metadata = {
  title: 'TaskFlow - Your Modern To-Do List',
  description: 'Manage your tasks efficiently with TaskFlow. Features include adding, completing, deleting, filtering, and reordering tasks with a modern UI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-screen-lg">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
