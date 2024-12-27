import { FormWrapper } from '@/components/form/form-wrapper';
import { useGet } from '@/core/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FormSelect } from '@/components/form/form-select';
import { PuffLoader } from 'react-spinners';
import { externalTemplateInstance } from '@/lib/axios';
import { GitlabCISchema, gitlabCISchema } from './gitlab-ci.types';

const GitlabCI: FC = () => {
  const getServices = useGet<string[], unknown>(
    '/gitlab-ci',
    'get-gitlab-ci',
    false,
  );

  const [services, setServices] = useState<
    { label: string; value: string }[] | undefined
  >();
  const [getTemplatePending, setGetTemplatePending] = useState(false);

  const getTemplateMethod = useForm<GitlabCISchema>({
    resolver: zodResolver(gitlabCISchema),
  });

  useEffect(() => {
    getGitlabCITemplate();
  }, []);

  async function getGitlabCITemplate() {
    try {
      const { data } = await getServices.mutateAsync(undefined);
      setServices(data.map((item) => ({ label: item, value: item })));
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
    }
  }

  async function handleSubmitService(body: GitlabCISchema) {
    try {
      setGetTemplatePending(true);
      const { data } = await externalTemplateInstance.get(
        `/gitlab-ci/${body.template.value}`,
        { responseType: 'blob' },
      );

      const blob = new Blob([data], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${body.template.value}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setGetTemplatePending(false);
    }
  }

  if (getServices.isPending) {
    return (
      <div className="flex h-full w-full items-center justify-center text-white">
        <PuffLoader color="#fff" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center text-white">
      <div className="w-full max-w-96">
        <FormWrapper methods={getTemplateMethod} onSubmit={handleSubmitService}>
          <div className="space-y-3">
            <FormSelect
              name="template"
              label="Templates"
              options={services as any}
            />
            <button
              type="submit"
              disabled={getTemplatePending}
              className="btn w-full bg-orchid-medium text-white hover:bg-orchid-medium/70 disabled:bg-orchid-medium/50 disabled:text-white/70"
            >
              Generate
            </button>
          </div>
        </FormWrapper>
      </div>
    </div>
  );
};

export default GitlabCI;
