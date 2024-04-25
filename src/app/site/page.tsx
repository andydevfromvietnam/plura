import { pricingCards } from "@/lib/constants";
import Image from "next/image";
import React from "react";
import FeatureCard from "@/components/site/FeatureCard";

const page = () => {
  return (
    <>
      <section className="h-full w-full pt-36 relative flex items-center justify-center flex-col">
        <div
          className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px)] 
        linear-gradient(to_bottom,#161616_1px,transparent_1px) bg-[size:4rem_4rem] 
        [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"
        />
        <p className="text-center">Run your agency, in one place</p>
        <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
          <h1 className="text-9xl font-bold text-center md:text-[300px]">
            Plura
          </h1>
        </div>
        <div className="flex justify-center items-center relative md:mt-[-70px]">
          <Image
            src={"/assets/preview.png"}
            alt="Plura Preview"
            width={1200}
            height={1200}
            className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted"
          />
          <div className="bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-10"></div>
        </div>
      </section>
      <section className="flex justify-center items-center flex-col gap-4 md:!mt-20 mt-[-60px]">
        <h2 className="text-4xl text-center">Choose what fits you right</h2>
        <p className="text-muted-foreground text-center">
          Our straightforward pricing plans are tailored to meet your needs. If{" "}
          {`you're`} not sure what plan is right for you, we can help you find
          the right one. {`you're`} not <br />
          ready to commit you can get started for free.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap mt-6">
          {pricingCards.map((card) => (
            <FeatureCard key={card.title} card={card} />
          ))}
        </div>
      </section>
    </>
  );
};

export default page;
