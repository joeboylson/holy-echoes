export function hasValidProps<
  T extends Record<string, unknown> = Record<string, unknown>
>(body: unknown, props: T): body is T {
  try {
    const bodyObject = JSON.parse(body as string) as Record<string, unknown>;
    const bodyObjectKeys = Object.keys(bodyObject);
    const isValid = Object.keys(props).every((key) =>
      bodyObjectKeys.includes(key)
    );
    if (isValid) {
      body = bodyObject;
    }
    return isValid;
  } catch {
    return false;
  }
}
