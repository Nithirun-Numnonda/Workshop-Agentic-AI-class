export function toGeminiSchema(schema: any): any {
  if (schema.type === 'object') {
    const properties: Record<string, any> = {};
    for (const [key, value] of Object.entries(schema.properties || {})) {
      properties[key] = toGeminiSchema(value);
    }
    return {
      type: 'OBJECT',
      properties,
      required: schema.required || [],
    };
  } else if (schema.type === 'array') {
    return {
      type: 'ARRAY',
      items: toGeminiSchema(schema.items),
    };
  } else if (schema.type === 'string') {
    return { type: 'STRING' };
  } else if (schema.type === 'number' || schema.type === 'integer') {
    return { type: 'NUMBER' };
  } else if (schema.type === 'boolean') {
    return { type: 'BOOLEAN' };
  }
  return schema;
}
