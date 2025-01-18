import { isAxiosError } from 'axios';
import { FC, FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { externalTemplateInstance } from '../../../../../../lib/axios';
import { usePost } from '../../../../../../core/react-query';
import route53 from './route53.json';
import { HashicorpTerraformAPI } from '../../../../../../enums/api.enums';
import { Route53Body, Route53Response } from './route53.types';
import { CircleAlert } from 'lucide-react';
import { GuideTable } from '../../components/guide-table';
import { cn } from '../../../../../../lib/utils';

export const Route53: FC = () => {
  const [services, setServices] = useState({
    zone: false,
    record: false,
    delegation_set: false,
    resolver_rule_association: false,
  });
  const [getTemplatePending, setGetTemplatePending] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<keyof typeof services | null>(
    null,
  );

  const { mutateAsync, isPending } = usePost<Route53Response, Route53Body>(
    HashicorpTerraformAPI.Route53,
    'route53',
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
        '/terraform-get/route53',
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
        link.setAttribute('download', 'Route53Terraform.zip');
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
            <p>Zone</p>
            <div className="flex items-center gap-2">
              <button
                onMouseEnter={() => setHoveredKey('zone')}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <CircleAlert className="size-4 text-gray-300" />
              </button>
              <input
                type="checkbox"
                checked={services.zone}
                className={cn('toggle border-gray-800 bg-gray-500', {
                  'bg-orchid-medium hover:bg-orchid-medium/80': services.zone,
                })}
                onChange={() => handleServiceChange('zone')}
              />
            </div>
            {hoveredKey === 'zone' && <GuideTable guide={route53.zone} />}
          </div>
          <div className="relative flex w-full items-center justify-between px-3 py-3">
            <p>Record</p>
            <div className="flex items-center gap-2">
              <button
                onMouseEnter={() => setHoveredKey('record')}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <CircleAlert className="size-4 text-gray-300" />
              </button>
              <input
                type="checkbox"
                checked={services.record}
                className={cn('toggle border-gray-800 bg-gray-500', {
                  'bg-orchid-medium hover:bg-orchid-medium/80': services.record,
                })}
                onChange={() => handleServiceChange('record')}
              />
            </div>
            {hoveredKey === 'record' && <GuideTable guide={route53.record} />}
          </div>
          <div className="relative flex w-full items-center justify-between px-3 py-3">
            <p>Delegation Set</p>
            <div className="flex items-center gap-2">
              <button
                onMouseEnter={() => setHoveredKey('delegation_set')}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <CircleAlert className="size-4 text-gray-300" />
              </button>
              <input
                type="checkbox"
                checked={services.delegation_set}
                className={cn('toggle border-gray-800 bg-gray-500', {
                  'bg-orchid-medium hover:bg-orchid-medium/80':
                    services.delegation_set,
                })}
                onChange={() => handleServiceChange('delegation_set')}
              />
            </div>
            {hoveredKey === 'delegation_set' && (
              <GuideTable guide={route53.delegation_set} />
            )}
          </div>
          <div className="relative flex w-full items-center justify-between px-3 py-3">
            <p>Resolver Rule Association</p>
            <div className="flex items-center gap-2">
              <button
                onMouseEnter={() => setHoveredKey('resolver_rule_association')}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <CircleAlert className="size-4 text-gray-300" />
              </button>
              <input
                type="checkbox"
                checked={services.resolver_rule_association}
                className={cn('toggle border-gray-800 bg-gray-500', {
                  'bg-orchid-medium hover:bg-orchid-medium/80':
                    services.resolver_rule_association,
                })}
                onChange={() =>
                  handleServiceChange('resolver_rule_association')
                }
              />
            </div>
            {hoveredKey === 'resolver_rule_association' && (
              <GuideTable guide={route53.resolver_rule_association} />
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
