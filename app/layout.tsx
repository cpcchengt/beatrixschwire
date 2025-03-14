import type { Metadata } from "next";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";


export const metadata: Metadata = {
  title: "Beactrix Schwire",
  description: "Magic zone of beactrix schwire",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <Theme>
          {children}
        </Theme>
      </body>
    </html>
  );
}
