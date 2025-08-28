import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import Arrow from "./Arrow";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="px-4 sm:px-20 xl:px-32 relative flex flex-col w-full justify-center bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2]">
          Supercharge Your Content Creation{" "}
          <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-400 bg-clip-text text-transparent">
            with AI
          </span>
        </h1>
        <p>Elevate your workflow with cutting-edge AI tools designed to inspire creativity and save time. Whether you need engaging articles,
          eye-catching blog titles, professional-grade images, or intelligent resume analysis, AetherAI provides everything you need to create, refine, and excel — all in one seamless platform.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs">
        <button
          onClick={() => navigate("/ai")}
          className="bg-primary text-white px-10 py-3 rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer"
        >
          Start creating now
        </button>
        <button className="bg-primary text-white px-10 py-3 rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer">
          Watch demo
        </button>
      </div>

      <div className="flex items-center gap-4 mt-8 mx-auto text-gray-600">
        <img src={assets.user_group} alt="" className="h-8" /> Trusted by 10k+
        people
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <Arrow />
      </div>
    </div>
  );
};

export default Hero;
