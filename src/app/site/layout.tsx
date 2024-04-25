import Navigation from "@/components/site/navigation";
import React from "react";

type SiteLayoutProps = {
  children: React.ReactNode;
};

const SiteLayout: React.FC<SiteLayoutProps> = ({ children }) => {
  return (
    <main className="h-full">
      <Navigation />
      {children}
    </main>
  );
};

export default SiteLayout;
