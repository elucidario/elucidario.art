import React, {
    InputHTMLAttributes,
    useCallback,
    useEffect,
    useState,
} from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { Button } from "@/components/button";
import { Calendar } from "@/components/calendar";

import { cn } from "@/utils";
import { ChangeHandler } from "react-hook-form";
import { useFormContext } from "@/hooks";

export type DatePickerProps = {
    name: string;
    onChange?: ChangeHandler;
} & InputHTMLAttributes<HTMLInputElement>;

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
    ({ name, value, defaultValue, placeholder, onChange, onBlur }, ref) => {
        const [date, setDate] = useState<string>(
            (value ? value : defaultValue ? defaultValue : "") as string,
        );

        const onDateChange = useCallback(
            (date: Date | undefined) => {
                const formatted = date ? format(date, "yyyy-MM-dd") : undefined;
                onChange?.({
                    target: {
                        name: name,
                        value: formatted ? formatted : undefined,
                    },
                });

                if (formatted) setDate(formatted);
            },
            [name, setDate, onChange],
        );

        const { watch } = useFormContext();

        const watched = watch(name);

        useEffect(() => {
            if (typeof date !== "undefined" && watched !== date) {
                if (watched === "") {
                    setDate(watched as string);
                }
            }
        }, [date, watched]);

        return (
            <>
                <input
                    name={name}
                    ref={ref}
                    type="text"
                    className={cn("hidden")}
                    value={date}
                    onChange={onChange}
                    onBlur={onBlur}
                />
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "justify-start text-left font-normal",
                                !date && "text-muted-foreground",
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? (
                                date
                            ) : (
                                <span>{placeholder || "Pick a date"}</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date !== "" ? new Date(date) : undefined}
                            onSelect={onDateChange}
                            // initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </>
        );
    },
);

DatePicker.displayName = "DatePicker";
