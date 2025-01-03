import { z as zod } from 'zod';

export const argoWorkflowsSchema = zod.object({
  service: zod.object({
    label: zod.string(),
    value: zod.string(),
  }),
});

export type ArgoWorkflowsSchema = zod.infer<typeof argoWorkflowsSchema>;
