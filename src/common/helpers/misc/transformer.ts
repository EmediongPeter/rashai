import { TransformFnParams } from 'class-transformer';

export function serializerObjectIdTransformer(val: TransformFnParams): string {
  return val ? val.value?.toString() : val;
}
