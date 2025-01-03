import { z as zod } from 'zod';

export const lokiLogQLSchema = zod.object({
  service: zod.object({
    label: zod.string(),
    value: zod.string(),
  }),
});

export type LokiLogQLSchema = zod.infer<typeof lokiLogQLSchema>;
