import { CSSProperties } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { SskyMentionInputProps } from "./SskyMentionInput";

export const mentionInputClassName = "ssky-mention-input";
export const floatingLabelClassName = "ssky-mention-input-floating-label";

const paddingTop = "21px";
const paddingBottom = "3px";
const padding = `${paddingTop} 0 ${paddingBottom} 0`;
const fontSize = 16;

const getPlaceholderStyle = (isSuperscript: boolean): CSSProperties => ({
  top: isSuperscript ? 0 : paddingTop,
  fontSize: isSuperscript ? 0.75 * fontSize : fontSize,
});

export const useStyles = makeStyles(({ palette, transitions }) => {
  return createStyles({
    root: (props: SskyMentionInputProps) => ({
      width: 200,

      [`& .${mentionInputClassName}__control`]: {
        fontSize,
      },

      [`& .${mentionInputClassName}__input`]: {
        padding,
        border: 0,
        borderBottom: props.error
          ? `2px solid ${palette.error.main}`
          : `1px solid ${palette.divider}`,
        color: palette.text.primary,
        transition: transitions.create("border-bottom-color", {
          duration: transitions.duration.shorter,
          easing: transitions.easing.easeInOut,
        }),
        "&:focus": {
          outline: "none",
          borderBottom: !props.error && `2px solid ${palette.primary.main}`,
        },
        "&:disabled": {
          color: palette.text.disabled,
          borderBottom: !props.error && `1px dotted ${palette.divider}`,
        },
        "&:hover:not(:disabled):not(:focus)": {
          borderBottom: !props.error && `2px solid ${palette.divider}`,
        },
      },

      [`& .${mentionInputClassName}__highlighter`]: {
        padding,
      },

      [`& .${mentionInputClassName}__suggestions`]: {
        backgroundColor: palette.background.paper,
        marginTop: `calc(${paddingTop} + ${paddingBottom}) !important`,
        border: `1px solid ${palette.action.disabledBackground}`,
        boxShadow: `0 0 8px ${palette.action.disabled}`,
        width: "max-content",
        maxHeight: 300,
        overflow: "auto",
      },

      [`& .${mentionInputClassName}__suggestions__item`]: {
        display: "flex",
        alignItems: "center",
        height: 48,
        transition: transitions.create("background-color", {
          duration: transitions.duration.shortest,
          easing: transitions.easing.easeInOut,
        }),
      },

      [`& .${mentionInputClassName}__suggestions__item--focused`]: {
        backgroundColor: palette.action.selected,
      },

      [`& .${floatingLabelClassName}`]: () => {
        let color: string = palette.text.secondary;

        if (props.error) {
          color = palette.error.main;
        } else if (props.disabled) {
          color = palette.text.disabled;
        }

        return {
          ...getPlaceholderStyle(Boolean(props.value)),
          color,
          fontWeight: "normal",
          position: "absolute",
          pointerEvents: "none",
          transition: transitions.create("all", {
            duration: transitions.duration.shorter,
            easing: transitions.easing.easeInOut,
          }),
        };
      },

      "&:focus-within": {
        [`& .${floatingLabelClassName}`]: {
          ...getPlaceholderStyle(true),
          color: !props.error && palette.primary.main,
        },
      },
    }),
  });
});

export const defaultMentionStyle: CSSProperties = {
  backgroundColor: "#00A9E0",
  opacity: 0.3,
  padding: 1,
  marginLeft: -1,
  borderRadius: 3,
};
