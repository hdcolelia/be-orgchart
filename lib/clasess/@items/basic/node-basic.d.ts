import * as d3 from 'd3';
import { ID3Node } from './../../../interfaces';
export declare class D3NodeBasicParser {
    constructor();
    width: number;
    height: number;
    expandBase64Icon: string;
    collapseBase64Icon: string;
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
    drawNodes(prGroup: d3.Selection<SVGGElement, d3.HierarchyPointNode<ID3Node>, any, any>): void;
    drawNode(prData: d3.HierarchyPointNode<ID3Node>, prIndex: number, node: d3.Selection<SVGGElement, d3.HierarchyPointNode<ID3Node>, any, any>): void;
    xxxdrawNodes(prGroup: d3.Selection<SVGGElement, d3.HierarchyPointNode<ID3Node>, any, any>): void;
    updateNodes(prGroup: d3.Selection<SVGGElement, any, any, any>, prNodes: d3.HierarchyPointNode<ID3Node>[]): void;
}
