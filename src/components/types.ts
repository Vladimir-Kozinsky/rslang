interface IObj<T> {
  [key: string]: T;
}

interface IElements {
  htmlElements: IObj<HTMLElement>;
  svgElements: IObj<SVGElement>;
}

export { IObj, IElements };
