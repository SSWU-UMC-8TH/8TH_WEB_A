import { ChangeEvent, useEffect, useState } from "react";

interface UseFormProps<T> {
  initialValue: T; // 입력값 예 - { email: '', password: '' }
  // 값이 올바른지 검증하는 함수
  validate: (values: T) => Record<keyof T, string>; // T에 대한 키 값을 받고 그에 대한 value는 string이다. 
}

function useForm<T>({ initialValue, validate }: UseFormProps<T>) {
  const [values, setValues] = useState(initialValue); 
  const [touched, setTouched] = useState<Record<string, boolean>>({}); 
  const [errors, setErrors] = useState<Record<string, string>>({}); 

  const handleChange = (name: keyof T, text: string) => {
    setValues({
      ...values,
      [name]: text,   
    });
  };

  const handleBlur = (name: keyof T) => { 
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  const getInputProps = (name: keyof T) => {
    const value = values[name];
    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleChange(name, e.target.value);

    const onBlur = () => handleBlur(name);

    return { value, onChange, onBlur }
  };

  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors); 
  }, [validate, values]);

  return { values, errors, touched, getInputProps };
}

export default useForm;