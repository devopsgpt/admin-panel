import { z as zod } from 'zod';

export const terraformInstallationSchema = zod.object({
  os: zod.object({
    label: zod.string(),
    value: zod.string(),
  }),
  environment: zod.object({
    label: zod.string(),
    value: zod.string(),
  }),
});

export type terraformInstallationType = zod.infer<
  typeof terraformInstallationSchema
>;

export type TerraformInstallationResponse = {
  output: string;
};

export type TerraformInstallationBody = {
  os: string;
  environment: string;
};

export type terraformInstallationError = {
  detail: [
    {
      type: string;
      loc: string[];
      msg: string;
      input: null;
    },
  ];
};
