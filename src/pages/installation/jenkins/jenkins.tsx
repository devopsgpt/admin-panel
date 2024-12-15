import { FormWrapper } from '@/components/form/form-wrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import {
  JenkinsInstallationBody,
  jenkinsInstallationError,
  JenkinsInstallationResponse,
  jenkinsInstallationSchema,
  jenkinsInstallationType,
} from './jenkins.types';
import { usePost } from '@/core/react-query';
import { INSTALLATION } from '@/enums/api.enums';
import { useDownload } from '@/hooks';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { FormSelect } from '@/components/form/form-select';
import { environmentOptions, osOptions } from './data/select-options';

const JenkinsInstallation: FC = () => {
  const {
    mutateAsync: jenkinsInstallationMutate,
    isPending: jenkinsInstallationPending,
  } = usePost<JenkinsInstallationResponse, JenkinsInstallationBody>(
    INSTALLATION.Jenkins,
    'installation-jenkins',
  );

  const { download: downloadCompose, isPending: downloadComposePending } =
    useDownload({
      source: 'jenkins',
      folderName: 'MyCompose',
    });

  const { download: downloadBash, isPending: downloadBashPending } =
    useDownload({
      source: 'jenkins',
      folderName: 'MyBash',
    });

  const methods = useForm<jenkinsInstallationType>({
    resolver: zodResolver(jenkinsInstallationSchema),
  });

  const handleSubmit = async (data: jenkinsInstallationType) => {
    try {
      const body = {
        os: data.os.value,
        environment: data.environment.value,
      };
      console.log(body);
      await jenkinsInstallationMutate(body);
      if (body.environment === 'Docker') {
        await downloadCompose({ fileName: 'Jenkins Docker installation.zip' });
      } else if (body.environment === 'Linux') {
        await downloadBash({ fileName: 'Jenkins Linux installation.zip' });
      }
    } catch (error) {
      if (isAxiosError<jenkinsInstallationError>(error)) {
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
            disabled={jenkinsInstallationPending}
            className="btn w-full bg-orchid-medium text-white hover:bg-orchid-medium/70 disabled:bg-orchid-medium/50 disabled:text-white/70"
          >
            {jenkinsInstallationPending
              ? 'Generating...'
              : downloadBashPending || downloadComposePending
                ? 'Downloading...'
                : 'Generate'}
          </button>
        </div>
      </FormWrapper>
    </div>
  );
};

export default JenkinsInstallation;
