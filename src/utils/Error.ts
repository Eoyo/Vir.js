// 错误处理站

class ErrorManager {
  private errorCode = {}
  private errorPool: { [x: string]: any[] } = {}
  constructor(baseCode?) {
    this.errorCode = baseCode
  }
  add(code, message = 'something wrong!') {
    if (this.errorPool[code]) {
      this.errorPool[code].push(message)
    } else {
      this.errorPool[code] = [message]
    }
  }
  report() {
    let allRight = true
    for (const x in this.errorPool) {
      allRight = false;
      console.error(x, this.errorPool[x])
    }
    if (allRight) {
      console.log('All Right! No Problem!')
    }
  }
}

const error = new ErrorManager()
export {
  error
}