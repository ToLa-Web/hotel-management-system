"use client";

import React from "react";
import { useRouter } from "@node_modules/next/navigation";
export const Button = ({ param, style, Rooms, }) => {
  return (
    <button
      className={` group relative inline-block text-sm font-medium text-textColor focus:outline-none focus:ring active:text-textColor`}
      onClick={Rooms} 
    >
      <span
        className={`${style} absolute inset-0 translate-x-0 translate-y-0 bg-textColor transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5`}
      ></span>

      <span
        className={`${style} relative block border border-current bg-white py-2 px-4`}
      >
        {" "}
        {param}{" "}
      </span>
    </button>
  );
};

export const LoginButton = ({ isTransparent = false }) => {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3">
      <button
        className={`px-6 py-2.5 text-[13px] font-semibold rounded-lg border transition-all duration-300 cursor-pointer ${
          isTransparent
            ? "border-white/40 text-white hover:bg-white/10"
            : "border-[#857749] text-[#857749] hover:bg-[#857749]/5"
        }`}
        onClick={() => router.push("/login")}
      >
        Login
      </button>

      <button
        className={`px-6 py-2.5 text-[13px] font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
          isTransparent
            ? "bg-white/15 backdrop-blur-sm text-white hover:bg-white/25 border border-white/20"
            : "bg-[#857749] text-white hover:bg-[#6d6139] shadow-md shadow-[#857749]/20"
        }`}
        onClick={() => router.push("/signup")}
      >
        Sign Up
      </button>
    </div>
  );
};

export const BtnRoomDetails = () => {
  const router = useRouter();
  return (
    <div>
      <button className="w-full py-2 px-4 text-white bg-bgDarkColor rounded-md hover:bg-[#6F6238] focus:outline-none focus:ring-2 focus:ring-[#857749]"
      onClick={() => router.push("/HotelCards/Rooms/RoomDetails")}
      >
        Book Now
      </button>
    </div>
  );

}
