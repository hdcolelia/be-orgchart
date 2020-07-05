//#region 
// Desarrollado en base a: 
//  https://bl.ocks.org/bumbeishvili/09a03b81ae788d2d14f750afe59eb7de
//  https://github.com/bumbeishvili/d3-organization-chart
//#endregion
import * as d3 from 'd3';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { D3NodeBasicParser } from './@items';
var D3OrgChart = /** @class */ (function () {
    function D3OrgChart(prContainer, prOptions) {
        var _this = this;
        var _a, _b;
        //#region Default Options
        this.options = {
            backgroundColor: '#03A3C5',
            nodeParser: new D3NodeBasicParser(),
            data: [],
            defaultFont: 'Tahoma'
        };
        this._data = [];
        //#endregion
        this.currentZoom = 1;
        //#region Events
        // node click
        this.onNodeClick = new Subject();
        var me = this;
        // init container
        me.container = d3.select(prContainer);
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
            .call(d3.zoom().on("zoom", function (d) { return _this.zoomed(); }))
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
                .attr('transform', "translate(" + containerRect.width / 2 + "," + _this.nodeParser.height + ") scale(" + _this.currentZoom + ")");
        });
        // defs
        me.defs = me.svg.selectAll('defs.globalDefs')
            .data([{ id: 'defs' }], function (d) { return d.id; })
            .join(function (enter) {
            var defs = enter.append('defs').attr('class', 'globalDefs');
            defs.append('pattern')
                .attr('id', "img-expand")
                .attr('width', 1).attr('height', 1)
                .append('image')
                .attr("xlink:href", "data:image/png;base64," + me.nodeParser.expandBase64Icon)
                .attr('width', 30)
                .attr('height', 30)
                .attr('preserveAspectRatio', 'xMidYMin slice');
            defs.append('pattern')
                .attr('id', "img-collapse")
                .attr('width', 1).attr('height', 1)
                .append('image')
                .attr("xlink:href", "data:image/png;base64," + me.nodeParser.collapseBase64Icon)
                .attr('width', 30)
                .attr('height', 30)
                .attr('preserveAspectRatio', 'xMidYMin slice');
            // defs.append('pattern')
            //   .attr('id', `img-error`)
            //   .attr('width', 1).attr('height', 1)
            //   .append('image')
            //   .attr("xlink:href", "data:image/png;base64," + me.nodeParser.errorBase64Icon)
            //   .attr('width', me.nodeParser.imageDefs.w )
            //   .attr('height', me.nodeParser.imageDefs.h)
            //   .attr('preserveAspectRatio', 'xMidYMin slice');            
            return defs;
        }, function (update) { return update; });
    };
    // preparing data
    D3OrgChart.prototype.prepareData = function () {
        var me = this;
        // if no data return 
        if (!me.data.length)
            return;
        // Convert flat data to hierarchical
        if (!me.root) {
            try { // preventing multiple root
                me.root = d3.stratify().id(function (_a) {
                    var nodeId = _a.nodeId;
                    return nodeId;
                }).parentId(function (_a) {
                    var parentNodeId = _a.parentNodeId;
                    return parentNodeId;
                })(me.data);
            }
            catch (err) {
                me.root = d3.stratify().id(function (_a) {
                    var nodeId = _a.nodeId;
                    return nodeId;
                }).parentId(function (_a) {
                    var parentNodeId = _a.parentNodeId;
                    return parentNodeId;
                })([{
                        nodeId: 'root',
                        parentNodeId: '',
                        title: 'Error',
                        description: err.message || err,
                        nodeImage: {
                            base64: me.nodeParser.errorBase64Icon
                        }
                    }]);
            }
        }
        // preparing treemap
        var containerRect = me.container.node().getBoundingClientRect();
        me.treemap = d3.tree().size([containerRect.width || 250, containerRect.height])
            .nodeSize([this.nodeParser.width + this.nodeParser.width / 2, this.nodeParser.height + this.nodeParser.height / 1.2]);
        me.allNodes = me.treemap(me.root).descendants();
        me.checkExpanded(me.root);
    };
    // showing nodes
    D3OrgChart.prototype.showNodes = function (prNode) {
        var _this = this;
        if (prNode === void 0) { prNode = null; }
        var me = this;
        if (!prNode)
            prNode = me.root;
        var updatePosition = {
            x: prNode.x,
            y: prNode.y
        };
        //  Assigns the x and y position for the nodes
        var treeData = me.treemap(me.root);
        // it is necesary for scope 
        var drawNodes = function (container) { return me.nodeParser.drawNodes(container); };
        var drawCollapser = function (nodeGroup) {
            nodeGroup.append('circle')
                .attr('class', 'collapser')
                .attr('cx', me.nodeParser.width / 2)
                .attr('cy', me.nodeParser.height)
                .attr('r', 15)
                .attr('stroke', 'black')
                .attr('stroke-width', 2)
                .on('click', function (node) {
                me.expand(node, true);
            });
        };
        var nodes = treeData.descendants();
        // rendering nodes
        var nodeStartPosition = function (d) {
            if (prNode) {
                return "translate(" + (updatePosition.x - (me.nodeParser.width / 2)) + "," + updatePosition.y + ")";
            }
            if (!d.parent)
                return "translate(" + (d.x - (me.nodeParser.width / 2)) + "," + d.y + ")";
            return "translate(" + (d.parent.x - (me.nodeParser.width / 2)) + "," + d.parent.y + ")";
        };
        var nodePosition = function (params) {
            return "translate(" + (params.x - (me.nodeParser.width / 2)) + "," + params.y + ")";
        };
        var expandIconVisible = function (d) { return (d.children || d._children) ? 'visible' : 'hidden'; };
        var expandIcon = function (d) { return expandIconVisible(d) == 'visible' ? (d.data.expanded ? "url(#img-collapse)" : "url(#img-expand)") : ''; };
        me.centerG.selectAll('g.node')
            .data(nodes, function (d) { return d.data.nodeId; })
            .join(function (enter) {
            return enter.append('g')
                .style("opacity", 0)
                .attr('class', 'node')
                .attr('cursor', 'pointer')
                .attr('transform', nodeStartPosition)
                .call(drawNodes)
                .call(drawCollapser)
                .on('click', function (node) {
                me.onNodeClick.next({ id: node.data.nodeId, node: node.data });
            });
        }, function (update) { return update; }, function (exit) {
            return exit
                .transition()
                .duration(me.nodeParser.transitionDuration)
                .attr('transform', nodePosition(prNode))
                .style("opacity", 0)
                .remove();
        })
            .transition().duration(me.nodeParser.transitionDuration)
            .style("opacity", 1)
            .attr('transform', nodePosition)
            .selectAll('circle.collapser')
            .attr('visibility', expandIconVisible)
            .attr('fill', expandIcon);
        // rendering links
        var pathStartingDiagonal = function (params) {
            var target = { x: params.x, y: params.y + me.nodeParser.height };
            return _this.linkPath(target, target);
        };
        var pathDiagonal = function (d) {
            var target = { x: d.parent.x, y: d.parent.y + me.nodeParser.height };
            return _this.linkPath(d, target);
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
                .attr('d', pathStartingDiagonal({ x: updatePosition.x, y: updatePosition.y }));
        }, function (update) { return update; }, function (exit) {
            return exit
                .transition().duration(me.nodeParser.transitionDuration)
                .attr('d', pathStartingDiagonal(prNode))
                .remove();
        })
            .transition().duration(me.nodeParser.transitionDuration)
            .attr('d', pathDiagonal);
    };
    // Zoom handler function
    D3OrgChart.prototype.zoomed = function () {
        var me = this;
        // Saving d3 event's transform object
        me.lastTransform = d3.event.transform;
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
    D3OrgChart.prototype.linkPath = function (source, target) {
        // Calculate some variables based on source and target (s,t) coordinates
        var x = source.x;
        var y = source.y;
        var ex = target.x;
        var ey = target.y;
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
    D3OrgChart.prototype.checkExpanded = function (node) {
        var me = this;
        // checking expanded
        if (node.data.expanded) {
            if (!node.children && node._children) {
                node.children = node._children;
                node._children = null;
            }
        }
        else { // collapsed
            if (node.children) {
                node._children = node.children;
                node.children = null;
            }
        }
        // checking children
        (node.children || node._children || []).forEach(function (current) { return me.checkExpanded(current); });
    };
    D3OrgChart.prototype.expand = function (node, toggle) {
        if (toggle === void 0) { toggle = false; }
        var me = this;
        // if toggle - lets toggle
        if (toggle)
            node.data.expanded = !node.data.expanded;
        // checking expanded
        if (node.data.expanded) {
            if (!node.children && node._children) {
                node.children = node._children;
                node._children = null;
            }
        }
        else { // collapsed
            if (node.children) {
                node._children = node.children;
                node.children = null;
            }
        }
        // const expanded = node.data.expanded;
        // node.data.expanded = !expanded;
        // console.log('Expandind: ', node.data.nodeId)
        // const expand = (children: d3.HierarchyPointNode<ID3Node>[], expanded: boolean) => {
        //   (children || []).forEach(current => {
        //       current.data.hidden = !expanded;
        //       expand(current.children, expanded); 
        //     });
        // }
        // expand(node.children, node.data.expanded); 
        if (toggle)
            me.showNodes(node);
    };
    return D3OrgChart;
}());
export { D3OrgChart };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZDMtb3JnLWNoYXJ0LmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYmUtb3JnY2hhcnQvIiwic291cmNlcyI6WyJsaWIvY2xhc2Vzcy9kMy1vcmctY2hhcnQuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsVUFBVTtBQUNWLDJCQUEyQjtBQUMzQixxRUFBcUU7QUFDckUseURBQXlEO0FBQ3pELFlBQVk7QUFDWixPQUFPLEtBQUssRUFBRSxNQUFNLElBQUksQ0FBQztBQUV6QixPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMxQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sVUFBVSxDQUFDO0FBYzdDO0lBaURFLG9CQUFZLFdBQXdCLEVBQUUsU0FBOEI7UUFBcEUsaUJBeUJDOztRQXpFRCx5QkFBeUI7UUFDZixZQUFPLEdBQXVCO1lBQ3RDLGVBQWUsRUFBRSxTQUFTO1lBQzFCLFVBQVUsRUFBRSxJQUFJLGlCQUFpQixFQUFFO1lBQ25DLElBQUksRUFBRSxFQUFFO1lBQ1IsV0FBVyxFQUFFLFFBQVE7U0FDdEIsQ0FBQTtRQWlCUyxVQUFLLEdBQWMsRUFBRSxDQUFDO1FBb0JoQyxZQUFZO1FBRVosZ0JBQVcsR0FBVyxDQUFDLENBQUM7UUF1UnhCLGdCQUFnQjtRQUNoQixhQUFhO1FBQ2IsZ0JBQVcsR0FBMkMsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQXJSbEUsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBRWhCLGlCQUFpQjtRQUNqQixFQUFFLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFdEMsdUNBQXVDO1FBQ3ZDLFVBQUksU0FBUywwQ0FBRSxJQUFJO1lBQUUsRUFBRSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBRS9DLGlCQUFpQjtRQUNqQixF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SUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDakIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUMvQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQzthQUN0QjtTQUNGO1FBRUQsdUNBQXVDO1FBQ3ZDLGtDQUFrQztRQUNsQywrQ0FBK0M7UUFFL0Msc0ZBQXNGO1FBQ3RGLDBDQUEwQztRQUMxQyx5Q0FBeUM7UUFDekMsNkNBQTZDO1FBQzdDLFVBQVU7UUFDVixJQUFJO1FBRUosOENBQThDO1FBQzlDLElBQUksTUFBTTtZQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVILGlCQUFDO0FBQUQsQ0FBQyxBQXhhRCxJQXdhQyIsInNvdXJjZXNDb250ZW50IjpbIi8vI3JlZ2lvbiBcclxuLy8gRGVzYXJyb2xsYWRvIGVuIGJhc2UgYTogXHJcbi8vICBodHRwczovL2JsLm9ja3Mub3JnL2J1bWJlaXNodmlsaS8wOWEwM2I4MWFlNzg4ZDJkMTRmNzUwYWZlNTllYjdkZVxyXG4vLyAgaHR0cHM6Ly9naXRodWIuY29tL2J1bWJlaXNodmlsaS9kMy1vcmdhbml6YXRpb24tY2hhcnRcclxuLy8jZW5kcmVnaW9uXHJcbmltcG9ydCAqIGFzIGQzIGZyb20gJ2QzJztcclxuaW1wb3J0IHsgSUQzTm9kZSB9IGZyb20gJy4uL2ludGVyZmFjZXMnO1xyXG5pbXBvcnQgeyBTdWJqZWN0LCBmcm9tRXZlbnQgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgZGVib3VuY2VUaW1lIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBEM05vZGVCYXNpY1BhcnNlciB9IGZyb20gJy4vQGl0ZW1zJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUQzT3JnQ2hhcnRPcHRpb25zIHtcclxuICBub2RlUGFyc2VyPzogRDNOb2RlQmFzaWNQYXJzZXI7XHJcbiAgZGF0YT86IElEM05vZGVbXTtcclxuICBiYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XHJcbiAgZGVmYXVsdEZvbnQ/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVNpemUge1xyXG4gIHdpZHRoOiBudW1iZXI7XHJcbiAgaGVpZ2h0OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBEM09yZ0NoYXJ0IHtcclxuICAvLyNyZWdpb24gRGVmYXVsdCBPcHRpb25zXHJcbiAgcHJvdGVjdGVkIG9wdGlvbnM6IElEM09yZ0NoYXJ0T3B0aW9ucyA9IHtcclxuICAgIGJhY2tncm91bmRDb2xvcjogJyMwM0EzQzUnLFxyXG4gICAgbm9kZVBhcnNlcjogbmV3IEQzTm9kZUJhc2ljUGFyc2VyKCksXHJcbiAgICBkYXRhOiBbXSxcclxuICAgIGRlZmF1bHRGb250OiAnVGFob21hJ1xyXG4gIH1cclxuICAvLyNlbmRyZWdpb25cclxuXHJcbiAgLy8jcmVnaW9uIFNWRyBjb21wb2VubnRzXHJcbiAgcHJvdGVjdGVkIGNvbnRhaW5lcjogZDMuU2VsZWN0aW9uPEhUTUxFbGVtZW50LCBhbnksIGFueSwgYW55PjtcclxuICBwcm90ZWN0ZWQgc3ZnOiBkMy5TZWxlY3Rpb248ZDMuQmFzZVR5cGUsIHVua25vd24sIEhUTUxFbGVtZW50LCB1bmtub3duPjtcclxuICBwcm90ZWN0ZWQgY2hhcnQ6IGQzLlNlbGVjdGlvbjxhbnksIGFueSwgYW55LCBhbnk+O1xyXG4gIHByb3RlY3RlZCBjZW50ZXJHOiBkMy5TZWxlY3Rpb248YW55LCBhbnksIGFueSwgYW55PjtcclxuICBwcm90ZWN0ZWQgZGVmczogZDMuU2VsZWN0aW9uPGFueSwgYW55LCBhbnksIGFueT47XHJcblxyXG4gIHByb3RlY3RlZCBsYXN0VHJhbnNmb3JtOiBhbnk7XHJcbiAgLy8jZW5kcmVnaW9uXHJcblxyXG4gIC8vI3JlZ2lvbiBEQVRBXHJcbiAgcHJvdGVjdGVkIHJvb3Q6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPjtcclxuICBwcm90ZWN0ZWQgYWxsTm9kZXM6IGFueTtcclxuXHJcbiAgcHJvdGVjdGVkIF9kYXRhOiBJRDNOb2RlW10gPSBbXTtcclxuICBnZXQgZGF0YSgpOiBJRDNOb2RlW10ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEgfHwgW107XHJcbiAgfVxyXG5cclxuICBzZXQgZGF0YShkYXRhOiBJRDNOb2RlW10pIHtcclxuICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xyXG4gICAgLy8gdGhpcy5yZW5kZXIoKVxyXG4gIH1cclxuICAvLyNlbmRyZWdpb25cclxuXHJcbiAgLy8jcmVnaW9uICBOT0RFIFBBUlNFUlxyXG4gIHByb3RlY3RlZCBfbm9kZVBhcnNlcjogRDNOb2RlQmFzaWNQYXJzZXI7XHJcbiAgZ2V0IG5vZGVQYXJzZXIoKTogRDNOb2RlQmFzaWNQYXJzZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX25vZGVQYXJzZXI7XHJcbiAgfVxyXG4gIHNldCBub2RlUGFyc2VyKHBhcnNlcjogRDNOb2RlQmFzaWNQYXJzZXIpIHtcclxuICAgIHRoaXMuX25vZGVQYXJzZXIgPSBwYXJzZXI7XHJcbiAgICAvLyB0aGlzLnJlbmRlcigpO1xyXG4gIH1cclxuICAvLyNlbmRyZWdpb25cclxuXHJcbiAgY3VycmVudFpvb206IG51bWJlciA9IDE7XHJcbiAgdHJlZW1hcDogZDMuVHJlZUxheW91dDxJRDNOb2RlPjtcclxuXHJcbiAgY29uc3RydWN0b3IocHJDb250YWluZXI6IEhUTUxFbGVtZW50LCBwck9wdGlvbnM/OiBJRDNPcmdDaGFydE9wdGlvbnMpIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuXHJcbiAgICAvLyBpbml0IGNvbnRhaW5lclxyXG4gICAgbWUuY29udGFpbmVyID0gZDMuc2VsZWN0KHByQ29udGFpbmVyKTtcclxuXHJcbiAgICAvL0lmIERhdGEgYXJndW1lbnQgcGFzc2VkIC0gdGhlbiBzZXQgaXRcclxuICAgIGlmIChwck9wdGlvbnM/LmRhdGEpIG1lLl9kYXRhID0gcHJPcHRpb25zLmRhdGE7XHJcblxyXG4gICAgLy8gc2V0dGluZyBwYXJzZXJcclxuICAgIG1lLl9ub2RlUGFyc2VyID0gcHJPcHRpb25zPy5ub2RlUGFyc2VyIHx8IG1lLm9wdGlvbnMubm9kZVBhcnNlcjtcclxuXHJcbiAgICAvLyBhcHBseWluZyBvcHRpb25zXHJcbiAgICBtZS5vcHRpb25zID0gT2JqZWN0LmFzc2lnbihtZS5vcHRpb25zLCBwck9wdGlvbnMpO1xyXG5cclxuICAgIC8vIG1vbml0b3IgcmVzaXplXHJcbiAgICBmcm9tRXZlbnQod2luZG93LCAncmVzaXplJylcclxuICAgICAgLnBpcGUoXHJcbiAgICAgICAgZGVib3VuY2VUaW1lKDMwMClcclxuICAgICAgKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgLy8gSERDIC0gVkVSIHRoaXMucHJlcGFyZUNhbnZhcygpO1xyXG4gICAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgIClcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuICAgIC8vIHByZXBhcmluZyBzdmdcclxuICAgIG1lLnByZXBhcmVDYW52YXMoKTtcclxuXHJcbiAgICAvLyBpZiBubyBkYXRhIHRoZW4gcmV0dXJuXHJcbiAgICBpZiAoIW1lLmRhdGEubGVuZ3RoKSByZXR1cm47XHJcblxyXG4gICAgLy8gcHJlcGFyaW5nIGRhdGFcclxuICAgIG1lLnByZXBhcmVEYXRhKCk7XHJcblxyXG4gICAgLy8gc2hvd2luZyBub2Rlc1xyXG4gICAgbWUuc2hvd05vZGVzKCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIHByZXBhcmluZyBjYW52YXNcclxuICBwcm90ZWN0ZWQgcHJlcGFyZUNhbnZhcygpIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuXHJcbiAgICAvL0RyYXdpbmcgY29udGFpbmVyc1xyXG4gICAgY29uc3QgY29udGFpbmVyUmVjdCA9IG1lLmNvbnRhaW5lci5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBtZS5zdmcgPSBtZS5jb250YWluZXIuc2VsZWN0QWxsKCdzdmcnKVxyXG4gICAgICAuZGF0YShbeyBpZDogJ3N2ZycgfV0sIChkOiB7IGlkOiBzdHJpbmcgfSkgPT4gZC5pZClcclxuICAgICAgLmpvaW4oXHJcbiAgICAgICAgZW50ZXIgPT4gZW50ZXJcclxuICAgICAgICAgIC5hcHBlbmQoJ3N2ZycpXHJcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnc3ZnLWNoYXJ0LWNvbnRhaW5lcicpXHJcbiAgICAgICAgICAuYXR0cignZm9udC1mYW1pbHknLCBtZS5vcHRpb25zLmRlZmF1bHRGb250KVxyXG4gICAgICAgICAgLmNhbGwoZDMuem9vbSgpLm9uKFwiem9vbVwiLCBkID0+IHRoaXMuem9vbWVkKCkpKVxyXG4gICAgICAgICAgLmF0dHIoJ2N1cnNvcicsICdtb3ZlJylcclxuICAgICAgICAgIC5zdHlsZSgnYmFja2dyb3VuZC1jb2xvcicsIG1lLm9wdGlvbnMuYmFja2dyb3VuZENvbG9yKSxcclxuICAgICAgICB1cGRhdGUgPT5cclxuICAgICAgICAgIHVwZGF0ZVxyXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCBjb250YWluZXJSZWN0LndpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgY29udGFpbmVyUmVjdC5oZWlnaHQpXHJcbiAgICAgICk7XHJcbiAgICAvL0FkZCBjb250YWluZXIgZyBlbGVtZW50XHJcbiAgICBtZS5jaGFydCA9IG1lLnN2Zy5zZWxlY3RBbGwoJ2cuY2hhcnQnKVxyXG4gICAgICAuZGF0YShbeyBpZDogJ2NoYXJ0JyB9XSwgKGQ6IHsgaWQ6IHN0cmluZyB9KSA9PiBkLmlkKVxyXG4gICAgICAuam9pbihcclxuICAgICAgICBlbnRlciA9PiBlbnRlclxyXG4gICAgICAgICAgLmFwcGVuZCgnZycpXHJcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnY2hhcnQnKVxyXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwwKWApLFxyXG4gICAgICAgIHVwZGF0ZSA9PiB1cGRhdGVcclxuICAgICAgKVxyXG5cclxuICAgIC8vIEFkZCBvbmUgbW9yZSBjb250YWluZXIgZyBlbGVtZW50LCBmb3IgYmV0dGVyIHBvc2l0aW9uaW5nIGNvbnRyb2xzXHJcbiAgICBtZS5jZW50ZXJHID0gbWUuY2hhcnQuc2VsZWN0QWxsKCdnLmNlbnRlci1ncm91cCcpXHJcbiAgICAgIC5kYXRhKFt7IGlkOiAnY2VudGVyLWdyb3VwJyB9XSwgKGQ6IHsgaWQ6IHN0cmluZyB9KSA9PiBkLmlkKVxyXG4gICAgICAuam9pbihcclxuICAgICAgICBlbnRlciA9PiBlbnRlci5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2NlbnRlci1ncm91cCcpLFxyXG4gICAgICAgIHVwZGF0ZSA9PlxyXG4gICAgICAgICAgdXBkYXRlXHJcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7Y29udGFpbmVyUmVjdC53aWR0aCAvIDJ9LCR7dGhpcy5ub2RlUGFyc2VyLmhlaWdodH0pIHNjYWxlKCR7dGhpcy5jdXJyZW50Wm9vbX0pYClcclxuICAgICAgKVxyXG5cclxuICAgIC8vIGRlZnNcclxuICAgIG1lLmRlZnMgPSBtZS5zdmcuc2VsZWN0QWxsKCdkZWZzLmdsb2JhbERlZnMnKVxyXG4gICAgICAuZGF0YShbeyBpZDogJ2RlZnMnIH1dLCAoZDogeyBpZDogc3RyaW5nIH0pID0+IGQuaWQpXHJcbiAgICAgIC5qb2luKFxyXG4gICAgICAgIGVudGVyID0+IHtcclxuICAgICAgICAgIGNvbnN0IGRlZnMgPSBlbnRlci5hcHBlbmQoJ2RlZnMnKS5hdHRyKCdjbGFzcycsICdnbG9iYWxEZWZzJyk7XHJcbiAgICAgICAgICBkZWZzLmFwcGVuZCgncGF0dGVybicpXHJcbiAgICAgICAgICAgIC5hdHRyKCdpZCcsIGBpbWctZXhwYW5kYClcclxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgMSkuYXR0cignaGVpZ2h0JywgMSlcclxuICAgICAgICAgICAgLmFwcGVuZCgnaW1hZ2UnKVxyXG4gICAgICAgICAgICAuYXR0cihcInhsaW5rOmhyZWZcIiwgXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsXCIgKyBtZS5ub2RlUGFyc2VyLmV4cGFuZEJhc2U2NEljb24pXHJcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIDMwKVxyXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgMzApXHJcbiAgICAgICAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaWRZTWluIHNsaWNlJyk7XHJcbiAgICAgICAgICBkZWZzLmFwcGVuZCgncGF0dGVybicpXHJcbiAgICAgICAgICAgIC5hdHRyKCdpZCcsIGBpbWctY29sbGFwc2VgKVxyXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCAxKS5hdHRyKCdoZWlnaHQnLCAxKVxyXG4gICAgICAgICAgICAuYXBwZW5kKCdpbWFnZScpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieGxpbms6aHJlZlwiLCBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxcIiArIG1lLm5vZGVQYXJzZXIuY29sbGFwc2VCYXNlNjRJY29uKVxyXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCAzMClcclxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIDMwKVxyXG4gICAgICAgICAgICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWlkWU1pbiBzbGljZScpO1xyXG4gICAgICAgICAgLy8gZGVmcy5hcHBlbmQoJ3BhdHRlcm4nKVxyXG4gICAgICAgICAgLy8gICAuYXR0cignaWQnLCBgaW1nLWVycm9yYClcclxuICAgICAgICAgIC8vICAgLmF0dHIoJ3dpZHRoJywgMSkuYXR0cignaGVpZ2h0JywgMSlcclxuICAgICAgICAgIC8vICAgLmFwcGVuZCgnaW1hZ2UnKVxyXG4gICAgICAgICAgLy8gICAuYXR0cihcInhsaW5rOmhyZWZcIiwgXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsXCIgKyBtZS5ub2RlUGFyc2VyLmVycm9yQmFzZTY0SWNvbilcclxuICAgICAgICAgIC8vICAgLmF0dHIoJ3dpZHRoJywgbWUubm9kZVBhcnNlci5pbWFnZURlZnMudyApXHJcbiAgICAgICAgICAvLyAgIC5hdHRyKCdoZWlnaHQnLCBtZS5ub2RlUGFyc2VyLmltYWdlRGVmcy5oKVxyXG4gICAgICAgICAgLy8gICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWlkWU1pbiBzbGljZScpOyAgICAgICAgICAgIFxyXG4gICAgICAgICAgcmV0dXJuIGRlZnNcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVwZGF0ZSA9PiB1cGRhdGVcclxuICAgICAgKVxyXG4gIH1cclxuXHJcbiAgLy8gcHJlcGFyaW5nIGRhdGFcclxuICBwcm90ZWN0ZWQgcHJlcGFyZURhdGEoKSB7XHJcbiAgICBjb25zdCBtZSA9IHRoaXM7XHJcblxyXG4gICAgLy8gaWYgbm8gZGF0YSByZXR1cm4gXHJcbiAgICBpZiAoIW1lLmRhdGEubGVuZ3RoKSByZXR1cm47XHJcblxyXG4gICAgLy8gQ29udmVydCBmbGF0IGRhdGEgdG8gaGllcmFyY2hpY2FsXHJcbiAgICBpZiAoIW1lLnJvb3QpIHtcclxuICAgICAgdHJ5IHsgLy8gcHJldmVudGluZyBtdWx0aXBsZSByb290XHJcbiAgICAgICAgbWUucm9vdCA9IGQzLnN0cmF0aWZ5PElEM05vZGU+KCkuaWQoKHsgbm9kZUlkIH0pID0+IG5vZGVJZCkucGFyZW50SWQoKHsgcGFyZW50Tm9kZUlkIH0pID0+IHBhcmVudE5vZGVJZClcclxuICAgICAgICAgIChtZS5kYXRhKSBhcyBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT47XHJcbiAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIG1lLnJvb3QgPSBkMy5zdHJhdGlmeTxJRDNOb2RlPigpLmlkKCh7IG5vZGVJZCB9KSA9PiBub2RlSWQpLnBhcmVudElkKCh7IHBhcmVudE5vZGVJZCB9KSA9PiBwYXJlbnROb2RlSWQpXHJcbiAgICAgICAgICAoW3tcclxuICAgICAgICAgICAgbm9kZUlkOiAncm9vdCcsXHJcbiAgICAgICAgICAgIHBhcmVudE5vZGVJZDogJycsXHJcbiAgICAgICAgICAgIHRpdGxlOiAnRXJyb3InLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogZXJyLm1lc3NhZ2UgfHwgZXJyLFxyXG4gICAgICAgICAgICBub2RlSW1hZ2U6IHtcclxuICAgICAgICAgICAgICBiYXNlNjQ6IG1lLm5vZGVQYXJzZXIuZXJyb3JCYXNlNjRJY29uXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1dKSBhcyBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT47XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBwcmVwYXJpbmcgdHJlZW1hcFxyXG4gICAgY29uc3QgY29udGFpbmVyUmVjdCA9IG1lLmNvbnRhaW5lci5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBtZS50cmVlbWFwID0gZDMudHJlZTxJRDNOb2RlPigpLnNpemUoW2NvbnRhaW5lclJlY3Qud2lkdGggfHwgMjUwLCBjb250YWluZXJSZWN0LmhlaWdodF0pXHJcbiAgICAgIC5ub2RlU2l6ZShbdGhpcy5ub2RlUGFyc2VyLndpZHRoICsgdGhpcy5ub2RlUGFyc2VyLndpZHRoIC8gMiwgdGhpcy5ub2RlUGFyc2VyLmhlaWdodCArIHRoaXMubm9kZVBhcnNlci5oZWlnaHQgLyAxLjJdKTtcclxuXHJcbiAgICBtZS5hbGxOb2RlcyA9IG1lLnRyZWVtYXAobWUucm9vdCkuZGVzY2VuZGFudHMoKTtcclxuICAgIG1lLmNoZWNrRXhwYW5kZWQobWUucm9vdCk7XHJcbiAgfVxyXG5cclxuICAvLyBzaG93aW5nIG5vZGVzXHJcbiAgcHJvdGVjdGVkIHNob3dOb2Rlcyhwck5vZGU6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPiA9IG51bGwpIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuXHJcbiAgICBpZiAoIXByTm9kZSkgcHJOb2RlID0gbWUucm9vdDtcclxuICAgIGNvbnN0IHVwZGF0ZVBvc2l0aW9uOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0gPSB7XHJcbiAgICAgIHg6IHByTm9kZS54LFxyXG4gICAgICB5OiBwck5vZGUueVxyXG4gICAgfVxyXG5cclxuICAgIC8vICBBc3NpZ25zIHRoZSB4IGFuZCB5IHBvc2l0aW9uIGZvciB0aGUgbm9kZXNcclxuICAgIGNvbnN0IHRyZWVEYXRhID0gbWUudHJlZW1hcChtZS5yb290KTtcclxuICAgIC8vIGl0IGlzIG5lY2VzYXJ5IGZvciBzY29wZSBcclxuICAgIGNvbnN0IGRyYXdOb2RlcyA9IChjb250YWluZXIpID0+IG1lLm5vZGVQYXJzZXIuZHJhd05vZGVzKGNvbnRhaW5lcik7XHJcbiAgICBjb25zdCBkcmF3Q29sbGFwc2VyID0gKG5vZGVHcm91cDogZDMuU2VsZWN0aW9uPFNWR0dFbGVtZW50LCBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4sIGFueSwgYW55PikgPT4ge1xyXG4gICAgICBub2RlR3JvdXAuYXBwZW5kKCdjaXJjbGUnKVxyXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdjb2xsYXBzZXInKVxyXG4gICAgICAgIC5hdHRyKCdjeCcsIG1lLm5vZGVQYXJzZXIud2lkdGggLyAyKVxyXG4gICAgICAgIC5hdHRyKCdjeScsIG1lLm5vZGVQYXJzZXIuaGVpZ2h0KVxyXG4gICAgICAgIC5hdHRyKCdyJywgMTUpXHJcbiAgICAgICAgLmF0dHIoJ3N0cm9rZScsICdibGFjaycpXHJcbiAgICAgICAgLmF0dHIoJ3N0cm9rZS13aWR0aCcsIDIpXHJcbiAgICAgICAgLm9uKCdjbGljaycsIChub2RlKSA9PiB7XHJcbiAgICAgICAgICBtZS5leHBhbmQobm9kZSwgdHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IG5vZGVzID0gdHJlZURhdGEuZGVzY2VuZGFudHMoKTtcclxuXHJcbiAgICAvLyByZW5kZXJpbmcgbm9kZXNcclxuXHJcbiAgICBjb25zdCBub2RlU3RhcnRQb3NpdGlvbiA9IChkOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4pID0+IHtcclxuICAgICAgaWYgKHByTm9kZSkge1xyXG4gICAgICAgIHJldHVybiBgdHJhbnNsYXRlKCR7dXBkYXRlUG9zaXRpb24ueCAtIChtZS5ub2RlUGFyc2VyLndpZHRoIC8gMil9LCR7dXBkYXRlUG9zaXRpb24ueX0pYFxyXG4gICAgICB9XHJcbiAgICAgIGlmICghZC5wYXJlbnQpIHJldHVybiBgdHJhbnNsYXRlKCR7ZC54IC0gKG1lLm5vZGVQYXJzZXIud2lkdGggLyAyKX0sJHtkLnl9KWA7XHJcbiAgICAgIHJldHVybiBgdHJhbnNsYXRlKCR7ZC5wYXJlbnQueCAtIChtZS5ub2RlUGFyc2VyLndpZHRoIC8gMil9LCR7ZC5wYXJlbnQueX0pYFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG5vZGVQb3NpdGlvbiA9IChwYXJhbXM6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSkgPT5cclxuICAgICAgYHRyYW5zbGF0ZSgke3BhcmFtcy54IC0gKG1lLm5vZGVQYXJzZXIud2lkdGggLyAyKX0sJHtwYXJhbXMueX0pYDtcclxuXHJcbiAgICBjb25zdCBleHBhbmRJY29uVmlzaWJsZSA9XHJcbiAgICAgIChkOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4gJiB7IF9jaGlsZHJlbj86IGFueSB9KSA9PiAoZC5jaGlsZHJlbiB8fCBkLl9jaGlsZHJlbikgPyAndmlzaWJsZScgOiAnaGlkZGVuJztcclxuICAgIGNvbnN0IGV4cGFuZEljb24gPVxyXG4gICAgICAoZDogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+ICYgeyBfY2hpbGRyZW4/OiBhbnkgfSkgPT4gZXhwYW5kSWNvblZpc2libGUoZCkgPT0gJ3Zpc2libGUnID8gKGQuZGF0YS5leHBhbmRlZCA/IGB1cmwoI2ltZy1jb2xsYXBzZSlgIDogYHVybCgjaW1nLWV4cGFuZClgKSA6ICcnO1xyXG5cclxuXHJcbiAgICBtZS5jZW50ZXJHLnNlbGVjdEFsbCgnZy5ub2RlJylcclxuICAgICAgLmRhdGEobm9kZXMsIChkOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4pID0+IGQuZGF0YS5ub2RlSWQpXHJcbiAgICAgIC5qb2luKFxyXG4gICAgICAgIGVudGVyID0+XHJcbiAgICAgICAgICBlbnRlci5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdub2RlJylcclxuICAgICAgICAgICAgLmF0dHIoJ2N1cnNvcicsICdwb2ludGVyJylcclxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIG5vZGVTdGFydFBvc2l0aW9uKVxyXG4gICAgICAgICAgICAuY2FsbChkcmF3Tm9kZXMpXHJcbiAgICAgICAgICAgIC5jYWxsKGRyYXdDb2xsYXBzZXIpXHJcbiAgICAgICAgICAgIC5vbignY2xpY2snLCAobm9kZSkgPT4ge1xyXG4gICAgICAgICAgICAgIG1lLm9uTm9kZUNsaWNrLm5leHQoeyBpZDogbm9kZS5kYXRhLm5vZGVJZCwgbm9kZTogbm9kZS5kYXRhIH0pO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICB1cGRhdGUgPT4gdXBkYXRlLFxyXG4gICAgICAgIGV4aXQgPT5cclxuICAgICAgICAgIGV4aXRcclxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAuZHVyYXRpb24obWUubm9kZVBhcnNlci50cmFuc2l0aW9uRHVyYXRpb24pXHJcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBub2RlUG9zaXRpb24ocHJOb2RlKSlcclxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKVxyXG4gICAgICAgICAgICAucmVtb3ZlKClcclxuICAgICAgKVxyXG4gICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG1lLm5vZGVQYXJzZXIudHJhbnNpdGlvbkR1cmF0aW9uKVxyXG4gICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDEpXHJcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBub2RlUG9zaXRpb24pXHJcbiAgICAgIC5zZWxlY3RBbGwoJ2NpcmNsZS5jb2xsYXBzZXInKVxyXG4gICAgICAuYXR0cigndmlzaWJpbGl0eScsIGV4cGFuZEljb25WaXNpYmxlKVxyXG4gICAgICAuYXR0cignZmlsbCcsIGV4cGFuZEljb24pXHJcblxyXG4gICAgLy8gcmVuZGVyaW5nIGxpbmtzXHJcbiAgICBjb25zdCBwYXRoU3RhcnRpbmdEaWFnb25hbCA9IChwYXJhbXM6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSkgPT4ge1xyXG4gICAgICBjb25zdCB0YXJnZXQgPSB7IHg6IHBhcmFtcy54LCB5OiBwYXJhbXMueSArIG1lLm5vZGVQYXJzZXIuaGVpZ2h0IH07XHJcbiAgICAgIHJldHVybiB0aGlzLmxpbmtQYXRoKHRhcmdldCwgdGFyZ2V0KVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHBhdGhEaWFnb25hbCA9IChkOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4pID0+IHtcclxuICAgICAgY29uc3QgdGFyZ2V0ID0geyB4OiBkLnBhcmVudC54LCB5OiBkLnBhcmVudC55ICsgbWUubm9kZVBhcnNlci5oZWlnaHQgfTtcclxuICAgICAgcmV0dXJuIHRoaXMubGlua1BhdGgoZCwgdGFyZ2V0KVxyXG4gICAgfVxyXG5cclxuICAgIG1lLmNlbnRlckcuc2VsZWN0QWxsKCdwYXRoLmxpbmsnKVxyXG4gICAgICAuZGF0YShub2Rlcy5zbGljZSgxKSwgKGQ6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPikgPT4gZC5kYXRhLm5vZGVJZClcclxuICAgICAgLmpvaW4oXHJcbiAgICAgICAgZW50ZXIgPT5cclxuICAgICAgICAgIGVudGVyXHJcbiAgICAgICAgICAgIC5pbnNlcnQoJ3BhdGgnLCAnZycpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsaW5rJylcclxuICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCAnbm9uZScpXHJcbiAgICAgICAgICAgIC5hdHRyKCdzdHJva2UnLCAnYmx1ZScpXHJcbiAgICAgICAgICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCAyKVxyXG4gICAgICAgICAgICAuYXR0cignZCcsIHBhdGhTdGFydGluZ0RpYWdvbmFsKHsgeDogdXBkYXRlUG9zaXRpb24ueCwgeTogdXBkYXRlUG9zaXRpb24ueSB9KSksXHJcbiAgICAgICAgdXBkYXRlID0+IHVwZGF0ZSxcclxuICAgICAgICBleGl0ID0+XHJcbiAgICAgICAgICBleGl0XHJcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24obWUubm9kZVBhcnNlci50cmFuc2l0aW9uRHVyYXRpb24pXHJcbiAgICAgICAgICAgIC5hdHRyKCdkJywgcGF0aFN0YXJ0aW5nRGlhZ29uYWwocHJOb2RlKSlcclxuICAgICAgICAgICAgLnJlbW92ZSgpXHJcbiAgICAgIClcclxuICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihtZS5ub2RlUGFyc2VyLnRyYW5zaXRpb25EdXJhdGlvbilcclxuICAgICAgLmF0dHIoJ2QnLCBwYXRoRGlhZ29uYWwpO1xyXG4gIH1cclxuXHJcbiAgLy8gWm9vbSBoYW5kbGVyIGZ1bmN0aW9uXHJcbiAgem9vbWVkKCkge1xyXG4gICAgY29uc3QgbWUgPSB0aGlzO1xyXG4gICAgLy8gU2F2aW5nIGQzIGV2ZW50J3MgdHJhbnNmb3JtIG9iamVjdFxyXG4gICAgbWUubGFzdFRyYW5zZm9ybSA9IGQzLmV2ZW50LnRyYW5zZm9ybTtcclxuICAgIC8vIFJlcG9zaXRpb24gYW5kIHJlc2NhbGUgY2hhcnQgYWNjb3JkaW5nbHlcclxuICAgIG1lLmNoYXJ0LmF0dHIoJ3RyYW5zZm9ybScsIG1lLmxhc3RUcmFuc2Zvcm0pO1xyXG4gIH1cclxuICAvLyNyZWdpb24gRXZlbnRzXHJcbiAgLy8gbm9kZSBjbGlja1xyXG4gIG9uTm9kZUNsaWNrOiBTdWJqZWN0PHsgaWQ6IHN0cmluZywgbm9kZTogSUQzTm9kZSB9PiA9IG5ldyBTdWJqZWN0KCk7XHJcbiAgcHJvdGVjdGVkIF9vbk5vZGVDbGljayhub2RlSWQ6IHN0cmluZywgbm9kZTogSUQzTm9kZSkge1xyXG4gICAgdGhpcy5vbk5vZGVDbGljay5uZXh0KHsgaWQ6IG5vZGVJZCwgbm9kZTogbm9kZSB9KTtcclxuICB9XHJcbiAgLy8jZW5kcmVnaW9uXHJcblxyXG4gIC8vZHJhd05vZGUocHJOb2RlOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4pIHtcclxuICAvLyAgY29uc3QgbWUgPSB0aGlzO1xyXG4gIC8vICBtZS5ub2RlUGFyc2VyLmRyYXcobWUuY2VudGVyRywgcHJOb2RlKTtcclxuICAvL31cclxuXHJcblxyXG4gIC8vIEdlbmVyYXRlIGN1c3RvbSBkaWFnb25hbCAtIHBsYXkgd2l0aCBpdCBoZXJlIC0gaHR0cHM6Ly9vYnNlcnZhYmxlaHEuY29tL0BidW1iZWlzaHZpbGkvY3VydmVkLWVkZ2VzP2NvbGxlY3Rpb249QGJ1bWJlaXNodmlsaS93b3JrLWNvbXBvbmVudHNcclxuICBsaW5rUGF0aChzb3VyY2U6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSwgdGFyZ2V0OiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0pIHtcclxuXHJcbiAgICAvLyBDYWxjdWxhdGUgc29tZSB2YXJpYWJsZXMgYmFzZWQgb24gc291cmNlIGFuZCB0YXJnZXQgKHMsdCkgY29vcmRpbmF0ZXNcclxuICAgIGNvbnN0IHggPSBzb3VyY2UueDtcclxuICAgIGNvbnN0IHkgPSBzb3VyY2UueTtcclxuICAgIGNvbnN0IGV4ID0gdGFyZ2V0Lng7XHJcbiAgICBjb25zdCBleSA9IHRhcmdldC55XHJcbiAgICAgIDtcclxuICAgIGxldCB4cnZzID0gZXggLSB4IDwgMCA/IC0xIDogMTtcclxuICAgIGxldCB5cnZzID0gZXkgLSB5IDwgMCA/IC0xIDogMTtcclxuICAgIGxldCByZGVmID0gMzU7XHJcbiAgICBsZXQgckluaXRpYWwgPSBNYXRoLmFicyhleCAtIHgpIC8gMiA8IHJkZWYgPyBNYXRoLmFicyhleCAtIHgpIC8gMiA6IHJkZWY7XHJcbiAgICBsZXQgciA9IE1hdGguYWJzKGV5IC0geSkgLyAyIDwgckluaXRpYWwgPyBNYXRoLmFicyhleSAtIHkpIC8gMiA6IHJJbml0aWFsO1xyXG4gICAgbGV0IGggPSBNYXRoLmFicyhleSAtIHkpIC8gMiAtIHI7XHJcbiAgICBsZXQgdyA9IE1hdGguYWJzKGV4IC0geCkgLSByICogMjtcclxuXHJcbiAgICAvLyBCdWlsZCB0aGUgcGF0aFxyXG4gICAgY29uc3QgcGF0aCA9IGBcclxuICAgICAgICAgICAgTSAke3h9ICR7eX1cclxuICAgICAgICAgICAgTCAke3h9ICR7eSArIGggKiB5cnZzfVxyXG4gICAgICAgICAgICBDICAke3h9ICR7eSArIGggKiB5cnZzICsgciAqIHlydnN9ICR7eH0gJHt5ICsgaCAqIHlydnMgKyByICogeXJ2c30gJHt4ICsgciAqIHhydnN9ICR7eSArIGggKiB5cnZzICsgciAqIHlydnN9XHJcbiAgICAgICAgICAgIEwgJHt4ICsgdyAqIHhydnMgKyByICogeHJ2c30gJHt5ICsgaCAqIHlydnMgKyByICogeXJ2c31cclxuICAgICAgICAgICAgQyAke2V4fSAgJHt5ICsgaCAqIHlydnMgKyByICogeXJ2c30gJHtleH0gICR7eSArIGggKiB5cnZzICsgciAqIHlydnN9ICR7ZXh9ICR7ZXkgLSBoICogeXJ2c31cclxuICAgICAgICAgICAgTCAke2V4fSAke2V5fVxyXG4gICAgICAgICAgYFxyXG4gICAgLy8gUmV0dXJuIHJlc3VsdFxyXG4gICAgcmV0dXJuIHBhdGg7XHJcbiAgfVxyXG5cclxuICBjaGVja0V4cGFuZGVkKG5vZGU6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPiAmIHsgX2NoaWxkcmVuPzogYW55IH0pIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuXHJcbiAgICAvLyBjaGVja2luZyBleHBhbmRlZFxyXG4gICAgaWYgKG5vZGUuZGF0YS5leHBhbmRlZCkge1xyXG4gICAgICBpZiAoIW5vZGUuY2hpbGRyZW4gJiYgbm9kZS5fY2hpbGRyZW4pIHtcclxuICAgICAgICBub2RlLmNoaWxkcmVuID0gbm9kZS5fY2hpbGRyZW47XHJcbiAgICAgICAgbm9kZS5fY2hpbGRyZW4gPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgeyAvLyBjb2xsYXBzZWRcclxuICAgICAgaWYgKG5vZGUuY2hpbGRyZW4pIHtcclxuICAgICAgICBub2RlLl9jaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XHJcbiAgICAgICAgbm9kZS5jaGlsZHJlbiA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIGNoZWNraW5nIGNoaWxkcmVuXHJcbiAgICAobm9kZS5jaGlsZHJlbiB8fCBub2RlLl9jaGlsZHJlbiB8fCBbXSkuZm9yRWFjaChjdXJyZW50ID0+IG1lLmNoZWNrRXhwYW5kZWQoY3VycmVudCkpXHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIGV4cGFuZChub2RlOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4gJiB7IF9jaGlsZHJlbj86IGFueSB9LCB0b2dnbGU6IGJvb2xlYW4gPSBmYWxzZSkgeyAvLywgIHJlbmRlcjogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICBjb25zdCBtZSA9IHRoaXM7XHJcblxyXG4gICAgLy8gaWYgdG9nZ2xlIC0gbGV0cyB0b2dnbGVcclxuICAgIGlmICh0b2dnbGUpIG5vZGUuZGF0YS5leHBhbmRlZCA9ICFub2RlLmRhdGEuZXhwYW5kZWQ7XHJcblxyXG4gICAgLy8gY2hlY2tpbmcgZXhwYW5kZWRcclxuICAgIGlmIChub2RlLmRhdGEuZXhwYW5kZWQpIHtcclxuICAgICAgaWYgKCFub2RlLmNoaWxkcmVuICYmIG5vZGUuX2NoaWxkcmVuKSB7XHJcbiAgICAgICAgbm9kZS5jaGlsZHJlbiA9IG5vZGUuX2NoaWxkcmVuO1xyXG4gICAgICAgIG5vZGUuX2NoaWxkcmVuID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHsgLy8gY29sbGFwc2VkXHJcbiAgICAgIGlmIChub2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgbm9kZS5fY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xyXG4gICAgICAgIG5vZGUuY2hpbGRyZW4gPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29uc3QgZXhwYW5kZWQgPSBub2RlLmRhdGEuZXhwYW5kZWQ7XHJcbiAgICAvLyBub2RlLmRhdGEuZXhwYW5kZWQgPSAhZXhwYW5kZWQ7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnRXhwYW5kaW5kOiAnLCBub2RlLmRhdGEubm9kZUlkKVxyXG5cclxuICAgIC8vIGNvbnN0IGV4cGFuZCA9IChjaGlsZHJlbjogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+W10sIGV4cGFuZGVkOiBib29sZWFuKSA9PiB7XHJcbiAgICAvLyAgIChjaGlsZHJlbiB8fCBbXSkuZm9yRWFjaChjdXJyZW50ID0+IHtcclxuICAgIC8vICAgICAgIGN1cnJlbnQuZGF0YS5oaWRkZW4gPSAhZXhwYW5kZWQ7XHJcbiAgICAvLyAgICAgICBleHBhbmQoY3VycmVudC5jaGlsZHJlbiwgZXhwYW5kZWQpOyBcclxuICAgIC8vICAgICB9KTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBleHBhbmQobm9kZS5jaGlsZHJlbiwgbm9kZS5kYXRhLmV4cGFuZGVkKTsgXHJcbiAgICBpZiAodG9nZ2xlKSBtZS5zaG93Tm9kZXMobm9kZSk7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuIl19