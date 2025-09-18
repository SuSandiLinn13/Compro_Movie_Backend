import React from "react";
import HeadNavigationBar from "./HeadNav";
import BottomNavigationBar from "./BottomNav";

const NavigationLayout = ({ children }) => {
  return (
    <>
      {/* Top header navigation */}
      <HeadNavigationBar />

      {/* Page content */}
      <main style={{ paddingBottom: "60px" }}>
        {children}
      </main>

      {/* Bottom footer navigation */}
      <BottomNavigationBar />
    </>
  );
};

export default NavigationLayout;
