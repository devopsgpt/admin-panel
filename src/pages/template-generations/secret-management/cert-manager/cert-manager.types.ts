import { z as zod } from 'zod';

export const certManagerSchema = zod.object({
  service: zod.object({
    label: zod.string(),
    value: zod.string(),
  }),
});

export type CertManagerSchema = zod.infer<typeof certManagerSchema>;
