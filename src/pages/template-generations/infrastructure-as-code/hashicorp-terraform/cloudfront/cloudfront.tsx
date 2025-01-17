import { CircleAlert } from 'lucide-react';
import { FC, FormEvent, useState } from 'react';
import { cn } from '../../../../../lib/utils';
import cloudfront from './cloudfront.json';
import { GuideTable } from '../components/guide-table';
import { usePost } from '../../../../../core/react-query';
import { HashicorpTerraformAPI } from '../../../../../enums/api.enums';
import { CloudFrontBody, CloudFrontResponse } from './cloudfront.types';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { externalTemplateInstance } from '../../../../../lib/axios';

export const CloudFront: FC = () => {
  const [services, setServices] = useState({
    distribution: false,
    origin_access_identity: false,
    origin_access_control: false,
    monitoring_subscription: false,
    vpc_origin: false,
  });
  const [hoveredKey, setHoveredKey] = useState<keyof typeof services | null>(
    null,
  );
  const [getTemplatePending, setGetTemplatePending] = useState(false);

  const { mutateAsync, isPending } = usePost<
    CloudFrontResponse,
    CloudFrontBody
  >(HashicorpTerraformAPI.CloudFront, 'cloudfront', true);

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
        '/terraform-get/cloudfront',
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
        link.setAttribute('download', 'CloudFrontTerraform.zip');
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
          <div className="relative flex w-full items-center justify-between px-3 py-3">
            <p>Distribution</p>
            <div className="flex items-center gap-2">
              <button
                onMouseEnter={() => setHoveredKey('distribution')}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <CircleAlert className="size-4 text-gray-300" />
              </button>
              <input
                type="checkbox"
                className={cn('toggle border-gray-800 bg-gray-500', {
                  'bg-orchid-medium hover:bg-orchid-medium/80':
                    services.distribution,
                })}
                onChange={() => handleServiceChange('distribution')}
              />
            </div>
            {hoveredKey === 'distribution' && (
              <GuideTable guide={cloudfront.distribution} />
            )}
          </div>
          <div className="relative flex w-full items-center justify-between px-3 py-3">
            <p>Origin Access Identity</p>
            <div className="flex items-center gap-2">
              <button
                onMouseEnter={() => setHoveredKey('origin_access_identity')}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <CircleAlert className="size-4 text-gray-300" />
              </button>
              <input
                type="checkbox"
                className={cn('toggle border-gray-800 bg-gray-500', {
                  'bg-orchid-medium hover:bg-orchid-medium/80':
                    services.origin_access_identity,
                })}
                onChange={() => handleServiceChange('origin_access_identity')}
              />
            </div>
            {hoveredKey === 'origin_access_identity' && (
              <GuideTable guide={cloudfront.origin_access_identity} />
            )}
          </div>
          <div className="relative flex w-full items-center justify-between px-3 py-3">
            <p>Origin Access Control</p>
            <div className="flex items-center gap-2">
              <button
                onMouseEnter={() => setHoveredKey('origin_access_control')}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <CircleAlert className="size-4 text-gray-300" />
              </button>
              <input
                type="checkbox"
                className={cn('toggle border-gray-800 bg-gray-500', {
                  'bg-orchid-medium hover:bg-orchid-medium/80':
                    services.origin_access_control,
                })}
                onChange={() => handleServiceChange('origin_access_control')}
              />
            </div>
            {hoveredKey === 'origin_access_control' && (
              <GuideTable guide={cloudfront.origin_access_control} />
            )}
          </div>
          <div className="relative flex w-full items-center justify-between px-3 py-3">
            <p>Monitoring Subscription</p>
            <div className="flex items-center gap-2">
              <button
                onMouseEnter={() => setHoveredKey('monitoring_subscription')}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <CircleAlert className="size-4 text-gray-300" />
              </button>
              <input
                type="checkbox"
                className={cn('toggle border-gray-800 bg-gray-500', {
                  'bg-orchid-medium hover:bg-orchid-medium/80':
                    services.monitoring_subscription,
                })}
                onChange={() => handleServiceChange('monitoring_subscription')}
              />
            </div>
            {hoveredKey === 'monitoring_subscription' && (
              <GuideTable guide={cloudfront.monitoring_subscription} />
            )}
          </div>
          <div className="relative flex w-full items-center justify-between px-3 py-3">
            <p>VPC Origin</p>
            <div className="flex items-center gap-2">
              <button
                onMouseEnter={() => setHoveredKey('vpc_origin')}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <CircleAlert className="size-4 text-gray-300" />
              </button>
              <input
                type="checkbox"
                className={cn('toggle border-gray-800 bg-gray-500', {
                  'bg-orchid-medium hover:bg-orchid-medium/80':
                    services.vpc_origin,
                })}
                onChange={() => handleServiceChange('vpc_origin')}
              />
            </div>
            {hoveredKey === 'vpc_origin' && (
              <GuideTable guide={cloudfront.vpc_origin} />
            )}
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
