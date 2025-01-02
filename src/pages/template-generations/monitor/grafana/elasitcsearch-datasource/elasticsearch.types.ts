import { z as zod } from 'zod';

export interface ElasticSearchResponse {
  output: string;
}

export interface ElasticSearchBody {
  name: string;
  url: string;
  editable: boolean;
  index: string;
  interval: string;
  timeField: string;
  logMessageField: string;
  logLevelField: string;
}

export const elasticSearchSchema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  url: zod.string().min(1, 'URL is required'),
  editable: zod.boolean(),
  index: zod.string().min(1, 'Index is required'),
  interval: zod.string().min(1, 'Interval is required'),
  timeField: zod.string().min(1, 'Time Field is required'),
  logMessageField: zod.string().min(1, 'Log Message Field is required'),
  logLevelField: zod.string().min(1, 'Log Level Field is required'),
});

export type ElasticSearchSchema = zod.infer<typeof elasticSearchSchema>;

export interface elasticSearchValidationError {
  detail: [
    {
      type: string;
      loc: string[];
      msg: string;
      input: null;
    },
  ];
}
