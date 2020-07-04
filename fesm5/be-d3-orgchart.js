import { __spread } from 'tslib';
import { ɵɵnamespaceSVG, ɵɵelementStart, ɵɵelement, ɵɵelementEnd, ɵɵtext, ɵɵdirectiveInject, ElementRef, ɵɵdefineComponent, ɵɵNgOnChangesFeature, ɵɵtemplate, ɵɵtemplateRefExtractor, ɵsetClassMetadata, Component, Input, ɵɵdefineNgModule, ɵɵdefineInjector, ɵɵsetNgModuleScope, NgModule } from '@angular/core';
import { select, zoom, stratify, tree, event } from 'd3';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

var NodeItemParser = /** @class */ (function () {
    function NodeItemParser() {
        // dimensions
        this.width = 240;
        this.height = 150;
    }
    NodeItemParser.prototype.prepareDefs = function (prSVG) {
        var me = this;
        me.defs = prSVG.append('defs');
    };
    NodeItemParser.prototype.drawNodes = function (prGroup, prNodes) {
        var me = this;
        prGroup.data(prNodes, function (d) { return d.id; })
            .append('rect')
            .attr('class', 'node-rect')
            .attr('width', me.width)
            .attr('height', me.height)
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('fill', 'gray');
    };
    NodeItemParser.prototype.updateNodes = function (prGroup, prNodes) {
        prGroup.select('rect.node-rect').attr('fill', 'black');
        //  .each(d => {
        //    console.log('argument: ', d);
        //  })
        //.data(prNodes).select('rect.node-rect')
        //.attr('x', d => d.x)
        //.attr('y', d => d.y);
        // console.log('Updateing...:', prGroup)
    };
    return NodeItemParser;
}());

//#region 
var D3OrgChart = /** @class */ (function () {
    function D3OrgChart(prContainer, prOptions) {
        var _this = this;
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
        var me = this;
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
            .pipe(debounceTime(300)).subscribe(function () {
            // HDC - VER this.prepareCanvas();
            _this.render();
        });
    }
    Object.defineProperty(D3OrgChart.prototype, "data", {
        get: function () {
            return this._data || [];
        },
        set: function (data) {
            this._data = data;
            // this.render()
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(D3OrgChart.prototype, "nodeParser", {
        get: function () {
            return this._nodeParser;
        },
        set: function (parser) {
            this._nodeParser = parser;
            // this.render();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(D3OrgChart.prototype, "nodeSize", {
        get: function () {
            return this._nodeSize;
        },
        set: function (prSize) {
            this._nodeSize = prSize;
        },
        enumerable: true,
        configurable: true
    });
    D3OrgChart.prototype.render = function () {
        var me = this;
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
    };
    // preparing canvas
    D3OrgChart.prototype.prepareCanvas = function () {
        var _this = this;
        var me = this;
        //Drawing containers
        var containerRect = me.container.node().getBoundingClientRect();
        me.svg = me.container.selectAll('svg')
            .data([{ id: 'svg' }], function (d) { return d.id; })
            .join(function (enter) { return enter
            .append('svg')
            .attr('class', 'svg-chart-container')
            .attr('font-family', me.options.defaultFont)
            .call(zoom().on("zoom", function (d) { return _this.zoomed(); }))
            .attr('cursor', 'move')
            .style('background-color', me.options.backgroundColor); }, function (update) {
            return update
                .attr('width', containerRect.width)
                .attr('height', containerRect.height);
        });
        //Add container g element
        me.chart = me.svg.selectAll('g.chart')
            .data([{ id: 'chart' }], function (d) { return d.id; })
            .join(function (enter) { return enter
            .append('g')
            .attr('class', 'chart')
            .attr('transform', "translate(0,0)"); }, function (update) { return update; });
        // Add one more container g element, for better positioning controls
        me.centerG = me.chart.selectAll('g.center-group')
            .data([{ id: 'center-group' }], function (d) { return d.id; })
            .join(function (enter) { return enter.append('g')
            .attr('class', 'center-group'); }, function (update) {
            return update
                .attr('transform', "translate(" + containerRect.width / 2 + "," + _this._nodeSize.height + ") scale(" + _this.currentZoom + ")");
        });
    };
    // preparing data
    D3OrgChart.prototype.prepareData = function () {
        var me = this;
        // if no data return 
        if (!me.data.length)
            return;
        // Convert flat data to hierarchical
        me.root = stratify()
            .id(function (_a) {
            var nodeId = _a.nodeId;
            return nodeId;
        })
            .parentId(function (_a) {
            var parentNodeId = _a.parentNodeId;
            return parentNodeId;
        })(me.data);
        // preparing treemap
        var containerRect = me.container.node().getBoundingClientRect();
        me.treemap = tree().size([containerRect.width || 250, containerRect.height])
            .nodeSize([this._nodeSize.width + 100, this._nodeSize.height + 100]);
        me.allNodes = me.treemap(me.root).descendants();
    };
    // showing nodes
    D3OrgChart.prototype.showNodes = function () {
        var _this = this;
        var me = this;
        //  Assigns the x and y position for the nodes
        var treeData = me.treemap(me.root);
        // select nodes from center group
        // it is necesary for scope 
        var drawNodes = function (container, nodes) { return me.nodeParser.drawNodes(container, nodes); };
        var nodes = treeData.descendants()
            .filter(function (current) {
            return !current.parent
                || current.parent.data.expanded;
        });
        // rendering nodes
        var nodeStartPosition = function (d) {
            if (!d.parent)
                return "translate(" + (d.x - (me.nodeParser.width / 2)) + "," + d.y + ")";
            return "translate(" + (d.parent.x - (me.nodeParser.width / 2)) + "," + d.parent.y + ")";
        };
        var nodePosition = function (d) {
            return "translate(" + (d.x - (me.nodeParser.width / 2)) + "," + d.y + ")";
        };
        me.centerG.selectAll('g.node')
            .data(nodes, function (d) { return d.data.nodeId; })
            .join(function (enter) {
            return enter
                .append('g')
                .attr('class', 'node')
                .attr('transform', nodeStartPosition)
                .call(drawNodes, nodes)
                .on('click', function (node) {
                me.expand(node);
                me.onNodeClick.next({ id: node.data.nodeId, node: node.data });
            });
        }, function (update) { return update; }, function (exit) {
            return exit
                .transition()
                .duration(600)
                .attr('transform', nodeStartPosition)
                .style("opacity", 0)
                .remove();
        })
            .transition().duration(600)
            .attr('transform', nodePosition);
        // rendering links
        var pathStartingDiagonal = function (d) {
            var target = { x: d.parent.x, y: d.parent.y + me.nodeParser.height };
            return _this.diagonal(target, target);
        };
        var pathDiagonal = function (d) {
            var target = { x: d.parent.x, y: d.parent.y + me.nodeParser.height };
            return _this.diagonal(d, target);
        };
        me.centerG.selectAll('path.link')
            .data(nodes.slice(1), function (d) { return d.data.nodeId; })
            .join(function (enter) {
            return enter
                .insert('path', 'g')
                .attr('class', 'link')
                .attr('fill', 'none')
                .attr('stroke', 'blue')
                .attr('stroke-width', 2)
                .attr('d', pathStartingDiagonal);
        }, function (update) { return update; }, function (exit) {
            return exit
                .transition().duration(600)
                .attr('d', pathStartingDiagonal)
                .remove();
        })
            .transition().duration(600)
            .attr('d', pathDiagonal);
    };
    // Zoom handler function
    D3OrgChart.prototype.zoomed = function () {
        var me = this;
        // Saving d3 event's transform object
        me.lastTransform = event.transform;
        // Reposition and rescale chart accordingly
        me.chart.attr('transform', me.lastTransform);
    };
    D3OrgChart.prototype._onNodeClick = function (nodeId, node) {
        this.onNodeClick.next({ id: nodeId, node: node });
    };
    //#endregion
    //drawNode(prNode: d3.HierarchyPointNode<ID3Node>) {
    //  const me = this;
    //  me.nodeParser.draw(me.centerG, prNode);
    //}
    // Generate custom diagonal - play with it here - https://observablehq.com/@bumbeishvili/curved-edges?collection=@bumbeishvili/work-components
    D3OrgChart.prototype.diagonal = function (s, t) {
        // Calculate some variables based on source and target (s,t) coordinates
        var x = s.x;
        var y = s.y;
        var ex = t.x;
        var ey = t.y;
        var xrvs = ex - x < 0 ? -1 : 1;
        var yrvs = ey - y < 0 ? -1 : 1;
        var rdef = 35;
        var rInitial = Math.abs(ex - x) / 2 < rdef ? Math.abs(ex - x) / 2 : rdef;
        var r = Math.abs(ey - y) / 2 < rInitial ? Math.abs(ey - y) / 2 : rInitial;
        var h = Math.abs(ey - y) / 2 - r;
        var w = Math.abs(ex - x) - r * 2;
        // Build the path
        var path = "\n            M " + x + " " + y + "\n            L " + x + " " + (y + h * yrvs) + "\n            C  " + x + " " + (y + h * yrvs + r * yrvs) + " " + x + " " + (y + h * yrvs + r * yrvs) + " " + (x + r * xrvs) + " " + (y + h * yrvs + r * yrvs) + "\n            L " + (x + w * xrvs + r * xrvs) + " " + (y + h * yrvs + r * yrvs) + "\n            C " + ex + "  " + (y + h * yrvs + r * yrvs) + " " + ex + "  " + (y + h * yrvs + r * yrvs) + " " + ex + " " + (ey - h * yrvs) + "\n            L " + ex + " " + ey + "\n          ";
        // Return result
        return path;
    };
    D3OrgChart.prototype.expand = function (node) {
        var me = this;
        var expanded = node.data.expanded;
        node.data.expanded = !expanded;
        var expand = function (children, expanded) {
            (children || [])
                .forEach(function (current) {
                current.data.hidden = !expanded;
                expand(current.children, expanded);
            });
        };
        expand(node.children, expanded);
        me.render();
    };
    return D3OrgChart;
}());

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
var BED3OrgchartComponent = /** @class */ (function () {
    //#endregion
    function BED3OrgchartComponent(prEl) {
        this.prEl = prEl;
    }
    Object.defineProperty(BED3OrgchartComponent.prototype, "chart", {
        get: function () {
            var me = this;
            if (!me._chart) {
                var options = {};
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
        },
        enumerable: true,
        configurable: true
    });
    BED3OrgchartComponent.prototype.ngAfterViewInit = function () {
        this.init();
    };
    BED3OrgchartComponent.prototype.ngOnChanges = function (changes) {
        var me = this;
        // detecting changes of input
        if (changes.nodeParser && changes.nodeParser.currentValue) {
            me.assignNodeParser(changes.nodeParser.currentValue);
            me.chart.render();
        }
        if (changes.nodes && changes.nodes.currentValue) {
            me.assignData(changes.nodes.currentValue);
            me.chart.render();
        }
    };
    BED3OrgchartComponent.prototype.init = function () {
        var me = this;
        // init the canvas
        var chart = me.chart; // Must be like this to ensure chart init
        me.chart.render();
        // setting data
        me.chart.onNodeClick.subscribe(function (data) {
            console.log('Clicked: ', data);
        });
    };
    BED3OrgchartComponent.prototype.assignData = function (data, clear) {
        if (clear === void 0) { clear = true; }
        var me = this;
        var chart = me.chart; // Must be like this to ensure chart init
        // if isn´t array we convert it in array
        if (!(data instanceof Array))
            data = [data];
        if (clear) {
            chart.data = data;
            return;
        }
        // pushing data
        chart.data = __spread(chart.data, data);
        chart.render();
    };
    BED3OrgchartComponent.prototype.assignNodeParser = function (prParser) {
        var me = this;
        var chart = me.chart; // Must be like this to ensure chart init
        chart.nodeParser = prParser;
        chart.render();
    };
    BED3OrgchartComponent.ɵfac = function BED3OrgchartComponent_Factory(t) { return new (t || BED3OrgchartComponent)(ɵɵdirectiveInject(ElementRef)); };
    BED3OrgchartComponent.ɵcmp = ɵɵdefineComponent({ type: BED3OrgchartComponent, selectors: [["be-d3-orgchart"]], inputs: { nodes: "nodes", nodeParser: "nodeParser" }, features: [ɵɵNgOnChangesFeature], decls: 6, vars: 0, consts: [[1, "container"], ["orgchart", ""], ["defaultTemplate", ""], ["nodeTemplate", ""], ["height", "400", "width", "450"], ["id", "lineAB", "d", "M 100 350 l 150 -300", "stroke", "red", "stroke-width", "3", "fill", "none"], ["id", "lineBC", "d", "M 250 50 l 150 300", "stroke", "red", "stroke-width", "3", "fill", "none"], ["d", "M 175 200 l 150 0", "stroke", "green", "stroke-width", "3", "fill", "none"], ["d", "M 100 350 q 150 -300 300 0", "stroke", "blue", "stroke-width", "5", "fill", "none"], ["stroke", "black", "stroke-width", "3", "fill", "black"], ["id", "pointA", "cx", "100", "cy", "350", "r", "3"], ["id", "pointB", "cx", "250", "cy", "50", "r", "3"], ["id", "pointC", "cx", "400", "cy", "350", "r", "3"], ["font-size", "30", "font-family", "sans-serif", "fill", "black", "stroke", "none", "text-anchor", "middle"], ["x", "100", "y", "350", "dx", "-30"], ["x", "250", "y", "50", "dy", "-10"], ["x", "400", "y", "350", "dx", "30"]], template: function BED3OrgchartComponent_Template(rf, ctx) { if (rf & 1) {
            ɵɵelement(0, "div", 0, 1);
            ɵɵtemplate(2, BED3OrgchartComponent_ng_template_2_Template, 16, 0, "ng-template", null, 2, ɵɵtemplateRefExtractor);
            ɵɵtemplate(4, BED3OrgchartComponent_ng_template_4_Template, 5, 0, "ng-template", null, 3, ɵɵtemplateRefExtractor);
        } }, styles: ["[_nghost-%COMP%]{display:flex;flex-direction:column;overflow:hidden}image.rounded[_ngcontent-%COMP%]{border-radius:50%;border-color:#00f;border-width:2px}"] });
    return BED3OrgchartComponent;
}());
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

var BED3OrgchartModule = /** @class */ (function () {
    function BED3OrgchartModule() {
    }
    BED3OrgchartModule.ɵmod = ɵɵdefineNgModule({ type: BED3OrgchartModule });
    BED3OrgchartModule.ɵinj = ɵɵdefineInjector({ factory: function BED3OrgchartModule_Factory(t) { return new (t || BED3OrgchartModule)(); }, imports: [[]] });
    return BED3OrgchartModule;
}());
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
