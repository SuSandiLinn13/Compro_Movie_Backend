// components/NavigationLayoutWrapper.js
"use client";

import { usePathname } from "next/navigation";
import NavigationLayout from "./Navlayout";

export default function NavigationLayoutWrapper({ children }) {
  const pathname = usePathname();

  // Hide bottom nav only for genres and movieprofile pages
  const hideBottomNav =
    pathname.startsWith("/genres") 
    || pathname.startsWith("/movies") 
    || pathname.startsWith("/topimdb")
    || pathname.startsWith("/home")
    || pathname.startsWith("/series")
    ;

  return <NavigationLayout hideBottomNav={hideBottomNav}>{children}</NavigationLayout>;
}
