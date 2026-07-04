import type { Metadata } from "next";

export const metadata: Metadata = {
  verification: {
    google: "TyKS8blYgP3M25I",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}