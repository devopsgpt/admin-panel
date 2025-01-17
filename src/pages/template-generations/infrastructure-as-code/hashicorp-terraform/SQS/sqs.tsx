import { CircleAlert } from 'lucide-react';
import { FC, FormEvent, useEffect, useState } from 'react';
import { GuideTable } from '../components/guide-table';
import sqs from './sqs.json';
import { cn } from '../../../../../lib/utils';
import { usePost } from '../../../../../core/react-query';
import { HashicorpTerraformAPI } from '../../../../../enums/api.enums';
import { SQSBody, SQSResponse } from './sqs.types';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { externalTemplateInstance } from '../../../../../lib/axios';

export const SQS: FC = () => {
  const [services, setServices] = useState({
    sqs_queue: false,
    queue_policy: false,
    dlq: false,
    dlq_redrive_allow_policy: false,
    dlq_queue_policy: false,
  });

  const [getTemplatePending, setGetTemplatePending] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<keyof typeof services | null>(
    null,
  );

  const { mutateAsync, isPending } = usePost<SQSResponse, SQSBody>(
    HashicorpTerraformAPI.SQS,
    'sqs',
    true,
  );

  useEffect(() => {
    if (services.sqs_queue === false) {
      setServices((prev) => ({
        ...prev,
        queue_policy: false,
        dlq: false,
        dlq_redrive_allow_policy: false,
        dlq_queue_policy: false,
      }));
    }
  }, [services.sqs_queue]);

  useEffect(() => {
    if (services.dlq === false) {
      setServices((prev) => ({
        ...prev,
        dlq: false,
        dlq_redrive_allow_policy: false,
        dlq_queue_policy: false,
      }));
    }
  }, [services.dlq]);

  const handleServiceChange = (service: keyof typeof services) => {
    setServices((prev) => ({
      ...prev,
      [service]: !prev[service],
    }));
  };

  const handleForm = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await mutateAsync(services);
      const formData = new FormData();
      const blob = new Blob([data]);
      formData.append('tfvars_file', blob, 'terraform.tfvars');
      setGetTemplatePending(true);
      const { data: template } = await externalTemplateInstance.post(
        '/terraform-get/sqs',
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
        link.setAttribute('download', 'SQSTerraform.zip');
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
        <div className="flex flex-col divide-y divide-gray-800">
          <div className="relative flex w-full items-center justify-between px-3 py-3">
            <p>SQS Queue</p>
            <div className="flex items-center gap-2">
              <button
                onMouseEnter={() => setHoveredKey('sqs_queue')}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <CircleAlert className="size-4 text-gray-300" />
              </button>
              <input
                type="checkbox"
                checked={services.sqs_queue}
                className={cn('toggle border-gray-800 bg-gray-500', {
                  'bg-orchid-medium hover:bg-orchid-medium/80':
                    services.sqs_queue,
                })}
                onChange={() => handleServiceChange('sqs_queue')}
              />
            </div>
            {hoveredKey === 'sqs_queue' && <GuideTable guide={sqs.sqs_queue} />}
          </div>
          <div className="relative">
            <div
              className={cn(
                'max-h-0 w-full divide-y divide-gray-700 overflow-y-hidden transition-all',
                {
                  'max-h-96 overflow-x-visible': services.sqs_queue,
                },
              )}
            >
              <div className="flex items-center justify-between bg-white/10 px-3 py-3">
                <p>DLQ</p>
                <div className="flex items-center gap-2">
                  <button
                    onMouseEnter={() => setHoveredKey('dlq')}
                    onMouseLeave={() => setHoveredKey(null)}
                  >
                    <CircleAlert className="size-4 text-gray-300" />
                  </button>
                  <input
                    checked={services.dlq}
                    type="checkbox"
                    className={cn('toggle border-gray-800 bg-gray-500', {
                      'bg-orchid-medium hover:bg-orchid-medium/80':
                        services.dlq,
                    })}
                    onChange={() => handleServiceChange('dlq')}
                  />
                </div>
                {hoveredKey === 'dlq' && <GuideTable guide={sqs.dlq} />}
              </div>
              <div
                className={cn(
                  'max-h-0 w-full divide-y divide-gray-700 overflow-y-hidden transition-all',
                  {
                    'max-h-96 overflow-x-visible': services.dlq,
                  },
                )}
              >
                <div className="flex items-center justify-between bg-white/20 px-3 py-3">
                  <p>DLQ Queue Policy</p>
                  <div className="flex items-center gap-2">
                    <button
                      onMouseEnter={() => setHoveredKey('dlq_queue_policy')}
                      onMouseLeave={() => setHoveredKey(null)}
                    >
                      <CircleAlert className="size-4 text-gray-300" />
                    </button>
                    <input
                      checked={services.dlq_queue_policy}
                      type="checkbox"
                      className={cn('toggle border-gray-800 bg-gray-500', {
                        'bg-orchid-medium hover:bg-orchid-medium/80':
                          services.dlq_queue_policy,
                      })}
                      onChange={() => handleServiceChange('dlq_queue_policy')}
                    />
                  </div>
                  {hoveredKey === 'dlq_queue_policy' && (
                    <GuideTable guide={sqs.dlq_queue_policy} />
                  )}
                </div>
                <div className="flex items-center justify-between bg-white/20 px-3 py-3">
                  <p>DLQ Redrive Allow Policy</p>
                  <div className="flex items-center gap-2">
                    <button
                      onMouseEnter={() =>
                        setHoveredKey('dlq_redrive_allow_policy')
                      }
                      onMouseLeave={() => setHoveredKey(null)}
                    >
                      <CircleAlert className="size-4 text-gray-300" />
                    </button>
                    <input
                      checked={services.dlq_redrive_allow_policy}
                      type="checkbox"
                      className={cn('toggle border-gray-800 bg-gray-500', {
                        'bg-orchid-medium hover:bg-orchid-medium/80':
                          services.dlq_redrive_allow_policy,
                      })}
                      onChange={() =>
                        handleServiceChange('dlq_redrive_allow_policy')
                      }
                    />
                  </div>
                  {hoveredKey === 'dlq_redrive_allow_policy' && (
                    <GuideTable guide={sqs.dlq_redrive_allow_policy} />
                  )}
                </div>
              </div>
              <div className="flex w-full items-center justify-between rounded-b-md bg-white/10 px-3 py-3">
                <p>Queue Policy</p>
                <div className="flex items-center gap-2">
                  <button
                    onMouseEnter={() => setHoveredKey('queue_policy')}
                    onMouseLeave={() => setHoveredKey(null)}
                  >
                    <CircleAlert className="size-4 text-gray-300" />
                  </button>
                  <input
                    type="checkbox"
                    checked={services.queue_policy}
                    className={cn('toggle border-gray-800 bg-gray-500', {
                      'bg-orchid-medium hover:bg-orchid-medium/80':
                        services.queue_policy,
                    })}
                    onChange={() => handleServiceChange('queue_policy')}
                  />
                </div>
                {hoveredKey === 'queue_policy' && (
                  <GuideTable guide={sqs.queue_policy} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="btn mt-3 w-full bg-orchid-medium text-white hover:bg-orchid-medium/70 disabled:bg-orchid-medium/50 disabled:text-white/70"
      >
        {isPending || getTemplatePending ? 'Wait...' : 'Generate Terraform'}
      </button>
    </form>
  );
};
