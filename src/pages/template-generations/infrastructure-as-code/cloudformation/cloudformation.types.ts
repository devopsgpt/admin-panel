import { z as zod } from 'zod';

export const cloudFormationSchema = zod.object({
  service: zod.object({
    label: zod.string(),
    value: zod.string(),
  }),
});

export type CloudformationSchema = zod.infer<typeof cloudFormationSchema>;
