import React from "react";
import heroImg from "../assets/hero.jpg";

const Hero = () => {
  return (
    <article className="py-10 mx-4 md:mx-32">
      <div className="flex flex-col items-center justify-center md:grid md:grid-cols-3 md:gap-16">
        <div>
          <h1 className="text-h2 font-semibold text-center mb-4 md:text-h1 md:text-right">
            From Bits to Beats, and Beyond
          </h1>
          <p className="font-medium text-brown-400 text-center md:text-right">
            My coding, music, and tech learning, shared here.
          </p>
        </div>
        <div className="flex items-center justify-center rounded-2xl overflow-clip my-10">
          <img src={heroImg} alt="hero image" />
        </div>
        <div className="text-brown-400 font-medium">
          <p className="text-b3">-Author</p>
          <h3 className="text-brown-500 text-h3 pt-1 pb-3">Yotsathon R.</h3>
          <p>
            Welcome to my digital space where I document my ongoing journey
            through the fascinating worlds of coding, music, and occasionally, DevOps.
            <br />
            <br />
            This blog serves as my personal logbook, where I'll record my progress, challenges, and insights in these areas of interest.
          </p>
        </div>
      </div>
    </article>
  );
};

export default Hero;
