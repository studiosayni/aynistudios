import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/publicContent";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/login",
          "/signup",
          "/complete-profile",
          "/workspace",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
