"use client";

import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { WishlistProvider } from "@/context/WishlistContext";
import { ListingsProvider } from "@/context/ListingsContext";
import { FilterProvider } from "@/context/FilterContext";
import { AuthProvider } from "@/context/AuthContext";
import { ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
  messages: Record<string, unknown>;
};

export default function Providers({ children, messages }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <AuthProvider>
        <ListingsProvider>
          <WishlistProvider>
            <FilterProvider>
              <NextIntlClientProvider messages={messages}>
                {children}
              </NextIntlClientProvider>
            </FilterProvider>
          </WishlistProvider>
        </ListingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
