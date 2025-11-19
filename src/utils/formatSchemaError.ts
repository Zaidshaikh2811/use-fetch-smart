export function formatSchemaError(err: any, endpoint: string) {
    let msg = `Schema validation failed for response at "${endpoint}":\n`;

    const issues = err?.issues || err?.errors || err?.inner;

    if (Array.isArray(issues)) {
        issues.forEach((issue: any) => {
            const pathArray = issue.path ?? [];
            const path =
                pathArray.length > 0
                    ? "[" + pathArray.join("].") + "]"
                    : "value";
            msg += `- ${path}: ${issue.message}\n`;
        });
    } else {
        msg += `- ${err?.message || "Unknown schema validation error"}`;
    }

    return msg.trim();
}
