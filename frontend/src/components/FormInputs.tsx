import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

interface FormGroupProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormGroup({ label, error, hint, required, children }: FormGroupProps) {
  return (
    <div className="form-group">
      <label className={`form-label ${required ? 'form-label--required' : ''}`}>{label}</label>
      {children}
      {error && <p className="form-error">{error}</p>}
      {hint && !error && <p className="form-hint">{hint}</p>}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`form-input ${error ? 'form-input--error' : ''} ${className}`}
      {...props}
    />
  )
);
Input.displayName = 'Input';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, options, placeholder, className = '', ...props }, ref) => (
    <select
      ref={ref}
      className={`form-select ${error ? 'form-select--error' : ''} ${className}`}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
);
Select.displayName = 'Select';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className = '', ...props }, ref) => (
    <textarea
      ref={ref}
      className={`form-textarea ${error ? 'form-textarea--error' : ''} ${className}`}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, ...props }, ref) => (
    <div className="form-checkbox-group">
      <input ref={ref} type="checkbox" {...props} />
      <label className="form-label" style={{ marginBottom: 0 }}>{label}</label>
    </div>
  )
);
Checkbox.displayName = 'Checkbox';
