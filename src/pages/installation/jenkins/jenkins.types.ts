import { z as zod } from 'zod';

export const jenkinsInstallationSchema = zod
  .object({
    os: zod
      .object({
        label: zod.string(),
        value: zod.string(),
      })
      .optional(),
    environment: zod.object({
      label: zod.string(),
      value: zod.string(),
    }),
  })
  .refine(
    (data) => {
      if (data.environment.value === 'Docker') {
        return true;
      }
      return data.os !== undefined;
    },
    {
      path: ['os'],
    },
  );

export type jenkinsInstallationType = zod.infer<
  typeof jenkinsInstallationSchema
>;

export type JenkinsInstallationResponse = {
  output: string;
};

export type JenkinsInstallationBody = {
  os?: string;
  environment: string;
};

export type jenkinsInstallationError = {
  detail: [
    {
      type: string;
      loc: string[];
      msg: string;
      input: null;
    },
  ];
};
