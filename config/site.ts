import { SiteConfig } from "@/lib/types/site";
import type { Metadata } from "next";

export const siteConfig: SiteConfig = {
  name: "2025-03-01-DATATHON",
  author: "Kurt San Jose",
  description: "Datathon project by Kurt San Jose",
  keywords: [
    "Next.js",
    "React",
    "TailwindCSS",
    "shadcn/ui",
    "Next15",
    "Visualization",
    "Analytics",
  ],
  url: {
    base: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    author: "https://kurtsanjose.dev",
  },
  links: {
    github: "https://github.com/ssanjose/2025-03-01-datathon",
  },
  ogImage: `${process.env.NEXT_PUBLIC_APP_URL}/landing.jpg`,
}

export const MetadataConfig: Metadata = {
  metadataBase: new URL(siteConfig.url.base),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.author,
      url: siteConfig.url.author
    },
  ],
  creator: siteConfig.author,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url.base,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.author,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};