import { HTMLAttributes, useCallback, useEffect, useState } from "react";
import { ChangeHandler } from "react-hook-form";

import * as PrimitiveSelect from "@radix-ui/react-select";

import { Content } from "./Content";
import { Trigger } from "./Trigger";
import { Item } from "./Item";

import { useFormContext } from "@/hooks";

export type SelectProps = {
    ref?: React.Ref<HTMLButtonElement>;
    name: string;
    options: string[];
    onChange?: ChangeHandler;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
} & PrimitiveSelect.SelectProps &
    HTMLAttributes<HTMLInputElement>;

export function Controlled({ ref, options, ...props }: SelectProps) {
    const [selected, setSelected] = useState<string>(props.defaultValue || "");

    const { watch } = useFormContext();

    const value = watch(props.name);

    const onValueChange = useCallback(
        (value: string) => {
            setSelected(value);
            props.onChange?.({ target: { name: props.name, value } });
        },
        [props],
    );

    useEffect(() => {
        if (typeof selected !== "undefined" && value !== selected) {
            if (value === "") {
                onValueChange(value);
            }
        }
    }, [onValueChange, selected, value]);

    return (
        <PrimitiveSelect.Root
            {...props}
            disabled={options.length === 0}
            value={selected}
            onValueChange={onValueChange}
        >
            <Trigger ref={ref}>
                <PrimitiveSelect.SelectValue placeholder="Selecione" />
            </Trigger>

            <Content>
                {options.map((option) => (
                    <Item key={option} value={option}>
                        {option}
                    </Item>
                ))}
            </Content>
        </PrimitiveSelect.Root>
    );
}
