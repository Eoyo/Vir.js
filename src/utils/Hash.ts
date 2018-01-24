import { EventPool } from "./EventPool";
class HashURL {
  private ev = new EventPool()
  private fromHashChange = (e) => {
    this.ev.done(location.hash, e)
    this.ev.done(this.hash, e)
  }
  private hash = Symbol('hashchange')
  constructor() {
    window.addEventListener('hashchange', this.fromHashChange)
    window.addEventListener('load', this.fromHashChange)
  }
  at(str, cb: (ele: HTMLElement) => any) {
    return (ele) => {
      this.ev.after(str, () => {
        cb(ele)
      })
      this.ev.listenAll(this.hash, () => {
        if (location.hash !== str) {
          ele.innerHTML = ''
        }
      })
    }
  }
  emit(str) {
    this.ev.done(str, '')
  }
  onChange(cb) {
    return (ele) => {
      this.ev.listen(this.hash, () => {
        cb(ele, location.hash)
      })
    }
  }
  remove() {
    window.removeEventListener('hashchange', this.fromHashChange)
    window.removeEventListener('load', this.fromHashChange)
  }
}

export {
  HashURL
}

// VirEvNode

