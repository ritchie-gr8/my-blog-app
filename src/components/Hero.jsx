import React from "react";
import placeholderImg from "../assets/hero-placeholder-img.png";

const Hero = () => {
  return (
    <article className="py-10 mx-4">
      <div className="container mx-auto flex flex-col items-center justify-center md:grid md:grid-cols-3 md:gap-16">
        <div>
          <h1 className="text-[40px] font-semibold text-center mb-4 md:text-[52px] md:text-right">
            Stay Informed, Stay Inspired
          </h1>
          <p className="font-medium text-[#75716B] text-center md:text-right">
            Discover a World of Knowledge at Your Fingertips. Your Daily Dose of
            Inspiration and Information.
          </p>
        </div>
        <img
          src={placeholderImg}
          alt="placeholder hero image"
          className="py-10 mx-auto"
        />
        <div className="text-[#75716B] font-medium">
          <p className="text-[12px]">-Author</p>
          <h3 className="text-[#43403B] text-2xl pt-1 pb-3">Thompson P.</h3>
          <p>
            I am a pet enthusiast and freelance writer who specializes in animal
            behavior and care. With a deep love for cats, I enjoy sharing
            insights on feline companionship and wellness.
            <br />
            <br /> When i’m not writing, I spends time volunteering at my local
            animal shelter, helping cats find loving homes.
          </p>
        </div>
      </div>
    </article>
  );
};

export default Hero;
