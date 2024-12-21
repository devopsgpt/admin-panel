import { usePost } from '@/core/react-query';
import { useDownload } from '@/hooks';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  LokiBody,
  LokiResponse,
  LokiSchema,
  lokiSchema,
  lokiValidationError,
} from './loki.types';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { FormWrapper } from '@/components/form/form-wrapper';
import { FormInput } from '@/components/form/form-input';

const defaultValues = {
  name: 'Loki',
  uid: 'loki',
  url: 'http://localhost:3100',
  editable: true,
  timeout: 60,
  maxLines: 1000,
};

const LokiDatasource: FC = () => {
  const generateTemplate = usePost<LokiResponse, LokiBody>(
    '/grafana/loki',
    'loki',
    true,
  );
  const downloadTemplate = useDownload({
    folderName: 'MyGrafana',
    isEngine: true,
    source: 'loki',
  });

  const [basicAuth, setBasicAuth] = useState(false);

  const templateMethods = useForm<LokiSchema>({
    resolver: zodResolver(lokiSchema),
    defaultValues,
  });

  const handleGetTemplate = async (data: LokiSchema) => {
    try {
      const body = {
        ...data,
        basic_auth: basicAuth
          ? {
              basicAuthUser: data.basic_auth?.basicAuthUser,
              basicAuthPassword: data.basic_auth?.basicAuthPassword,
            }
          : null,
      };

      await generateTemplate.mutateAsync(body);
      await downloadTemplate.download({ fileName: 'loki.zip' });
    } catch (error) {
      console.log(error);
      if (isAxiosError<lokiValidationError>(error)) {
        toast.error(
          `${error.response?.data.detail[0].loc[error.response?.data.detail[0].loc.length - 1]} ${error.response?.data.detail[0].msg}`,
        );
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  return (
    <div className="flex h-full w-full items-start text-white sm:items-center">
      <div className="mx-auto w-full max-w-96">
        <FormWrapper methods={templateMethods} onSubmit={handleGetTemplate}>
          <div className="flex flex-col gap-3">
            <FormInput label="Name" name="name" />
            <FormInput label="URL" name="url" />
            <FormInput label="UID" name="uid" />
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
            <FormInput
              label="Timeout"
              name="timeout"
              inputType="number"
              isNumber={true}
            />
            <FormInput
              label="Max Lines"
              name="maxLines"
              inputType="number"
              isNumber={true}
            />
            <div>
              <div className="my-1 flex items-center justify-between">
                <label htmlFor="basic-auth" className="cursor-pointer">
                  Basic Auth
                </label>
                <input
                  id="basic-auth"
                  type="checkbox"
                  className={cn(
                    'toggle border-gray-800 bg-gray-500',
                    'checked:bg-orchid-medium checked:bg-orchid-medium/70',
                  )}
                  onChange={(e) => setBasicAuth(e.target.checked)}
                />
              </div>
              <div
                className={cn('max-h-0 w-full overflow-hidden transition-all', {
                  'max-h-96': basicAuth,
                })}
              >
                <div className="mt-2 space-y-2">
                  <FormInput label="Username" name="basic_auth.basicAuthUser" />
                  <FormInput
                    label="Password"
                    name="basic_auth.basicAuthPassword"
                    inputType="password"
                  />
                </div>
              </div>
            </div>
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
                  : 'Generate Datasource'}
            </button>
          </div>
        </FormWrapper>
      </div>
    </div>
  );
};

export default LokiDatasource;
