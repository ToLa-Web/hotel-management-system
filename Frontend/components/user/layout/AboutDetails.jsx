import React from "react";
import {
  FaAward,
  FaConciergeBell,
  FaHeart,
  FaGlobe,
} from "react-icons/fa";

const stats = [
  { number: "15+", label: "Years of Excellence" },
  { number: "200+", label: "Luxury Rooms" },
  { number: "50K+", label: "Happy Guests" },
  { number: "12", label: "Awards Won" },
];

const values = [
  {
    icon: FaConciergeBell,
    title: "Exceptional Service",
    description:
      "Our dedicated team goes above and beyond to ensure every guest feels welcomed and cared for from arrival to departure.",
  },
  {
    icon: FaHeart,
    title: "Heartfelt Hospitality",
    description:
      "We believe luxury is personal. Every detail is thoughtfully curated to create meaningful and memorable experiences.",
  },
  {
    icon: FaAward,
    title: "Uncompromising Quality",
    description:
      "From the finest linens to world-class dining, we maintain the highest standards in every aspect of your stay.",
  },
  {
    icon: FaGlobe,
    title: "Sustainable Luxury",
    description:
      "We are committed to responsible tourism, preserving natural beauty while delivering an extraordinary guest experience.",
  },
];

const team = [
  {
    name: "Chheng Tola",
    role: "General Manager",
    image: "https://res.cloudinary.com/djbtemkl1/image/upload/v1772802895/smiling-young-man-illustration_1308-173524_qcgwni.avif",
  },
  {
    name: "Rithjr",
    role: "Head of Guest Relations",
    image: "https://res.cloudinary.com/djbtemkl1/image/upload/v1772803107/smiling-young-man-illustration_1308-174669_zf35vn.avif",
  },
  {
    name: "David Laurent",
    role: "Executive Chef",
    image: "https://res.cloudinary.com/djbtemkl1/image/upload/v1772803130/smiling-blonde-boy-hoodie_1308-174731_po0ezf.avif",
  },
];

const AboutDetails = () => {
  return (
    <div className="flex flex-col">
      {/* ── Our Story Section ── */}
      <section className="py-20">
        <div className="w-10/12 max-w-6xl mx-auto mt-7 flex flex-col lg:flex-row items-center gap-16">
          {/* Image side */}
          <div className="w-full lg:w-4/12 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://res.cloudinary.com/djbtemkl1/image/upload/v1772802895/smiling-young-man-illustration_1308-173524_qcgwni.avif"
                alt="Hotel Interior"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Accent card */}
            <div className="absolute -bottom-6 -right-6 bg-[#857749] text-white rounded-2xl px-6 py-4 shadow-xl">
              <span className="text-3xl font-bold block">2010</span>
              <span className="text-sm text-white/80">Established</span>
            </div>
          </div>

          {/* Text side */}
          <div className="w-full lg:w-7/12 flex flex-col gap-6">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#857749]">
              Our Story
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              A Legacy of{" "}
              <span className="text-[#857749]">Luxury & Warmth</span>
            </h2>
            <div className="w-12 h-[3px] bg-[#857749] rounded-full" />
            <p className="text-gray-500 leading-relaxed">
              Founded in 2010, Paradise View Hotel began with a simple vision: to
              create a sanctuary where luxury meets genuine warmth. Nestled in a
              prime location, our hotel has grown from a boutique retreat into a
              destination that travelers around the world call their home away from
              home.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Over the years, we have welcomed thousands of guests, each leaving
              with memories that last a lifetime. Our commitment to excellence,
              attention to detail, and passion for hospitality remain at the heart
              of everything we do.
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-[#857749]">
        <div className="w-10/12 max-w-6xl mx-auto py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <span className="text-4xl md:text-5xl font-bold text-white block">
                {stat.number}
              </span>
              <span className="text-white/70 text-sm mt-1 block">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Values Section ── */}
      <section className="py-20 bg-gray-50">
        <div className="w-10/12 max-w-6xl mx-auto flex flex-col gap-14">
          <div className="text-center flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#857749]">
              What Drives Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Core <span className="text-[#857749]">Values</span>
            </h2>
            <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
              The principles that guide every decision and every interaction at
              Paradise View Hotel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, i) => (
              <div
                key={i}
                className="flex gap-5 p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-14 h-14 shrink-0 rounded-xl bg-[#857749]/10 flex items-center justify-center">
                  <value.icon className="text-[#857749]" size={24} />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Meet the Team ── */}
      <section className="py-20">
        <div className="w-10/12 max-w-6xl mx-auto flex flex-col gap-14">
          <div className="text-center flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#857749]">
              The People Behind the Experience
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Meet Our <span className="text-[#857749]">Team</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div
                key={i}
                className="group flex flex-col items-center text-center"
              >
                <div className="relative w-48 h-48 rounded-full overflow-hidden mb-5 shadow-lg ring-4 ring-white">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  {member.name}
                </h3>
                <span className="text-sm text-[#857749] font-medium">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutDetails;
