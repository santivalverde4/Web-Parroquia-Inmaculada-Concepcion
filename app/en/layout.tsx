import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "Immaculate Conception Parish", template: "%s | Immaculate Conception Parish" },
  description: "Community, faith, and service. Discover the life of Immaculate Conception Parish.",
};

export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
