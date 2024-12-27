import { FormSelect } from '@/components/form/form-select';
import { FormWrapper } from '@/components/form/form-wrapper';
import { FC, useState } from 'react';
import { categories } from './data/select-options';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { externalTemplateInstance } from '@/lib/axios';
import { toast } from 'sonner';
import ExportTemplateModal from '@/components/modal/external-template';
import { GetPipelinesSchema, getPipelinesSchema } from './jenkins.types';

const Jenkins: FC = () => {
  const [getPipelinesPending, setGetPipelinesPending] = useState(false);
  const [pipelines, setPipelines] = useState<
    { label: string; value: string }[]
  >([]);
  const [show, setShow] = useState(false);
  const [downloadPending, setDownloadPending] = useState(false);

  const getPipelinesMethod = useForm<GetPipelinesSchema>({
    resolver: zodResolver(getPipelinesSchema),
  });

  async function handleGetPipelines(body: GetPipelinesSchema) {
    try {
      setGetPipelinesPending(true);
      const { data } = await externalTemplateInstance.get<string[]>(
        `/jenkins/${body.pipeline.value}`,
      );
      setPipelines(data.map((item) => ({ label: item, value: item })));
      setShow(true);
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    } finally {
      setGetPipelinesPending(false);
    }
  }

  async function downloadPipeline(body: string) {
    try {
      setDownloadPending(true);
      const { data } = await externalTemplateInstance.get<string>(
        `/jenkins/${getPipelinesMethod.getValues().pipeline.value}/${body}`,
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
        <FormWrapper methods={getPipelinesMethod} onSubmit={handleGetPipelines}>
          <div className="space-y-3">
            <FormSelect
              name="pipeline"
              label="Pipelines"
              options={categories}
            />
            <button
              type="submit"
              disabled={getPipelinesPending}
              className="btn w-full bg-orchid-medium text-white hover:bg-orchid-medium/70 disabled:bg-orchid-medium/50 disabled:text-white/70"
            >
              Generate
            </button>
          </div>
        </FormWrapper>
        <ExportTemplateModal
          show={show}
          content={pipelines}
          downloadPending={downloadPending}
          onClose={() => setShow(false)}
          onSubmit={downloadPipeline}
        />
      </div>
    </div>
  );
};

export default Jenkins;
