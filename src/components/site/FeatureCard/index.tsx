import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";
import { Check } from "lucide-react";
import Link from "next/link";
import { pricingCards } from "@/lib/constants";

type FeatureCardProps = {
  card: (typeof pricingCards)[0];
};

const FeatureCard: React.FC<FeatureCardProps> = ({ card }) => {
  return (
    <Card
      key={card.title}
      className={cn("w-[300px] flex flex-col justify-between", {
        "border-2 border-primary": card.title === "Unlimited Saas",
      })}
    >
      <CardHeader>
        <CardTitle
          className={cn("", {
            "text-muted-foreground": card.title === "Unlimited Saas",
          })}
        >
          {card.title}
        </CardTitle>
        <CardDescription>{card.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <span className="text-4xl font-bold">{card.price}</span>
        <span className="text-muted-foreground">/m</span>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <div>
          {card.features.map((feature) => (
            <div key={feature} className="flex gap-2 items-center">
              <Check className="text-muted-foreground" />
              <p>{feature}</p>
            </div>
          ))}
        </div>
        <Link
          href={`/agency?plan=${card.priceId}`}
          className={cn("w-full text-center bg-primary p-2 rounded-md", {
            "!bg-muted-foreground": card.title !== "Unlimited Saas",
          })}
        >
          Get Started
        </Link>
      </CardFooter>
    </Card>
  );
};

export default FeatureCard;
