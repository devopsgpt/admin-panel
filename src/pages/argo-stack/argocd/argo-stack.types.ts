import { z as zod } from 'zod';

export const argoStackSchema = zod.object({
  service: zod.object({
    label: zod.string(),
    value: zod.string(),
  }),
});

export type ArgoStackSchema = zod.infer<typeof argoStackSchema>;
