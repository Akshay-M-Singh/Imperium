import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./FormField.module.css";

export type FormFieldType = "text" | "email" | "tel" | "textarea" | "select";

export interface FormFieldProps {
  name: string;
  label: string;
  type?: FormFieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  error?: string;
}

export function FormField({
  name,
  label,
  type = "text",
  required = false,
  options = [],
  error,
}: FormFieldProps): ReactNode {
  const id = `${name}-field`;
  const errorId = `${name}-error`;
  const hasError = Boolean(error);
  const inputClassName = cn(styles.input, hasError && styles.inputError);

  const commonProps = {
    id,
    name,
    required,
    "aria-invalid": hasError || undefined,
    "aria-describedby": hasError ? errorId : undefined,
    className: inputClassName,
  } as const;

  let control: ReactNode;

  if (type === "textarea") {
    control = <textarea {...commonProps} rows={5} />;
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
    control = <input {...commonProps} type={type} />;
  }

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {control}
      {hasError ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default FormField;
