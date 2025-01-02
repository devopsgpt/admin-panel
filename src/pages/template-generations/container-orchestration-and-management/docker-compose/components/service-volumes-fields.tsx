import { FC } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { cn } from '../../../../../lib/utils';
import { FormInput } from '../../../../../components/form';

type ServiceVolumesFieldsProps = {
  serviceIndex: number;
};

export const ServiceVolumesFields: FC<ServiceVolumesFieldsProps> = ({
  serviceIndex,
}) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `services.${serviceIndex}.volumes`,
  });

  return (
    <div className="mb-2 mt-6">
      <div className="mb-2 flex items-center">
        <p className="text-base font-bold">Volumes</p>

        <button
          type="button"
          onClick={() => append('')}
          className="btn btn-xs ml-4"
        >
          Add <Plus className="size-3" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {fields.map((field, idx) => (
          <div className={'relative'} key={field.id}>
            <FormInput
              label=""
              name={`services.${serviceIndex}.volumes.${idx}.value`}
              placeholder="./host/path:/container/path"
              inputClass={cn({
                'pr-8': idx > 0,
                'divide-red-500 border-red-500': control.getFieldState(
                  `services.${serviceIndex}.volumes.${idx}`,
                ).invalid,
              })}
            />
            {idx > 0 && (
              <button
                type="button"
                onClick={() => remove(idx)}
                className="absolute right-3 top-0 z-10 h-full rounded-e-md rounded-s-none"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
