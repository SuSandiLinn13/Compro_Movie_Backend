import RootLayout from "./RootLayout";

export const metadata = {
  title: "Movie App",
  description: "You were Here movie app with NextJS and FastAPI",
};

export default function Layout({ children }) {
  return <RootLayout>{children}</RootLayout>;
}