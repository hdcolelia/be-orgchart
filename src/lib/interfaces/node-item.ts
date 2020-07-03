export interface INodeItemComponent {
  tag: string;
  attrs: {
    [index: string]: string | number;
  }
}

export interface INodeItemDef {
  properties: { [index: string]: string | number },
  size: {
    width: number;
    height: number;
  };
  components: INodeItemComponent[];
}
