import { usePost } from '@/core/react-query';
import { cn } from '@/lib/utils';
import { FC, FormEvent, useState } from 'react';
import { IAMBody, IAMResponse } from './iam.types';
import { TerraformTemplateAPI } from '@/enums/api.enums';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { externalTemplateInstance } from '@/lib/axios';

const IAM: FC = () => {
  const { mutateAsync: iamMutate, isPending: iamPending } = usePost<
    IAMResponse,
    IAMBody
  >(TerraformTemplateAPI.Iam, 'iam', true);

  const [services, setServices] = useState({
    iam_user: false,
    iam_group: false,
  });

  const [getTemplatePending, setGetTemplatePending] = useState(false);

  const handleServices = (serviceItem: keyof typeof services) => {
    setServices((prev) => ({
      ...prev,
      [serviceItem]: !prev[serviceItem],
    }));
  };

  const handleForm = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const iamBody: IAMBody = {
        ...services,
      };

      const { data } = await iamMutate(iamBody);

      const formData = new FormData();
      const blob = new Blob([data]);
      formData.append('tfvars_file', blob, 'terraform.tfvars');
      setGetTemplatePending(true);
      const { data: template } = await externalTemplateInstance.post(
        '/terraform-get/iam',
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
        link.setAttribute('download', 'IAMTerraform.zip');
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
    }
  };

  return (
    <form onSubmit={handleForm} className="w-full max-w-96 text-white">
      <div className="rounded-md border border-gray-800">
        <div className="divide-y divide-gray-800">
          <div className="flex w-full items-center justify-between px-3 py-3">
            <p>IAM User</p>
            <input
              type="checkbox"
              className={cn('toggle border-gray-800 bg-gray-500', {
                'bg-orchid-medium hover:bg-orchid-medium/80': services.iam_user,
              })}
              onChange={() => handleServices('iam_user')}
            />
          </div>
          <div className="flex w-full items-center justify-between px-3 py-3">
            <p>IAM Group</p>
            <input
              type="checkbox"
              className={cn('toggle border-gray-800 bg-gray-500', {
                'bg-orchid-medium hover:bg-orchid-medium/80':
                  services.iam_group,
              })}
              onChange={() => handleServices('iam_group')}
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={iamPending || getTemplatePending}
        className="btn mt-3 w-full bg-orchid-medium text-white hover:bg-orchid-medium/70 disabled:bg-orchid-medium/50 disabled:text-white/70"
      >
        {iamPending
          ? 'Wait...'
          : getTemplatePending
            ? 'Wait...'
            : 'Generate Terraform'}
      </button>
    </form>
  );
};

export default IAM;
