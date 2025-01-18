import { FC, FormEvent, useEffect, useState } from 'react';
import { usePost } from '../../../../../../core/react-query';
import { HashicorpTerraformAPI } from '../../../../../../enums/api.enums';
import { KeyPairBody, KeyPairResponse } from './kay-pair.types';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { externalTemplateInstance } from '../../../../../../lib/axios';
import { CircleAlert } from 'lucide-react';
import { cn } from '../../../../../../lib/utils';
import { GuideTable } from '../../components/guide-table';
import key_pair from './key-pair.json';

export const KeyPair: FC = () => {
  const [services, setServices] = useState({
    key_pair: false,
    private_key: false,
  });

  const [getTemplatePending, setGetTemplatePending] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<keyof typeof services | null>(
    null,
  );

  const { mutateAsync, isPending } = usePost<KeyPairResponse, KeyPairBody>(
    HashicorpTerraformAPI.KeyPair,
    'key_pair',
    true,
  );

  useEffect(() => {
    if (services.key_pair === false) {
      setServices((prev) => ({
        ...prev,
        private_key: false,
      }));
    }
  }, [services.key_pair]);

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
        '/terraform-get/key_pair',
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
        link.setAttribute('download', 'Key_PairTerraform.zip');
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
            <p>Key Pair</p>
            <div className="flex items-center gap-2">
              <button
                onMouseEnter={() => setHoveredKey('key_pair')}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <CircleAlert className="size-4 text-gray-300" />
              </button>
              <input
                type="checkbox"
                checked={services.key_pair}
                className={cn('toggle border-gray-800 bg-gray-500', {
                  'bg-orchid-medium hover:bg-orchid-medium/80':
                    services.key_pair,
                })}
                onChange={() => handleServiceChange('key_pair')}
              />
            </div>
            {hoveredKey === 'key_pair' && (
              <GuideTable guide={key_pair.key_pair} />
            )}
          </div>
          <div className="relative">
            <div
              className={cn(
                'max-h-0 w-full divide-y divide-gray-700 overflow-y-hidden transition-all',
                {
                  'max-h-96 overflow-x-visible': services.key_pair,
                },
              )}
            >
              <div className="flex items-center justify-between bg-white/10 px-3 py-3">
                <p>Private Key</p>
                <div className="flex items-center gap-2">
                  <button
                    onMouseEnter={() => setHoveredKey('private_key')}
                    onMouseLeave={() => setHoveredKey(null)}
                  >
                    <CircleAlert className="size-4 text-gray-300" />
                  </button>
                  <input
                    checked={services.private_key}
                    type="checkbox"
                    className={cn('toggle border-gray-800 bg-gray-500', {
                      'bg-orchid-medium hover:bg-orchid-medium/80':
                        services.private_key,
                    })}
                    onChange={() => handleServiceChange('private_key')}
                  />
                </div>
                {hoveredKey === 'private_key' && (
                  <GuideTable guide={key_pair.private_key} />
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
