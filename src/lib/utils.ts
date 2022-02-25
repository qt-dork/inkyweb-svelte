// Credit: https://github.com/scpwiki/wikijump/blob/bec11a052c0991a10456b84dce798ec87f75b208/web/modules/_types/util.d.ts#L3
/** Represents any function, without using the {@link Function} object. */
type AnyFunction<R = unknown> = (...args: any) => R

// Credit: https://gist.github.com/vincentorback/9649034
/** Returns a 'debounced' variant of the given function. */
export function debounce<T extends AnyFunction>(fn: T, wait = 1) {
  let timeout: any
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => void fn.call(this, ...args), wait)
  }
}