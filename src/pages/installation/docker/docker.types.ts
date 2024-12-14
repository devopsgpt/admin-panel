import { z as zod } from 'zod';

export const dockerInstallationSchema = zod.object({
  os: zod.object({
    label: zod.string(),
    value: zod.string(),
  }),
  environment: zod.object({
    label: zod.string(),
    value: zod.string(),
  }),
});

export type dockerInstallationType = zod.infer<typeof dockerInstallationSchema>;

export type DockerInstallationResponse = {
  output: string;
};

export type DockerInstallationBody = {
  os: string;
  environment: string;
};

export type dockerInstallationError = {
  detail: [
    {
      type: string;
      loc: string[];
      msg: string;
      input: null;
    },
  ];
};
