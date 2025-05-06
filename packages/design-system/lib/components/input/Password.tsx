import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components";

import { Input } from "./Input";
import { cn } from "@/utils";
import { InputProps } from "./types";

export function PasswordInput({ type, color = "gray", ...rest }: InputProps) {
    const [passwordType, setType] = useState(type);

    return (
        <div className={cn("flex", "items-center", "w-full")}>
            <Input
                color={color}
                type={passwordType}
                className={cn("w-full", "rounded-r-none")}
                {...rest}
            />
            <Button
                variant={"outline"}
                color={color}
                className={cn("border-l-0", "rounded-none", "rounded-r-md")}
                onClick={(e) => {
                    e.preventDefault();
                    setType((prev) =>
                        prev === "password" ? "text" : "password",
                    );
                }}
            >
                {passwordType === "text" ? (
                    <Eye size={16} />
                ) : (
                    <EyeOff size={16} />
                )}
            </Button>
        </div>
    );
}
