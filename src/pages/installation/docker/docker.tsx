import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import {
  DockerInstallationBody,
  dockerInstallationError,
  DockerInstallationResponse,
  dockerInstallationSchema,
  dockerInstallationType,
} from './docker.types';
import { FormWrapper } from '@/components/form/form-wrapper';
import { FormSelect } from '@/components/form/form-select';
import { environmentOptions, osOptions } from './data/select-options';
import { INSTALLATION } from '@/enums/api.enums';
import { usePost } from '@/core/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { useDownload } from '@/hooks';

const DockerInstallation: FC = () => {
  const {
    mutateAsync: dockerInstallationMutate,
    isPending: dockerInstallationPending,
  } = usePost<DockerInstallationResponse, DockerInstallationBody>(
    INSTALLATION.Docker,
    'installation-docker',
  );
  const { download, isPending: downloadPending } = useDownload({
    source: 'docker',
    folderName: 'MyBash',
  });

  const methods = useForm<dockerInstallationType>({
    resolver: zodResolver(dockerInstallationSchema),
  });

  const handleSubmit = async (data: dockerInstallationType) => {
    try {
      const body = {
        os: data.os.value,
        environment: data.environment.value,
      };

      await dockerInstallationMutate(body);
      await download({ fileName: `Docker ${body.environment} Install.zip` });
    } catch (error) {
      if (isAxiosError<dockerInstallationError>(error)) {
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
        <div className="flex flex-col gap-4">
          <FormSelect
            name="os"
            label="OS"
            placeholder="Select..."
            options={osOptions}
          />
          <FormSelect
            name="environment"
            label="Environment"
            placeholder="Select..."
            options={environmentOptions}
          />
          <button
            type="submit"
            disabled={dockerInstallationPending}
            className="btn w-full bg-orchid-medium text-white hover:bg-orchid-medium/70 disabled:bg-orchid-medium/50 disabled:text-white/70"
          >
            {dockerInstallationPending
              ? 'Generating...'
              : downloadPending
                ? 'Downloading...'
                : 'Generate'}
          </button>
        </div>
      </FormWrapper>
    </div>
  );
};

export default DockerInstallation;
