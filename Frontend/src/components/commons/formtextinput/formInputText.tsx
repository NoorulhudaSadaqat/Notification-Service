import React, { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  textBox?: boolean;
  rowNumber?: number;
  onTextChange?: (text: any) => void; // Update the type of onTextChange
}

const FormInputText = ({
  name,
  label,
  type,
  defaultValue,
  textBox,
  rowNumber,
  onTextChange,
}: FormInputProps) => {
  const { control, formState } = useFormContext(); // Access the form's control and state
  const { errors } = formState;
  const [defaultValueState, setDefaultValueState] =
    React.useState<string>(defaultValue);

  useEffect(() => {
    setDefaultValueState(defaultValue!);
  }, [defaultValue]);
  return (
    <Controller
      name={name}
      defaultValue={defaultValueState || ''}
      control={control}
      render={({ field: { onChange, value } }) => (
        <TextField
          sx={{ marginBlockEnd: '1rem' }}
          helperText={errors[name] ? errors[name].message : null}
          size='small'
          type={type}
          multiline={textBox}
          rows={textBox ? rowNumber : undefined}
          error={!!errors[name]}
          onChange={(e) => {
            onChange(e);
            if (onTextChange) {
              onTextChange(e.target.value);
            }
          }}
          value={value}
          fullWidth
          label={label}
          variant='outlined'
        />
      )}
    />
  );
};

export default FormInputText;
