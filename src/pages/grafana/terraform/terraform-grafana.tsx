import { FormWrapper } from '@/components/form/form-wrapper';
import { cn } from '@/lib/utils';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  GetTfVarsBody,
  terraformGrafanaSchema,
  TerraformGrafanaSchema,
} from './terraform-grafana.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePost } from '@/core/react-query';
import { toast } from 'sonner';
import { externalTemplateInstance } from '@/lib/axios';

const defaultValues: TerraformGrafanaSchema = {
  create_contact_point: {
    use_email: false,
    use_slack: false,
  },
  create_message_template: false,
  create_mute_timing: false,
  create_notification_policy: false,
};

const TerraformGrafana: FC = () => {
  const getTfvars = usePost<File, GetTfVarsBody>(
    '/grafana/terraform',
    'get-tfvars-file',
    true,
  );

  const [getTemplatePending, setGetTemplatePending] = useState(false);

  const getTfVarsFileMethods = useForm<TerraformGrafanaSchema>({
    resolver: zodResolver(terraformGrafanaSchema),
    defaultValues,
  });

  const handleGetTfVars = async (data: TerraformGrafanaSchema) => {
    const body = {
      ...data,
      ...(data.create_contact_point.use_email ||
      data.create_contact_point.use_slack
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
    <div className="w-full text-white max-w-96">
      <FormWrapper methods={getTfVarsFileMethods} onSubmit={handleGetTfVars}>
        <div className="border border-gray-800 rounded-md">
          <div className="divide-y divide-gray-800">
            <div className="px-3 py-2 space-y-1">
              <p className="font-semibold">Create Contact Point</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="gap-2 cursor-pointer label">
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
                </div>
                <div className="flex items-center gap-2">
                  <label className="gap-2 cursor-pointer label">
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
              </div>
            </div>
            <div className="px-3 py-2 space-y-1">
              <label className="justify-between gap-2 cursor-pointer label">
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
            <div className="px-3 py-2 space-y-1">
              <label className="justify-between gap-2 cursor-pointer label">
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
            <div className="px-3 py-2 space-y-1">
              <label className="justify-between gap-2 cursor-pointer label">
                <span>Create Mute Timing</span>
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
          className="w-full mt-3 text-white btn bg-orchid-medium hover:bg-orchid-medium/70 disabled:bg-orchid-medium/50 disabled:text-white/70"
        >
          Generate
        </button>
      </FormWrapper>
    </div>
  );
};

export default TerraformGrafana;
