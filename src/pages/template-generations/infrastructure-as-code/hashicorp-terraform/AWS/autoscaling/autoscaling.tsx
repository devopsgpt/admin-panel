import { CircleAlert } from 'lucide-react';
import { FC, FormEvent, useEffect, useState } from 'react';
import { GuideTable } from '../../components/guide-table';
import autoscaling from './autoscaling.json';
import { cn } from '../../../../../../lib/utils';
import { usePost } from '../../../../../../core/react-query';
import { HashicorpTerraformAPI } from '../../../../../../enums/api.enums';
import { AutoScalingBody, AutoScalingResponse } from './autoscaling.types';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { externalTemplateInstance } from '../../../../../../lib/axios';

export const AutoScaling: FC = () => {
  const [services, setServices] = useState({
    autoscaling_group: false,
    launch_template: false,
    schedule: false,
    scaling_policy: false,
    iam_instance_profile: false,
  });

  const [getTemplatePending, setGetTemplatePending] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<keyof typeof services | null>(
    null,
  );

  const { mutateAsync, isPending } = usePost<
    AutoScalingResponse,
    AutoScalingBody
  >(HashicorpTerraformAPI.AutoScaling, 'autoscaling', true);

  useEffect(() => {
    if (services.autoscaling_group === false) {
      setServices((prev) => ({
        ...prev,
        iam_instance_profile: false,
        launch_template: false,
        scaling_policy: false,
        schedule: false,
      }));
    }
  }, [services.autoscaling_group]);

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
        '/terraform-get/autoscaling',
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
        link.setAttribute('download', 'AutoScalingTerraform.zip');
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
            <p>AutoScaling Group</p>
            <div className="flex items-center gap-2">
              <button
                onMouseEnter={() => setHoveredKey('autoscaling_group')}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <CircleAlert className="size-4 text-gray-300" />
              </button>
              <input
                type="checkbox"
                checked={services.autoscaling_group}
                className={cn('toggle border-gray-800 bg-gray-500', {
                  'bg-orchid-medium hover:bg-orchid-medium/80':
                    services.autoscaling_group,
                })}
                onChange={() => handleServiceChange('autoscaling_group')}
              />
            </div>
            {hoveredKey === 'autoscaling_group' && (
              <GuideTable guide={autoscaling.autoscaling_group} />
            )}
          </div>
          <div className="relative">
            <div
              className={cn(
                'max-h-0 w-full divide-y divide-gray-700 overflow-y-hidden transition-all',
                {
                  'max-h-96 overflow-x-visible': services.autoscaling_group,
                },
              )}
            >
              <div className="flex items-center justify-between bg-white/10 px-3 py-3">
                <p>Schedule</p>
                <div className="flex items-center gap-2">
                  <button
                    onMouseEnter={() => setHoveredKey('schedule')}
                    onMouseLeave={() => setHoveredKey(null)}
                  >
                    <CircleAlert className="size-4 text-gray-300" />
                  </button>
                  <input
                    checked={services.schedule}
                    type="checkbox"
                    className={cn('toggle border-gray-800 bg-gray-500', {
                      'bg-orchid-medium hover:bg-orchid-medium/80':
                        services.schedule,
                    })}
                    onChange={() => handleServiceChange('schedule')}
                  />
                </div>
                {hoveredKey === 'schedule' && (
                  <GuideTable guide={autoscaling.schedule} />
                )}
              </div>
              <div className="flex items-center justify-between bg-white/10 px-3 py-3">
                <p>Scaling Policy</p>
                <div className="flex items-center gap-2">
                  <button
                    onMouseEnter={() => setHoveredKey('scaling_policy')}
                    onMouseLeave={() => setHoveredKey(null)}
                  >
                    <CircleAlert className="size-4 text-gray-300" />
                  </button>
                  <input
                    checked={services.scaling_policy}
                    type="checkbox"
                    className={cn('toggle border-gray-800 bg-gray-500', {
                      'bg-orchid-medium hover:bg-orchid-medium/80':
                        services.scaling_policy,
                    })}
                    onChange={() => handleServiceChange('scaling_policy')}
                  />
                </div>
                {hoveredKey === 'scaling_policy' && (
                  <GuideTable guide={autoscaling.scaling_policy} />
                )}
              </div>
              <div className="flex items-center justify-between bg-white/10 px-3 py-3">
                <p>IAM Instance Profile</p>
                <div className="flex items-center gap-2">
                  <button
                    onMouseEnter={() => setHoveredKey('iam_instance_profile')}
                    onMouseLeave={() => setHoveredKey(null)}
                  >
                    <CircleAlert className="size-4 text-gray-300" />
                  </button>
                  <input
                    checked={services.iam_instance_profile}
                    type="checkbox"
                    className={cn('toggle border-gray-800 bg-gray-500', {
                      'bg-orchid-medium hover:bg-orchid-medium/80':
                        services.iam_instance_profile,
                    })}
                    onChange={() => handleServiceChange('iam_instance_profile')}
                  />
                </div>
                {hoveredKey === 'iam_instance_profile' && (
                  <GuideTable guide={autoscaling.iam_instance_profile} />
                )}
              </div>
            </div>
          </div>
          <div className="relative flex w-full items-center justify-between px-3 py-3">
            <p>Launch Template</p>
            <div className="flex items-center gap-2">
              <button
                onMouseEnter={() => setHoveredKey('launch_template')}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <CircleAlert className="size-4 text-gray-300" />
              </button>
              <input
                type="checkbox"
                checked={services.launch_template}
                className={cn('toggle border-gray-800 bg-gray-500', {
                  'bg-orchid-medium hover:bg-orchid-medium/80':
                    services.launch_template,
                })}
                onChange={() => handleServiceChange('launch_template')}
              />
            </div>
            {hoveredKey === 'launch_template' && (
              <GuideTable guide={autoscaling.launch_template} />
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
