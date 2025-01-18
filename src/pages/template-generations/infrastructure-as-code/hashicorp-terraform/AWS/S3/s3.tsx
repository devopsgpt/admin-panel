import { usePost } from '../../../../../../core/react-query';
import { cn } from '../../../../../../lib/utils';
import { FC, FormEvent, useState } from 'react';
import { HashicorpTerraformAPI } from '../../../../../../enums/api.enums';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { externalTemplateInstance } from '../../../../../../lib/axios';
import { S3Body, S3Response } from './s3.types';

export const S3: FC = () => {
  const { mutateAsync: s3Mutate, isPending: s3Pending } = usePost<
    S3Response,
    S3Body
  >(HashicorpTerraformAPI.S3, 's3', true);

  const [services, setServices] = useState({
    s3_bucket: false,
    bucket_versioning: false,
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
      const s3Body: S3Body = {
        ...services,
      };

      const { data } = await s3Mutate(s3Body);

      const formData = new FormData();
      const blob = new Blob([data]);
      formData.append('tfvars_file', blob, 'terraform.tfvars');
      setGetTemplatePending(true);
      const { data: template } = await externalTemplateInstance.post(
        '/terraform-get/s3',
        formData,
        {
          responseType: 'blob',
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      if (template) {
        const zipBlob = new Blob([template], { type: 'application/zip' });
        const url = window.URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'S3Terraform.zip');
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
            <p>S3 Bucket</p>
            <input
              type="checkbox"
              className={cn('toggle border-gray-800 bg-gray-500', {
                'bg-orchid-medium hover:bg-orchid-medium/80':
                  services.s3_bucket,
              })}
              onChange={() => handleServices('s3_bucket')}
            />
          </div>
          <div className="flex w-full items-center justify-between px-3 py-3">
            <p>Bucket Versioning</p>
            <input
              type="checkbox"
              className={cn('toggle border-gray-800 bg-gray-500', {
                'bg-orchid-medium hover:bg-orchid-medium/80':
                  services.bucket_versioning,
              })}
              onChange={() => handleServices('bucket_versioning')}
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={s3Pending || getTemplatePending}
        className="btn mt-3 w-full bg-orchid-medium text-white hover:bg-orchid-medium/70 disabled:bg-orchid-medium/50 disabled:text-white/70"
      >
        {s3Pending
          ? 'Wait...'
          : getTemplatePending
            ? 'Wait...'
            : 'Generate Terraform'}
      </button>
    </form>
  );
};
