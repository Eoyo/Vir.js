class quickJsDom {
    nodeName = 'div'
    childrenlist = []
    attribute = {}
    childrenStr = '';
    constructor (name) {
        this.nodeName = name;
    }
    appendChild(jsDomInstance) {
        this.childrenlist.push(jsDomInstance)
        this.childrenStr += jsDomInstance.outerHTML;
    }
    setAttribute(strName, value) {
        this.attribute[strName] = value;
    }
    get outerHTML () {
        let childrenStr = ''
        let atttributeStr = ''
        for (const x in this.attribute) {
            atttributeStr += ` ${x}="${this.attribute[x]}"`
        }
        return `<${this.nodeName}${atttributeStr}>${this.childrenStr}</${this.nodeName}>`;
    }
    set innerHTML (value) {
        this.childrenStr = value;
    }
    get innerHTML () {
        return this.childrenStr;
    }
    static create(name) {
        return new quickJsDom(name)
    }
}

export {
    quickJsDom
}