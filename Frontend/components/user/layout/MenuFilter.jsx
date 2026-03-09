"use client";
import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaHotel } from "react-icons/fa";
import { BsFillPersonFill } from "react-icons/bs";
import { IoBagCheckOutline } from "react-icons/io5";
import { MdSearch } from "react-icons/md";
import { useRouter } from "next/navigation";

const FieldWrapper = ({ children, last = false }) => (
  <div
    className={`flex items-center gap-3 px-5 py-3.5 flex-1 min-w-[130px] group hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
      !last ? "border-b lg:border-b-0 lg:border-r border-gray-200" : ""
    }`}
  >
    {children}
  </div>
);

const IconBox = ({ children }) => (
  <div className="w-9 h-9 rounded-xl bg-[#857749]/10 group-hover:bg-[#857749]/20 flex items-center justify-center flex-shrink-0 transition-colors duration-200">
    {children}
  </div>
);

const MenuFilter = () => {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  return (
    <div className="flex flex-wrap lg:flex-nowrap items-stretch bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Location */}
      <FieldWrapper>
        <IconBox>
          <FaLocationDot size={16} className="text-[#857749]" />
        </IconBox>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Location
          </span>
          <select className="text-sm font-semibold text-gray-800 focus:outline-none bg-transparent cursor-pointer w-full">
            <option value="kandal">Kandal</option>
            <option value="phnom-penh">Phnom Penh</option>
            <option value="takhmao">Takhmao</option>
          </select>
        </div>
      </FieldWrapper>

      {/* Room Type */}
      <FieldWrapper>
        <IconBox>
          <FaHotel size={16} className="text-[#857749]" />
        </IconBox>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Room Type
          </span>
          <select className="text-sm font-semibold text-gray-800 focus:outline-none bg-transparent cursor-pointer w-full">
            <option value="standard">Standard</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      </FieldWrapper>

      {/* Person */}
      <FieldWrapper>
        <IconBox>
          <BsFillPersonFill size={16} className="text-[#857749]" />
        </IconBox>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Person
          </span>
          <select className="text-sm font-semibold text-gray-800 focus:outline-none bg-transparent cursor-pointer w-full">
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4 Guests</option>
            <option value="5+">5+ Guests</option>
          </select>
        </div>
      </FieldWrapper>

      {/* Check In */}
      <FieldWrapper>
        <IconBox>
          <IoBagCheckOutline size={16} className="text-[#857749]" />
        </IconBox>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Check In
          </span>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="text-sm font-semibold text-gray-800 focus:outline-none bg-transparent cursor-pointer w-full"
          />
        </div>
      </FieldWrapper>

      {/* Check Out */}
      <FieldWrapper last>
        <IconBox>
          <IoBagCheckOutline size={16} className="text-[#857749]" />
        </IconBox>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Check Out
          </span>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn}
            className="text-sm font-semibold text-gray-800 focus:outline-none bg-transparent cursor-pointer w-full"
          />
        </div>
      </FieldWrapper>

      <div className="flex items-stretch p-2 lg:p-2">
        <button className="flex items-center gap-2 px-7 bg-gradient-to-br from-[#857749] to-[#6b5e39] hover:from-[#9a8a56] hover:to-[#857749] active:scale-95 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-[#857749]/40 text-sm tracking-wide whitespace-nowrap"
                onClick={() => router.push('/hotels') }     
        >
          <MdSearch size={18} />
          Book Now
        </button>
      </div>
    </div>
  );
};

export default MenuFilter;
