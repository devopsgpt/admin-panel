import { z as zod } from 'zod';

export const hashiCropVMWareSphereSchema = zod.object({
  service: zod.object({
    label: zod.string(),
    value: zod.string(),
  }),
});

export type HashiCorpVMWareSphereSchema = zod.infer<
  typeof hashiCropVMWareSphereSchema
>;
