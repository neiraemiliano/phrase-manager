import { useState, useCallback } from 'react';
import { FormValues, FormErrors, FormTouched, UseFormReturn, ValidatorMap } from '@types';

export function useForm<T extends FormValues>(
  initialValues: T,
  validators: ValidatorMap<T> = {}
): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validateField = useCallback((name: keyof T, value: any) => {
    if (validators[name]) {
      return validators[name]!(value);
    }
    return null;
  }, [validators]);
  
  const handleChange = useCallback((name: keyof T) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (touched[name as string]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);
  
  const handleBlur = useCallback((name: keyof T) => () => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [values, validateField]);
  
  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};
    let isValid = true;
    
    Object.keys(values).forEach(key => {
      const error = validateField(key as keyof T, values[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  }, [values, validateField]);
  
  const handleSubmit = useCallback((onSubmit: (values: T) => void | Promise<void>) => 
    async (e: React.FormEvent) => {
      e.preventDefault();
      
      const allTouched: FormTouched = {};
      Object.keys(values).forEach(key => {
        allTouched[key] = true;
      });
      setTouched(allTouched);
      
      if (validateForm()) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
          setValues(initialValues);
          setErrors({});
          setTouched({});
        } catch (error) {
          console.error('Form submission error:', error);
        } finally {
          setIsSubmitting(false);
        }
      }
    }, [values, initialValues, validateForm]
  );
  
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const setFieldError = useCallback((name: keyof T, error: string | null) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError
  };
}