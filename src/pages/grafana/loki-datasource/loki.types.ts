import { z as zod } from 'zod';

export interface LokiResponse {
  output: string;
}

export interface LokiBody {
  name: string;
  uid: string;
  url: string;
  editable: boolean;
  timeout: number;
  basic_auth: {
    basicAuthUser: string;
    basicAuthPassword: string;
  } | null;
}

export const lokiSchema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  uid: zod.string().min(1, 'UID is required'),
  url: zod.string().min(1, 'URL is required'),
  editable: zod.boolean(),
  timeout: zod.number().min(1, 'Timeout is required'),
  basic_auth: zod.object({
    basicAuthUser: zod.string(),
    basicAuthPassword: zod.string(),
  }),
});

export type LokiSchema = zod.infer<typeof lokiSchema>;

export interface lokiValidationError {
  detail: [
    {
      type: string;
      loc: string[];
      msg: string;
      input: null;
    },
  ];
}
