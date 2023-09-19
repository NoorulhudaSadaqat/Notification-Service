import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string | null;
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

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      control={control}
      render={({ field: { onChange, value } }) => (
        <TextField
          sx={{ marginBlockEnd: '1rem' }}
          helperText={errors[name] ? errors[name].message : null}
          size='small'
          type={type}
          multiline={textBox} // Conditionally set multiline based on textBox prop
          rows={textBox ? rowNumber : undefined} // Optionally specify rows when textBox is true
          error={!!errors[name]}
          onChange={(e) => {
            onChange(e); // Call the original onChange
            if (onTextChange) {
              onTextChange(e.target.value); // Notify parent component
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
