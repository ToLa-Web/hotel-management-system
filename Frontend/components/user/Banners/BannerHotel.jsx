import Image from "@node_modules/next/image";
import React from "react";

const BannerHotel = () => {
  return (
    <div className="w-full relative h-[85vh]">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/image/BannerRoom.jpg"
          alt="banner"
          fill
          className="object-cover transition-all duration-700"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-10/12 mx-auto flex flex-col gap-6 max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-[2px] bg-[#c4a96a]" />
            <span className="text-[#c4a96a] text-xs font-bold uppercase tracking-[0.3em]">
              Paradise View Hotel
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
            Find Your
            <br />
            <span className="text-[#c4a96a]">Perfect Stay</span>
          </h1>

          {/* Description */}
          <p className="text-white/70 text-base md:text-lg max-w-lg leading-relaxed font-light">
            Browse our curated collection of exceptional hotels. From beachfront
            resorts to city-center luxury — find the one that speaks to you.
          </p>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-white/50 text-[10px] uppercase tracking-widest font-medium">
          Scroll
        </span>
        <div className="w-5 h-8 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default BannerHotel;
