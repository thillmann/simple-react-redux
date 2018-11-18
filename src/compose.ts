export function compose(...funcs: ((...args: any[]) => any)[]): any {
  if (funcs.length === 0) {
    return (arg: any) => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
