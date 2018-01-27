class quickJsDom {
    nodeName = 'div'
    childrenlist = []
    attribute = {}
    parentElement: quickJsDom
    id = ''
    className = ''
    constructor (name) {
        this.nodeName = name;
    }
    appendChild(jsDomInstance:quickJsDom) {
        this.childrenlist.push(jsDomInstance)
        jsDomInstance.parentElement = this;
    }
    setAttribute(strName, value) {
        this.attribute[strName] = value;
    }
    get outerHTML () {
        let atttributeStr = ''
        for (const x in this.attribute) {
            atttributeStr += ` ${x}="${this.attribute[x]}"`
        }
        
        this.id && (atttributeStr += ' id="' + this.id + '"')
        this.className && (atttributeStr += ' class="' + this.className + '"')
        return `<${this.nodeName}${atttributeStr}>${this.innerHTML}</${this.nodeName}>`;
    }
    set innerHTML (value) {
        this.childrenlist = [{outerHTML: value}];
    }
    get innerHTML () {
        let childrenStr = ''
        for (const x of this.childrenlist) {
            childrenStr += x.outerHTML
        }
        return childrenStr;
    }
    static create(name) {
        return new quickJsDom(name)
    }
}

export {
    quickJsDom
}