import { z as zod } from 'zod';

export const pulumiSchema = zod.object({
  service: zod.object({
    label: zod.string(),
    value: zod.string(),
  }),
});

export type PulumiSchema = zod.infer<typeof pulumiSchema>;
