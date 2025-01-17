import { CircleAlert } from 'lucide-react';
import { FC, FormEvent, useEffect, useState } from 'react';
import { cn } from '../../../../../lib/utils';
import sns from './sns.json';
import { GuideTable } from '../components/guide-table';
import { usePost } from '../../../../../core/react-query';
import { SNSBody, SNSResponse } from './sns.types';
import { HashicorpTerraformAPI } from '../../../../../enums/api.enums';
import { externalTemplateInstance } from '../../../../../lib/axios';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

export const SNS: FC = () => {
  const [services, setServices] = useState({
    sns_topic: false,
    topic_policy: false,
    subscription: false,
  });
  const [getTemplatePending, setGetTemplatePending] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<keyof typeof services | null>(
    null,
  );

  const { mutateAsync, isPending } = usePost<SNSResponse, SNSBody>(
    HashicorpTerraformAPI.SNS,
    'sns',
    true,
  );

  useEffect(() => {
    if (services.sns_topic === false) {
      setServices((prev) => ({
        ...prev,
        topic_policy: false,
        subscription: false,
      }));
    }
  }, [services.sns_topic]);

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
        '/terraform-get/sns',
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
        link.setAttribute('download', 'SNSTerraform.zip');
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
          <div className="flex flex-col">
            <div className="relative flex w-full items-center justify-between px-3 py-3">
              <p>SNS Topic</p>
              <div className="flex items-center gap-2">
                <button
                  onMouseEnter={() => setHoveredKey('sns_topic')}
                  onMouseLeave={() => setHoveredKey(null)}
                >
                  <CircleAlert className="size-4 text-gray-300" />
                </button>
                <input
                  type="checkbox"
                  checked={services.sns_topic}
                  className={cn('toggle border-gray-800 bg-gray-500', {
                    'bg-orchid-medium hover:bg-orchid-medium/80':
                      services.sns_topic,
                  })}
                  onChange={() => handleServiceChange('sns_topic')}
                />
              </div>
              {hoveredKey === 'sns_topic' && (
                <GuideTable guide={sns.sns_topic} />
              )}
            </div>
            <div className="relative">
              <div
                className={cn(
                  'max-h-0 w-full divide-y divide-gray-800 overflow-y-hidden transition-all',
                  {
                    'max-h-96 overflow-x-visible': services.sns_topic,
                  },
                )}
              >
                <div className="flex items-center justify-between bg-white/10 px-3 py-3">
                  <p>Topic Policy</p>
                  <div className="flex items-center gap-2">
                    <button
                      onMouseEnter={() => setHoveredKey('topic_policy')}
                      onMouseLeave={() => setHoveredKey(null)}
                    >
                      <CircleAlert className="size-4 text-gray-300" />
                    </button>
                    <input
                      checked={services.topic_policy}
                      type="checkbox"
                      className={cn('toggle border-gray-800 bg-gray-500', {
                        'bg-orchid-medium hover:bg-orchid-medium/80':
                          services.topic_policy,
                      })}
                      onChange={() => handleServiceChange('topic_policy')}
                    />
                  </div>
                  {hoveredKey === 'topic_policy' && (
                    <GuideTable guide={sns.topic_policy} />
                  )}
                </div>
                <div className="flex items-center justify-between rounded-b-md bg-white/10 px-3 py-3">
                  <p>Subscription</p>
                  <div className="flex items-center gap-2">
                    <button
                      onMouseEnter={() => setHoveredKey('subscription')}
                      onMouseLeave={() => setHoveredKey(null)}
                    >
                      <CircleAlert className="size-4 text-gray-300" />
                    </button>
                    <input
                      type="checkbox"
                      checked={services.subscription}
                      className={cn('toggle border-gray-800 bg-gray-500', {
                        'bg-orchid-medium hover:bg-orchid-medium/80':
                          services.subscription,
                      })}
                      onChange={() => handleServiceChange('subscription')}
                    />
                  </div>
                  {hoveredKey === 'subscription' && (
                    <GuideTable guide={sns.subscription} />
                  )}
                </div>
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
