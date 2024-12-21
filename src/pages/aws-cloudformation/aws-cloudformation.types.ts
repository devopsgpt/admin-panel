import { z as zod } from 'zod';

export const awsCloudFormationSchema = zod.object({
  service: zod.object({
    label: zod.string(),
    value: zod.string(),
  }),
});

export type AWSCloudformationSchema = zod.infer<typeof awsCloudFormationSchema>;
