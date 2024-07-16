import React from "react";
import { BodyProps } from "@elucidario/types-design-system";

export const Body = (props: BodyProps) => {
    const { children, body } = props;

    const className = ["bg-white", "dark:bg-black"];

    const Tag = typeof body !== "undefined" && body === true ? "body" : "div";

    return <Tag className={className.join(" ")}>{children}</Tag>;
};
