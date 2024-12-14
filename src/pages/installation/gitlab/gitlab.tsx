import { FormSelect } from '@/components/form/form-select';
import { FormWrapper } from '@/components/form/form-wrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import {
  GitlabInstallationBody,
  gitlabInstallationError,
  GitlabInstallationResponse,
  gitlabInstallationSchema,
  gitlabInstallationType,
} from './gitlab.types';
import { usePost } from '@/core/react-query';
import { INSTALLATION } from '@/enums/api.enums';
import { useDownload } from '@/hooks';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { environmentOptions } from './data/select-options';

const GitlabInstallation: FC = () => {
  const {
    mutateAsync: gitlabInstallationMutate,
    isPending: gitlabInstallationPending,
  } = usePost<GitlabInstallationResponse, GitlabInstallationBody>(
    INSTALLATION.Gitlab,
    'installation-gitlab',
  );
  const { download, isPending: downloadPending } = useDownload({
    downloadFileName: 'GitlabInstallation',
    source: 'gitlab',
    folderName: 'MyCompose',
  });

  const methods = useForm<gitlabInstallationType>({
    resolver: zodResolver(gitlabInstallationSchema),
  });

  const handleSubmit = async (data: gitlabInstallationType) => {
    try {
      const body = {
        environment: data.environment.value,
      };

      await gitlabInstallationMutate(body);
      await download();
    } catch (error) {
      if (isAxiosError<gitlabInstallationError>(error)) {
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
            name="environment"
            label="Environment"
            placeholder="Select..."
            options={environmentOptions}
          />
          <button
            type="submit"
            disabled={gitlabInstallationPending}
            className="btn w-full bg-orchid-medium text-white hover:bg-orchid-medium/70 disabled:bg-orchid-medium/50 disabled:text-white/70"
          >
            {gitlabInstallationPending
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

export default GitlabInstallation;
