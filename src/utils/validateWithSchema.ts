import { formatSchemaError } from "./formatSchemaError";
import { SchemaValidator, SchemaMode } from "../types";

export function validateWithSchema<T>(
    data: any,
    schema?: SchemaValidator<T>,
    mode: SchemaMode = "error",
    endpoint: string = ""
): T {
    if (!schema) return data;

    try {
        return schema.parse(data);
    } catch (err: any) {
        const formatted = formatSchemaError(err, endpoint);

        if (mode === "warn") {
            console.warn("[use-fetch-smart warn]\n" + formatted);
            return data;
        }

        err.message = formatted;
        throw err;
    }
}

