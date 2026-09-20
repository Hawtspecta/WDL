"use client";

import Link from "next/link";
import { useTimer } from "../components/timer-provider";

export default function TimerPage() {
  const { seconds, running, start, pause, reset } = useTimer();
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-12">
          <h1 className="sm:text-4xl text-3xl font-medium title-font text-gray-900">Timer State Preservation</h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-gray-500">
            This timer lives in a shared layout provider so it keeps running when you navigate between pages.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-10">
          <div className="text-center mb-8">
            <p className="text-sm uppercase tracking-wide text-indigo-600 font-semibold">Next.js state preservation demo</p>
            <p className="text-6xl font-bold text-slate-900">
              {minutes.toString().padStart(2, "0")}:{remainingSeconds.toString().padStart(2, "0")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={running ? pause : start}
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
            >
              {running ? "Pause" : "Resume"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Reset
            </button>
          </div>

          <div className="mt-8 text-sm text-slate-500 leading-relaxed space-y-3">
            <p>Type in Contact, switch routes, or update any page state and this timer will keep its value intact.</p>
            <p>
              Navigate back and forth to verify the preservation: <Link href="/contact" className="font-semibold text-indigo-600 hover:text-indigo-700">Contact</Link> • <Link href="/" className="font-semibold text-indigo-600 hover:text-indigo-700">Home</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
