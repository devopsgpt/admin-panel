import { FormSelect } from '@/components/form/form-select';
import { FormWrapper } from '@/components/form/form-wrapper';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { externalTemplateInstance } from '@/lib/axios';
import { toast } from 'sonner';
import ExportTemplateModal from '@/components/modal/external-template';
import { useGet } from '@/core/react-query';
import { PuffLoader } from 'react-spinners';
import { LokiLogQLSchema, lokiLogQLSchema } from './loki-logql.types';

const LokiLogQL: FC = () => {
  const getServices = useGet<string[], unknown>(
    '/loki-get-services',
    'loki-get-services',
    false,
  );

  const [services, setServices] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [serviceTemplate, setServiceTemplate] = useState<
    { label: string; value: string }[]
  >([]);

  const [getServicesPending, setGetServicesPending] = useState(false);
  const [show, setShow] = useState(false);
  const [downloadPending, setDownloadPending] = useState(false);

  const getServicesMethod = useForm<LokiLogQLSchema>({
    resolver: zodResolver(lokiLogQLSchema),
  });

  useEffect(() => {
    getLokiServices();
  }, []);

  async function getLokiServices() {
    try {
      const { data } = await getServices.mutateAsync(undefined);
      setServices(data.map((item) => ({ label: item, value: item })));
    } catch (error) {
      toast.error('Something went wrong');
    }
  }

  async function handleGetServiceTemplate() {
    try {
      setGetServicesPending(true);
      const { data } = await externalTemplateInstance.get<string[]>(
        `/loki-get-file/{service}?service=${getServicesMethod.getValues().service.value}`,
      );
      setServiceTemplate(data.map((item) => ({ label: item, value: item })));
      setShow(true);
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setGetServicesPending(false);
    }
  }

  async function downloadTemplate(body: string) {
    try {
      setDownloadPending(true);
      const { data } = await externalTemplateInstance.get<string>(
        `/loki-get-templates/${getServicesMethod.getValues().service.value}/${body}`,
      );

      const blob = new Blob([data], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = body;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setDownloadPending(false);
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
        <FormWrapper
          methods={getServicesMethod}
          onSubmit={handleGetServiceTemplate}
        >
          <div className="space-y-3">
            <FormSelect name="service" label="Services" options={services} />
            <button
              type="submit"
              disabled={getServicesPending}
              className="btn w-full bg-orchid-medium text-white hover:bg-orchid-medium/70 disabled:bg-orchid-medium/50 disabled:text-white/70"
            >
              Generate
            </button>
          </div>
        </FormWrapper>
        <ExportTemplateModal
          show={show}
          content={serviceTemplate}
          downloadPending={downloadPending}
          onClose={() => setShow(false)}
          onSubmit={downloadTemplate}
        />
      </div>
    </div>
  );
};

export default LokiLogQL;
