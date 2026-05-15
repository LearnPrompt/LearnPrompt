import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
        source_repo: z.string().optional(),
        source_url: z.url().optional(),
        updated_from: z.string().optional(),
        legacy_status: z
          .enum(["current", "outdated", "archived"])
          .default("current"),
        replacement_url: z.string().optional(),
      }),
    }),
  }),
};
