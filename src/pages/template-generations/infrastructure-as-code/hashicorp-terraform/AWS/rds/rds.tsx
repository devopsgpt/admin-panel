import { FC, FormEvent, useEffect, useState } from 'react';
import { usePost } from '../../../../../../core/react-query';
import { HashicorpTerraformAPI } from '../../../../../../enums/api.enums';
import { RDSBody, RDSResponse } from './rds.types';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { externalTemplateInstance } from '../../../../../../lib/axios';
import { CircleAlert } from 'lucide-react';
import rds from './rds.json';
import { cn } from '../../../../../../lib/utils';
import { GuideTable } from '../../components/guide-table';

export const RDS: FC = () => {
  const [services, setServices] = useState({
    db_instance: false,
    db_option_group: false,
    db_parameter_group: false,
    db_subnet_group: false,
    monitoring_role: false,
    cloudwatch_log_group: false,
    master_user_password_rotation: false,
  });
  const [getTemplatePending, setGetTemplatePending] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<keyof typeof services | null>(
    null,
  );

  const { mutateAsync, isPending } = usePost<RDSResponse, RDSBody>(
    HashicorpTerraformAPI.RDS,
    'rds',
    true,
  );

  useEffect(() => {
    if (services.db_instance === false) {
      setServices((prev) => ({
        ...prev,
        cloudwatch_log_group: false,
        master_user_password_rotation: false,
        monitoring_role: false,
      }));
    }
  }, [services.db_instance]);

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
        '/terraform-get/rds',
        formData,
        {
          responseType: 'blob',
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      if (template) {
        const zipBlob = new Blob([template], {
          type: 'application/zip',
        });
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
            <p>DB Instance</p>
            <div className="flex items-center gap-2">
              <button
                onMouseEnter={() => setHoveredKey('db_instance')}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <CircleAlert className="size-4 text-gray-300" />
              </button>
              <input
                type="checkbox"
                checked={services.db_instance}
                className={cn('toggle border-gray-800 bg-gray-500', {
                  'bg-orchid-medium hover:bg-orchid-medium/80':
                    services.db_instance,
                })}
                onChange={() => handleServiceChange('db_instance')}
              />
            </div>
            {hoveredKey === 'db_instance' && (
              <GuideTable guide={rds.db_instance} />
            )}
          </div>
          <div className="relative">
            <div
              className={cn(
                'max-h-0 w-full divide-y divide-gray-700 overflow-y-hidden transition-all',
                {
                  'max-h-96 overflow-x-visible': services.db_instance,
                },
              )}
            >
              <div className="flex items-center justify-between bg-white/10 px-3 py-3">
                <p>Cloudwatch Log Group</p>
                <div className="flex items-center gap-2">
                  <button
                    onMouseEnter={() => setHoveredKey('cloudwatch_log_group')}
                    onMouseLeave={() => setHoveredKey(null)}
                  >
                    <CircleAlert className="size-4 text-gray-300" />
                  </button>
                  <input
                    type="checkbox"
                    checked={services.cloudwatch_log_group}
                    className={cn('toggle border-gray-800 bg-gray-500', {
                      'bg-orchid-medium hover:bg-orchid-medium/80':
                        services.cloudwatch_log_group,
                    })}
                    onChange={() => handleServiceChange('cloudwatch_log_group')}
                  />
                </div>
                {hoveredKey === 'cloudwatch_log_group' && (
                  <GuideTable guide={rds.cloudwatch_log_group} />
                )}
              </div>
              <div className="flex items-center justify-between bg-white/10 px-3 py-3">
                <p>Master User Password Rotation</p>
                <div className="flex items-center gap-2">
                  <button
                    onMouseEnter={() =>
                      setHoveredKey('master_user_password_rotation')
                    }
                    onMouseLeave={() => setHoveredKey(null)}
                  >
                    <CircleAlert className="size-4 text-gray-300" />
                  </button>
                  <input
                    type="checkbox"
                    checked={services.master_user_password_rotation}
                    className={cn('toggle border-gray-800 bg-gray-500', {
                      'bg-orchid-medium hover:bg-orchid-medium/80':
                        services.master_user_password_rotation,
                    })}
                    onChange={() =>
                      handleServiceChange('master_user_password_rotation')
                    }
                  />
                </div>
                {hoveredKey === 'master_user_password_rotation' && (
                  <GuideTable guide={rds.master_user_password_rotation} />
                )}
              </div>
              <div className="flex items-center justify-between bg-white/10 px-3 py-3">
                <p>Monitoring Role</p>
                <div className="flex items-center gap-2">
                  <button
                    onMouseEnter={() => setHoveredKey('monitoring_role')}
                    onMouseLeave={() => setHoveredKey(null)}
                  >
                    <CircleAlert className="size-4 text-gray-300" />
                  </button>
                  <input
                    type="checkbox"
                    checked={services.monitoring_role}
                    className={cn('toggle border-gray-800 bg-gray-500', {
                      'bg-orchid-medium hover:bg-orchid-medium/80':
                        services.monitoring_role,
                    })}
                    onChange={() => handleServiceChange('monitoring_role')}
                  />
                </div>
                {hoveredKey === 'monitoring_role' && (
                  <GuideTable guide={rds.monitoring_role} />
                )}
              </div>
            </div>
          </div>
          <div className="relative flex w-full items-center justify-between px-3 py-3">
            <p>DB Option Group</p>
            <div className="flex items-center gap-2">
              <button
                onMouseEnter={() => setHoveredKey('db_option_group')}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <CircleAlert className="size-4 text-gray-300" />
              </button>
              <input
                type="checkbox"
                checked={services.db_option_group}
                className={cn('toggle border-gray-800 bg-gray-500', {
                  'bg-orchid-medium hover:bg-orchid-medium/80':
                    services.db_option_group,
                })}
                onChange={() => handleServiceChange('db_option_group')}
              />
            </div>
            {hoveredKey === 'db_option_group' && (
              <GuideTable guide={rds.db_option_group} />
            )}
          </div>
          <div className="relative flex w-full items-center justify-between px-3 py-3">
            <p>DB Parameter Group</p>
            <div className="flex items-center gap-2">
              <button
                onMouseEnter={() => setHoveredKey('db_parameter_group')}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <CircleAlert className="size-4 text-gray-300" />
              </button>
              <input
                type="checkbox"
                checked={services.db_parameter_group}
                className={cn('toggle border-gray-800 bg-gray-500', {
                  'bg-orchid-medium hover:bg-orchid-medium/80':
                    services.db_parameter_group,
                })}
                onChange={() => handleServiceChange('db_parameter_group')}
              />
            </div>
            {hoveredKey === 'db_parameter_group' && (
              <GuideTable guide={rds.db_parameter_group} />
            )}
          </div>
          <div className="relative flex w-full items-center justify-between px-3 py-3">
            <p>DB Subnet Group</p>
            <div className="flex items-center gap-2">
              <button
                onMouseEnter={() => setHoveredKey('db_subnet_group')}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <CircleAlert className="size-4 text-gray-300" />
              </button>
              <input
                type="checkbox"
                checked={services.db_subnet_group}
                className={cn('toggle border-gray-800 bg-gray-500', {
                  'bg-orchid-medium hover:bg-orchid-medium/80':
                    services.db_subnet_group,
                })}
                onChange={() => handleServiceChange('db_subnet_group')}
              />
            </div>
            {hoveredKey === 'db_subnet_group' && (
              <GuideTable guide={rds.db_subnet_group} />
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
