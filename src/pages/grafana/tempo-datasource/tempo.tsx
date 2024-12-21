import { FormInput } from '@/components/form/form-input';
import { FormWrapper } from '@/components/form/form-wrapper';
import { usePost } from '@/core/react-query';
import { useDownload } from '@/hooks';
import { cn } from '@/lib/utils';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  TempoBody,
  TempoResponse,
  tempoSchema,
  TempoSchema,
  tempoValidationError,
} from './tempo.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

const defaultValues = {
  apiVersion: 1,
  datasources: [
    {
      name: 'Tempo',
      type: 'tempo',
      access: 'proxy',
      orgId: 1,
      url: 'http://tempo-query-frontend.tempo.svc.cluster.local:3100',
      basicAuth: false,
      version: 1,
      editable: true,
      apiVersion: 1,
      uid: 'tempo',
      jsonData: {
        httpMethod: 'GET',
        nodeGraph: {
          enabled: true,
        },
        serviceMap: {
          datasourceUid: 'Mimir-OtelMetrics-Tenant',
        },
        tracesToLogsV2: {
          datasourceUid: 'loki',
          filterBySpanID: true,
          filterByTraceID: true,
          spanEndTimeShift: '2m',
          spanStartTimeShift: '-2m',
        },
      },
    },
  ],
};

const TempoDatasource: FC = () => {
  const generateTemplate = usePost<TempoResponse, TempoBody>(
    '/grafana/tempo',
    'tempo',
    true,
  );
  const downloadTemplate = useDownload({
    folderName: 'MyGrafana',
    isEngine: true,
    source: 'tempo',
  });

  const [serviceMap, setServiceMap] = useState(false);
  const [tracesToLogsV2, setTracesToLogsV2] = useState(false);

  const templateMethods = useForm<TempoSchema>({
    resolver: zodResolver(tempoSchema),
    defaultValues,
  });

  const handleGetTemplate = async (data: TempoSchema) => {
    try {
      const body: TempoBody = {
        apiVersion: data.apiVersion,
        datasources: [
          {
            ...data.datasources[0],
            jsonData: {
              ...data.datasources[0].jsonData,
              serviceMap: serviceMap
                ? data.datasources[0].jsonData.serviceMap
                : null,
              tracesToLogsV2: tracesToLogsV2
                ? data.datasources[0].jsonData.tracesToLogsV2
                : null,
            },
          },
        ],
      };

      await generateTemplate.mutateAsync(body);
      await downloadTemplate.download({ fileName: 'tempo.zip' });
    } catch (error) {
      console.log(error);
      if (isAxiosError<tempoValidationError>(error)) {
        toast.error(
          `${error.response?.data.detail[0].loc[error.response?.data.detail[0].loc.length - 1]} ${error.response?.data.detail[0].msg}`,
        );
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  return (
    <div className="h-full w-full text-white">
      <div className="mx-auto w-full max-w-96">
        <FormWrapper methods={templateMethods} onSubmit={handleGetTemplate}>
          <div className="flex flex-col gap-3">
            <FormInput
              name="apiVersion"
              label="API Version"
              inputType="number"
              isNumber
            />
            <h1 className="text-2xl font-bold">Datasources</h1>
            <FormInput name="datasources.0.name" label="Name" />
            <FormInput name="datasources.0.type" label="Type" />
            <FormInput name="datasources.0.access" label="Access" />
            <FormInput
              name="datasources.0.orgId"
              label="Org ID"
              inputType="number"
              isNumber
            />
            <FormInput name="datasources.0.url" label="URL" />
            <div className="my-1 flex items-center justify-between">
              <label htmlFor="basicAuth" className="cursor-pointer">
                Basic Auth
              </label>
              <input
                id="basicAuth"
                type="checkbox"
                className={cn(
                  'toggle border-gray-800 bg-gray-500',
                  'checked:bg-orchid-medium checked:bg-orchid-medium/70',
                )}
                {...templateMethods.register('datasources.0.basicAuth', {
                  setValueAs: (value) => !!value,
                })}
              />
            </div>
            <FormInput
              name="datasources.0.version"
              label="Version"
              inputType="number"
              isNumber
            />
            <div className="my-1 flex items-center justify-between">
              <label htmlFor="basicAuth" className="cursor-pointer">
                Editable
              </label>
              <input
                id="basicAuth"
                type="checkbox"
                className={cn(
                  'toggle border-gray-800 bg-gray-500',
                  'checked:bg-orchid-medium checked:bg-orchid-medium/70',
                )}
                {...templateMethods.register('datasources.0.editable', {
                  setValueAs: (value) => !!value,
                })}
              />
            </div>
            <FormInput
              name="datasources.0.apiVersion"
              label="Api Version"
              inputType="number"
              isNumber
            />
            <FormInput name="datasources.0.uid" label="UID" />
            <FormInput
              name="datasources.0.jsonData.httpMethod"
              label="HTTP Method"
            />
            <div>
              <div className="my-1 flex items-center justify-between">
                <label htmlFor="nodeGraph" className="cursor-pointer">
                  Node Graph
                </label>
                <input
                  id="nodeGraph"
                  type="checkbox"
                  className={cn(
                    'toggle border-gray-800 bg-gray-500',
                    'checked:bg-orchid-medium checked:bg-orchid-medium/70',
                  )}
                  {...templateMethods.register(
                    'datasources.0.jsonData.nodeGraph.enabled',
                    {
                      setValueAs: (value) => !!value,
                    },
                  )}
                />
              </div>
            </div>
            <div>
              <div className="my-2 flex items-center justify-between">
                <label htmlFor="serviceMap" className="cursor-pointer">
                  Service Map
                </label>
                <input
                  id="serviceMap"
                  type="checkbox"
                  className={cn(
                    'toggle border-gray-800 bg-gray-500',
                    'checked:bg-orchid-medium checked:bg-orchid-medium/70',
                  )}
                  onChange={(e) => setServiceMap(e.target.checked)}
                />
              </div>
              <div
                className={cn('max-h-0 w-full overflow-hidden transition-all', {
                  'max-h-96': serviceMap,
                })}
              >
                <div className="my-2 pl-4">
                  <FormInput
                    name="datasources.0.jsonData.serviceMap.datasourceUid"
                    label="Datasource UID"
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="my-1 flex items-center justify-between">
                <label htmlFor="tracesToLogsV2" className="cursor-pointer">
                  Traces To Logs V2
                </label>
                <input
                  id="tracesToLogsV2"
                  type="checkbox"
                  className={cn(
                    'toggle border-gray-800 bg-gray-500',
                    'checked:bg-orchid-medium checked:bg-orchid-medium/70',
                  )}
                  onChange={(e) => setTracesToLogsV2(e.target.checked)}
                />
              </div>
              <div
                className={cn('max-h-0 w-full overflow-hidden transition-all', {
                  'max-h-96': tracesToLogsV2,
                })}
              >
                <div className="my-2 flex flex-col gap-2 pl-4">
                  <FormInput
                    name="datasources.0.jsonData.tracesToLogsV2.datasourceUid"
                    label="Datasource UID"
                  />
                  <div className="my-2 flex items-center justify-between">
                    <label htmlFor="filterBySpanID" className="cursor-pointer">
                      Filter By Span ID
                    </label>
                    <input
                      id="filterBySpanID"
                      type="checkbox"
                      className={cn(
                        'toggle border-gray-800 bg-gray-500',
                        'checked:bg-orchid-medium checked:bg-orchid-medium/70',
                      )}
                      {...templateMethods.register(
                        'datasources.0.jsonData.tracesToLogsV2.filterBySpanID',
                        {
                          setValueAs: (value) => !!value,
                        },
                      )}
                    />
                  </div>
                  <div className="my-2 flex items-center justify-between">
                    <label htmlFor="filterByTraceID" className="cursor-pointer">
                      Filter By Trace ID
                    </label>
                    <input
                      id="filterByTraceID"
                      type="checkbox"
                      className={cn(
                        'toggle border-gray-800 bg-gray-500',
                        'checked:bg-orchid-medium checked:bg-orchid-medium/70',
                      )}
                      {...templateMethods.register(
                        'datasources.0.jsonData.tracesToLogsV2.filterByTraceID',
                        {
                          setValueAs: (value) => !!value,
                        },
                      )}
                    />
                  </div>
                  <FormInput
                    name="datasources.0.jsonData.tracesToLogsV2.spanEndTimeShift"
                    label="Span End Time Shift"
                  />
                  <FormInput
                    name="datasources.0.jsonData.tracesToLogsV2.spanStartTimeShift"
                    label="Span Start Time Shift"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={
                generateTemplate.isPending || downloadTemplate.isPending
              }
              className="btn mt-1 w-full bg-orchid-medium text-white hover:bg-orchid-medium/70 disabled:bg-orchid-medium/50 disabled:text-white/70"
            >
              {generateTemplate.isPending
                ? 'Wait...'
                : downloadTemplate.isPending
                  ? 'Wait...'
                  : 'Generate Terraform'}
            </button>
          </div>
        </FormWrapper>
      </div>
    </div>
  );
};

export default TempoDatasource;
