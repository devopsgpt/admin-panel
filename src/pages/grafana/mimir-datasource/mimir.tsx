import { usePost } from '@/core/react-query';
import { useDownload } from '@/hooks';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { FormWrapper } from '@/components/form/form-wrapper';
import { FormInput } from '@/components/form/form-input';
import {
  MimirBody,
  MimirResponse,
  mimirSchema,
  MimirSchema,
  mimirValidationError,
} from './mimir.types';

const defaultValues = {
  name: 'Mimir',
  uid: 'mimir',
  url: 'http://mimir-nginx.mimir.svc.cluster.local/prometheus',
  editable: true,
  alertmanagerUid: 'alertmanager',
  multi_tenancy: {
    tenant_name: 'pods',
    httpHeaderName1: 'X-Scope-OrgID',
  },
};

const MimirDatasource: FC = () => {
  const generateTemplate = usePost<MimirResponse, MimirBody>(
    '/grafana/mimir',
    'mimir',
    true,
  );
  const downloadTemplate = useDownload({
    folderName: 'MyGrafana',
    isEngine: true,
    source: 'mimir',
  });

  const [multiTenancy, setMultiTenancy] = useState(false);

  const templateMethods = useForm<MimirSchema>({
    resolver: zodResolver(mimirSchema),
    defaultValues,
  });

  const handleGetTemplate = async (data: MimirSchema) => {
    try {
      const body = {
        ...data,
        multi_tenancy: multiTenancy
          ? {
              tenant_name: data.multi_tenancy.tenant_name,
              httpHeaderName1: data.multi_tenancy.httpHeaderName1,
            }
          : null,
      };

      await generateTemplate.mutateAsync(body);
      await downloadTemplate.download({ fileName: 'mimir.zip' });
    } catch (error) {
      console.log(error);
      if (isAxiosError<mimirValidationError>(error)) {
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
            <FormInput label="UID" name="uid" />
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
            <FormInput label="Alertmanager Uid" name="alertmanagerUid" />
            <div>
              <div className="my-1 flex items-center justify-between">
                <label htmlFor="multi-tenancy" className="cursor-pointer">
                  Multi Tenancy
                </label>
                <input
                  id="multi-tenancy"
                  type="checkbox"
                  className={cn(
                    'toggle border-gray-800 bg-gray-500',
                    'checked:bg-orchid-medium checked:bg-orchid-medium/70',
                  )}
                  onChange={(e) => setMultiTenancy(e.target.checked)}
                />
              </div>
              <div
                className={cn('max-h-0 w-full overflow-hidden transition-all', {
                  'max-h-96': multiTenancy,
                })}
              >
                <div className="mt-2 space-y-2">
                  <FormInput
                    label="Tenant Name"
                    name="multi_tenancy.tenant_name"
                  />
                  <FormInput
                    label="Http Header Name"
                    name="multi_tenancy.httpHeaderName1"
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

export default MimirDatasource;
