import { FC, useState } from 'react';
import { category } from './data/select-options';
import { useForm } from 'react-hook-form';
import { getWorkflowsSchema, GetWorkflowsSchema } from './github-actions.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { externalTemplateInstance } from '../../../../lib/axios';
import { toast } from 'sonner';
import ExportTemplateModal from '../../../../components/modal/external-template';
import { FormSelect, FormWrapper } from '../../../../components/form';

export const GithubActions: FC = () => {
  const [getWorkflowsPending, setGetWorkflowsPending] = useState(false);
  const [workflows, setWorkflows] = useState<
    { label: string; value: string }[]
  >([]);
  const [show, setShow] = useState(false);
  const [downloadPending, setDownloadPending] = useState(false);

  const getWorkflowsMethod = useForm<GetWorkflowsSchema>({
    resolver: zodResolver(getWorkflowsSchema),
  });

  async function handleGetWorkflows(body: GetWorkflowsSchema) {
    try {
      setGetWorkflowsPending(true);
      const { data } = await externalTemplateInstance.get<string[]>(
        `/github-actions/${body.workflow.value}`,
      );
      setWorkflows(data.map((item) => ({ label: item, value: item })));
      setShow(true);
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    } finally {
      setGetWorkflowsPending(false);
    }
  }

  async function downloadWorkflow(body: string) {
    try {
      setDownloadPending(true);
      const { data } = await externalTemplateInstance.get<string>(
        `/github-actions/${getWorkflowsMethod.getValues().workflow.value}/${body}`,
      );

      const blob = new Blob([data], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = body;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setDownloadPending(false);
    }
  }

  return (
    <div className="flex h-full w-full items-center justify-center text-white">
      <div className="w-full max-w-96">
        <FormWrapper methods={getWorkflowsMethod} onSubmit={handleGetWorkflows}>
          <div className="space-y-3">
            <FormSelect name="workflow" label="Workflows" options={category} />
            <button
              type="submit"
              disabled={getWorkflowsPending}
              className="btn w-full bg-orchid-medium text-white hover:bg-orchid-medium/70 disabled:bg-orchid-medium/50 disabled:text-white/70"
            >
              Generate
            </button>
          </div>
        </FormWrapper>
        <ExportTemplateModal
          show={show}
          content={workflows}
          downloadPending={downloadPending}
          onClose={() => setShow(false)}
          onSubmit={downloadWorkflow}
        />
      </div>
    </div>
  );
};
