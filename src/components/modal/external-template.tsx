import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { FC, useEffect } from 'react';
import { FormWrapper } from '../form/form-wrapper';
import {
  externalTemplateSchema,
  ExternalTemplateSchema,
} from './external-template.types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSelect } from '../form/form-select';

type ExportTemplateModalProps = {
  show: boolean;
  content: { label: string; value: string }[];
  downloadPending: boolean;
  onClose: () => void;
  onSubmit: (data: string) => Promise<void>;
};

const ExportTemplateModal: FC<ExportTemplateModalProps> = ({
  show,
  content,
  downloadPending,
  onSubmit,
  onClose,
}) => {
  const methods = useForm<ExternalTemplateSchema>({
    resolver: zodResolver(externalTemplateSchema),
  });

  useEffect(() => {
    if (show) {
      methods.reset();
      console.log(methods.getValues());
    }
  }, [show]);

  return (
    <div
      className={cn(
        'invisible absolute left-0 top-0 z-40 flex h-dvh w-full items-center justify-center bg-black/70 opacity-0 backdrop-blur-sm backdrop-filter transition-all',
        { 'visible opacity-100': show },
      )}
    >
      <div className="z-50 w-full max-w-[440px]">
        <div className="h-full w-full rounded-lg border border-gray-800 bg-gray-400/10 bg-clip-padding p-4 backdrop-blur-lg backdrop-contrast-100 backdrop-saturate-100 backdrop-filter">
          <div className="flex justify-end">
            <button onClick={onClose}>
              <X />
            </button>
          </div>
          <div className="w-full">
            <FormWrapper
              methods={methods}
              onSubmit={() => onSubmit(methods.getValues().template.value)}
            >
              <div className="space-y-3">
                <FormSelect
                  name="template"
                  label="Templates"
                  options={content as any}
                />
                <button
                  type="submit"
                  disabled={downloadPending}
                  className="btn w-full bg-orchid-medium text-white hover:bg-orchid-medium/70 disabled:bg-orchid-medium/50 disabled:text-white/70"
                >
                  Download
                </button>
              </div>
            </FormWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportTemplateModal;
