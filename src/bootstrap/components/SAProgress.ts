'use strict';

import bindMethods from '../../utils/bindMethods';

import Base from './Base';

export default class SALabel extends Base<HTMLDivElement> {
    private className: string;
    private classOver: string;
    private text1: Text;
    private text2: Text;
    private spanUnder?: HTMLSpanElement;
    private spanOver?: HTMLSpanElement;
    constructor({ dataAttr = 'logo-progress', className = 'progress', classOver = 'over', text = 'installing' }) {
        super({ dataAttr });
        bindMethods(this);
        this.className = className;
        this.classOver = classOver;
        this.text1 = document.createTextNode(text||'');
        this.text2 = document.createTextNode(text||'');
    }
    createFragment(){
        const divUnder = this.$self = this.$self = document.createElement('div');
        const divOver = this.$self = this.$self = document.createElement('div');
        const spanUnder = this.spanUnder = document.createElement('span');
        const spanOver = this.spanOver = document.createElement('span');
        spanOver.appendChild(this.text1);
        spanOver.appendChild(this.text2);
        if (this.dataAttr) {
            const attr = document.createAttribute(`data-${this.dataAttr}`);
            divUnder.setAttributeNode(attr);
        }
        if (this.className) {
           divUnder.classList.add(this.className);
        }
        if (this.classOver){
            divOver.classList.add(this.classOver);
        }
        divUnder.appendChild(divOver);
        divUnder.appendChild(spanUnder);
        divOver.appendChild(spanOver);
    }
}