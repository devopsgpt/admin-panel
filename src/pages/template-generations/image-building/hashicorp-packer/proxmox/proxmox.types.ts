import { z as zod } from 'zod';

export const promoxSchema = zod.object({
  service: zod.object({
    label: zod.string(),
    value: zod.string(),
  }),
});

export type PromoxSchema = zod.infer<typeof promoxSchema>;
