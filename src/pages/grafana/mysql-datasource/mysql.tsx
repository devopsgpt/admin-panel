import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  MySQLBody,
  MySQLResponse,
  mySQLSchema,
  MySQLSchema,
  mySQLValidationError,
} from './mysql.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormWrapper } from '@/components/form/form-wrapper';
import { usePost } from '@/core/react-query';
import { useDownload } from '@/hooks';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { FormInput } from '@/components/form/form-input';
import { cn } from '@/lib/utils';

const defaultValues = {
  name: 'MySQL',
  url: 'localhost:3306',
  user: 'grafana',
  editable: true,
  database: 'grafana',
  maxOpenConns: 100,
  maxIdleConns: 100,
  maxIdleConnsAuto: true,
  connMaxLifetime: 14400,
  password: '${GRAFANA_MYSQL_PASSWORD}',
  tls: {
    tlsClientCert: '${GRAFANA_TLS_CLIENT_CERT}',
    tlsCACert: '${GRAFANA_TLS_CA_CERT}',
    tlsAuth: true,
    tlsSkipVerify: true,
  },
};

const MySQLDatasource: FC = () => {
  const generateTemplate = usePost<MySQLResponse, MySQLBody>(
    '/grafana/mysql',
    'mimir',
    true,
  );
  const downloadTemplate = useDownload({
    folderName: 'MyGrafana',
    isEngine: true,
    source: 'mysql',
  });

  const [tls, setTls] = useState(false);

  const templateMethods = useForm<MySQLSchema>({
    resolver: zodResolver(mySQLSchema),
    defaultValues,
  });

  const handleGetTemplate = async (data: MySQLSchema) => {
    try {
      const body = {
        ...data,
        tls: tls ? data.tls : null,
      };

      await generateTemplate.mutateAsync(body);
      await downloadTemplate.download({ fileName: 'mysql.zip' });
    } catch (error) {
      console.log(error);
      if (isAxiosError<mySQLValidationError>(error)) {
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
            <FormInput label="User" name="user" />
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
            <FormInput label="Database" name="database" />
            <FormInput
              label="Max Open Conns"
              name="maxOpenConns"
              inputType="number"
              isNumber={true}
            />
            <FormInput
              label="Max Idle Conns"
              name="maxIdleConns"
              inputType="number"
              isNumber={true}
            />
            <div className="my-1 flex items-center justify-between">
              <label htmlFor="maxIdleConnsAuto" className="cursor-pointer">
                Max Idle Conns Auto
              </label>
              <input
                id="maxIdleConnsAuto"
                type="checkbox"
                className={cn(
                  'toggle border-gray-800 bg-gray-500',
                  'checked:bg-orchid-medium checked:bg-orchid-medium/70',
                )}
                {...templateMethods.register('maxIdleConnsAuto', {
                  setValueAs: (value) => !!value,
                })}
              />
            </div>
            <FormInput
              label="Conn Max Lifetime"
              name="connMaxLifetime"
              inputType="number"
              isNumber={true}
            />
            <FormInput label="Password" name="password" />
            <div>
              <div className="my-1 flex items-center justify-between">
                <label htmlFor="tls" className="cursor-pointer">
                  TLS
                </label>
                <input
                  id="tls"
                  type="checkbox"
                  className={cn(
                    'toggle border-gray-800 bg-gray-500',
                    'checked:bg-orchid-medium checked:bg-orchid-medium/70',
                  )}
                  onChange={(e) => setTls(e.target.checked)}
                />
              </div>
              <div
                className={cn('max-h-0 w-full overflow-hidden transition-all', {
                  'max-h-96': tls,
                })}
              >
                <div className="mt-2 flex flex-col gap-2">
                  <FormInput label="TLS Client Cert" name="tls.tlsClientCert" />
                  <FormInput label="TLS CA Cert" name="tls.tlsCACert" />
                  <div className="my-1 flex items-center justify-between">
                    <label htmlFor="tlsAuth" className="cursor-pointer">
                      TLS Auth
                    </label>
                    <input
                      id="tlsAuth"
                      type="checkbox"
                      className={cn(
                        'toggle border-gray-800 bg-gray-500',
                        'checked:bg-orchid-medium checked:bg-orchid-medium/70',
                      )}
                      {...templateMethods.register('tls.tlsAuth', {
                        setValueAs: (value) => !!value,
                      })}
                    />
                  </div>
                  <div className="my-1 flex items-center justify-between">
                    <label htmlFor="tlsSkipVerify" className="cursor-pointer">
                      TLS Skip Verify
                    </label>
                    <input
                      id="tlsSkipVerify"
                      type="checkbox"
                      className={cn(
                        'toggle border-gray-800 bg-gray-500',
                        'checked:bg-orchid-medium checked:bg-orchid-medium/70',
                      )}
                      {...templateMethods.register('tls.tlsSkipVerify', {
                        setValueAs: (value) => !!value,
                      })}
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
          </div>
        </FormWrapper>
      </div>
    </div>
  );
};

export default MySQLDatasource;
