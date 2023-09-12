import React from 'react';
import styles from './button.module.css';

interface Props {
  text: string;
  border?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({
  text,
  border = '',
  disabled,
  onClick,
}: Props) {
  const combinedClassName = `${styles[border]} ${styles.btnDistance}`;

  return (
    <button
      className={`${combinedClassName} ${disabled ? styles.disabled : ' '}`}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
