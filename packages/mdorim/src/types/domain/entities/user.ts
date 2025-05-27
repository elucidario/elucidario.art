import { EntityProps, Email, Name, Password } from "@/types";

export type UserProps = EntityProps<{
    email: Email;
    name?: Name;
    password?: Password;
}>;
