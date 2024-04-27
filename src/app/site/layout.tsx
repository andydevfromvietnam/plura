import Navigation from "@/components/site/navigation";
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

type SiteLayoutProps = {
  children: React.ReactNode;
};

const SiteLayout: React.FC<SiteLayoutProps> = ({ children }) => {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <main className="h-full">
        <Navigation />
        {children}
      </main>
    </ClerkProvider>
  );
};

export default SiteLayout;
