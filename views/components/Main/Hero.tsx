"use client";

import Link from "next/link";

import PieChart from "./Charts/PieChart";
import SimpleBarChart from "./Charts/BarChart";
import Card from "./Card";

import { useAuthStore } from "@/store/authStore";

const Hero = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <section className="w-full py-8 sm:py-10 lg:py-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
        <div className="flex flex-col items-start justify-center">
          <p className="text-4xl font-bold tracking-tight text-[#202020] sm:text-5xl lg:text-7xl">
            <span className="block">Every shelf,</span>
            <span className="mt-1 block text-gray-400">measured.</span>
            <span className="mt-3 block text-[#202020] sm:mt-4">
              Every sale,
            </span>
            <span className="mt-1 block text-gray-400">decoded.</span>
          </p>

          <p className="mt-6 max-w-xl text-base leading-7 text-gray-500 sm:text-lg">
            Send us your CSV. We analyze it with the pandas library and tell you
            the real insights hiding in your data — trends, outliers and the
            full analysis, in plain language.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {user ? (
              <Link
                href="/Dashboard"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#202020] px-6 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-gray-800 hover:shadow-md"
              >
                Go to dashboard
              </Link>
            ) : (
              <Link
                href="/SignUp"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#202020] px-6 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-gray-800 hover:shadow-md"
              >
                Sign up now
              </Link>
            )}

            <Link
              href={user ? "/UploadCSV" : "/SignIn"}
              className="inline-flex h-12 items-center justify-center rounded-xl border border-gray-200 bg-white px-6 text-base font-semibold text-[#202020] shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
            >
              Upload Your CSV
            </Link>
          </div>
        </div>

        <div className="w-full rounded-[28px] border border-gray-200 bg-gray-100 p-4 shadow-sm sm:p-5">
          <div className="rounded-[22px] bg-white p-4 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <Card title="Revenue" price="$450" percentage="+12.5%" />
              <Card title="Basket Size" price="$38" percentage="+9.2%" />
              <Card title="Stockouts" price="1.8%" percentage="-1.6%" />
            </div>

            <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-base font-medium text-gray-500">
                Monthly sales by category
              </p>

              <div className="mt-4 flex items-center justify-center gap-4">
                <PieChart />
                <div className="hidden md:block">
                  <SimpleBarChart />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
