import * as d3 from 'd3';
import { ID3Node } from '../interfaces';
import { Subject } from 'rxjs';
import { D3NodeBasicParser } from './@items';
import { IRootNode } from './d3x/d3x';
import { BaseType } from 'd3';
export interface ID3OrgChartOptions {
    nodeParser?: D3NodeBasicParser;
    data?: ID3Node[];
    backgroundColor?: string;
    defaultFont?: string;
    nodeHorizontalSpaceScale?: number;
    nodeVerticalSpaceScale?: number;
}
export declare class D3OrgChart {
    protected options: ID3OrgChartOptions;
    protected _nodeParser: D3NodeBasicParser;
    get nodeParser(): D3NodeBasicParser;
    set nodeParser(parser: D3NodeBasicParser);
    protected container: d3.Selection<HTMLElement, any, any, any>;
    protected svg: d3.Selection<SVGElement, unknown, HTMLElement, unknown>;
    protected tb: d3.Selection<any, any, any, any>;
    protected chart: d3.Selection<SVGGElement, any, BaseType, any>;
    protected defs: d3.Selection<any, any, any, any>;
    protected lastTransform: any;
    protected root: d3.HierarchyPointNode<ID3Node>;
    protected _data: ID3Node[];
    get data(): ID3Node[];
    set data(data: ID3Node[]);
    zoomFunc: d3.ZoomBehavior<Element, unknown>;
    currentZoom: number;
    treemap: d3.TreeLayout<ID3Node>;
    constructor(prContainer: HTMLElement, prOptions?: ID3OrgChartOptions);
    render(): this;
    protected prepareCanvas(): void;
    prepareDefs(): void;
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
        parent: IRootNode<ID3Node>;
    }, target: {
        x: number;
        y: number;
        parent: IRootNode<ID3Node>;
    }): string;
    checkExpanded(node: d3.HierarchyPointNode<ID3Node> & {
        _children?: any;
    }): void;
    expand(node: d3.HierarchyPointNode<ID3Node> & {
        _children?: any;
    }, toggle?: boolean): void;
    traslateTo(prX: any, prY: any): void;
    fit(): void;
    setOptions(prOptions: Partial<ID3OrgChartOptions>): void;
}
