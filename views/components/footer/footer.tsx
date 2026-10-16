import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-[#f8f8f7]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.8fr_0.8fr]">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#202020] p-1 shadow-sm">
                <Image
                  src="/logo.svg"
                  alt="RetailLens logo"
                  width={26}
                  height={26}
                  className="h-6 w-6"
                />
              </div>

              <div>
                <p className="text-lg font-bold tracking-tight text-[#202020]">
                  RetailLens
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-500">
              Retail analytics for operators who want clearer decisions, faster
              answers, and fewer spreadsheet surprises.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/SignUp"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-[#202020] px-4 text-sm font-medium text-white transition-all duration-200 hover:bg-gray-700"
              >
                Start free
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-500">
              Product
            </p>

            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>
                <Link
                  href="#feature"
                  className="transition-colors hover:text-[#202020]"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#insite"
                  className="transition-colors hover:text-[#202020]"
                >
                  Results
                </Link>
              </li>
              <li>
                <Link
                  href="#reviews"
                  className="transition-colors hover:text-[#202020]"
                >
                  Reviews
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-gray-200 pt-5 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 RetailLens. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
