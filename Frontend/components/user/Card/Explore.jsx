"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL;

const Explore = () => {
  const [exploreList, setExploreList] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/explore`)
      .then((res) => res.json())
      .then((data) => setExploreList(data.data || []))
      .catch((err) => console.error("Failed to fetch explore data:", err));
  }, []);

  return (
    <div className="w-10/12 mx-auto py-16 flex flex-col gap-20">
      {/* Section header */}
      <div className="flex flex-col gap-3 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#857749]">
          Discover More
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
          Explore Our <span className="text-[#857749]">Hotel</span>
        </h2>
        <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
          Immerse yourself in the unique experiences and spaces that make our
          hotel truly exceptional.
        </p>
      </div>

      {/* Cards - alternating layout */}
      <div className="flex flex-col gap-24">
        {exploreList.map((explore, idx) => (
          <div
            key={explore.id}
            className={`flex flex-col lg:flex-row items-center gap-10 ${
              idx % 2 !== 0 ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* Image */}
            <div className="w-full lg:w-7/12 relative group">
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src={explore.image}
                  alt={explore.name || "Explore"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              {/* Decorative accent */}
              <div
                className={`absolute -bottom-4 ${
                  idx % 2 !== 0 ? "-left-4" : "-right-4"
                } w-24 h-24 bg-[#857749]/10 rounded-2xl -z-10`}
              />
            </div>

            {/* Content */}
            <div className="w-full lg:w-5/12 flex flex-col gap-5">
              {/* Numbering */}
              <span className="text-6xl font-black text-[#857749]/10 leading-none">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 -mt-3">
                {explore.name}
              </h3>
              <div className="w-12 h-[3px] bg-[#857749] rounded-full" />
              <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                {explore.description}
              </p>
              <button className="w-fit flex items-center gap-2 text-[#857749] font-semibold text-sm group/btn hover:gap-3 transition-all duration-300">
                Learn More
                <svg
                  className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
