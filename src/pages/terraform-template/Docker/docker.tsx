import { cn } from '@/lib/utils';
import { FC, FormEvent, useState } from 'react';
import { DockerBody, DockerResponse } from './docker.types';
import { usePost } from '@/core/react-query';
import { useDownload } from '@/hooks';
import { TerraformTemplateAPI } from '@/enums/api.enums';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

const Docker: FC = () => {
  const { mutateAsync: dockerMutate, isPending: dockerPending } = usePost<
    DockerResponse,
    DockerBody
  >(TerraformTemplateAPI.Docker, 'docker');
  const { download, isPending: downloadPending } = useDownload({
    folderName: 'MyTerraform',
    source: 'docker',
    downloadFileName: 'Docker',
  });

  const [services, setServices] = useState({
    docker_image: false,
    docker_container: false,
  });

  const handleServices = (serviceItem: keyof typeof services) => {
    setServices((prev) => ({
      ...prev,
      [serviceItem]: !prev[serviceItem],
    }));
  };

  const handleForm = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const dockerBody: DockerBody = {
        ...services,
      };

      await dockerMutate(dockerBody);
      await download();
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.data.detail) {
          toast.error(error.response.data.detail);
        } else {
          toast.error('Something went wrong');
        }
      }
    }
  };

  return (
    <form onSubmit={handleForm} className="w-full max-w-96 text-white">
      <div className="rounded-md border border-gray-500">
        <div className="divide-y divide-gray-500">
          <div className="flex w-full items-center justify-between px-3 py-3">
            <p>Key Pair</p>
            <input
              type="checkbox"
              className={cn('toggle border-gray-500 bg-gray-500', {
                'bg-orange-base hover:bg-orange-base/70': services.docker_image,
              })}
              onChange={() => handleServices('docker_image')}
            />
          </div>
          <div className="flex w-full items-center justify-between px-3 py-3">
            <p>Security Group</p>
            <input
              type="checkbox"
              className={cn('toggle border-gray-500 bg-gray-500', {
                'bg-orange-base hover:bg-orange-base/70':
                  services.docker_container,
              })}
              onChange={() => handleServices('docker_container')}
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={dockerPending || downloadPending}
        className="btn mt-3 w-full bg-orange-base text-white hover:bg-orange-base/70 disabled:bg-orange-base/50 disabled:text-white/70"
      >
        {dockerPending
          ? 'Wait...'
          : downloadPending
            ? 'Wait...'
            : 'Generate Terraform'}
      </button>
    </form>
  );
};

export default Docker;
