import React, { useEffect } from "react";
import { Object as ObjectType } from "@elucidario/types-design-system";
import { Box } from "@/components";
import * as Form from "@/components/form";
import useFieldContext from "../field/bk/useFieldContext";
import { ObjectSchema } from "@elucidario/types-mdorim";

const ObjectComponent: ObjectType = (props) => {
    const { schema } = useFieldContext();

    const { properties } = schema as ObjectSchema;

    const className = ["object", "pl-3", "mb-3", "border-l-2", "border-blue"];

    return (
        <Box className={className.join(" ")}>
            <>
                {Object.entries(properties).map(([name, schema], index) => {
                    return (
                        <Form.Field.Root
                            key={index}
                            name={name}
                            schema={schema}
                        >
                            {name}
                        </Form.Field.Root>
                    );
                })}
            </>
        </Box>
    );
};

export { ObjectComponent as Object };
