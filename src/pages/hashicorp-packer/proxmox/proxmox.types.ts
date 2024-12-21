import { z as zod } from 'zod';

export const hashiCropPackerSchema = zod.object({
  service: zod.object({
    label: zod.string(),
    value: zod.string(),
  }),
});

export type HashiCorpPackerSchema = zod.infer<typeof hashiCropPackerSchema>;
