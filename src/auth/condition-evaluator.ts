export function evaluateCondition(
  condition: Record<string, Record<string, string>>,
  context: Record<string, any>,
): boolean {
  const checks: Record<string, (key: string, value: string) => boolean> = {
    stringEquals: (key, value) => getContextValue(context, key) === value,
    stringLike: (key, pattern) =>
      new RegExp('^' + pattern.replace(/\*/g, '.*') + '$').test(getContextValue(context, key)),
  };

  for (const op in condition) {
    const expressions = condition[op];
    for (const key in expressions) {
      const expected = expressions[key];
      const checkFn = checks[op];
      if (!checkFn || !checkFn(key, expected)) {
        return false;
      }
    }
  }

  return true;
}

function getContextValue(context: any, path: string): any {
  return path.split(':').reduce((val, part) => val?.[part], context);
}
