import * as d3 from 'd3';
import { ID3Node, IImageDef } from './../../../interfaces';
import { Subject } from 'rxjs';
export declare class D3NodeBasicParser {
    constructor();
    width: number;
    height: number;
    defaultImage?: IImageDef;
    errorBase64Icon: string;
    imageDefs: {
        x: number;
        y: number;
        h: number;
        w: number;
        rx: number;
    };
    transitionDuration: number;
    protected addImage(): void;
    drawNodes(prGroup: d3.Selection<SVGGElement, d3.HierarchyPointNode<ID3Node>, any, any>, prClickEvent: Subject<{
        id: string;
        node: ID3Node;
    }>): void;
}
