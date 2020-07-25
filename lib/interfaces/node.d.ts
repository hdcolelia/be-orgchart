export interface IIconDef {
    type: 'icon';
    name: string;
    color: string;
    backgroundColor: string;
    scale?: number;
}
export interface IImageDef {
    type: 'link' | 'base64';
    data: string;
}
export interface ID3Node {
    nodeId: string;
    parentNodeId: string;
    expanded?: boolean;
    nodeImage?: IIconDef | IImageDef;
    title: string;
    description: string;
    childrenDist?: 'horizontal' | 'vertical';
}
