import { usePost } from '@/core/react-query';
import { API } from '@/enums/api.enums';
import { FC, FormEvent, useState } from 'react';
import {
  InstallationBody,
  InstallationResponse,
  InstallationValidationError,
} from './installation.types';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import Select, { SingleValue } from 'react-select';
import { osSelectOptions, toolSelectOptions } from './data/select-options';
import { selectStyle } from './styles/select';
import { OptionType } from '@/types/select.types';

const Installation: FC = () => {
  const { mutateAsync, isPending } = usePost<
    InstallationResponse,
    InstallationBody
  >(API.Installation, 'installation');

  const [os, setOs] = useState<SingleValue<OptionType>>();
  const [tool, setTool] = useState<SingleValue<OptionType>>();

  const handleInstall = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const installationBody: InstallationBody = {
        os: os?.value as string,
        service: tool?.value as string,
      };

      const {
        data: { output },
      } = await mutateAsync(installationBody);

      const blob = new Blob([output], { type: 'text/plain' });

      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'installation.sh';
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      if (isAxiosError<InstallationValidationError>(error)) {
        if (
          Array.isArray(error.response?.data.detail) &&
          error.response?.data.detail[0].msg
        ) {
          toast.error(error.response.data.detail[0].msg);
        } else if (
          !Array.isArray(error.response?.data.detail) &&
          error.response?.data.detail
        ) {
          toast.error(error.response.data.detail);
        } else {
          toast.error('Something went wrong');
        }
      }
    }
  };

  return (
    <form
      onSubmit={handleInstall}
      className="flex h-full w-full items-center justify-center"
    >
      <div className="w-full max-w-96">
        <div className="divide-y-gray-800 rounded-md border border-gray-800">
          <Select
            options={osSelectOptions}
            placeholder="os"
            value={os}
            onChange={(newValue) => setOs(newValue)}
            styles={selectStyle('6px 6px 0 0')}
          />
          <Select
            options={toolSelectOptions}
            placeholder="tool"
            value={tool}
            onChange={(newValue) => setTool(newValue)}
            styles={selectStyle('0 0 6px 6px')}
          />
        </div>
        <button
          type="submit"
          disabled={isPending || !os || !tool}
          className="bg-orchid-medium hover:bg-orchid-medium/70 disabled:bg-orchid-medium/50 btn mt-3 w-full text-white disabled:text-white/70"
        >
          {isPending ? 'Wait...' : 'Generate'}
        </button>
      </div>
    </form>
  );
};

export default Installation;
