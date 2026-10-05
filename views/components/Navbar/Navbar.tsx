"use client";

import Link from "next/link";

import { useNavbar } from "./hooks/useNavbar";

const Navbar = () => {
  const { user, handleLogout } = useNavbar();

  return (
    <div className="sticky top-0 flex h-[50px] w-full flex-row items-center justify-between bg-[#EDEDED]/85 p-4 z-50">
      <div className="text-lg font-bold">Logo</div>

      <div className="flex flex-row gap-2">
        <p className="text-base font-light text-gray-600 hover:text-black">
          feature
        </p>
        <p className="text-base font-light text-gray-600 hover:text-black">
          About
        </p>
      </div>

      <div className="flex flex-row items-center gap-2">
        {user ? (
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-[30px] items-center justify-center bg-white px-5 text-center font-bold text-[#202020] hover:bg-gray-300"
          >
            Log out
          </button>
        ) : (
          <>
            <Link
              href="/LogIn"
              className="flex h-[30px] items-center justify-center bg-white px-5 text-center font-bold text-[#202020] hover:bg-gray-300"
            >
              Log In
            </Link>

            <Link
              href="/Register"
              className="flex h-[30px] items-center justify-center bg-[#D7D7D7] px-5 text-center font-bold text-[#202020]"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
