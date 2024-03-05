import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Taskify | Home',
  description: "Welcome to taskify",
};

export default function Home() {
  return (
    <main className="h-full w-full">
      <div className="bg-gradient-to-br from-gray-950 via-purple-950  to-gray-950 bg-animate h-full page-container gap-6 px-52">
      {/* <h1 className="text-6xl font-heading font-bold text-primary">welcome to Taskify!</h1>
      <p className="font-body text-lg text-center text-pretty w-2/3">
        Taskify is not just any ordinary task manager; it&apos;s your ultimate companion for organizing your tasks seamlessly while adding a touch of journaling to your productivity routine. Built with Remix, Rails, and enhanced with the sleek styling of TailwindCSS + daisyUI, Taskify offers a refreshing and efficient way to manage your daily activities.
      </p> */}
      <div className="flex flex-col gap-4 text-center text-xl">
        <div>
          <p>Organize your tasks seamlessly on the web.</p>
          <p className="opacity-55">
            Built with Remix, Rails, and TailwindCSS + daisyUI.
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
        <p className="opacity-55 text-base pt-4">
          Created by Marc Dimacuha of Avion Batch 31-32
        </p>
      </div>
    </div>
    </main>
  );
}
