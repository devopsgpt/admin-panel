import { FC } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { cn } from '../../../../../lib/utils';
import { FormInput } from '../../../../../components/form';

type ServiceNetworkFieldsProps = {
  serviceIndex: number;
};

const ServiceNetworkFields: FC<ServiceNetworkFieldsProps> = ({
  serviceIndex,
}) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `services.${serviceIndex}.networks`,
  });

  return (
    <div className="mb-2 mt-6">
      <div className="mb-2 flex items-center">
        <p className="text-base font-bold">Network</p>

        <button
          type="button"
          onClick={() => append('')}
          className="btn btn-xs ml-4"
        >
          Add <Plus className="size-3" />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {fields.map((field, idx) => (
          <div className={'relative'} key={field.id}>
            <FormInput
              label=""
              name={`services.${serviceIndex}.networks.${idx}.value`}
              inputClass={cn({
                'pr-8': idx > 0,
                'divide-red-500 border-red-500': control.getFieldState(
                  `services.${serviceIndex}.networks.${idx}`,
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

export default ServiceNetworkFields;
