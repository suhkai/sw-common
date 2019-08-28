'use strict';

import bindMethods from '../../utils/bindMethods';

import Base from './Base';

export default class SALabel extends Base<HTMLDivElement> {
    private className: string;
    private textStr: string;
    private text1?: Text;
    private text2?: Text;
    private spanUnder?: HTMLSpanElement;
    private spanOver?: HTMLSpanElement;
    constructor({ dataAttr = 'logo-progress', className = 'progress', text = 'installing' }) {
        super({ dataAttr });
        bindMethods(this);
        this.className = className;
        this.textStr = text;
    }
    createFragment(){
        const divUnder = this.$self = this.$self = document.createElement('div');
        const divOver = this.$self = this.$self = document.createElement('div');
        const spanUnder = this.spanUnder = document.createElement('span');
        const spanOver = this.spanOver = document.createElement('span');
        const text1 = this.text1 = document.createTextNode(this.textStr||'');
        const text2 = this.text2 = document.createTextNode(this.textStr||'');
        spanOver.appendChild(text1);
        spanOver.appendChild(text2);
        if (this.dataAttr) {
            const attr = document.createAttribute(`data-${this.dataAttr}`);
            divUnder.setAttributeNode(attr);
        }
        if (this.className) {
           divUnder.classList.add(this.className);
        }
        divUnder.appendChild(divOver);
        divUnder.appendChild(spanUnder);
        divOver.appendChild(spanOver);
    }

    setProgress(){//TODO

    }
}
/*
<div id="parent">
<div class="under">
  <div class="over"><span>THIS IS A LONG PIECE OF TEXT</span></div>  // we will need this div but get it via spanOVer.parent to set explict width on the style!!
  <span>THIS IS A LONG PIECE OF TEXT</span>
</div>
</div>  


body {
  background: #222222;
}

#parent {
  width: 800px;
  border: 4px solid red;
  box-sizing: border-box;
}

.under {
  color: rgba(255,255,255, 0.8);
  position: relative;
  display: flex;
  font-size: 32px;
  font-weight: bold;
  border: 3px solid;
  user-select: none;
  width: calc(100%- 3px);
}

.under > span, .over > span {
   padding:0 1em;
}

.over {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 95.34%;
  z-index: 1;
  overflow: hidden;
}

.over > span {
  white-space: nowrap;
  color: #222222;
  background: rgba(255,255,255, 0.8);
}
*/