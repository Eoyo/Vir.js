class Selector {
  region: any[]
  private curId: number = undefined
  constructor(op: { inFunc?, outFunc?, region: any[] }) {
    Object.assign(this, op);
  }
  select(id) {
    if (this.curId !== undefined) {
      this.outFunc(this.region[this.curId])
    }

    this.curId = id

    this.inFunc(this.region[this.curId])
  }
  inFunc(ele) { }
  outFunc(ele) { }
}

class DomPageSelector extends Selector {
  constructor(op: { region: any[] }) {
    super(op)
  }
  inFunc(ele) {
    ele.style.display = 'block'
  }
  outFunc(ele) {
    ele.style.display = 'none'
  }
}

export {
  Selector
  , DomPageSelector
}