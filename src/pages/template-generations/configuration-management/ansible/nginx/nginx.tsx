import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import {
  NginxAnsibleBody,
  NginxAnsibleResponse,
  nginxAnsibleSchema,
  nginxTemplateValidationError,
} from './nginx.types';
import { AnsibleTemplateAPI } from '../../../../../enums/api.enums';
import { usePost } from '../../../../../core/react-query';
import { useDownload } from '../../../../../hooks';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import HostsField from './components/hosts-field';
import { OSOptions, VersionOptions } from './data/select-options';
import type { NginxAnsibleType } from './nginx.types';
import {
  FormInput,
  FormSelect,
  FormWrapper,
} from '../../../../../components/form';

export const NginxAnsible: FC = () => {
  const defaultValues = {
    ansible_user: '',
    os: { label: 'Ubuntu', value: 'ubuntu' },
    hosts: [{ value: '' }],
    version: {
      label: 'Latest',
      value: 'latest',
    },
  };

  const methods = useForm<NginxAnsibleType>({
    resolver: zodResolver(nginxAnsibleSchema),
    defaultValues,
  });

  const { mutateAsync: nginxAnsibleMutate, isPending: nginxAnsiblePending } =
    usePost<NginxAnsibleResponse, NginxAnsibleBody>(
      AnsibleTemplateAPI.Nginx,
      'ansible-nginx',
      true,
    );

  const { download, isPending: downloadPending } = useDownload({
    source: 'nginx',
    folderName: 'MyAnsible',
    isEngine: true,
  });

  const handleSubmit = async (data: NginxAnsibleType) => {
    try {
      const body = {
        ...data,
        hosts: data.hosts.map((host) => host.value),
        os: data.os.value,
        version: data.version.value,
      };

      await nginxAnsibleMutate(body);
      await download({ fileName: 'NginxAnsible.zip' });
    } catch (error) {
      console.log(error);
      if (isAxiosError<nginxTemplateValidationError>(error)) {
        toast.error(
          `${error.response?.data.detail[0].loc[error.response?.data.detail[0].loc.length - 1]} ${error.response?.data.detail[0].msg}`,
        );
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  return (
    <div className="w-full max-w-96 text-white">
      <FormWrapper methods={methods} onSubmit={handleSubmit}>
        <div className="mb-4">
          <FormInput
            id="ansible_user"
            name={`ansible_user`}
            label="User"
            placeholder="root"
          />
        </div>
        <div className="mb-4">
          <FormInput
            id="ansible_port"
            name={`ansible_port`}
            label="Port"
            placeholder="22"
            inputType={'number'}
            isNumber={true}
          />
        </div>
        <div className="mb-4">
          <FormSelect
            name={`os`}
            label="OS"
            placeholder="Select..."
            options={OSOptions}
          />
        </div>
        <div className="mb-4">
          <HostsField />
        </div>
        <div className="mb-4">
          <FormSelect
            name={`version`}
            label="Version"
            placeholder="Select..."
            options={VersionOptions}
          />
        </div>
        <button
          type="submit"
          disabled={nginxAnsiblePending}
          className="btn mt-3 w-full bg-orchid-medium text-white hover:bg-orchid-medium/70 disabled:bg-orchid-medium/50 disabled:text-white/70"
        >
          {nginxAnsiblePending
            ? 'Generating...'
            : downloadPending
              ? 'Downloading...'
              : 'Generate'}
        </button>
      </FormWrapper>
    </div>
  );
};
