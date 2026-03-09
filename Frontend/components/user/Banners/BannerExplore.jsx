import React from "react";

const BannerExplore = () => {
  return (
    <div className="relative w-full h-[85vh] overflow-hidden">
      {/* Video Background */}
      <video
        src="/video/ExplorBanner.mp4"
        type="video/mp4"
        autoPlay
        loop
        muted
        playsInline
        poster="/image/BannerRoom.jpg"
        className="w-full h-full object-cover scale-105"
      />

      {/* Layered overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

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
            Explore Our
            <br />
            <span className="text-[#c4a96a]">Experiences</span>
          </h1>

          {/* Description */}
          <p className="text-white/70 text-base md:text-lg max-w-lg leading-relaxed font-light">
            Discover the perfect blend of elegance and modern amenities.
            Every corner tells a story of luxury crafted just for you.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4 mt-2">
            <button className="px-7 py-3.5 bg-[#857749] hover:bg-[#9a8a56] active:scale-95 text-white font-semibold rounded-xl transition-all duration-300 text-sm shadow-lg shadow-[#857749]/30">
              Explore Rooms
            </button>
            <button className="group flex items-center gap-2 px-7 py-3.5 bg-white/10 backdrop-blur-sm text-white font-medium rounded-xl hover:bg-white/20 transition-all duration-300 text-sm border border-white/20">
              Watch Tour
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom fade for smooth section transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-white/50 text-[10px] uppercase tracking-widest font-medium">Scroll</span>
        <div className="w-5 h-8 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default BannerExplore;
