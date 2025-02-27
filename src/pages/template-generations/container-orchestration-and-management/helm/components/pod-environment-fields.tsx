import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '../../../../../lib/utils';
import { FC } from 'react';
import { FormInput } from '../../../../../components/form';

type PodEnvironmentFieldsProps = {
  podIndex: number;
};

const PodEnvironmentFields: FC<PodEnvironmentFieldsProps> = ({ podIndex }) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `pods.${podIndex}.environment`,
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
              'relative flex items-center divide-x-2 divide-gray-800 rounded-md border border-gray-800 transition-all focus-within:divide-orchid-light focus-within:border-orchid-light',
              {
                'divide-red-500 border-red-500':
                  control.getFieldState(
                    `pods.${podIndex}.environment.${envIdx}.name`,
                  ).invalid ||
                  control.getFieldState(
                    `pods.${podIndex}.environment.${envIdx}.value`,
                  ).invalid,
              },
            )}
            key={field.id}
          >
            <FormInput
              id={`env_name_${envIdx}`}
              name={`pods.${podIndex}.environment.${envIdx}.name`}
              label=""
              placeholder="Env"
              inputClass={'border-none'}
            />
            <FormInput
              id={`env_value_${envIdx}`}
              name={`pods.${podIndex}.environment.${envIdx}.value`}
              label=""
              placeholder="Hi"
              inputClass={'border-none'}
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

export default PodEnvironmentFields;
