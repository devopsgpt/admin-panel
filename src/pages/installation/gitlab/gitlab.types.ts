import { z as zod } from 'zod';

export const gitlabInstallationSchema = zod.object({
  environment: zod.object({
    label: zod.string(),
    value: zod.string(),
  }),
});

export type gitlabInstallationType = zod.infer<typeof gitlabInstallationSchema>;

export type GitlabInstallationResponse = {
  output: string;
};

export type GitlabInstallationBody = {
  environment: string;
};

export type gitlabInstallationError = {
  detail: [
    {
      type: string;
      loc: string[];
      msg: string;
      input: null;
    },
  ];
};
