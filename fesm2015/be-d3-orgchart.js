import { ɵɵnamespaceSVG, ɵɵelementStart, ɵɵelement, ɵɵelementEnd, ɵɵtext, ɵɵdirectiveInject, ElementRef, ɵɵdefineComponent, ɵɵNgOnChangesFeature, ɵɵtemplate, ɵɵtemplateRefExtractor, ɵsetClassMetadata, Component, Input, ɵɵdefineNgModule, ɵɵdefineInjector, ɵɵsetNgModuleScope, NgModule } from '@angular/core';
import { select, zoom, stratify, tree, event } from 'd3';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

class NodeItemParser {
    constructor() {
        // dimensions
        this.width = 240;
        this.height = 150;
    }
    prepareDefs(prSVG) {
        const me = this;
        me.defs = prSVG.append('defs');
    }
    drawNodes(prGroup, prNodes) {
        const me = this;
        prGroup.data(prNodes, (d) => d.id)
            .append('rect')
            .attr('class', 'node-rect')
            .attr('width', me.width)
            .attr('height', me.height)
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('fill', 'gray');
    }
    updateNodes(prGroup, prNodes) {
        prGroup.select('rect.node-rect').attr('fill', 'black');
        //  .each(d => {
        //    console.log('argument: ', d);
        //  })
        //.data(prNodes).select('rect.node-rect')
        //.attr('x', d => d.x)
        //.attr('y', d => d.y);
        // console.log('Updateing...:', prGroup)
    }
}

//#region 
class D3OrgChart {
    constructor(prContainer, prOptions) {
        var _a, _b;
        //#region Default Options
        this.options = {
            backgroundColor: '#03A3C5',
            nodeParser: new NodeItemParser(),
            data: [],
            defaultFont: 'Tahoma'
        };
        this._data = [];
        //#endregion
        this.currentZoom = 1;
        this._nodeSize = {
            width: 250,
            height: 200
        };
        //#region Events
        // node click
        this.onNodeClick = new Subject();
        const me = this;
        // init container
        me.container = select(prContainer);
        //If Data argument passed - then set it
        if ((_a = prOptions) === null || _a === void 0 ? void 0 : _a.data)
            me._data = prOptions.data;
        // setting parser
        me._nodeParser = ((_b = prOptions) === null || _b === void 0 ? void 0 : _b.nodeParser) || me.options.nodeParser;
        // applying options
        me.options = Object.assign(me.options, prOptions);
        // monitor resize
        fromEvent(window, 'resize')
            .pipe(debounceTime(300)).subscribe(() => {
            // HDC - VER this.prepareCanvas();
            this.render();
        });
    }
    get data() {
        return this._data || [];
    }
    set data(data) {
        this._data = data;
        // this.render()
    }
    get nodeParser() {
        return this._nodeParser;
    }
    set nodeParser(parser) {
        this._nodeParser = parser;
        // this.render();
    }
    get nodeSize() {
        return this._nodeSize;
    }
    set nodeSize(prSize) {
        this._nodeSize = prSize;
    }
    render() {
        const me = this;
        // preparing svg
        me.prepareCanvas();
        // if no data then return
        if (!me.data.length)
            return;
        // preparing data
        me.prepareData();
        // showing nodes
        me.showNodes();
        return this;
    }
    // preparing canvas
    prepareCanvas() {
        const me = this;
        //Drawing containers
        const containerRect = me.container.node().getBoundingClientRect();
        me.svg = me.container.selectAll('svg')
            .data([{ id: 'svg' }], (d) => d.id)
            .join(enter => enter
            .append('svg')
            .attr('class', 'svg-chart-container')
            .attr('font-family', me.options.defaultFont)
            .call(zoom().on("zoom", d => this.zoomed()))
            .attr('cursor', 'move')
            .style('background-color', me.options.backgroundColor), update => update
            .attr('width', containerRect.width)
            .attr('height', containerRect.height));
        //Add container g element
        me.chart = me.svg.selectAll('g.chart')
            .data([{ id: 'chart' }], (d) => d.id)
            .join(enter => enter
            .append('g')
            .attr('class', 'chart')
            .attr('transform', `translate(0,0)`), update => update);
        // Add one more container g element, for better positioning controls
        me.centerG = me.chart.selectAll('g.center-group')
            .data([{ id: 'center-group' }], (d) => d.id)
            .join(enter => enter.append('g')
            .attr('class', 'center-group'), update => update
            .attr('transform', `translate(${containerRect.width / 2},${this._nodeSize.height}) scale(${this.currentZoom})`));
    }
    // preparing data
    prepareData() {
        const me = this;
        // if no data return 
        if (!me.data.length)
            return;
        // Convert flat data to hierarchical
        me.root = stratify()
            .id(({ nodeId }) => nodeId)
            .parentId(({ parentNodeId }) => parentNodeId)(me.data);
        // preparing treemap
        const containerRect = me.container.node().getBoundingClientRect();
        me.treemap = tree().size([containerRect.width || 250, containerRect.height])
            .nodeSize([this._nodeSize.width + 100, this._nodeSize.height + 100]);
        me.allNodes = me.treemap(me.root).descendants();
    }
    // showing nodes
    showNodes() {
        const me = this;
        //  Assigns the x and y position for the nodes
        const treeData = me.treemap(me.root);
        // select nodes from center group
        // it is necesary for scope 
        const drawNodes = (container, nodes) => me.nodeParser.drawNodes(container, nodes);
        const nodes = treeData.descendants()
            .filter(current => !current.parent
            || current.parent.data.expanded);
        // rendering nodes
        const nodeStartPosition = (d) => {
            if (!d.parent)
                return `translate(${d.x - (me.nodeParser.width / 2)},${d.y})`;
            return `translate(${d.parent.x - (me.nodeParser.width / 2)},${d.parent.y})`;
        };
        const nodePosition = (d) => `translate(${d.x - (me.nodeParser.width / 2)},${d.y})`;
        me.centerG.selectAll('g.node')
            .data(nodes, (d) => d.data.nodeId)
            .join(enter => enter
            .append('g')
            .attr('class', 'node')
            .attr('transform', nodeStartPosition)
            .call(drawNodes, nodes)
            .on('click', (node) => {
            me.expand(node);
            me.onNodeClick.next({ id: node.data.nodeId, node: node.data });
        }), update => update, exit => exit
            .transition()
            .duration(600)
            .attr('transform', nodeStartPosition)
            .style("opacity", 0)
            .remove())
            .transition().duration(600)
            .attr('transform', nodePosition);
        // rendering links
        const pathStartingDiagonal = (d) => {
            const target = { x: d.parent.x, y: d.parent.y + me.nodeParser.height };
            return this.diagonal(target, target);
        };
        const pathDiagonal = (d) => {
            const target = { x: d.parent.x, y: d.parent.y + me.nodeParser.height };
            return this.diagonal(d, target);
        };
        me.centerG.selectAll('path.link')
            .data(nodes.slice(1), (d) => d.data.nodeId)
            .join(enter => enter
            .insert('path', 'g')
            .attr('class', 'link')
            .attr('fill', 'none')
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('d', pathStartingDiagonal), update => update, exit => exit
            .transition().duration(600)
            .attr('d', pathStartingDiagonal)
            .remove())
            .transition().duration(600)
            .attr('d', pathDiagonal);
    }
    // Zoom handler function
    zoomed() {
        const me = this;
        // Saving d3 event's transform object
        me.lastTransform = event.transform;
        // Reposition and rescale chart accordingly
        me.chart.attr('transform', me.lastTransform);
    }
    _onNodeClick(nodeId, node) {
        this.onNodeClick.next({ id: nodeId, node: node });
    }
    //#endregion
    //drawNode(prNode: d3.HierarchyPointNode<ID3Node>) {
    //  const me = this;
    //  me.nodeParser.draw(me.centerG, prNode);
    //}
    // Generate custom diagonal - play with it here - https://observablehq.com/@bumbeishvili/curved-edges?collection=@bumbeishvili/work-components
    diagonal(s, t) {
        // Calculate some variables based on source and target (s,t) coordinates
        const x = s.x;
        const y = s.y;
        const ex = t.x;
        const ey = t.y;
        let xrvs = ex - x < 0 ? -1 : 1;
        let yrvs = ey - y < 0 ? -1 : 1;
        let rdef = 35;
        let rInitial = Math.abs(ex - x) / 2 < rdef ? Math.abs(ex - x) / 2 : rdef;
        let r = Math.abs(ey - y) / 2 < rInitial ? Math.abs(ey - y) / 2 : rInitial;
        let h = Math.abs(ey - y) / 2 - r;
        let w = Math.abs(ex - x) - r * 2;
        // Build the path
        const path = `
            M ${x} ${y}
            L ${x} ${y + h * yrvs}
            C  ${x} ${y + h * yrvs + r * yrvs} ${x} ${y + h * yrvs + r * yrvs} ${x + r * xrvs} ${y + h * yrvs + r * yrvs}
            L ${x + w * xrvs + r * xrvs} ${y + h * yrvs + r * yrvs}
            C ${ex}  ${y + h * yrvs + r * yrvs} ${ex}  ${y + h * yrvs + r * yrvs} ${ex} ${ey - h * yrvs}
            L ${ex} ${ey}
          `;
        // Return result
        return path;
    }
    expand(node) {
        const me = this;
        const expanded = node.data.expanded;
        node.data.expanded = !expanded;
        const expand = (children, expanded) => {
            (children || [])
                .forEach(current => {
                current.data.hidden = !expanded;
                expand(current.children, expanded);
            });
        };
        expand(node.children, expanded);
        me.render();
    }
}

function BED3OrgchartComponent_ng_template_2_Template(rf, ctx) { if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵelementStart(0, "svg", 4);
    ɵɵelement(1, "path", 5);
    ɵɵelement(2, "path", 6);
    ɵɵelement(3, "path", 7);
    ɵɵelement(4, "path", 8);
    ɵɵelementStart(5, "g", 9);
    ɵɵelement(6, "circle", 10);
    ɵɵelement(7, "circle", 11);
    ɵɵelement(8, "circle", 12);
    ɵɵelementEnd();
    ɵɵelementStart(9, "g", 13);
    ɵɵelementStart(10, "text", 14);
    ɵɵtext(11, "A");
    ɵɵelementEnd();
    ɵɵelementStart(12, "text", 15);
    ɵɵtext(13, "B");
    ɵɵelementEnd();
    ɵɵelementStart(14, "text", 16);
    ɵɵtext(15, "C");
    ɵɵelementEnd();
    ɵɵelementEnd();
    ɵɵelementEnd();
} }
function BED3OrgchartComponent_ng_template_4_Template(rf, ctx) { if (rf & 1) {
    ɵɵelementStart(0, "div");
    ɵɵelementStart(1, "p");
    ɵɵtext(2, "$$title");
    ɵɵelementEnd();
    ɵɵelementStart(3, "p");
    ɵɵtext(4, "$$id");
    ɵɵelementEnd();
    ɵɵelementEnd();
} }
class BED3OrgchartComponent {
    //#endregion
    constructor(prEl) {
        this.prEl = prEl;
    }
    get chart() {
        const me = this;
        if (!me._chart) {
            const options = {};
            // adding nodes if defined
            if (me.nodes)
                options.data = me.nodes;
            // adding node parser if defined
            if (me.nodeParser)
                options.nodeParser = me.nodeParser;
            me._chart = new D3OrgChart(this.prEl.nativeElement, options);
        }
        ;
        return me._chart;
    }
    ngAfterViewInit() {
        this.init();
    }
    ngOnChanges(changes) {
        const me = this;
        // detecting changes of input
        if (changes.nodeParser && changes.nodeParser.currentValue) {
            me.assignNodeParser(changes.nodeParser.currentValue);
            me.chart.render();
        }
        if (changes.nodes && changes.nodes.currentValue) {
            me.assignData(changes.nodes.currentValue);
            me.chart.render();
        }
    }
    init() {
        const me = this;
        // init the canvas
        const chart = me.chart; // Must be like this to ensure chart init
        me.chart.render();
        // setting data
        me.chart.onNodeClick.subscribe((data) => {
            console.log('Clicked: ', data);
        });
    }
    assignData(data, clear = true) {
        const me = this;
        const chart = me.chart; // Must be like this to ensure chart init
        // if isn´t array we convert it in array
        if (!(data instanceof Array))
            data = [data];
        if (clear) {
            chart.data = data;
            return;
        }
        // pushing data
        chart.data = [...chart.data, ...data];
        chart.render();
    }
    assignNodeParser(prParser) {
        const me = this;
        const chart = me.chart; // Must be like this to ensure chart init
        chart.nodeParser = prParser;
        chart.render();
    }
}
BED3OrgchartComponent.ɵfac = function BED3OrgchartComponent_Factory(t) { return new (t || BED3OrgchartComponent)(ɵɵdirectiveInject(ElementRef)); };
BED3OrgchartComponent.ɵcmp = ɵɵdefineComponent({ type: BED3OrgchartComponent, selectors: [["be-d3-orgchart"]], inputs: { nodes: "nodes", nodeParser: "nodeParser" }, features: [ɵɵNgOnChangesFeature], decls: 6, vars: 0, consts: [[1, "container"], ["orgchart", ""], ["defaultTemplate", ""], ["nodeTemplate", ""], ["height", "400", "width", "450"], ["id", "lineAB", "d", "M 100 350 l 150 -300", "stroke", "red", "stroke-width", "3", "fill", "none"], ["id", "lineBC", "d", "M 250 50 l 150 300", "stroke", "red", "stroke-width", "3", "fill", "none"], ["d", "M 175 200 l 150 0", "stroke", "green", "stroke-width", "3", "fill", "none"], ["d", "M 100 350 q 150 -300 300 0", "stroke", "blue", "stroke-width", "5", "fill", "none"], ["stroke", "black", "stroke-width", "3", "fill", "black"], ["id", "pointA", "cx", "100", "cy", "350", "r", "3"], ["id", "pointB", "cx", "250", "cy", "50", "r", "3"], ["id", "pointC", "cx", "400", "cy", "350", "r", "3"], ["font-size", "30", "font-family", "sans-serif", "fill", "black", "stroke", "none", "text-anchor", "middle"], ["x", "100", "y", "350", "dx", "-30"], ["x", "250", "y", "50", "dy", "-10"], ["x", "400", "y", "350", "dx", "30"]], template: function BED3OrgchartComponent_Template(rf, ctx) { if (rf & 1) {
        ɵɵelement(0, "div", 0, 1);
        ɵɵtemplate(2, BED3OrgchartComponent_ng_template_2_Template, 16, 0, "ng-template", null, 2, ɵɵtemplateRefExtractor);
        ɵɵtemplate(4, BED3OrgchartComponent_ng_template_4_Template, 5, 0, "ng-template", null, 3, ɵɵtemplateRefExtractor);
    } }, styles: ["[_nghost-%COMP%]{display:flex;flex-direction:column;overflow:hidden}image.rounded[_ngcontent-%COMP%]{border-radius:50%;border-color:#00f;border-width:2px}"] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(BED3OrgchartComponent, [{
        type: Component,
        args: [{
                selector: 'be-d3-orgchart',
                templateUrl: './be-d3-orgchart.component.html',
                styleUrls: ['./be-d3-orgchart.component.scss']
            }]
    }], function () { return [{ type: ElementRef }]; }, { nodes: [{
            type: Input
        }], nodeParser: [{
            type: Input
        }] }); })();

class BED3OrgchartModule {
}
BED3OrgchartModule.ɵmod = ɵɵdefineNgModule({ type: BED3OrgchartModule });
BED3OrgchartModule.ɵinj = ɵɵdefineInjector({ factory: function BED3OrgchartModule_Factory(t) { return new (t || BED3OrgchartModule)(); }, imports: [[]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵɵsetNgModuleScope(BED3OrgchartModule, { declarations: [BED3OrgchartComponent], exports: [BED3OrgchartComponent] }); })();
/*@__PURE__*/ (function () { ɵsetClassMetadata(BED3OrgchartModule, [{
        type: NgModule,
        args: [{
                declarations: [BED3OrgchartComponent],
                imports: [],
                exports: [BED3OrgchartComponent]
            }]
    }], null, null); })();

/*
 * Public API Surface of be-d3-orgchart
 */

/**
 * Generated bundle index. Do not edit.
 */

export { BED3OrgchartComponent, BED3OrgchartModule, NodeItemParser };
//# sourceMappingURL=be-d3-orgchart.js.map
