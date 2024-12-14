import { z as zod } from 'zod';

export const jenkinsInstallationSchema = zod.object({
  os: zod.object({
    label: zod.string(),
    value: zod.string(),
  }),
  environment: zod.object({
    label: zod.string(),
    value: zod.string(),
  }),
});

export type jenkinsInstallationType = zod.infer<
  typeof jenkinsInstallationSchema
>;

export type JenkinsInstallationResponse = {
  output: string;
};

export type JenkinsInstallationBody = {
  os: string;
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
