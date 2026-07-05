"use client";

import { useState, useCallback, type ReactNode, type ChangeEvent, type FocusEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AnimatedFocusRing } from "@/components/motion/AnimatedFocusRing";
import { ValidationMorph } from "@/components/motion/ValidationMorph";
import styles from "./FormField.module.css";

export type FormFieldType = "text" | "email" | "tel" | "textarea" | "select";

export interface FormFieldProps {
  name: string;
  label: string;
  type?: FormFieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  error?: string;
  disabled?: boolean;
}

export function FormField({
  name,
  label,
  type = "text",
  required = false,
  options = [],
  error,
  disabled = false,
}: FormFieldProps): ReactNode {
  const id = `${name}-field`;
  const errorId = `${name}-error`;
  const reduced = useReducedMotion();
  const hasError = Boolean(error);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const isFloating = isFocused || hasValue;

  const handleFocus = useCallback(
    (_event: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setIsFocused(true);
    },
    [],
  );

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setIsFocused(false);
      setHasValue(event.currentTarget.value !== "");
    },
    [],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setHasValue(event.currentTarget.value !== "");
    },
    [],
  );

  const inputClassName = cn(styles.input, hasError && styles.inputError);

  const commonProps = {
    id,
    name,
    required,
    disabled,
    "aria-invalid": hasError || undefined,
    "aria-describedby": hasError ? errorId : undefined,
    className: inputClassName,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onChange: handleChange,
  } as const;

  let control: ReactNode;

  if (type === "textarea") {
    control = <textarea {...commonProps} rows={5} placeholder=" " />;
  } else if (type === "select") {
    control = (
      <select {...commonProps} defaultValue="">
        <option value="" disabled hidden>
          {label}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  } else {
    control = <input {...commonProps} type={type} placeholder=" " />;
  }

  return (
    <div className={styles.field}>
      <div className={styles.controlWrapper}>
        <motion.label
          htmlFor={id}
          className={styles.label}
          data-floating={isFloating ? "true" : undefined}
          animate={{
            y: isFloating ? -16 : 0,
            scale: isFloating ? 12 / 16 : 1,
          }}
          transition={reduced ? { duration: 0 } : springs.soft}
        >
          {label}
        </motion.label>
        {control}
        {isFocused && !hasError ? <AnimatedFocusRing /> : null}
        {hasError ? <div key={error} className={styles.errorPulse} aria-hidden="true" /> : null}
      </div>
      <ValidationMorph state={hasError ? "error" : "idle"} message={error} id={errorId} />
    </div>
  );
}

export default FormField;
