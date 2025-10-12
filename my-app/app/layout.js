// app/layout.js
import { AuthProvider } from "@/contexts/AuthContext";
import NavigationLayout from "@/components/Navlayout";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NavigationLayout>
            {children}
          </NavigationLayout>
        </AuthProvider>
      </body>
    </html>
  );
}