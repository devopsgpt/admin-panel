import { Plus, Trash2 } from 'lucide-react';
import { FC } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FormInput } from '../../../../../../components/form';

const HostsField: FC = () => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'hosts',
  });

  return (
    <div>
      <div className="mb-2 flex items-center">
        <p className="text-lg font-bold">Hosts</p>
        <button type="button" onClick={append} className="btn btn-xs ml-4">
          Add <Plus className="size-3" />
        </button>
      </div>
      <div className="space-y-2">
        {fields.map((_, hostIdx) => (
          <div className="relative" key={hostIdx}>
            <FormInput
              id={`hosts_input.${hostIdx}`}
              name={`hosts.${hostIdx}.value`}
              label=""
              placeholder="www.example.com"
            />
            {hostIdx > 0 && (
              <button
                onClick={() => remove(hostIdx)}
                className="absolute right-3 top-3"
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

export default HostsField;
