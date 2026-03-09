import React from 'react';

const Loading = ({ message = "Loading" }) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0f0d0a]">
      {/* Background hotel image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Dark warm overlay */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Brand name */}
        <h1 className="text-3xl font-bold tracking-wide text-white">
          Paradise<span className="text-[#c4a96a]"> View</span>
        </h1>

        {/* Spinner rings */}
        <div className="relative w-16 h-16" role="status" aria-label="Loading">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-[#857749]/20" />
          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#c4a96a] animate-spin" />
          {/* Inner counter-spin */}
          <div
            className="absolute inset-2 rounded-full border-2 border-transparent border-b-[#857749] animate-spin"
            style={{ animationDuration: "1.8s", animationDirection: "reverse" }}
          />
          {/* Center dot */}
          <div className="absolute inset-[28%] rounded-full bg-[#c4a96a]" />
        </div>

        {/* Message */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm font-medium tracking-widest uppercase text-white/60">
            {message}
          </p>
          {/* Animated gold bar */}
          <div className="w-48 h-px bg-white/10 relative overflow-hidden rounded-full">
            <div
              className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#c4a96a] to-transparent animate-shimmer"
              style={{
                animation: "shimmer 1.6s infinite",
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
};

export default Loading;
