import Button from "@site/src/components/Button";
import LargeCallout from "@site/src/components/layouts/LargeCallout";
import Marquee from "react-fast-marquee";
import React from "react";
import { RxArrowTopRight } from "react-icons/rx";
import StatPoint from "@site/src/components/StatPoint";
import { motion } from "framer-motion";

function Join() {
  const stats = [
    {
      header: "70K+",
      subtitle: "People Learning",
    },
    {
      header: "12K+",
      subtitle: "Community Members",
    },
    {
      header: "80+",
      subtitle: "Content Modules",
    },
    {
      header: "10+",
      subtitle: "Languages",
    },
  ];

  return (
    <div className="w-screen font-vietnam">
      <div className="text-center text-2xl md:text-5xl font-vietnam font-semibold md:font-medium tracking-tighter px-4 md:px-32 md:pt-15 lg:px-[200px]">
        <span style={{ color: "black" }}>Join Our Community</span>
        <br />
        <span style={{ color: "black" }}>Upgrade your prompting skills</span>
        {/* <div className="text-center text-default text-sm font-vietnam font-light tracking-tight px-4 md:px-30 lg:px-56 pt-10">
          Become part of a worldwide network of learners from various
          industries, all mastering the skill of effectively engaging with AI
          using our curriculum
        </div> */}
      </div>
      <div className="flex flex-col gap-8 md:gap-0 md:flex-row items-center justify-between px-12 md:px-16 lg:px-20 xl:px-24 2xl:px-32 text-transparent bg-clip-text bg-gradient-to-r from-[#005046] to-[#027F75] pt-14 pb-10 max-w-screen-xl mx-auto">
        {stats.map((stat, i) => (
          <StatPoint key={i} header={stat.header} subtitle={stat.subtitle} />
        ))}
      </div>
    </div>
  );
}

export default Join;
