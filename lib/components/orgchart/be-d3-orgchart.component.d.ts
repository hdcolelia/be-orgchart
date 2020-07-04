import { ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { D3OrgChart } from '../../clasess/d3-org-chart.class';
import { ID3Node } from '../../interfaces';
import { NodeItemParser } from '../@items/basic/item-basic';
import * as i0 from "@angular/core";
export declare class BED3OrgchartComponent implements AfterViewInit, OnChanges {
    protected prEl: ElementRef;
    nodes: ID3Node[];
    nodeParser: NodeItemParser;
    protected _chart: D3OrgChart;
    get chart(): D3OrgChart;
    constructor(prEl: ElementRef);
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    init(): void;
    assignData(data: ID3Node[] | ID3Node, clear?: boolean): void;
    assignNodeParser(prParser: NodeItemParser): void;
    static ɵfac: i0.ɵɵFactoryDef<BED3OrgchartComponent>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<BED3OrgchartComponent, "be-d3-orgchart", never, { "nodes": "nodes"; "nodeParser": "nodeParser"; }, {}, never>;
}
