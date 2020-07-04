import * as d3 from 'd3';
import { ID3Node } from '../../../interfaces';
export declare class NodeItemParser {
    constructor();
    width: number;
    height: number;
    defs: d3.Selection<SVGDefsElement, any, any, any>;
    prepareDefs(prSVG: d3.Selection<SVGElement, any, any, any>): void;
    drawNodes(prGroup: d3.Selection<SVGGElement, any, any, any>, prNodes: d3.HierarchyPointNode<ID3Node>[]): void;
    updateNodes(prGroup: d3.Selection<SVGGElement, any, any, any>, prNodes: d3.HierarchyPointNode<ID3Node>[]): void;
}
