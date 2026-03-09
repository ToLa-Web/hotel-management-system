import Header from "@components/user/layout/Header";
import React from "react";
import Footer from "@components/user/layout/Footer";
import { HomePage } from "@components/user/homepage";
import PageTransition from "@components/motion/PageTransition";

const Home = () => {
  return (
    // website
    <PageTransition>
    <div className="flex flex-col gap-8 w-full h-full bg-gray-100">
      <div className="w-full flex flex-col justify-center items-center  shadow-2xl sticky top-0 z-[9999] bg-white">
        <div className="w-10/12">
          <Header />
        </div>
      </div>
      <HomePage />
      <div className="w-full h-full">
        <Footer />
      </div>
    </div>
    </PageTransition>
  );
};

export default Home;
