import "./globals.css";

export const metadata = {
  title: "Unspoken",
  description: "A quiet space to feel heard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}