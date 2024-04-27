import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      {children}
    </ClerkProvider>
  );
};

export default MainLayout;
