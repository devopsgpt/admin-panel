import { useGet } from '../../../../core/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  CloudformationSchema,
  cloudFormationSchema,
} from './cloudformation.types';
import { PuffLoader } from 'react-spinners';
import { externalTemplateInstance } from '../../../../lib/axios';
import { FormSelect, FormWrapper } from '../../../../components/form';

export const CloudFormation: FC = () => {
  const getServices = useGet<string[], unknown>(
    '/cloudformation-get-services',
    'get-cloudformation',
    false,
  );

  const [cloudformationServices, setCloudFormationServices] = useState<
    { label: string; value: string }[] | undefined
  >();
  const [getServiceTemplatePending, setGetServiceTemplatePending] =
    useState(false);

  const getServicesMethod = useForm<CloudformationSchema>({
    resolver: zodResolver(cloudFormationSchema),
  });

  useEffect(() => {
    getCloudFormationServices();
  }, []);

  async function getCloudFormationServices() {
    try {
      const { data } = await getServices.mutateAsync(undefined);
      setCloudFormationServices(
        data.map((item) => ({ label: item, value: item })),
      );
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
    }
  }

  async function handleSubmitService(body: CloudformationSchema) {
    try {
      setGetServiceTemplatePending(true);
      const { data } = await externalTemplateInstance.get(
        `/cloudformation-get-templates/${body.service.value}`,
        { responseType: 'blob' },
      );

      const blob = new Blob([data], { type: 'application/zip' });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${body.service.value}.zip`);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setGetServiceTemplatePending(false);
    }
  }

  if (getServices.isPending) {
    return (
      <div className="flex h-full w-full items-center justify-center text-white">
        <PuffLoader color="#fff" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center text-white">
      <div className="w-full max-w-96">
        <FormWrapper methods={getServicesMethod} onSubmit={handleSubmitService}>
          <div className="space-y-3">
            <FormSelect
              name="service"
              label="Services"
              options={cloudformationServices as any}
            />
            <button
              type="submit"
              disabled={getServiceTemplatePending}
              className="btn w-full bg-orchid-medium text-white hover:bg-orchid-medium/70 disabled:bg-orchid-medium/50 disabled:text-white/70"
            >
              Generate
            </button>
          </div>
        </FormWrapper>
      </div>
    </div>
  );
};
