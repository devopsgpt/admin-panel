import { FormWrapper } from '../../../../../components/form/form-wrapper';
import { useGet } from '../../../../../core/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FormSelect } from '../../../../../components/form/form-select';
import { PuffLoader } from 'react-spinners';
import { externalTemplateInstance } from '../../../../../lib/axios';
import { vmWareSphereSchema, VMWareSphereSchema } from './vmware-vsphere.types';

export const VMWarevSphere: FC = () => {
  const getServices = useGet<string[], unknown>(
    '/packer/vmware-vsphere-all',
    'get-vmware-vsphere-all',
    false,
  );

  const [VMWareSphereServices, setVMWareSphereServices] = useState<
    { label: string; value: string }[] | undefined
  >();
  const [getServiceTemplatePending, setGetServiceTemplatePending] =
    useState(false);

  const getServicesMethod = useForm<VMWareSphereSchema>({
    resolver: zodResolver(vmWareSphereSchema),
  });

  useEffect(() => {
    getVMWareSphereServices();
  }, []);

  async function getVMWareSphereServices() {
    try {
      const { data } = await getServices.mutateAsync(undefined);
      setVMWareSphereServices(
        data.map((item) => ({ label: item, value: item })),
      );
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
    }
  }

  async function handleSubmitService(body: VMWareSphereSchema) {
    try {
      setGetServiceTemplatePending(true);
      const { data } = await externalTemplateInstance.get(
        `/packer/vmware-vsphere-get/${body.service.value}`,
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
              options={VMWareSphereServices as any}
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
