import * as d3 from 'd3';
import { ID3Node } from '../interfaces';
import { Subject } from 'rxjs';
import { NodeItemParser } from './../components/@items/basic/item-basic';
export interface ID3OrgChartOptions {
    nodeParser?: NodeItemParser;
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
    protected svg: d3.Selection<any, any, any, any>;
    protected chart: d3.Selection<any, any, any, any>;
    protected centerG: d3.Selection<any, any, any, any>;
    protected defs: any;
    protected lastTransform: any;
    protected root: d3.HierarchyPointNode<ID3Node>;
    protected allNodes: any;
    protected _data: ID3Node[];
    get data(): ID3Node[];
    set data(data: ID3Node[]);
    protected _nodeParser: NodeItemParser;
    get nodeParser(): NodeItemParser;
    set nodeParser(parser: NodeItemParser);
    currentZoom: number;
    protected _nodeSize: ISize;
    get nodeSize(): ISize;
    set nodeSize(prSize: ISize);
    treemap: d3.TreeLayout<ID3Node>;
    constructor(prContainer: HTMLElement, prOptions?: ID3OrgChartOptions);
    render(): this;
    protected prepareCanvas(): void;
    protected prepareData(): void;
    protected showNodes(): void;
    zoomed(): void;
    onNodeClick: Subject<{
        id: string;
        node: ID3Node;
    }>;
    protected _onNodeClick(nodeId: string, node: ID3Node): void;
    diagonal(s: any, t: any): string;
    expand(node: d3.HierarchyPointNode<ID3Node>): void;
}
