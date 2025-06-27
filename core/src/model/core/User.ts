import { Mdorim, User as UserType } from "@elucidario/mdorim";

import AbstractModel from "@/model/AbstractModel";
import InterfaceModel from "@/model/InterfaceModel";

/**
 * # User
 * The User class provides methods to validate the User Entity.
 */
export class User
    extends AbstractModel<UserType>
    implements InterfaceModel<UserType>
{
    /**
     * Creates a new instance of UserModel.
     * @param mdorim - The mdorim instance to use for validation.
     * @param data - Optional initial data for the user.
     */
    constructor(mdorim: Mdorim, data?: UserType | UserType[] | null) {
        super("/core/User", mdorim, data);
    }

    /**
     * Validates username against the string schema.
     * @param username - username to validate
     * @returns true if the username is valid, throws an MdorimError if it is not
     * @throws MdorimError
     */
    async validateUsername(username: unknown): Promise<boolean> {
        try {
            return await this.validate(
                username,
                "/core/Definitions#/$defs/username",
            );
        } catch (error) {
            throw this.error(error);
        }
    }

    /**
     * Validates email against the string schema.
     * @param email - email to validate
     * @returns true if the email is valid, throws an MdorimError if it is not
     * @throws MdorimError
     */
    async validatePassword(password: unknown): Promise<boolean> {
        try {
            return await this.validate(
                password,
                "/core/Definitions#/$defs/password",
            );
        } catch (error) {
            throw this.error(error);
        }
    }
}
