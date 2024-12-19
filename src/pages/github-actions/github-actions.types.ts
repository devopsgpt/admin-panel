import { z as zod } from 'zod';

export const getWorkflowsSchema = zod.object({
  workflow: zod.object({
    label: zod.string(),
    value: zod.string(),
  }),
});

export type GetWorkflowsSchema = zod.infer<typeof getWorkflowsSchema>;
