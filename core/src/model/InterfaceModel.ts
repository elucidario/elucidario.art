export default interface InterfaceModel<T extends Record<string, unknown>> {
    set(data?: T | T[] | null): void;

    get(): T | T[] | undefined | null;

    validate(data: unknown, schema: string): Promise<boolean>;

    validateEntity(
        data: Record<string, unknown>,
        schemaName?: string,
    ): Promise<boolean>;

    validateUUID(uuid: unknown): Promise<boolean>;

    validateNumber(value: unknown): Promise<boolean>;

    validateEmail(email: unknown): Promise<boolean>;

    error(err: unknown): Error;
}
