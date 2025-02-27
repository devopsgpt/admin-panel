import { cn } from '../../../../../lib/utils';
import { FC, FormEvent, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { HashicorpTerraformAPI } from '../../../../../enums/api.enums';
import { usePost } from '../../../../../core/react-query';
import { ArgocdBody, ArgocdResponse } from './argocd.types';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { externalTemplateInstance } from '../../../../../lib/axios';

export const ArgoCD: FC = () => {
  const { mutateAsync: argocdMutate, isPending: argocdPending } = usePost<
    ArgocdResponse,
    ArgocdBody
  >(HashicorpTerraformAPI.Argocd, 'argocd', true);

  const [getTemplatePending, setGetTemplatePending] = useState(false);

  const [dropdown, setDropdown] = useState({
    argo_application: false,
    sync_policy: false,
  });
  const [services, setServices] = useState({
    auto_prune: false,
    self_heal: false,
    argocd_repository: false,
  });

  const handleDropdown = (dropdownItem: keyof typeof dropdown) => {
    setDropdown((prev) => ({
      ...prev,
      [dropdownItem]: !prev[dropdownItem],
    }));
  };

  const handleServices = (serviceItem: keyof typeof services) => {
    setServices((prev) => ({
      ...prev,
      [serviceItem]: !prev[serviceItem],
    }));
  };

  const handleForm = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const argocdBody: ArgocdBody = {
        argocd_application: dropdown.argo_application
          ? {
              sync_policy: {
                auto_prune: services.auto_prune,
                self_heal: services.self_heal,
              },
            }
          : null,
        argocd_repository: services.argocd_repository,
      };

      const { data } = await argocdMutate(argocdBody);

      const formData = new FormData();
      const blob = new Blob([data]);
      formData.append('tfvars_file', blob, 'terraform.tfvars');
      setGetTemplatePending(true);
      const { data: template } = await externalTemplateInstance.post(
        '/terraform-get/argocd',
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
        link.setAttribute('download', 'ArgoCDTerraform.zip');
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
          <div className="flex w-full items-center justify-between px-3 py-3">
            <p>Argo Application</p>
            <input
              type="checkbox"
              className={cn('toggle border-gray-800 bg-gray-500', {
                'bg-orchid-medium hover:bg-orchid-medium/80':
                  dropdown.argo_application,
              })}
              onChange={() => handleDropdown('argo_application')}
            />
          </div>
          <div
            className={cn(
              'max-h-0 w-full divide-y divide-gray-800 overflow-hidden transition-all',
              {
                'max-h-96': dropdown.argo_application,
              },
            )}
          >
            <div
              className="flex cursor-pointer items-center justify-between py-3 pl-10 pr-3"
              onClick={() => handleDropdown('sync_policy')}
            >
              <p>Sync Policy</p>
              <ChevronDown
                className={cn('transition-all', {
                  'rotate-180': dropdown.sync_policy,
                })}
              />
            </div>
            <div
              className={cn(
                'max-h-0 w-full divide-y divide-gray-800 overflow-hidden transition-all',
                {
                  'max-h-96': dropdown.sync_policy,
                },
              )}
            >
              <div className="flex items-center justify-between py-3 pl-16 pr-3">
                <p>Auto Prune</p>
                <input
                  type="checkbox"
                  className={cn('toggle border-gray-800 bg-gray-500', {
                    'bg-orchid-medium hover:bg-orchid-medium/80':
                      services.auto_prune,
                  })}
                  onChange={() => handleServices('auto_prune')}
                />
              </div>
              <div className="flex items-center justify-between py-3 pl-16 pr-3">
                <p>Self Heal</p>
                <input
                  type="checkbox"
                  className={cn('toggle border-gray-800 bg-gray-500', {
                    'bg-orchid-medium hover:bg-orchid-medium/80':
                      services.self_heal,
                  })}
                  onChange={() => handleServices('self_heal')}
                />
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-between px-3 py-3">
            <p>ArgoCD Repository</p>
            <input
              type="checkbox"
              className={cn('toggle border-gray-800 bg-gray-500', {
                'bg-orchid-medium hover:bg-orchid-medium/80':
                  services.argocd_repository,
              })}
              onChange={() => handleServices('argocd_repository')}
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={argocdPending || getTemplatePending}
        className="btn mt-3 w-full bg-orchid-medium text-white hover:bg-orchid-medium/70 disabled:bg-orchid-medium/50 disabled:text-white/70"
      >
        {argocdPending
          ? 'Wait...'
          : getTemplatePending
            ? 'Wait...'
            : 'Generate Terraform'}
      </button>
    </form>
  );
};
