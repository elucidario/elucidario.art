import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { Input, inputVariants } from ".";

import { NumberInputProps } from "./types";

import { VariantProps } from "class-variance-authority";

export const InputNumber = React.forwardRef<
    HTMLInputElement,
    NumberInputProps<VariantProps<typeof inputVariants>>
>(({ className, ...props }, ref) => {
    const [last, setLast] = useState<number>(
        Number(props.defaultValue) || Number(props.value) || 0,
    );
    const [value, setValue] = useState<string>(String(last) || "");

    const [type, setType] = useState<string>("number");
    const isMounted = useRef<boolean | null>(null);

    const localeOptions = useMemo(() => {
        return {
            style: "decimal",
            maximumFractionDigits: 2,
            ...props.localeOptions,
        };
    }, [props.localeOptions]);

    const textToNumber = useCallback(() => {
        setType("number");
        setValue(String(last));
    }, [last]);

    const numberToText = useCallback(
        (num = value) => {
            setType("");
            setLast(Number(num));
            setValue(
                num === ""
                    ? ""
                    : Number(num).toLocaleString(undefined, localeOptions),
            );
        },
        [localeOptions, value],
    );

    const onLocalFocus = useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            textToNumber();
            props.onFocus?.(e);
        },
        [props, textToNumber],
    );

    const onLocalBlur = useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            numberToText();
            props.onBlur?.(e);
        },
        [numberToText, props],
    );

    const onLocalChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setValue(e.target.value);
            props.onChange?.(e);
        },
        [props],
    );

    useEffect(() => {
        if (isMounted.current) {
            numberToText();
        } else {
            isMounted.current = true;
        }
    });

    return (
        <Input
            ref={ref}
            className={className}
            {...props}
            type={type}
            value={value}
            onFocus={onLocalFocus}
            onBlur={onLocalBlur}
            onChange={onLocalChange}
        />
    );
});

InputNumber.displayName = "InputNumber";
