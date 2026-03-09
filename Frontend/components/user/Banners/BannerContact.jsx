import React from "react";

const BannerContact = () => {
  return (
    <div className="relative w-full h-[85vh] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage:
            "url('https://watermark.lovepik.com/photo/20211122/large/lovepik-hotel-lobby-picture_500742423.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-10/12 mx-auto flex flex-col gap-6 max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-[2px] bg-[#c4a96a]" />
            <span className="text-[#c4a96a] text-xs font-bold uppercase tracking-[0.3em]">
              Get In Touch
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
            Contact
            <br />
            <span className="text-[#c4a96a]">Our Team</span>
          </h1>

          <p className="text-white/70 text-base md:text-lg max-w-lg leading-relaxed font-light">
            Have a question or special request? We are here to help make your
            experience unforgettable. Reach out anytime.
          </p>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

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

export default BannerContact;
