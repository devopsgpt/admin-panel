import { z as zod } from 'zod';

export const alertRulesSchema = zod.object({
  service: zod.object({
    label: zod.string(),
    value: zod.string(),
  }),
});

export type AlertRulesSchema = zod.infer<typeof alertRulesSchema>;
