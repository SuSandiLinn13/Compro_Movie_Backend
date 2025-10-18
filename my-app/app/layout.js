// import RootLayout from "./RootLayout";

// export const metadata = {
//   title: "Movie App",
//   description: "You were Here movie app with NextJS and FastAPI",
// };

// export default function Layout({ children }) {
//   return <RootLayout>{children}</RootLayout>;
// }


// app/layout.js
import ThemeRegistry from "./ThemeRegistry";
import NavigationLayoutWrapper from "../components/NavigationLayoutWrapper";
import "./globals.css";

export const metadata = {
  title: "You Were Here",
  description: "You were Here movie app with NextJS and FastAPI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <NavigationLayoutWrapper>
            {children}
          </NavigationLayoutWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
