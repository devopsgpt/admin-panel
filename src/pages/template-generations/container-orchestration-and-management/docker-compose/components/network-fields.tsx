import { FC } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  FormCheckbox,
  FormInput,
  FormSelect,
} from '../../../../../components/form';

const defaultNetworkDrivers = ['Bridge', 'Host', 'None', 'Overlay'] as const;

const NetworkFields: FC = () => {
  const { control, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'networks.app_network',
  });

  const customNetwork = watch('networks.external_network');

  const handleRemoveNetwork = (index: number) => {
    remove(index);
  };

  const handleAppendNetwork = () => {
    const networkData = customNetwork
      ? {
          network_name: '',
          name: '',
        }
      : {
          network_name: '',
          driver: {
            label: 'Bridge',
            value: 'bridge',
          },
        };

    append(networkData);
  };

  return (
    <div>
      <div className="my-4 flex items-center justify-between">
        <div className="flex items-center">
          <p className="text-2xl font-bold">Networks</p>
          <button
            type="button"
            onClick={handleAppendNetwork}
            className="btn btn-xs ml-4"
          >
            Add <Plus className="size-3" />
          </button>
        </div>
        <FormCheckbox
          label="External Network"
          name="networks.external_network"
        />
      </div>

      <div className="space-y-4">
        <div className="flex w-full flex-col gap-4 rounded-md">
          {fields.map((field, index) => (
            <div key={field.id} className="mb-4">
              <div className="flex items-center gap-3 [&>div]:flex-1">
                <FormInput
                  name={`networks.app_network.${index}.network_name`}
                  label="App Network"
                  placeholder="network_name"
                  showError={false}
                />
                {!customNetwork && (
                  <FormSelect
                    name={`networks.app_network.${index}.driver`}
                    label="Network Driver"
                    options={defaultNetworkDrivers.map((driver) => ({
                      label: driver,
                      value: driver,
                    }))}
                  />
                )}
                {customNetwork && (
                  <FormInput
                    name={`networks.app_network.${index}.name`}
                    label="Name"
                    placeholder="Name"
                    showError={false}
                  />
                )}
                {index > 0 && (
                  <button
                    type="button"
                    className="mt-6"
                    onClick={() => handleRemoveNetwork(index)}
                  >
                    <Trash2 className="size-4" color="white" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NetworkFields;
