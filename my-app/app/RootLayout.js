// app/RootLayout.js
"use client";

import NavigationLayout from "@/components/Navlayout";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* ✅ Use NavigationLayout to handle HeadNav + BottomNav + layout spacing */}
        <NavigationLayout>
          {children}
        </NavigationLayout>
      </body>
    </html>
  );
}
