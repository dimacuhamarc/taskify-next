import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Taskify | Home',
  description: 'Welcome to taskify!',
};

export default function Home() {
  return (
    <main className="h-full w-full">
      <div className="bg-gradient-to-br from-gray-950 via-purple-950  to-gray-950 bg-animate h-full page-container gap-6 px-52">
        <h1 className="font-heading font-bold text-7xl text-gray-200">
          This is Taskify.
        </h1>
        <div className="flex flex-col gap-4 text-center text-md">
          <div>
            <p>Organize your tasks seamlessly on the web.</p>
            <p className="opacity-55">
              Built with NextJS + Rails, and TailwindCSS + daisyUI.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-6 mt-6">
            <Link
              href="/onboarding"
              className="btn btn-outline btn-neutral btn-primary"
            >
              Continue To App
            </Link>
          </div>
          <p className="opacity-55 text-xs pt-4">
            Created by{' '}
            <span className='hover:brightness-150 text-transition'>
              <Link href="https://github.com"  target="_blank">
                Marc Dimacuha
              </Link>
            </span>{' '}
            of Avion Batch 31-32
          </p>
        </div>
      </div>
    </main>
  );
}
