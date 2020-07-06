import * as d3 from 'd3';
import { ID3Node } from '../interfaces';
import { Subject } from 'rxjs';
import { D3NodeBasicParser } from './@items';
export interface ID3OrgChartOptions {
    nodeParser?: D3NodeBasicParser;
    data?: ID3Node[];
    backgroundColor?: string;
    defaultFont?: string;
}
export interface ISize {
    width: number;
    height: number;
}
export declare class D3OrgChart {
    protected options: ID3OrgChartOptions;
    protected container: d3.Selection<HTMLElement, any, any, any>;
    protected svg: d3.Selection<d3.BaseType, unknown, HTMLElement, unknown>;
    protected chart: d3.Selection<any, any, any, any>;
    protected centerG: d3.Selection<any, any, any, any>;
    protected defs: d3.Selection<any, any, any, any>;
    protected lastTransform: any;
    protected root: d3.HierarchyPointNode<ID3Node>;
    protected allNodes: any;
    protected _data: ID3Node[];
    get data(): ID3Node[];
    set data(data: ID3Node[]);
    protected _nodeParser: D3NodeBasicParser;
    get nodeParser(): D3NodeBasicParser;
    set nodeParser(parser: D3NodeBasicParser);
    currentZoom: number;
    treemap: d3.TreeLayout<ID3Node>;
    constructor(prContainer: HTMLElement, prOptions?: ID3OrgChartOptions);
    render(): this;
    protected prepareCanvas(): void;
    protected prepareData(): void;
    protected showNodes(prNode?: d3.HierarchyPointNode<ID3Node>): void;
    zoomed(): void;
    onNodeClick: Subject<{
        id: string;
        node: ID3Node;
    }>;
    protected _onNodeClick(nodeId: string, node: ID3Node): void;
    linkPath(source: {
        x: number;
        y: number;
    }, target: {
        x: number;
        y: number;
    }): string;
    checkExpanded(node: d3.HierarchyPointNode<ID3Node> & {
        _children?: any;
    }): void;
    expand(node: d3.HierarchyPointNode<ID3Node> & {
        _children?: any;
    }, toggle?: boolean): void;
}
