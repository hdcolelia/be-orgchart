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
            nodeGroup.each(function (d, i) {
                // adding collapse / expand button
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZDMtb3JnLWNoYXJ0LmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYmUtZDMtb3JnY2hhcnQvIiwic291cmNlcyI6WyJsaWIvY2xhc2Vzcy9kMy1vcmctY2hhcnQuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsVUFBVTtBQUNWLDJCQUEyQjtBQUMzQixxRUFBcUU7QUFDckUseURBQXlEO0FBQ3pELFlBQVk7QUFDWixPQUFPLEtBQUssRUFBRSxNQUFNLElBQUksQ0FBQztBQUV6QixPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMxQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sVUFBVSxDQUFDO0FBYzdDO0lBaURFLG9CQUFZLFdBQXdCLEVBQUUsU0FBOEI7UUFBcEUsaUJBeUJDOztRQXpFRCx5QkFBeUI7UUFDZixZQUFPLEdBQXVCO1lBQ3RDLGVBQWUsRUFBRSxTQUFTO1lBQzFCLFVBQVUsRUFBRSxJQUFJLGlCQUFpQixFQUFFO1lBQ25DLElBQUksRUFBRSxFQUFFO1lBQ1IsV0FBVyxFQUFFLFFBQVE7U0FDdEIsQ0FBQTtRQWlCUyxVQUFLLEdBQWMsRUFBRSxDQUFDO1FBb0JoQyxZQUFZO1FBRVosZ0JBQVcsR0FBVyxDQUFDLENBQUM7UUEwUnhCLGdCQUFnQjtRQUNoQixhQUFhO1FBQ2IsZ0JBQVcsR0FBMkMsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQXhSbEUsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBRWhCLGlCQUFpQjtRQUNqQixFQUFFLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFdEMsdUNBQXVDO1FBQ3ZDLFVBQUksU0FBUywwQ0FBRSxJQUFJO1lBQUUsRUFBRSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBRS9DLGlCQUFpQjtRQUNq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LFNBQVMsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7YUFDdkI7U0FDRjthQUFNLEVBQUUsWUFBWTtZQUNuQixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7YUFDdEI7U0FDRjtRQUVELHVDQUF1QztRQUN2QyxrQ0FBa0M7UUFDbEMsK0NBQStDO1FBRS9DLHNGQUFzRjtRQUN0RiwwQ0FBMEM7UUFDMUMseUNBQXlDO1FBQ3pDLDZDQUE2QztRQUM3QyxVQUFVO1FBQ1YsSUFBSTtRQUVKLDhDQUE4QztRQUM5QyxJQUFJLE1BQU07WUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFSCxpQkFBQztBQUFELENBQUMsQUEzYUQsSUEyYUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyNyZWdpb24gXHJcbi8vIERlc2Fycm9sbGFkbyBlbiBiYXNlIGE6IFxyXG4vLyAgaHR0cHM6Ly9ibC5vY2tzLm9yZy9idW1iZWlzaHZpbGkvMDlhMDNiODFhZTc4OGQyZDE0Zjc1MGFmZTU5ZWI3ZGVcclxuLy8gIGh0dHBzOi8vZ2l0aHViLmNvbS9idW1iZWlzaHZpbGkvZDMtb3JnYW5pemF0aW9uLWNoYXJ0XHJcbi8vI2VuZHJlZ2lvblxyXG5pbXBvcnQgKiBhcyBkMyBmcm9tICdkMyc7XHJcbmltcG9ydCB7IElEM05vZGUgfSBmcm9tICcuLi9pbnRlcmZhY2VzJztcclxuaW1wb3J0IHsgU3ViamVjdCwgZnJvbUV2ZW50IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGRlYm91bmNlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgRDNOb2RlQmFzaWNQYXJzZXIgfSBmcm9tICcuL0BpdGVtcyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElEM09yZ0NoYXJ0T3B0aW9ucyB7XHJcbiAgbm9kZVBhcnNlcj86IEQzTm9kZUJhc2ljUGFyc2VyO1xyXG4gIGRhdGE/OiBJRDNOb2RlW107XHJcbiAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xyXG4gIGRlZmF1bHRGb250Pzogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElTaXplIHtcclxuICB3aWR0aDogbnVtYmVyO1xyXG4gIGhlaWdodDogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRDNPcmdDaGFydCB7XHJcbiAgLy8jcmVnaW9uIERlZmF1bHQgT3B0aW9uc1xyXG4gIHByb3RlY3RlZCBvcHRpb25zOiBJRDNPcmdDaGFydE9wdGlvbnMgPSB7XHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjMDNBM0M1JyxcclxuICAgIG5vZGVQYXJzZXI6IG5ldyBEM05vZGVCYXNpY1BhcnNlcigpLFxyXG4gICAgZGF0YTogW10sXHJcbiAgICBkZWZhdWx0Rm9udDogJ1RhaG9tYSdcclxuICB9XHJcbiAgLy8jZW5kcmVnaW9uXHJcblxyXG4gIC8vI3JlZ2lvbiBTVkcgY29tcG9lbm50c1xyXG4gIHByb3RlY3RlZCBjb250YWluZXI6IGQzLlNlbGVjdGlvbjxIVE1MRWxlbWVudCwgYW55LCBhbnksIGFueT47XHJcbiAgcHJvdGVjdGVkIHN2ZzogZDMuU2VsZWN0aW9uPGQzLkJhc2VUeXBlLCB1bmtub3duLCBIVE1MRWxlbWVudCwgdW5rbm93bj47XHJcbiAgcHJvdGVjdGVkIGNoYXJ0OiBkMy5TZWxlY3Rpb248YW55LCBhbnksIGFueSwgYW55PjtcclxuICBwcm90ZWN0ZWQgY2VudGVyRzogZDMuU2VsZWN0aW9uPGFueSwgYW55LCBhbnksIGFueT47XHJcbiAgcHJvdGVjdGVkIGRlZnM6IGQzLlNlbGVjdGlvbjxhbnksIGFueSwgYW55LCBhbnk+O1xyXG5cclxuICBwcm90ZWN0ZWQgbGFzdFRyYW5zZm9ybTogYW55O1xyXG4gIC8vI2VuZHJlZ2lvblxyXG5cclxuICAvLyNyZWdpb24gREFUQVxyXG4gIHByb3RlY3RlZCByb290OiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT47XHJcbiAgcHJvdGVjdGVkIGFsbE5vZGVzOiBhbnk7XHJcblxyXG4gIHByb3RlY3RlZCBfZGF0YTogSUQzTm9kZVtdID0gW107XHJcbiAgZ2V0IGRhdGEoKTogSUQzTm9kZVtdIHtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhIHx8IFtdO1xyXG4gIH1cclxuXHJcbiAgc2V0IGRhdGEoZGF0YTogSUQzTm9kZVtdKSB7XHJcbiAgICB0aGlzLl9kYXRhID0gZGF0YTtcclxuICAgIC8vIHRoaXMucmVuZGVyKClcclxuICB9XHJcbiAgLy8jZW5kcmVnaW9uXHJcblxyXG4gIC8vI3JlZ2lvbiAgTk9ERSBQQVJTRVJcclxuICBwcm90ZWN0ZWQgX25vZGVQYXJzZXI6IEQzTm9kZUJhc2ljUGFyc2VyO1xyXG4gIGdldCBub2RlUGFyc2VyKCk6IEQzTm9kZUJhc2ljUGFyc2VyIHtcclxuICAgIHJldHVybiB0aGlzLl9ub2RlUGFyc2VyO1xyXG4gIH1cclxuICBzZXQgbm9kZVBhcnNlcihwYXJzZXI6IEQzTm9kZUJhc2ljUGFyc2VyKSB7XHJcbiAgICB0aGlzLl9ub2RlUGFyc2VyID0gcGFyc2VyO1xyXG4gICAgLy8gdGhpcy5yZW5kZXIoKTtcclxuICB9XHJcbiAgLy8jZW5kcmVnaW9uXHJcblxyXG4gIGN1cnJlbnRab29tOiBudW1iZXIgPSAxO1xyXG4gIHRyZWVtYXA6IGQzLlRyZWVMYXlvdXQ8SUQzTm9kZT47XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByQ29udGFpbmVyOiBIVE1MRWxlbWVudCwgcHJPcHRpb25zPzogSUQzT3JnQ2hhcnRPcHRpb25zKSB7XHJcbiAgICBjb25zdCBtZSA9IHRoaXM7XHJcblxyXG4gICAgLy8gaW5pdCBjb250YWluZXJcclxuICAgIG1lLmNvbnRhaW5lciA9IGQzLnNlbGVjdChwckNvbnRhaW5lcik7XHJcblxyXG4gICAgLy9JZiBEYXRhIGFyZ3VtZW50IHBhc3NlZCAtIHRoZW4gc2V0IGl0XHJcbiAgICBpZiAocHJPcHRpb25zPy5kYXRhKSBtZS5fZGF0YSA9IHByT3B0aW9ucy5kYXRhO1xyXG5cclxuICAgIC8vIHNldHRpbmcgcGFyc2VyXHJcbiAgICBtZS5fbm9kZVBhcnNlciA9IHByT3B0aW9ucz8ubm9kZVBhcnNlciB8fCBtZS5vcHRpb25zLm5vZGVQYXJzZXI7XHJcblxyXG4gICAgLy8gYXBwbHlpbmcgb3B0aW9uc1xyXG4gICAgbWUub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24obWUub3B0aW9ucywgcHJPcHRpb25zKTtcclxuXHJcbiAgICAvLyBtb25pdG9yIHJlc2l6ZVxyXG4gICAgZnJvbUV2ZW50KHdpbmRvdywgJ3Jlc2l6ZScpXHJcbiAgICAgIC5waXBlKFxyXG4gICAgICAgIGRlYm91bmNlVGltZSgzMDApXHJcbiAgICAgICkuc3Vic2NyaWJlKFxyXG4gICAgICAgICgpID0+IHtcclxuICAgICAgICAgIC8vIEhEQyAtIFZFUiB0aGlzLnByZXBhcmVDYW52YXMoKTtcclxuICAgICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICApXHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICBjb25zdCBtZSA9IHRoaXM7XHJcbiAgICAvLyBwcmVwYXJpbmcgc3ZnXHJcbiAgICBtZS5wcmVwYXJlQ2FudmFzKCk7XHJcblxyXG4gICAgLy8gaWYgbm8gZGF0YSB0aGVuIHJldHVyblxyXG4gICAgaWYgKCFtZS5kYXRhLmxlbmd0aCkgcmV0dXJuO1xyXG5cclxuICAgIC8vIHByZXBhcmluZyBkYXRhXHJcbiAgICBtZS5wcmVwYXJlRGF0YSgpO1xyXG5cclxuICAgIC8vIHNob3dpbmcgbm9kZXNcclxuICAgIG1lLnNob3dOb2RlcygpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvLyBwcmVwYXJpbmcgY2FudmFzXHJcbiAgcHJvdGVjdGVkIHByZXBhcmVDYW52YXMoKSB7XHJcbiAgICBjb25zdCBtZSA9IHRoaXM7XHJcblxyXG4gICAgLy9EcmF3aW5nIGNvbnRhaW5lcnNcclxuICAgIGNvbnN0IGNvbnRhaW5lclJlY3QgPSBtZS5jb250YWluZXIubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgbWUuc3ZnID0gbWUuY29udGFpbmVyLnNlbGVjdEFsbCgnc3ZnJylcclxuICAgICAgLmRhdGEoW3sgaWQ6ICdzdmcnIH1dLCAoZDogeyBpZDogc3RyaW5nIH0pID0+IGQuaWQpXHJcbiAgICAgIC5qb2luKFxyXG4gICAgICAgIGVudGVyID0+IGVudGVyXHJcbiAgICAgICAgICAuYXBwZW5kKCdzdmcnKVxyXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3N2Zy1jaGFydC1jb250YWluZXInKVxyXG4gICAgICAgICAgLmF0dHIoJ2ZvbnQtZmFtaWx5JywgbWUub3B0aW9ucy5kZWZhdWx0Rm9udClcclxuICAgICAgICAgIC5jYWxsKGQzLnpvb20oKS5vbihcInpvb21cIiwgZCA9PiB0aGlzLnpvb21lZCgpKSlcclxuICAgICAgICAgIC5hdHRyKCdjdXJzb3InLCAnbW92ZScpXHJcbiAgICAgICAgICAuc3R5bGUoJ2JhY2tncm91bmQtY29sb3InLCBtZS5vcHRpb25zLmJhY2tncm91bmRDb2xvciksXHJcbiAgICAgICAgdXBkYXRlID0+XHJcbiAgICAgICAgICB1cGRhdGVcclxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgY29udGFpbmVyUmVjdC53aWR0aClcclxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIGNvbnRhaW5lclJlY3QuaGVpZ2h0KVxyXG4gICAgICApO1xyXG4gICAgLy9BZGQgY29udGFpbmVyIGcgZWxlbWVudFxyXG4gICAgbWUuY2hhcnQgPSBtZS5zdmcuc2VsZWN0QWxsKCdnLmNoYXJ0JylcclxuICAgICAgLmRhdGEoW3sgaWQ6ICdjaGFydCcgfV0sIChkOiB7IGlkOiBzdHJpbmcgfSkgPT4gZC5pZClcclxuICAgICAgLmpvaW4oXHJcbiAgICAgICAgZW50ZXIgPT4gZW50ZXJcclxuICAgICAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2NoYXJ0JylcclxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsMClgKSxcclxuICAgICAgICB1cGRhdGUgPT4gdXBkYXRlXHJcbiAgICAgIClcclxuXHJcbiAgICAvLyBBZGQgb25lIG1vcmUgY29udGFpbmVyIGcgZWxlbWVudCwgZm9yIGJldHRlciBwb3NpdGlvbmluZyBjb250cm9sc1xyXG4gICAgbWUuY2VudGVyRyA9IG1lLmNoYXJ0LnNlbGVjdEFsbCgnZy5jZW50ZXItZ3JvdXAnKVxyXG4gICAgICAuZGF0YShbeyBpZDogJ2NlbnRlci1ncm91cCcgfV0sIChkOiB7IGlkOiBzdHJpbmcgfSkgPT4gZC5pZClcclxuICAgICAgLmpvaW4oXHJcbiAgICAgICAgZW50ZXIgPT4gZW50ZXIuYXBwZW5kKCdnJylcclxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdjZW50ZXItZ3JvdXAnKSxcclxuICAgICAgICB1cGRhdGUgPT5cclxuICAgICAgICAgIHVwZGF0ZVxyXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke2NvbnRhaW5lclJlY3Qud2lkdGggLyAyfSwke3RoaXMubm9kZVBhcnNlci5oZWlnaHR9KSBzY2FsZSgke3RoaXMuY3VycmVudFpvb219KWApXHJcbiAgICAgIClcclxuXHJcbiAgICAvLyBkZWZzXHJcbiAgICBtZS5kZWZzID0gbWUuc3ZnLnNlbGVjdEFsbCgnZGVmcy5nbG9iYWxEZWZzJylcclxuICAgICAgLmRhdGEoW3sgaWQ6ICdkZWZzJyB9XSwgKGQ6IHsgaWQ6IHN0cmluZyB9KSA9PiBkLmlkKVxyXG4gICAgICAuam9pbihcclxuICAgICAgICBlbnRlciA9PiB7XHJcbiAgICAgICAgICBjb25zdCBkZWZzID0gZW50ZXIuYXBwZW5kKCdkZWZzJykuYXR0cignY2xhc3MnLCAnZ2xvYmFsRGVmcycpO1xyXG4gICAgICAgICAgZGVmcy5hcHBlbmQoJ3BhdHRlcm4nKVxyXG4gICAgICAgICAgICAuYXR0cignaWQnLCBgaW1nLWV4cGFuZGApXHJcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIDEpLmF0dHIoJ2hlaWdodCcsIDEpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2ltYWdlJylcclxuICAgICAgICAgICAgLmF0dHIoXCJ4bGluazpocmVmXCIsIFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LFwiICsgbWUubm9kZVBhcnNlci5leHBhbmRCYXNlNjRJY29uKVxyXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCAzMClcclxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIDMwKVxyXG4gICAgICAgICAgICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWlkWU1pbiBzbGljZScpO1xyXG4gICAgICAgICAgZGVmcy5hcHBlbmQoJ3BhdHRlcm4nKVxyXG4gICAgICAgICAgICAuYXR0cignaWQnLCBgaW1nLWNvbGxhcHNlYClcclxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgMSkuYXR0cignaGVpZ2h0JywgMSlcclxuICAgICAgICAgICAgLmFwcGVuZCgnaW1hZ2UnKVxyXG4gICAgICAgICAgICAuYXR0cihcInhsaW5rOmhyZWZcIiwgXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsXCIgKyBtZS5ub2RlUGFyc2VyLmNvbGxhcHNlQmFzZTY0SWNvbilcclxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgMzApXHJcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAzMClcclxuICAgICAgICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaW4gc2xpY2UnKTtcclxuICAgICAgICAgIC8vIGRlZnMuYXBwZW5kKCdwYXR0ZXJuJylcclxuICAgICAgICAgIC8vICAgLmF0dHIoJ2lkJywgYGltZy1lcnJvcmApXHJcbiAgICAgICAgICAvLyAgIC5hdHRyKCd3aWR0aCcsIDEpLmF0dHIoJ2hlaWdodCcsIDEpXHJcbiAgICAgICAgICAvLyAgIC5hcHBlbmQoJ2ltYWdlJylcclxuICAgICAgICAgIC8vICAgLmF0dHIoXCJ4bGluazpocmVmXCIsIFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LFwiICsgbWUubm9kZVBhcnNlci5lcnJvckJhc2U2NEljb24pXHJcbiAgICAgICAgICAvLyAgIC5hdHRyKCd3aWR0aCcsIG1lLm5vZGVQYXJzZXIuaW1hZ2VEZWZzLncgKVxyXG4gICAgICAgICAgLy8gICAuYXR0cignaGVpZ2h0JywgbWUubm9kZVBhcnNlci5pbWFnZURlZnMuaClcclxuICAgICAgICAgIC8vICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaW4gc2xpY2UnKTsgICAgICAgICAgICBcclxuICAgICAgICAgIHJldHVybiBkZWZzXHJcbiAgICAgICAgfSxcclxuICAgICAgICB1cGRhdGUgPT4gdXBkYXRlXHJcbiAgICAgIClcclxuICB9XHJcblxyXG4gIC8vIHByZXBhcmluZyBkYXRhXHJcbiAgcHJvdGVjdGVkIHByZXBhcmVEYXRhKCkge1xyXG4gICAgY29uc3QgbWUgPSB0aGlzO1xyXG5cclxuICAgIC8vIGlmIG5vIGRhdGEgcmV0dXJuIFxyXG4gICAgaWYgKCFtZS5kYXRhLmxlbmd0aCkgcmV0dXJuO1xyXG5cclxuICAgIC8vIENvbnZlcnQgZmxhdCBkYXRhIHRvIGhpZXJhcmNoaWNhbFxyXG4gICAgaWYgKCFtZS5yb290KSB7XHJcbiAgICAgIHRyeSB7IC8vIHByZXZlbnRpbmcgbXVsdGlwbGUgcm9vdFxyXG4gICAgICAgIG1lLnJvb3QgPSBkMy5zdHJhdGlmeTxJRDNOb2RlPigpLmlkKCh7IG5vZGVJZCB9KSA9PiBub2RlSWQpLnBhcmVudElkKCh7IHBhcmVudE5vZGVJZCB9KSA9PiBwYXJlbnROb2RlSWQpXHJcbiAgICAgICAgKG1lLmRhdGEpIGFzIGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPjtcclxuICAgICAgfSBjYXRjaCggZXJyICkge1xyXG4gICAgICAgIG1lLnJvb3QgPSBkMy5zdHJhdGlmeTxJRDNOb2RlPigpLmlkKCh7IG5vZGVJZCB9KSA9PiBub2RlSWQpLnBhcmVudElkKCh7IHBhcmVudE5vZGVJZCB9KSA9PiBwYXJlbnROb2RlSWQpXHJcbiAgICAgICAgKFt7IFxyXG4gICAgICAgICAgbm9kZUlkOiAncm9vdCcsIFxyXG4gICAgICAgICAgcGFyZW50Tm9kZUlkOiAnJywgXHJcbiAgICAgICAgICB0aXRsZTogJ0Vycm9yJywgXHJcbiAgICAgICAgICBkZXNjcmlwdGlvbjogZXJyLm1lc3NhZ2UgfHwgZXJyLFxyXG4gICAgICAgICAgbm9kZUltYWdlOiB7XHJcbiAgICAgICAgICAgIGJhc2U2NDogbWUubm9kZVBhcnNlci5lcnJvckJhc2U2NEljb25cclxuICAgICAgICAgIH0gIFxyXG4gICAgICAgIH1dKSBhcyBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT47XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBwcmVwYXJpbmcgdHJlZW1hcFxyXG4gICAgY29uc3QgY29udGFpbmVyUmVjdCA9IG1lLmNvbnRhaW5lci5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBtZS50cmVlbWFwID0gZDMudHJlZTxJRDNOb2RlPigpLnNpemUoW2NvbnRhaW5lclJlY3Qud2lkdGggfHwgMjUwLCBjb250YWluZXJSZWN0LmhlaWdodF0pXHJcbiAgICAgIC5ub2RlU2l6ZShbdGhpcy5ub2RlUGFyc2VyLndpZHRoICsgdGhpcy5ub2RlUGFyc2VyLndpZHRoIC8gMiwgdGhpcy5ub2RlUGFyc2VyLmhlaWdodCArIHRoaXMubm9kZVBhcnNlci5oZWlnaHQgLyAxLjJdKTtcclxuXHJcbiAgICBtZS5hbGxOb2RlcyA9IG1lLnRyZWVtYXAobWUucm9vdCkuZGVzY2VuZGFudHMoKTtcclxuICAgIG1lLmNoZWNrRXhwYW5kZWQobWUucm9vdCk7XHJcbiAgfVxyXG5cclxuICAvLyBzaG93aW5nIG5vZGVzXHJcbiAgcHJvdGVjdGVkIHNob3dOb2Rlcyhwck5vZGU6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPiA9IG51bGwpIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuXHJcbiAgICBpZiAoIXByTm9kZSkgcHJOb2RlID0gbWUucm9vdDtcclxuICAgIGNvbnN0IHVwZGF0ZVBvc2l0aW9uOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0gPSB7XHJcbiAgICAgIHg6IHByTm9kZS54LFxyXG4gICAgICB5OiBwck5vZGUueVxyXG4gICAgfVxyXG5cclxuICAgIC8vICBBc3NpZ25zIHRoZSB4IGFuZCB5IHBvc2l0aW9uIGZvciB0aGUgbm9kZXNcclxuICAgIGNvbnN0IHRyZWVEYXRhID0gbWUudHJlZW1hcChtZS5yb290KTtcclxuICAgIC8vIGl0IGlzIG5lY2VzYXJ5IGZvciBzY29wZSBcclxuICAgIGNvbnN0IGRyYXdOb2RlcyA9IChjb250YWluZXIpID0+IG1lLm5vZGVQYXJzZXIuZHJhd05vZGVzKGNvbnRhaW5lcik7XHJcbiAgICBjb25zdCBkcmF3Q29sbGFwc2VyID0gKG5vZGVHcm91cDogZDMuU2VsZWN0aW9uPFNWR0dFbGVtZW50LCBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4sIGFueSwgYW55PikgPT4ge1xyXG4gICAgICBub2RlR3JvdXAuZWFjaCgoZCwgaSkgPT4ge1xyXG4gICAgICAgIC8vIGFkZGluZyBjb2xsYXBzZSAvIGV4cGFuZCBidXR0b25cclxuICAgICAgICBub2RlR3JvdXAuYXBwZW5kKCdjaXJjbGUnKVxyXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2NvbGxhcHNlcicpXHJcbiAgICAgICAgICAuYXR0cignY3gnLCBtZS5ub2RlUGFyc2VyLndpZHRoIC8gMilcclxuICAgICAgICAgIC5hdHRyKCdjeScsIG1lLm5vZGVQYXJzZXIuaGVpZ2h0KVxyXG4gICAgICAgICAgLmF0dHIoJ3InLCAxNSlcclxuICAgICAgICAgIC5hdHRyKCdzdHJva2UnLCAnYmxhY2snKVxyXG4gICAgICAgICAgLmF0dHIoJ3N0cm9rZS13aWR0aCcsIDIpXHJcbiAgICAgICAgICAub24oJ2NsaWNrJywgKG5vZGUpID0+IHtcclxuICAgICAgICAgICAgbWUuZXhwYW5kKG5vZGUsIHRydWUpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBub2RlcyA9IHRyZWVEYXRhLmRlc2NlbmRhbnRzKCk7XHJcblxyXG4gICAgLy8gcmVuZGVyaW5nIG5vZGVzXHJcblxyXG4gICAgY29uc3Qgbm9kZVN0YXJ0UG9zaXRpb24gPSAoZDogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+KSA9PiB7XHJcbiAgICAgIGlmIChwck5vZGUpIHtcclxuICAgICAgICByZXR1cm4gYHRyYW5zbGF0ZSgke3VwZGF0ZVBvc2l0aW9uLnggLSAobWUubm9kZVBhcnNlci53aWR0aCAvIDIpfSwke3VwZGF0ZVBvc2l0aW9uLnl9KWBcclxuICAgICAgfVxyXG4gICAgICBpZiAoIWQucGFyZW50KSByZXR1cm4gYHRyYW5zbGF0ZSgke2QueCAtIChtZS5ub2RlUGFyc2VyLndpZHRoIC8gMil9LCR7ZC55fSlgO1xyXG4gICAgICByZXR1cm4gYHRyYW5zbGF0ZSgke2QucGFyZW50LnggLSAobWUubm9kZVBhcnNlci53aWR0aCAvIDIpfSwke2QucGFyZW50Lnl9KWBcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBub2RlUG9zaXRpb24gPSAocGFyYW1zOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0pID0+XHJcbiAgICAgIGB0cmFuc2xhdGUoJHtwYXJhbXMueCAtIChtZS5ub2RlUGFyc2VyLndpZHRoIC8gMil9LCR7cGFyYW1zLnl9KWA7XHJcblxyXG4gICAgY29uc3QgZXhwYW5kSWNvblZpc2libGUgPVxyXG4gICAgICAoZDogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+ICYgeyBfY2hpbGRyZW4/OiBhbnkgfSkgPT4gKGQuY2hpbGRyZW4gfHwgZC5fY2hpbGRyZW4pID8gJ3Zpc2libGUnIDogJ2hpZGRlbic7XHJcbiAgICBjb25zdCBleHBhbmRJY29uID1cclxuICAgICAgKGQ6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPiAmIHsgX2NoaWxkcmVuPzogYW55IH0pID0+IGV4cGFuZEljb25WaXNpYmxlKGQpID09ICd2aXNpYmxlJyA/IChkLmRhdGEuZXhwYW5kZWQgPyBgdXJsKCNpbWctY29sbGFwc2UpYCA6IGB1cmwoI2ltZy1leHBhbmQpYCkgOiAnJztcclxuXHJcblxyXG4gICAgbWUuY2VudGVyRy5zZWxlY3RBbGwoJ2cubm9kZScpXHJcbiAgICAgIC5kYXRhKG5vZGVzLCAoZDogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+KSA9PiBkLmRhdGEubm9kZUlkKVxyXG4gICAgICAuam9pbihcclxuICAgICAgICBlbnRlciA9PlxyXG4gICAgICAgICAgZW50ZXIuYXBwZW5kKCdnJylcclxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbm9kZScpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjdXJzb3InLCAncG9pbnRlcicpXHJcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBub2RlU3RhcnRQb3NpdGlvbilcclxuICAgICAgICAgICAgLmNhbGwoZHJhd05vZGVzKVxyXG4gICAgICAgICAgICAuY2FsbChkcmF3Q29sbGFwc2VyKVxyXG4gICAgICAgICAgICAub24oJ2NsaWNrJywgKG5vZGUpID0+IHtcclxuICAgICAgICAgICAgICBtZS5vbk5vZGVDbGljay5uZXh0KHsgaWQ6IG5vZGUuZGF0YS5ub2RlSWQsIG5vZGU6IG5vZGUuZGF0YSB9KTtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgdXBkYXRlID0+IHVwZGF0ZSxcclxuICAgICAgICBleGl0ID0+XHJcbiAgICAgICAgICBleGl0XHJcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgLmR1cmF0aW9uKG1lLm5vZGVQYXJzZXIudHJhbnNpdGlvbkR1cmF0aW9uKVxyXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgbm9kZVBvc2l0aW9uKHByTm9kZSkpXHJcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMClcclxuICAgICAgICAgICAgLnJlbW92ZSgpXHJcbiAgICAgIClcclxuICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihtZS5ub2RlUGFyc2VyLnRyYW5zaXRpb25EdXJhdGlvbilcclxuICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAxKVxyXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgbm9kZVBvc2l0aW9uKVxyXG4gICAgICAuc2VsZWN0QWxsKCdjaXJjbGUuY29sbGFwc2VyJylcclxuICAgICAgLmF0dHIoJ3Zpc2liaWxpdHknLCBleHBhbmRJY29uVmlzaWJsZSlcclxuICAgICAgLmF0dHIoJ2ZpbGwnLCBleHBhbmRJY29uKVxyXG5cclxuICAgIC8vIHJlbmRlcmluZyBsaW5rc1xyXG4gICAgY29uc3QgcGF0aFN0YXJ0aW5nRGlhZ29uYWwgPSAocGFyYW1zOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0pID0+IHtcclxuICAgICAgY29uc3QgdGFyZ2V0ID0geyB4OiBwYXJhbXMueCwgeTogcGFyYW1zLnkgKyBtZS5ub2RlUGFyc2VyLmhlaWdodCB9O1xyXG4gICAgICByZXR1cm4gdGhpcy5saW5rUGF0aCh0YXJnZXQsIHRhcmdldClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwYXRoRGlhZ29uYWwgPSAoZDogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+KSA9PiB7XHJcbiAgICAgIGNvbnN0IHRhcmdldCA9IHsgeDogZC5wYXJlbnQueCwgeTogZC5wYXJlbnQueSArIG1lLm5vZGVQYXJzZXIuaGVpZ2h0IH07XHJcbiAgICAgIHJldHVybiB0aGlzLmxpbmtQYXRoKGQsIHRhcmdldClcclxuICAgIH1cclxuXHJcbiAgICBtZS5jZW50ZXJHLnNlbGVjdEFsbCgncGF0aC5saW5rJylcclxuICAgICAgLmRhdGEobm9kZXMuc2xpY2UoMSksIChkOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4pID0+IGQuZGF0YS5ub2RlSWQpXHJcbiAgICAgIC5qb2luKFxyXG4gICAgICAgIGVudGVyID0+XHJcbiAgICAgICAgICBlbnRlclxyXG4gICAgICAgICAgICAuaW5zZXJ0KCdwYXRoJywgJ2cnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGluaycpXHJcbiAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgJ25vbmUnKVxyXG4gICAgICAgICAgICAuYXR0cignc3Ryb2tlJywgJ2JsdWUnKVxyXG4gICAgICAgICAgICAuYXR0cignc3Ryb2tlLXdpZHRoJywgMilcclxuICAgICAgICAgICAgLmF0dHIoJ2QnLCBwYXRoU3RhcnRpbmdEaWFnb25hbCh7IHg6IHVwZGF0ZVBvc2l0aW9uLngsIHk6IHVwZGF0ZVBvc2l0aW9uLnkgfSkpLFxyXG4gICAgICAgIHVwZGF0ZSA9PiB1cGRhdGUsXHJcbiAgICAgICAgZXhpdCA9PlxyXG4gICAgICAgICAgZXhpdFxyXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG1lLm5vZGVQYXJzZXIudHJhbnNpdGlvbkR1cmF0aW9uKVxyXG4gICAgICAgICAgICAuYXR0cignZCcsIHBhdGhTdGFydGluZ0RpYWdvbmFsKHByTm9kZSkpXHJcbiAgICAgICAgICAgIC5yZW1vdmUoKVxyXG4gICAgICApXHJcbiAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24obWUubm9kZVBhcnNlci50cmFuc2l0aW9uRHVyYXRpb24pXHJcbiAgICAgIC5hdHRyKCdkJywgcGF0aERpYWdvbmFsKTtcclxuICB9XHJcblxyXG4gIC8vIFpvb20gaGFuZGxlciBmdW5jdGlvblxyXG4gIHpvb21lZCgpIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuICAgIC8vIFNhdmluZyBkMyBldmVudCdzIHRyYW5zZm9ybSBvYmplY3RcclxuICAgIG1lLmxhc3RUcmFuc2Zvcm0gPSBkMy5ldmVudC50cmFuc2Zvcm07XHJcbiAgICAvLyBSZXBvc2l0aW9uIGFuZCByZXNjYWxlIGNoYXJ0IGFjY29yZGluZ2x5XHJcbiAgICBtZS5jaGFydC5hdHRyKCd0cmFuc2Zvcm0nLCBtZS5sYXN0VHJhbnNmb3JtKTtcclxuICB9XHJcbiAgLy8jcmVnaW9uIEV2ZW50c1xyXG4gIC8vIG5vZGUgY2xpY2tcclxuICBvbk5vZGVDbGljazogU3ViamVjdDx7IGlkOiBzdHJpbmcsIG5vZGU6IElEM05vZGUgfT4gPSBuZXcgU3ViamVjdCgpO1xyXG4gIHByb3RlY3RlZCBfb25Ob2RlQ2xpY2sobm9kZUlkOiBzdHJpbmcsIG5vZGU6IElEM05vZGUpIHtcclxuICAgIHRoaXMub25Ob2RlQ2xpY2submV4dCh7IGlkOiBub2RlSWQsIG5vZGU6IG5vZGUgfSk7XHJcbiAgfVxyXG4gIC8vI2VuZHJlZ2lvblxyXG5cclxuICAvL2RyYXdOb2RlKHByTm9kZTogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+KSB7XHJcbiAgLy8gIGNvbnN0IG1lID0gdGhpcztcclxuICAvLyAgbWUubm9kZVBhcnNlci5kcmF3KG1lLmNlbnRlckcsIHByTm9kZSk7XHJcbiAgLy99XHJcblxyXG5cclxuICAvLyBHZW5lcmF0ZSBjdXN0b20gZGlhZ29uYWwgLSBwbGF5IHdpdGggaXQgaGVyZSAtIGh0dHBzOi8vb2JzZXJ2YWJsZWhxLmNvbS9AYnVtYmVpc2h2aWxpL2N1cnZlZC1lZGdlcz9jb2xsZWN0aW9uPUBidW1iZWlzaHZpbGkvd29yay1jb21wb25lbnRzXHJcbiAgbGlua1BhdGgoc291cmNlOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0sIHRhcmdldDogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9KSB7XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIHNvbWUgdmFyaWFibGVzIGJhc2VkIG9uIHNvdXJjZSBhbmQgdGFyZ2V0IChzLHQpIGNvb3JkaW5hdGVzXHJcbiAgICBjb25zdCB4ID0gc291cmNlLng7XHJcbiAgICBjb25zdCB5ID0gc291cmNlLnk7XHJcbiAgICBjb25zdCBleCA9IHRhcmdldC54O1xyXG4gICAgY29uc3QgZXkgPSB0YXJnZXQueVxyXG4gICAgICA7XHJcbiAgICBsZXQgeHJ2cyA9IGV4IC0geCA8IDAgPyAtMSA6IDE7XHJcbiAgICBsZXQgeXJ2cyA9IGV5IC0geSA8IDAgPyAtMSA6IDE7XHJcbiAgICBsZXQgcmRlZiA9IDM1O1xyXG4gICAgbGV0IHJJbml0aWFsID0gTWF0aC5hYnMoZXggLSB4KSAvIDIgPCByZGVmID8gTWF0aC5hYnMoZXggLSB4KSAvIDIgOiByZGVmO1xyXG4gICAgbGV0IHIgPSBNYXRoLmFicyhleSAtIHkpIC8gMiA8IHJJbml0aWFsID8gTWF0aC5hYnMoZXkgLSB5KSAvIDIgOiBySW5pdGlhbDtcclxuICAgIGxldCBoID0gTWF0aC5hYnMoZXkgLSB5KSAvIDIgLSByO1xyXG4gICAgbGV0IHcgPSBNYXRoLmFicyhleCAtIHgpIC0gciAqIDI7XHJcblxyXG4gICAgLy8gQnVpbGQgdGhlIHBhdGhcclxuICAgIGNvbnN0IHBhdGggPSBgXHJcbiAgICAgICAgICAgIE0gJHt4fSAke3l9XHJcbiAgICAgICAgICAgIEwgJHt4fSAke3kgKyBoICogeXJ2c31cclxuICAgICAgICAgICAgQyAgJHt4fSAke3kgKyBoICogeXJ2cyArIHIgKiB5cnZzfSAke3h9ICR7eSArIGggKiB5cnZzICsgciAqIHlydnN9ICR7eCArIHIgKiB4cnZzfSAke3kgKyBoICogeXJ2cyArIHIgKiB5cnZzfVxyXG4gICAgICAgICAgICBMICR7eCArIHcgKiB4cnZzICsgciAqIHhydnN9ICR7eSArIGggKiB5cnZzICsgciAqIHlydnN9XHJcbiAgICAgICAgICAgIEMgJHtleH0gICR7eSArIGggKiB5cnZzICsgciAqIHlydnN9ICR7ZXh9ICAke3kgKyBoICogeXJ2cyArIHIgKiB5cnZzfSAke2V4fSAke2V5IC0gaCAqIHlydnN9XHJcbiAgICAgICAgICAgIEwgJHtleH0gJHtleX1cclxuICAgICAgICAgIGBcclxuICAgIC8vIFJldHVybiByZXN1bHRcclxuICAgIHJldHVybiBwYXRoO1xyXG4gIH1cclxuXHJcbiAgY2hlY2tFeHBhbmRlZChub2RlOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4gJiB7IF9jaGlsZHJlbj86IGFueSB9KSB7XHJcbiAgICBjb25zdCBtZSA9IHRoaXM7XHJcblxyXG4gICAgLy8gY2hlY2tpbmcgZXhwYW5kZWRcclxuICAgIGlmIChub2RlLmRhdGEuZXhwYW5kZWQpIHtcclxuICAgICAgaWYgKCFub2RlLmNoaWxkcmVuICYmIG5vZGUuX2NoaWxkcmVuKSB7XHJcbiAgICAgICAgbm9kZS5jaGlsZHJlbiA9IG5vZGUuX2NoaWxkcmVuO1xyXG4gICAgICAgIG5vZGUuX2NoaWxkcmVuID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHsgLy8gY29sbGFwc2VkXHJcbiAgICAgIGlmIChub2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgbm9kZS5fY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xyXG4gICAgICAgIG5vZGUuY2hpbGRyZW4gPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBjaGVja2luZyBjaGlsZHJlblxyXG4gICAgKG5vZGUuY2hpbGRyZW4gfHwgbm9kZS5fY2hpbGRyZW4gfHwgW10pLmZvckVhY2goY3VycmVudCA9PiBtZS5jaGVja0V4cGFuZGVkKGN1cnJlbnQpKVxyXG4gIH1cclxuXHJcblxyXG5cclxuICBleHBhbmQobm9kZTogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+ICYgeyBfY2hpbGRyZW4/OiBhbnkgfSwgdG9nZ2xlOiBib29sZWFuID0gZmFsc2UpIHsgLy8sICByZW5kZXI6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgY29uc3QgbWUgPSB0aGlzO1xyXG5cclxuICAgIC8vIGlmIHRvZ2dsZSAtIGxldHMgdG9nZ2xlXHJcbiAgICBpZiAodG9nZ2xlKSBub2RlLmRhdGEuZXhwYW5kZWQgPSAhbm9kZS5kYXRhLmV4cGFuZGVkO1xyXG5cclxuICAgIC8vIGNoZWNraW5nIGV4cGFuZGVkXHJcbiAgICBpZiAobm9kZS5kYXRhLmV4cGFuZGVkKSB7XHJcbiAgICAgIGlmICghbm9kZS5jaGlsZHJlbiAmJiBub2RlLl9jaGlsZHJlbikge1xyXG4gICAgICAgIG5vZGUuY2hpbGRyZW4gPSBub2RlLl9jaGlsZHJlbjtcclxuICAgICAgICBub2RlLl9jaGlsZHJlbiA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7IC8vIGNvbGxhcHNlZFxyXG4gICAgICBpZiAobm9kZS5jaGlsZHJlbikge1xyXG4gICAgICAgIG5vZGUuX2NoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcclxuICAgICAgICBub2RlLmNoaWxkcmVuID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvbnN0IGV4cGFuZGVkID0gbm9kZS5kYXRhLmV4cGFuZGVkO1xyXG4gICAgLy8gbm9kZS5kYXRhLmV4cGFuZGVkID0gIWV4cGFuZGVkO1xyXG4gICAgLy8gY29uc29sZS5sb2coJ0V4cGFuZGluZDogJywgbm9kZS5kYXRhLm5vZGVJZClcclxuXHJcbiAgICAvLyBjb25zdCBleHBhbmQgPSAoY2hpbGRyZW46IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPltdLCBleHBhbmRlZDogYm9vbGVhbikgPT4ge1xyXG4gICAgLy8gICAoY2hpbGRyZW4gfHwgW10pLmZvckVhY2goY3VycmVudCA9PiB7XHJcbiAgICAvLyAgICAgICBjdXJyZW50LmRhdGEuaGlkZGVuID0gIWV4cGFuZGVkO1xyXG4gICAgLy8gICAgICAgZXhwYW5kKGN1cnJlbnQuY2hpbGRyZW4sIGV4cGFuZGVkKTsgXHJcbiAgICAvLyAgICAgfSk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gZXhwYW5kKG5vZGUuY2hpbGRyZW4sIG5vZGUuZGF0YS5leHBhbmRlZCk7IFxyXG4gICAgaWYgKHRvZ2dsZSkgbWUuc2hvd05vZGVzKG5vZGUpO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbiJdfQ==