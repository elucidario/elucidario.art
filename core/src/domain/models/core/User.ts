import { User as UserType } from "@elucidario/mdorim";

import AModel from "../AModel";
import IModel from "../IModel";
import { PropertyConstraint } from "@/types";

/**
 * # User
 * The User class provides methods to validate the User Entity.
 */
export class User extends AModel<UserType> implements IModel<UserType> {
    /**
     * ## User.constraints
     * This static property holds an array of Cypher constraints that should be applied to the model.
     * These constraints are used to ensure data integrity and uniqueness in the database.
     */
    constraints: PropertyConstraint[] = [
        {
            name: "user_unique_uuid",
            labels: ["User"],
            prop: "uuid",
        },
        {
            name: "user_unique_username",
            labels: ["User"],
            prop: "username",
        },
        {
            name: "user_unique_email",
            labels: ["User"],
            prop: "email",
        },
    ];

    /**
     * Creates a new instance of UserModel.
     * @param data - Optional initial data for the user.
     */
    constructor(data?: UserType) {
        super("/core/User", data);
    }
}
