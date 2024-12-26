import { z as zod } from 'zod';

export const getPipelinesSchema = zod.object({
  pipeline: zod.object({
    label: zod.string(),
    value: zod.string(),
  }),
});

export type GetPipelinesSchema = zod.infer<typeof getPipelinesSchema>;
