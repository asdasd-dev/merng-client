import { useState } from "react";

export const useForm = (callback: () => void, initialState = {}) => {
    const [errors, setErrors] = useState<any>({});
    const [values, setValues] = useState<any>(initialState);

    function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        callback();
    }

    function onChange(event: React.FormEvent<HTMLInputElement>) {
        setValues({
            ...values,
            [event.currentTarget.name!]: event.currentTarget.value,
        });
        errors && setErrors({});
    }

    return {
        onChange, onSubmit, values, errors, setErrors
    }
}