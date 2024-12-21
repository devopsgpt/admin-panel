import { FormInput } from '@/components/form/form-input';
import { FormWrapper } from '@/components/form/form-wrapper';
import { usePost } from '@/core/react-query';
import { useDownload } from '@/hooks';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { FC } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import {
  PrometheusBody,
  PrometheusResponse,
  PrometheusSchema,
  prometheusSchema,
  prometheusValidationError,
} from './prometheus.types';

const defaultValues = {
  name: 'Prometheus',
  url: 'http://localhost:9090',
  editable: true,
  httpMethod: 'POST',
  manageAlerts: true,
  prometheusType: 'Prometheus',
  prometheusVersion: '2.44.0',
  cacheLevel: 'High',
  disableRecordingRules: false,
  incrementalQueryOverlapWindow: '10m',
};

const PrometheusDatasource: FC = () => {
  const generateTemplate = usePost<PrometheusResponse, PrometheusBody>(
    '/grafana/prometheus',
    'prometheus',
    true,
  );
  const downloadTemplate = useDownload({
    folderName: 'MyGrafana',
    isEngine: true,
    source: 'prometheus',
  });

  const templateMethods = useForm<PrometheusSchema>({
    resolver: zodResolver(prometheusSchema),
    defaultValues,
  });

  const handleGetTemplate = async (data: PrometheusSchema) => {
    try {
      await generateTemplate.mutateAsync(data);
      await downloadTemplate.download({ fileName: 'prometheus.zip' });
    } catch (error) {
      console.log(error);
      if (isAxiosError<prometheusValidationError>(error)) {
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
            <FormInput label="Name" name="name" />
            <FormInput label="URL" name="url" />
            <div className="my-1 flex items-center justify-between">
              <label htmlFor="editable" className="cursor-pointer">
                Editable
              </label>
              <input
                id="editable"
                type="checkbox"
                className={cn(
                  'toggle border-gray-800 bg-gray-500',
                  'checked:bg-orchid-medium checked:bg-orchid-medium/70',
                )}
                {...templateMethods.register('editable', {
                  setValueAs: (value) => !!value,
                })}
              />
            </div>
            <FormInput label="HTTP Method" name="httpMethod" />
            <div className="my-1 flex items-center justify-between">
              <label htmlFor="manageAlerts" className="cursor-pointer">
                Manage Alerts
              </label>
              <input
                id="manageAlerts"
                type="checkbox"
                className={cn(
                  'toggle border-gray-800 bg-gray-500',
                  'checked:bg-orchid-medium checked:bg-orchid-medium/70',
                )}
                {...templateMethods.register('manageAlerts', {
                  setValueAs: (value) => !!value,
                })}
              />
            </div>

            <FormInput label="Prometheus Type" name="prometheusType" />
            <FormInput label="Prometheus Version" name="prometheusVersion" />

            <FormInput label="Cache Level" name="cacheLevel" />

            <div className="my-1 flex items-center justify-between">
              <label htmlFor="disableRecordingRules" className="cursor-pointer">
                Disable Recording Rules
              </label>
              <input
                id="disableRecordingRules"
                type="checkbox"
                className={cn(
                  'toggle border-gray-800 bg-gray-500',
                  'checked:bg-orchid-medium checked:bg-orchid-medium/70',
                )}
                {...templateMethods.register('disableRecordingRules', {
                  setValueAs: (value) => !!value,
                })}
              />
            </div>
            <FormInput
              label="Incremental Query Overlap Window Version"
              name="incrementalQueryOverlapWindow"
            />
            <button
              type="submit"
              disabled={
                generateTemplate.isPending || downloadTemplate.isPending
              }
              className="btn w-full bg-orchid-medium text-white hover:bg-orchid-medium/70 disabled:bg-orchid-medium/50 disabled:text-white/70"
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

export default PrometheusDatasource;
