export interface IStratifiedNode<T> {
    children?: IStratifiedNode<T>[];
    data: T;
    height: number;
    id: string;
    parent: IStratifiedNode<T> | null;
}
export interface IColor {
    red: number;
    green: number;
    blue: number;
    alpha: number;
}
export interface ID3Node {
    nodeId: string;
    parentNodeId: string;
    expanded?: boolean;
    nodeImage?: {
        url?: string;
        icon?: string;
        base64?: string;
    };
    title: string;
    description: string;
}
export interface xxxID3Node {
    expanded: boolean;
    hidden?: boolean;
    x0: number;
    nodeId: string;
    parentNodeId: string;
    width: number;
    height: number;
    borderWidth: number;
    borderRadius: number;
    borderColor: IColor;
    backgroundColor: IColor;
    nodeImage: {
        borderColor: IColor;
        borderWidth: number;
        centerLeftDistance: number;
        centerTopDistance: number;
        cornerShape: string;
        height: number;
        shadow: boolean;
        url: string;
        width: number;
    };
    nodeIcon: {
        icon: string;
        size: number;
    };
    connectorLineColor: IColor;
    connectorLineWidth: number;
    dashArray: string;
    directSubordinates: number;
    template: string;
    totalSubordinates: number;
}
