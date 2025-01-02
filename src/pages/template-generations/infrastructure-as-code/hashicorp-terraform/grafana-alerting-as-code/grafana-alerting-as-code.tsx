import { cn } from '../../../../..//lib/utils';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  GetTfVarsBody,
  terraformGrafanaSchema,
  TerraformGrafanaSchema,
} from './grafana-alerting-as-code.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePost } from '../../../../../core/react-query';
import { toast } from 'sonner';
import { externalTemplateInstance } from '../../../../../lib/axios';
import { FormWrapper } from '../../../../../components/form';
import { HashicorpTerraformAPI } from '../../../../../enums/api.enums';

const defaultValues: TerraformGrafanaSchema = {
  create_contact_point: {
    use_email: false,
    use_slack: false,
  },
  create_message_template: false,
  create_mute_timing: false,
  create_notification_policy: false,
};

export const GrafanaAlertingAsCode: FC = () => {
  const getTfvars = usePost<File, GetTfVarsBody>(
    HashicorpTerraformAPI.GrafanaAlertingAsCode,
    'get-tfvars-file',
    true,
  );

  const [getTemplatePending, setGetTemplatePending] = useState(false);
  const [ccp, setCcp] = useState(false);

  const getTfVarsFileMethods = useForm<TerraformGrafanaSchema>({
    resolver: zodResolver(terraformGrafanaSchema),
    defaultValues,
  });

  const handleGetTfVars = async (data: TerraformGrafanaSchema) => {
    const body = {
      ...data,
      ...(ccp
        ? {
            create_contact_point: {
              use_email: data.create_contact_point.use_email,
              use_slack: data.create_contact_point.use_slack,
            },
          }
        : { create_contact_point: null }),
    };

    try {
      const { data } = await getTfvars.mutateAsync(body);

      const formData = new FormData();
      const blob = new Blob([data]);
      formData.append('tfvars_file', blob, 'terraform.tfvars');
      setGetTemplatePending(true);
      const { data: template } = await externalTemplateInstance.post(
        '/terraform-get/grafana_alerting',
        formData,
        {
          responseType: 'blob',
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      if (template) {
        const zipBlob = new Blob([template], { type: 'application/zip' });
        console.log(`Blob size: ${zipBlob.size} bytes`);

        const url = window.URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'grafana_alerting.zip');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
      setGetTemplatePending(false);
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="w-full max-w-96 text-white">
      <FormWrapper methods={getTfVarsFileMethods} onSubmit={handleGetTfVars}>
        <div className="rounded-md border border-gray-800">
          <div className="divide-y divide-gray-800">
            <div className="space-y-1 px-3 py-2">
              <div className="flex items-center justify-between">
                <label htmlFor="ccp" className="font-semibold">
                  Create Contact Point
                </label>
                <input
                  id="ccp"
                  type="checkbox"
                  className={cn('toggle border-gray-800 bg-gray-500', {
                    'bg-orchid-medium hover:bg-orchid-medium/80': ccp,
                  })}
                  onChange={(e) => setCcp(e.target.checked)}
                />
              </div>
            </div>
            <div
              className={cn(
                'max-h-0 w-full divide-y divide-gray-800 overflow-hidden transition-all',
                {
                  'max-h-96': ccp,
                },
              )}
            >
              <label className="label w-full cursor-pointer justify-between gap-2 py-3 pl-6 pr-3">
                <span className="text-white">Use Email</span>
                <input
                  id="use_email"
                  type="checkbox"
                  className={cn('toggle border-gray-800 bg-gray-500', {
                    'bg-orchid-medium hover:bg-orchid-medium/80':
                      getTfVarsFileMethods.watch(
                        'create_contact_point.use_email',
                      ),
                  })}
                  {...getTfVarsFileMethods.register(
                    'create_contact_point.use_email',
                    {
                      setValueAs: (v) => !!v,
                    },
                  )}
                />
              </label>

              <label className="label w-full cursor-pointer justify-between gap-2 py-3 pl-6 pr-3">
                <span>Use Slack</span>
                <input
                  type="checkbox"
                  className={cn('toggle border-gray-800 bg-gray-500', {
                    'bg-orchid-medium hover:bg-orchid-medium/80':
                      getTfVarsFileMethods.watch(
                        'create_contact_point.use_slack',
                      ),
                  })}
                  {...getTfVarsFileMethods.register(
                    'create_contact_point.use_slack',
                    {
                      setValueAs: (v) => !!v,
                    },
                  )}
                />
              </label>
            </div>
            <div className="space-y-1 px-3 py-2">
              <label className="label cursor-pointer justify-between gap-2">
                <span>Create Message Template</span>
                <input
                  type="checkbox"
                  className={cn('toggle border-gray-800 bg-gray-500', {
                    'bg-orchid-medium hover:bg-orchid-medium/80':
                      getTfVarsFileMethods.watch('create_message_template'),
                  })}
                  {...getTfVarsFileMethods.register('create_message_template', {
                    setValueAs: (v) => !!v,
                  })}
                />
              </label>
            </div>
            <div className="space-y-1 px-3 py-2">
              <label className="label cursor-pointer justify-between gap-2">
                <span>Create Mute Timing</span>
                <input
                  type="checkbox"
                  className={cn('toggle border-gray-800 bg-gray-500', {
                    'bg-orchid-medium hover:bg-orchid-medium/80':
                      getTfVarsFileMethods.watch('create_mute_timing'),
                  })}
                  {...getTfVarsFileMethods.register('create_mute_timing', {
                    setValueAs: (v) => !!v,
                  })}
                />
              </label>
            </div>
            <div className="space-y-1 px-3 py-2">
              <label className="label cursor-pointer justify-between gap-2">
                <span>Create Notification Policy</span>
                <input
                  type="checkbox"
                  className={cn('toggle border-gray-800 bg-gray-500', {
                    'bg-orchid-medium hover:bg-orchid-medium/80':
                      getTfVarsFileMethods.watch('create_notification_policy'),
                  })}
                  {...getTfVarsFileMethods.register(
                    'create_notification_policy',
                    {
                      setValueAs: (v) => !!v,
                    },
                  )}
                />
              </label>
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={getTfvars.isPending || getTemplatePending}
          className="btn mt-3 w-full bg-orchid-medium text-white hover:bg-orchid-medium/70 disabled:bg-orchid-medium/50 disabled:text-white/70"
        >
          Generate
        </button>
      </FormWrapper>
    </div>
  );
};
