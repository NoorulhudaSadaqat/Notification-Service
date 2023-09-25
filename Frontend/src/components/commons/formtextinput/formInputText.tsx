import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { Mention, MentionsInput } from "react-mentions";
import MenuItem from "@mui/material/MenuItem";

import {
  defaultMentionStyle,
  floatingLabelClassName,
  mentionInputClassName,
  useStyles,
} from "./mentionStyle";
import "./MentionInput.css";
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
  const [defaultValueState, setDefaultValueState] = React.useState<
    string | undefined
  >(defaultValue);
  const dataTestId = "test-id-ssky-mention-input";
  useEffect(() => {
    setDefaultValueState(defaultValue!);
  }, [defaultValue]);
  if (tags) {
    return (
      <Controller
        name={name}
        defaultValue={defaultValueState || ""}
        control={control}
        render={({ field: { onChange, value } }) => (
          <MentionsInput
            value={value}
            onChange={(e) => {
              onChange(e);
              const newValue = e.target.value;
              onTextChange && onTextChange(newValue, name);
            }}
            className={"custom-mention-input"}
            allowSpaceInQuery={true}
            allowSuggestionsAboveCursor={true}
            autoFocus={true}
            data-testid={dataTestId}
            multiline="true"
          >
            <Mention
              trigger="{{"
              markup="{{__id__}}"
              displayTransform={(id, display) => `{{${display}}}`}
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
              onTextChange && onTextChange(newValue, name);
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
