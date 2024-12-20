import { FormInput } from '@/components/form/form-input';
import { FormSelect } from '@/components/form/form-select';
import { FormWrapper } from '@/components/form/form-wrapper';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { implementationOptions } from './data/select-options';
import { cn } from '@/lib/utils';
import { usePost } from '@/core/react-query';
import {
  AlertManagerBody,
  AlertManagerResponse,
  alertManagerSchema,
  AlertManagerSchema,
  alertManagerValidationError,
} from './alertmanager.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDownload } from '@/hooks';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

const defaultValues = {
  name: 'Alertmanager',
  url: 'http://localhost:9093',
  uid: 'alertmanager',
  handleGrafanaManagedAlerts: true,
  editable: true,
};

const AlertManager: FC = () => {
  const generateTemplate = usePost<AlertManagerResponse, AlertManagerBody>(
    '/grafana/alertmanager',
    'alertmanager',
    true,
  );
  const downloadTemplate = useDownload({
    folderName: 'MyGrafana',
    isEngine: true,
    source: 'alertmanager',
  });

  const [basicAuth, setBasicAuth] = useState(false);

  const templateMethods = useForm<AlertManagerSchema>({
    resolver: zodResolver(alertManagerSchema),
    defaultValues,
  });

  const handleGetTemplate = async (data: AlertManagerSchema) => {
    try {
      const body = {
        ...data,
        basic_auth: basicAuth
          ? {
              basicAuthUser: data.basic_auth?.basicAuthUser,
              basicAuthPassword: data.basic_auth?.basicAuthPassword,
            }
          : null,
        implementation: data.implementation.value,
      };

      await generateTemplate.mutateAsync(body);
      await downloadTemplate.download({ fileName: 'alertmanager.zip' });
    } catch (error) {
      console.log(error);
      if (isAxiosError<alertManagerValidationError>(error)) {
        toast.error(
          `${error.response?.data.detail[0].loc[error.response?.data.detail[0].loc.length - 1]} ${error.response?.data.detail[0].msg}`,
        );
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center text-white">
      <div className="w-full max-w-96">
        <FormWrapper methods={templateMethods} onSubmit={handleGetTemplate}>
          <div className="flex flex-col gap-3">
            <FormInput label="Name" name="name" />
            <FormInput label="URL" name="url" />
            <FormInput label="UID" name="uid" />
            <FormSelect
              label="Implementation"
              name="implementation"
              options={implementationOptions}
            />
            <div className="my-1 flex items-center justify-between">
              <label
                htmlFor="handleGrafanaManagedAlerts"
                className="cursor-pointer"
              >
                Handle Grafana Managed Alerts
              </label>
              <input
                id="handleGrafanaManagedAlerts"
                type="checkbox"
                className={cn(
                  'toggle border-gray-800 bg-gray-500',
                  'checked:bg-orchid-medium checked:bg-orchid-medium/70',
                )}
                {...templateMethods.register('handleGrafanaManagedAlerts', {
                  setValueAs: (value) => !!value,
                })}
              />
            </div>
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
                  : 'Generate Terraform'}
            </button>
          </div>
        </FormWrapper>
      </div>
    </div>
  );
};

export default AlertManager;
