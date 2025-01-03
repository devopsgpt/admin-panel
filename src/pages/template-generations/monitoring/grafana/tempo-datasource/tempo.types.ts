import { z as zod } from 'zod';

export interface TempoResponse {
  output: string;
}

export interface TempoBody {
  apiVersion: number;
  datasources: [
    {
      name: string;
      type?: string;
      access?: string;
      orgId: number;
      url: string;
      basicAuth: boolean;
      version: number;
      editable: boolean;
      apiVersion?: number;
      uid?: string;
      jsonData: {
        httpMethod: string;
        nodeGraph: {
          enabled: boolean;
        } | null;
        serviceMap: {
          datasourceUid: string;
        } | null;
        tracesToLogsV2: {
          datasourceUid: string;
          filterBySpanID: boolean;
          filterByTraceID: boolean;
          spanEndTimeShift: string;
          spanStartTimeShift: string;
        } | null;
      };
    },
  ];
}

export const tempoSchema = zod.object({
  apiVersion: zod.number().min(1, 'Api Version is required'),
  datasources: zod.array(
    zod.object({
      name: zod.string().min(1, 'Name is required'),
      type: zod.string().optional(),
      access: zod.string().optional(),
      orgId: zod.number(),
      url: zod.string().min(1, 'URL is required'),
      basicAuth: zod.boolean(),
      version: zod.number(),
      editable: zod.boolean(),
      apiVersion: zod.number(),
      uid: zod.string().optional(),
      jsonData: zod.object({
        httpMethod: zod.string().min(1, 'Http Method is required'),
        nodeGraph: zod.object({
          enabled: zod.boolean(),
        }),
        serviceMap: zod.object({
          datasourceUid: zod.string().min(1, 'Datasource UID is required'),
        }),
        tracesToLogsV2: zod.object({
          datasourceUid: zod.string().min(1, 'Datasource UID is required'),
          filterBySpanID: zod.boolean(),
          filterByTraceID: zod.boolean(),
          spanEndTimeShift: zod
            .string()
            .min(1, 'Span End Time Shift is required'),
          spanStartTimeShift: zod
            .string()
            .min(1, 'Span Start Time Shift is required'),
        }),
      }),
    }),
  ),
});

export type TempoSchema = zod.infer<typeof tempoSchema>;

export interface tempoValidationError {
  detail: [
    {
      type: string;
      loc: string[];
      msg: string;
      input: null;
    },
  ];
}
