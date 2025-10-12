// components/NavigationLayout.js
"use client";

import HeadNav from "@/components/HeadNav";
import BottomNavigationBar from "@/components/BottomNav";

const NavigationLayout = ({ children }) => {
  return (
    <>
      {/* Fixed top navigation bar */}
      <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
        <HeadNav />
      </div>

      {/* Main content area */}
      <main
        style={{
          minHeight: "100vh",
          paddingTop: "70px", // space for fixed top nav (adjust if nav height differs)
          paddingBottom: "70px", // space for bottom nav
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </main>

      {/* Fixed bottom navigation bar */}
      <div style={{ position: "fixed", bottom: 0, width: "100%", zIndex: 1000 }}>
        <BottomNavigationBar />
      </div>
    </>
  );
};

export default NavigationLayout;
