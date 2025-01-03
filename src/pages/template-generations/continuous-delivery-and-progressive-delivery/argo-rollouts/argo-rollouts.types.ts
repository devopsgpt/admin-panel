import { z as zod } from 'zod';

export const argoRolloutsSchema = zod.object({
  service: zod.object({
    label: zod.string(),
    value: zod.string(),
  }),
});

export type ArgoRoulloutsSchema = zod.infer<typeof argoRolloutsSchema>;
