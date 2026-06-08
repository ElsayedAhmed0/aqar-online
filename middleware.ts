import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  // اللغات المدعومة
  locales: ["ar", "en"],

  // اللغة الافتراضية
  defaultLocale: "ar",

  // مش هيضيف /ar في الـ URL — هيفضل / عادي
  localePrefix: "as-needed",
});

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};