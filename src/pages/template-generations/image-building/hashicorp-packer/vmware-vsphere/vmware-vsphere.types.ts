import { z as zod } from 'zod';

export const vmWareSphereSchema = zod.object({
  service: zod.object({
    label: zod.string(),
    value: zod.string(),
  }),
});

export type VMWareSphereSchema = zod.infer<typeof vmWareSphereSchema>;
