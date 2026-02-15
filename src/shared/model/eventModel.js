export class Events {
  static listeners = {}

  static on(event, fn) {
    this.listeners[event] ??= new Set()
    this.listeners[event].add(fn)
    return () => this.listeners[event].delete(fn)
  }

  static emit(event, payload) {
    this.listeners[event]?.forEach(fn => fn(payload))
  }
}
