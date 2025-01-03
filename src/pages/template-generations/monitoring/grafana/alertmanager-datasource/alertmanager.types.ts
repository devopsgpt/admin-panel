import { z as zod } from 'zod';

export interface AlertManagerResponse {
  output: string;
}

export interface AlertManagerBody {
  name: string;
  url: string;
  uid: string;
  implementation: string;
  handleGrafanaManagedAlerts: boolean;
  editable: boolean;
  basic_auth: {
    basicAuthUser: string;
    basicAuthPassword: string;
  } | null;
}

export const alertManagerSchema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  url: zod.string().min(1, 'URL is required'),
  uid: zod.string().min(1, 'UID is required'),
  implementation: zod.object({
    label: zod.string(),
    value: zod.string(),
  }),
  handleGrafanaManagedAlerts: zod.boolean(),
  editable: zod.boolean(),
  basic_auth: zod.object({
    basicAuthUser: zod.string(),
    basicAuthPassword: zod.string(),
  }),
});

export type AlertManagerSchema = zod.infer<typeof alertManagerSchema>;

export interface alertManagerValidationError {
  detail: [
    {
      type: string;
      loc: string[];
      msg: string;
      input: null;
    },
  ];
}
