import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";

// Shared by the site and the /admin root layouts.
export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
  display: "swap",
});

export const fontVariables = `${fraunces.variable} ${inter.variable} ${mono.variable}`;
