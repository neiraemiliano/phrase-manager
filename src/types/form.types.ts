export interface FormValues {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string | null;
}

export interface FormTouched {
  [key: string]: boolean;
}

export interface UseFormReturn<T extends FormValues> {
  values: T;
  errors: FormErrors;
  touched: FormTouched;
  isSubmitting: boolean;
  isValid: boolean;
  handleChange: (
    name: keyof T,
  ) => (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  handleBlur: (name: keyof T) => () => void;
  handleSubmit: (
    onSubmit: (values: T) => void | Promise<void>,
  ) => (e: React.FormEvent) => void;
  resetForm: () => void;
  setFieldValue: (name: keyof T, value: any) => void;
  setFieldError: (name: keyof T, error: string | null) => void;
}

export type Validator<T> = (value: T) => string | null;
export type ValidatorMap<T extends FormValues> = {
  [K in keyof T]?: Validator<T[K]>;
};
