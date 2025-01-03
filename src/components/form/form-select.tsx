// components/form/FormSelect.tsx
import * as Form from '@radix-ui/react-form';
import { Controller, useFormContext } from 'react-hook-form';
import { FormFieldProps } from '../../types/form.types';
import Select from 'react-select';
import { getNestedValue } from '../../lib/helper';
import { selectStyle } from '../../styles/select.styles';

interface OptionType {
  value: string;
  label: string;
}

interface FormSelectProps extends FormFieldProps {
  options: OptionType[];
  placeholder?: string;
  isSearchable?: boolean;
}

export const FormSelect = ({
  name,
  label,
  error,
  options,
  placeholder = 'Select...',
  isSearchable = true,
  ...props
}: FormSelectProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const fieldError = getNestedValue(errors, name);
  const errorMessage = fieldError?.message as string;

  return (
    <Form.Field className={'form-field relative'} name={name}>
      {label && (
        <div className="mb-1 flex items-baseline justify-between">
          <Form.Label className="form-label">{label}</Form.Label>
        </div>
      )}
      <Form.Control asChild>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={options}
              placeholder={placeholder}
              className="w-full"
              {...props}
              styles={selectStyle(!!errorMessage)}
            />
          )}
        />
      </Form.Control>
    </Form.Field>
  );
};
