import { FC, FormEvent, useState } from 'react';
import { cn } from '../../../../../lib/utils';
import { usePost } from '../../../../../core/react-query';
import { HashicorpTerraformAPI } from '../../../../../enums/api.enums';
import { ALBBody, ALBResponse } from './alb.types';
import { externalTemplateInstance } from '../../../../../lib/axios';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { CircleAlert } from 'lucide-react';
import alb from './alb.json';
import { GuideTable } from '../components/guide-table';

export const ALB: FC = () => {
  const [services, setServices] = useState({
    alb_resources: true,
    security_group: true,
  });
  const [getTemplatePending, setGetTemplatePending] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<keyof typeof services | null>(
    null,
  );

  const { mutateAsync, isPending } = usePost<ALBResponse, ALBBody>(
    HashicorpTerraformAPI.ALB,
    'alb',
    true,
  );

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
        '/terraform-get/alb',
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
        link.setAttribute('download', 'ALBTerraform.zip');
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
            <p>ALB Resources</p>
            <div className="flex items-center gap-2">
              <button
                onMouseEnter={() => setHoveredKey('alb_resources')}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <CircleAlert className="size-4 text-gray-300" />
              </button>
              <input
                type="checkbox"
                className={cn('toggle border-gray-800 bg-gray-500', {
                  'bg-orchid-medium hover:bg-orchid-medium/80':
                    !services.alb_resources,
                })}
                onChange={() => handleServiceChange('alb_resources')}
              />
            </div>
            {hoveredKey === 'alb_resources' && (
              <GuideTable guide={alb.alb_resources} />
            )}
          </div>
          <div className="relative flex w-full items-center justify-between px-3 py-3">
            <p>Security Group</p>
            <div className="flex items-center gap-2">
              <button
                onMouseEnter={() => setHoveredKey('security_group')}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <CircleAlert className="size-4 text-gray-300" />
              </button>
              <input
                type="checkbox"
                className={cn('toggle border-gray-800 bg-gray-500', {
                  'bg-orchid-medium hover:bg-orchid-medium/80':
                    !services.security_group,
                })}
                onChange={() => handleServiceChange('security_group')}
              />
            </div>
            {hoveredKey === 'security_group' && (
              <GuideTable guide={alb.security_group} />
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
