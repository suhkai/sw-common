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
    // this stretches the div-element to occupy the height needed
    self.appendChild(document.createTextNode('|'));
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
