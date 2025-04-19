export function buildSetClause(
    alias: string,
    data: Record<string, any>,
    paramPrefix = ''
): { clause: string; params: Record<string, any> } {
    const sets: string[] = [];
    const params: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) {
            const paramKey = `${paramPrefix}${key}`;
            sets.push(`${alias}.${key} = $${paramKey}`);
            params[paramKey] = value;
        }
    }

    return {
        clause: sets.length ? `SET ${sets.join(', ')}` : '',
        params,
    };
}
