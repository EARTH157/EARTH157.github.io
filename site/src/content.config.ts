import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown file per case study in src/content/work/
const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      shortTitle: z.string(),
      kicker: z.string(),
      summary: z.string(),
      order: z.number(),
      cover: image(),
      coverAlt: z.string(),
      // photo: fills the frame; render: transparent 3D render on a blueprint panel; screen: app screenshot
      coverStyle: z.enum(['photo', 'render', 'screen']).default('photo'),
      specs: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
      tags: z.array(z.string()).default([]),
      metric: z
        .object({ label: z.string(), baselineLabel: z.string(), baseline: z.number(), finalLabel: z.string(), final: z.number() })
        .optional(),
      videos: z.array(z.object({ label: z.string(), youtubeId: z.string() })).default([]),
      github: z.url().optional(),
      // id of a robot in src/data/site.ts: shows its interactive 3D model on the page
      robot: z.string().optional(),
      // Key numbers shown under the cover
      facts: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      // Step-by-step flow diagram ("how it works")
      flow: z.object({ title: z.string(), steps: z.array(z.object({ title: z.string(), text: z.string() })) }).optional(),
    }),
});

export const collections = { work };
