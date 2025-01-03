import { useEffect, useState } from 'react';
import { useGet } from '../../../../core/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { externalTemplateInstance } from '../../../../lib/axios';
import { PuffLoader } from 'react-spinners';
import { FormSelect, FormWrapper } from '../../../../components/form';
import { argoRolloutsSchema, ArgoRoulloutsSchema } from './argo-rollouts.types';

export function ArgoRollouts() {
  const getServices = useGet<string[], unknown>(
    '/argo-rollouts-get-services',
    'argo-rollouts-get-services',
    false,
  );

  const [services, setServices] = useState<
    { label: string; value: string }[] | undefined
  >();
  const [getServiceTemplatePending, setGetServiceTemplatePending] =
    useState(false);

  const getServicesMethod = useForm<ArgoRoulloutsSchema>({
    resolver: zodResolver(argoRolloutsSchema),
  });

  useEffect(() => {
    getArgoRoulloutsServices();
  }, []);

  async function getArgoRoulloutsServices() {
    try {
      const { data } = await getServices.mutateAsync(undefined);
      setServices(data.map((item) => ({ label: item, value: item })));
    } catch (error) {
      toast.error('Something went wrong');
    }
  }

  async function handleSubmitService(body: ArgoRoulloutsSchema) {
    try {
      setGetServiceTemplatePending(true);
      const { data } = await externalTemplateInstance.get(
        `/argo-rollouts-get/${body.service.value}`,
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
              options={services as any}
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
}
