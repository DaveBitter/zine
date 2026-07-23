import type { Metadata } from "next";
import "./globals.css";

const title = "Zine";
const description =
  "Lay out a printable photo zine in your browser — fold and cut guides included. Nothing you upload ever leaves your device.";
const siteUrl = "https://zine.davebitter.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "Zine",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
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
