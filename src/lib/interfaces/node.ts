export interface IStratifiedNode<T> {
  children?: IStratifiedNode<T>[];
  data: T;
  // depth: number;
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
  },
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
  borderColor: IColor,
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
  },
  nodeIcon: {
    icon: string;
    size: number
  },
  connectorLineColor: IColor;
  connectorLineWidth: number;
  dashArray: string;
  directSubordinates: number;
  template: string;
  totalSubordinates: number;
}

//  "<div>\n                  <div style=\"margin-left:70px;\n                              margin-top:10px;\n                              font-size:20px;\n                              font-weight:bold;\n                         \">Ian Devling </div>\n                 <div style=\"margin-left:70px;\n                              margin-top:3px;\n                              font-size:16px;\n                         \">Cheaf Executive Officer  </div>\n\n                 <div style=\"margin-left:70px;\n                              margin-top:3px;\n                              font-size:14px;\n                         \">Business first</div>\n\n                 <div style=\"margin-left:196px;\n                             margin-top:15px;\n                             font-size:13px;\n                             position:absolute;\n                             bottom:5px;\n                            \">\n                      <div>CTO office</div>\n                      <div style=\"margin-top:5px\">Corporate</div>\n                 </div>\n              </div>",