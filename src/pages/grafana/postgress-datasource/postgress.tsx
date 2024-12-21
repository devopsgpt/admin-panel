import { FormInput } from '@/components/form/form-input';
import { FormWrapper } from '@/components/form/form-wrapper';
import { usePost } from '@/core/react-query';
import { useDownload } from '@/hooks';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { FC } from 'react';
import { toast } from 'sonner';
import {
  PostgresBody,
  PostgresResponse,
  postgresSchema,
  PostgresSchema,
  postgresValidationError,
} from './postgress.types';
import { useForm } from 'react-hook-form';

const defaultValues = {
  name: 'Postgres',
  url: 'localhost:5432',
  user: 'grafana',
  editable: true,
  database: 'grafana',
  sslmode: "'disable'",
  password: 'Password!',
  maxOpenConns: 100,
  maxIdleConns: 100,
  maxIdleConnsAuto: true,
  connMaxLifetime: 14400,
  postgresVersion: 903,
  timescaledb: false,
};

const PostgresDatasource: FC = () => {
  const generateTemplate = usePost<PostgresResponse, PostgresBody>(
    '/grafana/postgres',
    'postgres',
    true,
  );
  const downloadTemplate = useDownload({
    folderName: 'MyGrafana',
    isEngine: true,
    source: 'postgres',
  });

  const templateMethods = useForm<PostgresSchema>({
    resolver: zodResolver(postgresSchema),
    defaultValues,
  });

  const handleGetTemplate = async (data: PostgresSchema) => {
    try {
      await generateTemplate.mutateAsync(data);
      await downloadTemplate.download({ fileName: 'postgres.zip' });
    } catch (error) {
      console.log(error);
      if (isAxiosError<postgresValidationError>(error)) {
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
            <FormInput label="SSL Mode" name="sslmode" />
            <FormInput label="Password" name="password" />

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
            <FormInput
              label="Postgres Version"
              name="postgresVersion"
              inputType="number"
              isNumber={true}
            />

            <div className="my-1 flex items-center justify-between">
              <label htmlFor="timescaledb" className="cursor-pointer">
                Time Scale DB
              </label>
              <input
                id="timescaledb"
                type="checkbox"
                className={cn(
                  'toggle border-gray-800 bg-gray-500',
                  'checked:bg-orchid-medium checked:bg-orchid-medium/70',
                )}
                {...templateMethods.register('timescaledb', {
                  setValueAs: (value) => !!value,
                })}
              />
            </div>
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

export default PostgresDatasource;
