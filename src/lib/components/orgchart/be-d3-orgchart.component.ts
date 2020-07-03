import { Component, ElementRef, OnInit, ViewChildren, TemplateRef, QueryList, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { D3OrgChart, ID3OrgChartOptions } from '../../clasess/d3-org-chart.class';
import { ID3Node } from '../../interfaces';
import { D3NodeBasicParser } from './../../clasess/@items';

@Component({
    selector: 'be-d3-orgchart',
    templateUrl: './be-d3-orgchart.component.html',
    styleUrls: ['./be-d3-orgchart.component.scss']
})
export class BED3OrgchartComponent implements AfterViewInit, OnChanges {
    @Input() nodes: ID3Node[];
    @Input() nodeParser: D3NodeBasicParser;

    //#region Chart
    protected _chart: D3OrgChart;
    get chart(): D3OrgChart {
        const me = this;
        if (!me._chart) {
            const options: ID3OrgChartOptions = {};
            // adding nodes if defined
            if (me.nodes) options.data = me.nodes;
            // adding node parser if defined
            if (me.nodeParser) options.nodeParser = me.nodeParser;

            me._chart = new D3OrgChart(this.prEl.nativeElement, options);
        };
        return me._chart;
    }
    //#endregion

    constructor(protected prEl: ElementRef) { }

    ngAfterViewInit() {
        this.init()
    }

    ngOnChanges(changes: SimpleChanges) {
        const me = this;

        // detecting changes of input
        if (changes.nodeParser && changes.nodeParser.currentValue) {
            me.assignNodeParser(changes.nodeParser.currentValue);
            me.chart.render();
        }

        if (changes.nodes && changes.nodes.currentValue) {
            me.assignData(changes.nodes.currentValue as ID3Node[]);
            me.chart.render();
        }

    }

    init() {
        const me = this;
        // init the canvas
        const chart = me.chart; // Must be like this to ensure chart init
        me.chart.render();
        // setting data
        me.chart.onNodeClick.subscribe(
            (data: { id: string, node: ID3Node }) => {
                console.log('Clicked: ', data)
            }
        )
    }

    assignData(data: ID3Node[] | ID3Node, clear: boolean = true) {
        const me = this;
        const chart = me.chart; // Must be like this to ensure chart init
        // if isn´t array we convert it in array
        if (!(data instanceof Array)) data = [data];
        if (clear) {
            chart.data = data;
            return;
        }
        // pushing data
        chart.data = [...chart.data, ...data];
        chart.render();
    }

    assignNodeParser(prParser: D3NodeBasicParser) {
        const me = this;
        const chart = me.chart; // Must be like this to ensure chart init
        chart.nodeParser = prParser;
        chart.render();
    }


    //#region Para Eliminar
    // xxxinit() {
    //     const me = this;
    //     // Obtenemos la info
    //     d3
    //         .json('https://gist.githubusercontent.com/bumbeishvili/dc0d47bc95ef359fdc75b63cd65edaf2/raw/c33a3a1ef4ba927e3e92b81600c8c6ada345c64b/orgChart.json')
    //         .then((data: ID3Node[]) => {

    //             // data.forEach(current => { current.expanded = true; })
    //             console.log('Adding data: ')
    //             me.chart = new D3OrgChart(this.prEl.nativeElement, data);
    //             me.chart.render();

    //             me.chart.onNodeClick.subscribe(
    //                 (data: { id: string, node: ID3Node }) => {
    //                     console.log('Clicked: ', data)
    //                 }
    //             )
    //         });

    //     // me.chart = new D3OrgChart(this.prEl.nativeElement);
    //     // me.chart.render();

    //     // me.chart.onNodeClick.subscribe(
    //     //     (data: { id: string, node: ID3Node }) => {
    //     //         console.log('Clicked: ', data)
    //     //     }
    //     // )
    // }
    //#endregion



}

