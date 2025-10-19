"use client";

import HeadNav from "./HeadNav";
import BottomNav from "./BottomNav";

export default function NavigationLayout({ children, hideBottomNav = false }) {
  return (
    <>
      <HeadNav />
      <main style={{ minHeight: "100vh", paddingBottom: hideBottomNav ? 0 : 64 }}>
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
    </>
  );
}
