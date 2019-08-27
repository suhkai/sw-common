'use strict';

import bindMethods from './bindMethods';
import ran from './random';

export default class SALabel {
    private $self?: HTMLDivElement;
    private className: string;
    private $maskId: string;
    private dataAttr: string;
  
    constructor({ dataAttr = 'label', className = 'saira-extra-condensed', $maskId = `sa-label-${ran()}-${ran()}` }) {
        //
        bindMethods(this);
        //
        this.className = className;
        this.$maskId = $maskId;
        this.dataAttr = dataAttr;
    }

    mount($mp: HTMLElement) {
        const div = this.$self = document.createElement('div');
        
        const spanSuper = document.createElement('span');
        const spanAlgos = document.createElement('span');

        if (this.dataAttr){
            const attr = document.createAttribute(`data-${this.dataAttr}`);
            div.appendChild(attr);
        }

        if (this.$maskId) {
            div.setAttribute('id', this.$maskId);
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
        $mp.appendChild(this.$self);
    }

    unmount() {
        if (this.$self) {
            this.$self.parentNode && this.$self.parentNode.removeChild(this.$self);
            // TODO: potentially detach any event Listeners
        }
    }
}



