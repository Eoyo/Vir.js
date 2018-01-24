function createJsDom() {
  return {
    create (str: string) {
      return document.createElement(str)
    }
    , body: document.body
  }
}
const jsDom = createJsDom()
const div = document.createElement('div') 

export {
  jsDom
}