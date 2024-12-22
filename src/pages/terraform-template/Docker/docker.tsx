import { cn } from '@/lib/utils';
import { FC, FormEvent, useState } from 'react';
import { DockerBody, DockerResponse } from './docker.types';
import { usePost } from '@/core/react-query';
import { TerraformTemplateAPI } from '@/enums/api.enums';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { externalTemplateInstance } from '@/lib/axios';

const Docker: FC = () => {
  const { mutateAsync: dockerMutate, isPending: dockerPending } = usePost<
    DockerResponse,
    DockerBody
  >(TerraformTemplateAPI.Docker, 'docker', true);

  const [getTemplatePending, setGetTemplatePending] = useState(false);

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

      const { data } = await dockerMutate(dockerBody);

      const formData = new FormData();
      const blob = new Blob([data]);
      formData.append('tfvars_file', blob, 'terraform.tfvars');
      setGetTemplatePending(true);
      const { data: template } = await externalTemplateInstance.post(
        '/terraform-get/docker',
        formData,
        {
          responseType: 'blob',
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      if (template) {
        const zipBlob = new Blob([template], { type: 'application/zip' });
        console.log(`Blob size: ${zipBlob.size} bytes`);

        const url = window.URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'DockerTerraform.zip');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.data.detail) {
          toast.error(error.response.data.detail);
        } else {
          toast.error('Something went wrong');
        }
      }
    } finally {
      setGetTemplatePending(false);
    }
  };

  return (
    <form onSubmit={handleForm} className="w-full max-w-96 text-white">
      <div className="rounded-md border border-gray-800">
        <div className="divide-y divide-gray-800">
          <div className="flex w-full items-center justify-between px-3 py-3">
            <p>Docker Image</p>
            <input
              type="checkbox"
              className={cn('toggle border-gray-800 bg-gray-500', {
                'bg-orchid-medium hover:bg-orchid-medium/80':
                  services.docker_image,
              })}
              onChange={() => handleServices('docker_image')}
            />
          </div>
          <div className="flex w-full items-center justify-between px-3 py-3">
            <p>Docker Container</p>
            <input
              type="checkbox"
              className={cn('toggle border-gray-800 bg-gray-500', {
                'bg-orchid-medium hover:bg-orchid-medium/80':
                  services.docker_container,
              })}
              onChange={() => handleServices('docker_container')}
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={dockerPending || getTemplatePending}
        className="btn mt-3 w-full bg-orchid-medium text-white hover:bg-orchid-medium/70 disabled:bg-orchid-medium/50 disabled:text-white/70"
      >
        {dockerPending
          ? 'Wait...'
          : getTemplatePending
            ? 'Wait...'
            : 'Generate Terraform'}
      </button>
    </form>
  );
};

export default Docker;
