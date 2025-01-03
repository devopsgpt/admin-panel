import { z as zod } from 'zod';

export const gitlabCISchema = zod.object({
  template: zod.object({
    label: zod.string(),
    value: zod.string(),
  }),
});

export type GitlabCISchema = zod.infer<typeof gitlabCISchema>;
