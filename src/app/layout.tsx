import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zine",
  description:
    "Lay out a printable photo zine in your browser — fold and cut guides included. Nothing you upload ever leaves your device.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('zine-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;}catch(e){}",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
