export function parseDBError(error: any) {
  const index = error?.message?.indexOf(':');
  let message: string = error?.message;
  if (index >= 0) {
    message = error.message.substr(index + 1);
  }
  return message;
};