import { DataTypes, ObjectSchema, Schema } from "@elucidario/types-mdorim";

import { BoxProps } from "@/components";
import { FC, HTMLAttributes } from "react";

export type ObjectProps = BoxProps<HTMLAttributes<HTMLDivElement>> & {
    schema: ObjectSchema;
};

export type Object = FC<ObjectProps>;
