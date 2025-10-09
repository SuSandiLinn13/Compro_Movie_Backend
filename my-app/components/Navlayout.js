// components/NavigationLayout.js
"use client";

import HeadNav from "@/components/HeadNav";
import BottomNavigationBar from "@/components/BottomNav";

const NavigationLayout = ({ children }) => {
  return (
    <>
      {/* ✅ Top navigation bar */}
      <HeadNav />

      {/* ✅ Main content */}
      <main style={{ minHeight: "100vh", paddingBottom: "64px" }}>
        {children}
      </main>

      {/* ✅ Fixed bottom navigation bar */}
      <BottomNavigationBar />
    </>
  );
};

export default NavigationLayout;
