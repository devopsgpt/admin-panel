import { z as zod } from 'zod';

export const externalTemplateSchema = zod.object({
  template: zod.object({
    label: zod.string(),
    value: zod.string(),
  }),
});

export type ExternalTemplateSchema = zod.infer<typeof externalTemplateSchema>;
