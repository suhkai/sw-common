'use strict';

import bindMethods from '../../utils/bindMethods';

import Base from './Base';

export default class SALabel extends Base<HTMLDivElement> {
  // state vars
  private textStr: string;
  private className: string;
  private perc: number;
  // reference to active DOM elts
  private spanUnder?: HTMLSpanElement;
  private spanOver?: HTMLSpanElement;
  private divOver?: HTMLDivElement;
  // constructor
  constructor({ dataAttr = 'logo-progress', text = 'install serviceworker', className = '' }) {
    super({ dataAttr });
    bindMethods(this);
    this.textStr = text;
    this.className = className;
    this.perc = 0;
  }
  createFragment() {
    const divUnder = this.$self = this.$self = document.createElement('div');
    const divOver = this.divOver = document.createElement('div');
    const spanUnder = this.spanUnder = document.createElement('span');
    const spanOver = this.spanOver = document.createElement('span');
    spanOver.appendChild(document.createTextNode(this.textStr || ''));
    spanUnder.appendChild(document.createTextNode(this.textStr || ''));
    if (this.dataAttr) {
      const attr = document.createAttribute(`data-${this.dataAttr}`);
      divUnder.setAttributeNode(attr);
    }
    if (this.className) {
      this.$self.setAttribute('class', this.className);
    }
    divUnder.appendChild(divOver);
    divUnder.appendChild(spanUnder);
    divOver.appendChild(spanOver);
  }

  setProgress(newTextStr = this.textStr, perc = this.perc) {//TODO
    if (!(this.spanUnder && this.spanOver && this.$self && this.divOver)) {
      return;
    }
    if (newTextStr !== this.textStr) {
      let span = this.spanUnder;
      span.replaceChild(document.createTextNode(newTextStr), span.childNodes[0]);
      span = this.spanOver;
      span.replaceChild(document.createTextNode(newTextStr), span.childNodes[0]);
    }
    if (perc !== this.perc) {
      this.divOver.style.width = `${perc}%`;
      this.perc = this.perc;
    }
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