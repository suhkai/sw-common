'use strict';

import bindMethods from '../../utils/bindMethods';

import Base from './Base';

export default class SALabel extends Base<HTMLDivElement> {
    private className: string;
    constructor({ dataAttr = 'logo-label', className = 'saira-extra-condensed' }) {
        super({ dataAttr });
        bindMethods(this);
        this.className = className;
    }

    createFragment(){
        const div = this.$self = this.$self = document.createElement('div');
        const spanSuper = document.createElement('span');
        const spanAlgos = document.createElement('span');
        if (this.dataAttr) {
            const attr = document.createAttribute(`data-${this.dataAttr}`);
            div.setAttributeNode(attr);
        }

        if (this.className) {
            div.classList.add(this.className);
        }

        spanSuper.classList.add('white');
        spanSuper.appendChild(document.createTextNode('SUPER'));
        spanAlgos.classList.add('reddish');
        spanAlgos.appendChild(document.createTextNode('ALGOS'));
        div.appendChild(spanSuper);
        div.appendChild(spanAlgos);
    }
    
}



