import { MultipleProps } from "@elucidario/types-design-system";
import { Button } from "@/components";

export function Multiple({ schema, fields }: MultipleProps) {
    console.log("Multiple", {
        schema,
        fields,
    });

    const className = ["multiple", "pl-3", "mb-3", "border-l-2", "border-blue"];

    return (
        <div className={className.join(" ")}>
            {!fields
                ? null
                : fields.map((field: any, index: number) => {
                    return (
                        <div key={index} className="multiple__item">
                            {field}
                        </div>
                    );
                })}
            <Button>{"Adicionar"}</Button>
        </div>
    );
}
