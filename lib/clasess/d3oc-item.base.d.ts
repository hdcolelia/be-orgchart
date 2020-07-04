import * as d3 from 'd3';
export interface IItemComponent {
    tag: string;
    attrs: {
        [index: string]: string;
    };
}
export declare class D3OrgChartItem {
    protected svgCanvas: d3.Selection<SVGGElement, any, any, any>;
    id: string;
    parentId: string;
    g: d3.Selection<SVGGElement, any, any, any>;
    x0: number;
    y0: number;
    components: IItemComponent[];
    constructor(svgCanvas: d3.Selection<SVGGElement, any, any, any>);
    draw(): void;
    protected addComponents(): void;
}
