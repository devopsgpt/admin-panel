import { FC } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { cn } from '../../../../../lib/utils';
import { FormCheckbox, FormInput } from '../../../../../components/form';

type ServiceBuildFieldsProps = {
  serviceIndex: number;
};

export const ServiceBuildFields: FC<ServiceBuildFieldsProps> = ({
  serviceIndex,
}) => {
  const { control, watch } = useFormContext();
  const buildEnabled = watch(`services.${serviceIndex}.build.enabled`);

  const { fields, append, remove } = useFieldArray({
    control,
    name: `services.${serviceIndex}.build.args`,
  });

  return (
    <div className="my-8">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-base font-bold">Build Configuration</p>
        <FormCheckbox
          name={`services.${serviceIndex}.build.enabled`}
          label="Enable Build"
        />
      </div>

      {buildEnabled && (
        <div className="space-y-4 rounded-md">
          <div className="flex gap-2 [&>div]:flex-1">
            <FormInput
              name={`services.${serviceIndex}.build.context`}
              label="Context"
              placeholder="."
            />
            <FormInput
              name={`services.${serviceIndex}.build.dockerfile`}
              label="Dockerfile"
              placeholder="Dockerfile"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <p className="text-sm font-semibold">Build Arguments</p>
              <button
                type="button"
                onClick={() => append({ key: '', value: '' })}
                className="btn btn-xs ml-4"
              >
                Add <Plus className="size-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {fields.map((field, idx) => (
                <div
                  className={cn(
                    'relative flex items-center divide-x-2 divide-gray-800 rounded-md border border-gray-800 transition-all focus-within:divide-orchid-light focus-within:border-orchid-light',
                    {
                      'divide-red-500 border-red-500':
                        control.getFieldState(
                          `services.${serviceIndex}.build.args.${idx}.key`,
                        ).invalid ||
                        control.getFieldState(
                          `services.${serviceIndex}.build.args.${idx}.value`,
                        ).invalid,
                    },
                  )}
                  key={field.id}
                >
                  <FormInput
                    id={`env_name_${idx}`}
                    name={`services.${serviceIndex}.build.args.${idx}.key`}
                    label=""
                    placeholder="Key"
                    inputClass={'border-none'}
                  />
                  <FormInput
                    id={`env_value_${idx}`}
                    name={`services.${serviceIndex}.build.args.${idx}.value`}
                    label=""
                    placeholder="Value"
                    inputClass={cn('border-none rounded-s-none', {
                      'rounded-e-md': idx === 0,
                    })}
                  />

                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="z-10 h-full px-4"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
