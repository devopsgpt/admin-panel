import * as Form from '@radix-ui/react-form';
import { useFormContext } from 'react-hook-form';
import { FormFieldProps } from '../../types/form.types';
import { getNestedValue } from '../../lib/helper';
import { cn } from '../../lib/utils';

export const FormInput = ({
  name,
  label,
  error,
  isNumber,
  inputType,
  inputClass,
  showError = true,
  ...props
}: FormFieldProps) => {
  const { className, ...restProps } = props;

  const {
    register,
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
        <input
          type={inputType}
          className={cn(
            'w-full rounded-md border border-gray-800 px-3 py-2 outline-none transition-all hover:border-gray-700 focus:border-orchid-light',
            inputClass,
            {
              'border-red-500': errorMessage,
            },
          )}
          {...register(name, { ...(isNumber && { valueAsNumber: true }) })}
          {...restProps}
        />
      </Form.Control>
    </Form.Field>
  );
};
