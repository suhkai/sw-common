'use strict';

import bindMethods from '../../utils/bindMethods';

import Base from './Base';

const { min, max } = Math;

export default class SAInvertedProgress extends Base<HTMLDivElement> {
  // state vars
  private textStr: string;
  private className: string;
  private perc: number;
  // constructor
  constructor({ dataAttr = 'inverted-progress', text = 'install serviceworker', className = '' }) {
    super({ dataAttr });
    bindMethods(this);
    this.textStr = text;
    this.className = className;
    this.perc = 0;
  }
  createFragment() {
    const self = this.$self = document.createElement('div');
    self.setAttribute('data-content', this.textStr);
    if (this.dataAttr) {
      const attr = document.createAttribute(`data-${this.dataAttr}`);
      self.setAttributeNode(attr);
    }
    if (this.className) {
      self.setAttribute('class', this.className);
    }
  }

  setProgress(newTextStr = this.textStr, perc = this.perc) {//TODO
    if (!this.$self) {
      return;
    }
    if (newTextStr !== this.textStr) {
      this.textStr = newTextStr;
      this.$self.setAttribute('data-content', this.textStr);
    }
    if (perc !== this.perc) {
      this.perc = max(min(perc, 1), 0);
      this.$self.style.width = `${this.perc}%`;
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