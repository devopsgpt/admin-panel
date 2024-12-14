import { FormSelect } from '@/components/form/form-select';
import { FormWrapper } from '@/components/form/form-wrapper';
import { usePost } from '@/core/react-query';
import { INSTALLATION } from '@/enums/api.enums';
import { useDownload } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { environmentOptions, osOptions } from './data/select-options';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import {
  TerraformInstallationBody,
  terraformInstallationError,
  TerraformInstallationResponse,
  terraformInstallationSchema,
  terraformInstallationType,
} from './terraform.types';

const TerraformInstallation: FC = () => {
  const {
    mutateAsync: terraformInstallationMutate,
    isPending: terraformInstallationPending,
  } = usePost<TerraformInstallationResponse, TerraformInstallationBody>(
    INSTALLATION.Terraform,
    'installation-terraform',
  );
  const { download, isPending: downloadPending } = useDownload({
    downloadFileName: 'TerraformInstallation',
    source: 'terraform',
    folderName: 'MyBash',
  });

  const methods = useForm<terraformInstallationType>({
    resolver: zodResolver(terraformInstallationSchema),
  });

  const handleSubmit = async (data: terraformInstallationType) => {
    try {
      const body = {
        os: data.os.value,
        environment: data.environment.value,
      };

      await terraformInstallationMutate(body);
      await download();
    } catch (error) {
      if (isAxiosError<terraformInstallationError>(error)) {
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
            disabled={terraformInstallationPending}
            className="btn w-full bg-orchid-medium text-white hover:bg-orchid-medium/70 disabled:bg-orchid-medium/50 disabled:text-white/70"
          >
            {terraformInstallationPending
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

export default TerraformInstallation;
