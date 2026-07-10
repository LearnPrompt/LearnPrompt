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
        author: z.string().optional(),
        verified_at: z.string().optional(),
        reading_time: z.string().optional(),
        research_path: z.string().optional(),
        showcase_path: z.string().optional(),
        showcase_status: z.enum(["verified", "partial", "planned"]).optional(),
        quality_score: z.number().int().min(0).max(100).optional(),
        legacy_status: z
          .enum(["current", "outdated", "archived"])
          .default("current"),
        replacement_url: z.string().optional(),
      }),
    }),
  }),
};
