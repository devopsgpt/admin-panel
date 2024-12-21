import { z as zod } from 'zod';

export interface PrometheusResponse {
  output: string;
}

export interface PrometheusBody {
  name: string;
  url: string;
  editable: boolean;
  httpMethod: string;
  manageAlerts: boolean;
  prometheusType: string;
  prometheusVersion: string;
  cacheLevel: string;
  disableRecordingRules: boolean;
  incrementalQueryOverlapWindow: String;
}

export const prometheusSchema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  url: zod.string().min(1, 'URL is required'),
  editable: zod.boolean(),
  httpMethod: zod.string().min(1, 'HTTP Method is required'),
  manageAlerts: zod.boolean(),
  prometheusType: zod.string().min(1, 'SSL Mode is required'),
  prometheusVersion: zod.string().min(1, 'Password is required'),
  cacheLevel: zod.string().min(1, 'Cache Level is required'),
  disableRecordingRules: zod.boolean(),
  incrementalQueryOverlapWindow: zod
    .string()
    .min(1, 'Incremental Query Overlap Window is required'),
});

export type PrometheusSchema = zod.infer<typeof prometheusSchema>;

export interface prometheusValidationError {
  detail: [
    {
      type: string;
      loc: string[];
      msg: string;
      input: null;
    },
  ];
}
