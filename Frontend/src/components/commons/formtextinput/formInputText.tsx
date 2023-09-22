import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { Mention, MentionsInput } from "react-mentions";

import {
  defaultMentionStyle,
  floatingLabelClassName,
  mentionInputClassName,
  useStyles,
} from "./mentionStyle";

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  textBox?: boolean;
  rowNumber?: number;
  onTextChange?: (text: unknown) => void; // Update the type of onTextChange
  tags?: string[];
}

export type SskyMentionInputProps = {
  // ... kept only the interesting props for brevity
  className?: string;
  disabled?: boolean;
  error?: boolean;
  inputClassName?: string;
  mentionStyle?: CSSProperties;
  onChange?: (value: string) => void;
  value?: string;
};

const defaultRenderSuggestionItem = (
  dataTestId: string
): SskyMentionInputProps["renderSuggestionItem"] => {
  return (suggestion) => {
    const itemContent = suggestion.display;
    return (
      <MenuItem
        component="div"
        style={{ height: "100%", width: "100%" }}
        data-testid={`${dataTestId}-menu-item-${itemContent}`}
      >
        {itemContent}
      </MenuItem>
    );
  };
};

const FormInputText = ({
  name,
  label,
  type,
  defaultValue,
  textBox,
  rowNumber,
  onTextChange,
  tags,
}: FormInputProps) => {
  const { control, formState } = useFormContext(); // Access the form's control and state
  const { errors } = formState;
  const [defaultValueState, setDefaultValueState] =
    React.useState<string>(defaultValue);
  const dataTestId = "test-id-ssky-mention-input";
  const classes = useStyles({ error: "error ", disable: false });
  console.log("tags : ", tags);
  useEffect(() => {
    setDefaultValueState(defaultValue!);
  }, [defaultValue]);
  if (tags && tags.length > 1) {
    return (
      <Controller
        name={name}
        defaultValue={defaultValueState || ""}
        className={classes.root}
        control={control}
        render={({ field: { onChange, value } }) => (
          <MentionsInput
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              const newValue = e.target.value;
              if (defaultValue !== newValue && onTextChange) {
                onTextChange(newValue);
              }
            }}
            allowSpaceInQuery={true}
            allowSuggestionsAboveCursor={true}
            autoFocus={true}
            className={mentionInputClassName}
            data-testid={dataTestId}
            singleLine={true}
          >
            <Mention
              trigger="{{"
              markup="{{__id__}}"
              displayTransform={(id, display) => `{{${display}}`}
              appendSpaceOnAdd={true}
              isLoading={false}
              renderSuggestion={defaultRenderSuggestionItem(dataTestId)}
              data={tags}
              style={{
                ...defaultMentionStyle,
              }}
            />
          </MentionsInput>
        )}
      />
    );
  } else {
    return (
      <Controller
        name={name}
        defaultValue={defaultValueState || ""}
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextField
            sx={{ marginBlockEnd: "1rem" }}
            helperText={errors[name] ? errors[name].message : null}
            size="small"
            type={type}
            multiline={textBox}
            rows={textBox ? rowNumber : undefined}
            error={!!errors[name]}
            onChange={(e) => {
              onChange(e);
              const newValue = e.target.value;
              if (defaultValue != value) {
                if (onTextChange) {
                  onTextChange(newValue);
                }
              }
            }}
            value={value}
            fullWidth
            label={label}
            variant="outlined"
          />
        )}
      />
    );
  }
};

export default FormInputText;
