import { FormWrapper } from '@/components/form/form-wrapper';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import {
  ElasticSearchBody,
  ElasticSearchResponse,
  elasticSearchSchema,
  ElasticSearchSchema,
  elasticSearchValidationError,
} from './elasticsearch.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/components/form/form-input';
import { cn } from '@/lib/utils';
import { usePost } from '@/core/react-query';
import { useDownload } from '@/hooks';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

const defaultValues = {
  name: 'elasticsearch-v7-filebeat',
  url: 'http://localhost:9200',
  editable: true,
  index: '[filebeat-]YYYY.MM.DD',
  interval: 'Daily',
  timeField: '@timestamp',
  logMessageField: 'message',
  logLevelField: 'fields.level',
};

const ElasticSearchDatasource: FC = () => {
  const generateTemplate = usePost<ElasticSearchResponse, ElasticSearchBody>(
    '/grafana/elasticsearch',
    'alertmanager',
    true,
  );
  const downloadTemplate = useDownload({
    folderName: 'MyGrafana',
    isEngine: true,
    source: 'elasticsearch',
  });

  const templateMethods = useForm<ElasticSearchSchema>({
    resolver: zodResolver(elasticSearchSchema),
    defaultValues,
  });

  const handleGetTemplate = async (data: ElasticSearchSchema) => {
    try {
      await generateTemplate.mutateAsync(data);
      await downloadTemplate.download({ fileName: 'elasticsearch.zip' });
    } catch (error) {
      if (isAxiosError<elasticSearchValidationError>(error)) {
        toast.error(
          `${error.response?.data.detail[0].loc[error.response?.data.detail[0].loc.length - 1]} ${error.response?.data.detail[0].msg}`,
        );
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  return (
    <div className="flex w-full items-center justify-center text-white">
      <div className="w-full max-w-96">
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
            <FormInput label="Index" name="index" />
            <FormInput label="Time Field" name="timeField" />
            <FormInput label="Log Message Field" name="logMessageField" />
            <FormInput label="Log Level Field" name="logLevelField" />
            <button
              type="submit"
              disabled={
                generateTemplate.isPending || downloadTemplate.isPending
              }
              className="btn mt-3 w-full bg-orchid-medium text-white hover:bg-orchid-medium/70 disabled:bg-orchid-medium/50 disabled:text-white/70"
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

export default ElasticSearchDatasource;
