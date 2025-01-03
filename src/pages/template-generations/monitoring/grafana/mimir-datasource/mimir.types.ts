import { z as zod } from 'zod';

export interface MimirResponse {
  output: string;
}

export interface MimirBody {
  name: string;
  uid: string;
  url: string;
  editable: boolean;
  alertmanagerUid: string;
  multi_tenancy: {
    tenant_name: string;
    httpHeaderName1: string;
  } | null;
}

export const mimirSchema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  uid: zod.string().min(1, 'UID is required'),
  url: zod.string().min(1, 'URL is required'),
  editable: zod.boolean(),
  alertmanagerUid: zod.string().min(1, 'Alertmanager UID is required'),
  multi_tenancy: zod.object({
    tenant_name: zod.string(),
    httpHeaderName1: zod.string(),
  }),
});

export type MimirSchema = zod.infer<typeof mimirSchema>;

export interface mimirValidationError {
  detail: [
    {
      type: string;
      loc: string[];
      msg: string;
      input: null;
    },
  ];
}
