import { IObj, IElements } from '../types';

export default abstract class ElementCreator {
  elements: IElements;
  body: HTMLElement;

  constructor() {
    this.body = document.body;
    this.elements = {
      htmlElements: {},
      svgElements: {},
    };
  }

  createElement = (
    tag: string,
    parentElem: HTMLElement,
    attributes: IObj<string> | null = null,
    text: string | null = null
  ): HTMLElement => {
    const elem = document.createElement(tag);
    if (attributes) {
      const entries = Object.entries(attributes);
      entries.forEach((item) => {
        elem.setAttribute(item[0], item[1]);
      });
    }
    if (text) {
      elem.textContent = text;
    }
    parentElem.append(elem);
    return elem;
  };

  createElementSVG = (parentElem: HTMLElement, attributesSVG: IObj<string> | null, attributesUSE: IObj<string> | null): SVGElement => {
    const elemSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const elemUSE = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    if (attributesSVG) {
      const entries = Object.entries(attributesSVG);
      entries.forEach((item) => {
        elemSVG.setAttribute(item[0], item[1]);
      });
    }
    if (attributesUSE) {
      const entries = Object.entries(attributesUSE);
      entries.forEach((item) => {
        elemUSE.setAttribute(item[0], item[1]);
      });
    }
    elemSVG.append(elemUSE);
    parentElem.append(elemSVG);
    return elemSVG;
  };
}
