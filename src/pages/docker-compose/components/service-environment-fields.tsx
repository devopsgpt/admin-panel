import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { FormInput } from '@/components/form/form-input';
import { cn } from '@/lib/utils';
import { FC } from 'react';

type ServiceEnvironmentFieldsProps = {
  serviceIndex: number;
};

const ServiceEnvironmentFields: FC<ServiceEnvironmentFieldsProps> = ({
  serviceIndex,
}) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `services.${serviceIndex}.environment`,
  });

  return (
    <div className="mb-2 mt-6">
      <div className="mb-2 flex items-center">
        <p className="text-base font-bold">Environments</p>

        <button
          type="button"
          onClick={() => append({ name: '', value: '' })}
          className="btn btn-xs ml-4"
        >
          Add <Plus className="size-3" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {fields.map((field, envIdx) => (
          <div
            className={cn(
              'focus-within:border-orchid-light focus-within:divide-orchid-light relative flex items-center divide-x-2 divide-gray-800 rounded-md border border-gray-800',
              {
                'divide-red-500 border-red-500': control.getFieldState(
                  `services.${serviceIndex}.environment.${envIdx}.name`,
                ).invalid,
              },
            )}
            key={field.id}
          >
            <FormInput
              id={`env_name_${envIdx}`}
              name={`services.${serviceIndex}.environment.${envIdx}.key`}
              label=""
              placeholder="Env"
              inputClass={'border-none'}
            />
            <FormInput
              id={`env_value_${envIdx}`}
              name={`services.${serviceIndex}.environment.${envIdx}.value`}
              label=""
              placeholder="Hi"
              inputClass={cn('border-none rounded-s-none', {
                'rounded-e-md': envIdx === 0,
              })}
            />

            {envIdx > 0 && (
              <button
                type="button"
                onClick={() => remove(envIdx)}
                className="z-10 h-full px-4"
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

export default ServiceEnvironmentFields;
