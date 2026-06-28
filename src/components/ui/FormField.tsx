// FormField — underline-style input with label-above pattern and custom
// select. AnimatedFocusRing applied in Phase 5.7 (MOTION_SPEC.md §3.3).

export type FormFieldType = "text" | "email" | "textarea" | "select";

export interface FormFieldProps {
  name: string;
  label: string;
  type?: FormFieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
}

export function FormField(_: FormFieldProps) {
  return null;
}

export default FormField;
