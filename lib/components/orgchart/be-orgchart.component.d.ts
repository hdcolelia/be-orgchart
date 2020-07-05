import { ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { D3OrgChart } from '../../clasess/d3-org-chart.class';
import { ID3Node } from '../../interfaces';
import { D3NodeBasicParser } from '../../clasess/@items';
export declare class BEOrgchartComponent implements AfterViewInit, OnChanges {
    protected prEl: ElementRef;
    nodes: ID3Node[];
    nodeParser: D3NodeBasicParser;
    protected _chart: D3OrgChart;
    get chart(): D3OrgChart;
    constructor(prEl: ElementRef);
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    init(): void;
    assignData(data: ID3Node[] | ID3Node, clear?: boolean): void;
    assignNodeParser(prParser: D3NodeBasicParser): void;
}
