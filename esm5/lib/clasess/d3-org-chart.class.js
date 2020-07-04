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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZDMtb3JnLWNoYXJ0LmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGJlL29yZ2NoYXJ0LyIsInNvdXJjZXMiOlsibGliL2NsYXNlc3MvZDMtb3JnLWNoYXJ0LmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFVBQVU7QUFDViwyQkFBMkI7QUFDM0IscUVBQXFFO0FBQ3JFLHlEQUF5RDtBQUN6RCxZQUFZO0FBQ1osT0FBTyxLQUFLLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFFekIsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDMUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQWM3QztJQWlERSxvQkFBWSxXQUF3QixFQUFFLFNBQThCO1FBQXBFLGlCQXlCQzs7UUF6RUQseUJBQXlCO1FBQ2YsWUFBTyxHQUF1QjtZQUN0QyxlQUFlLEVBQUUsU0FBUztZQUMxQixVQUFVLEVBQUUsSUFBSSxpQkFBaUIsRUFBRTtZQUNuQyxJQUFJLEVBQUUsRUFBRTtZQUNSLFdBQVcsRUFBRSxRQUFRO1NBQ3RCLENBQUE7UUFpQlMsVUFBSyxHQUFjLEVBQUUsQ0FBQztRQW9CaEMsWUFBWTtRQUVaLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBMFJ4QixnQkFBZ0I7UUFDaEIsYUFBYTtRQUNiLGdCQUFXLEdBQTJDLElBQUksT0FBTyxFQUFFLENBQUM7UUF4UmxFLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQztRQUVoQixpQkFBaUI7UUFDakIsRUFBRSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRXRDLHVDQUF1QztRQUN2QyxVQUFJLFNBQVMsMENBQUUsSUFBSTtZQUFFLEVBQUUsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQztRQUUvQyxpQkFBaUI7UUFDakIs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QUFTLENBQUM7Z0JBQy9CLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO2FBQ3ZCO1NBQ0Y7YUFBTSxFQUFFLFlBQVk7WUFDbkIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNqQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQy9CLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO2FBQ3RCO1NBQ0Y7UUFFRCx1Q0FBdUM7UUFDdkMsa0NBQWtDO1FBQ2xDLCtDQUErQztRQUUvQyxzRkFBc0Y7UUFDdEYsMENBQTBDO1FBQzFDLHlDQUF5QztRQUN6Qyw2Q0FBNkM7UUFDN0MsVUFBVTtRQUNWLElBQUk7UUFFSiw4Q0FBOEM7UUFDOUMsSUFBSSxNQUFNO1lBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUgsaUJBQUM7QUFBRCxDQUFDLEFBM2FELElBMmFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8jcmVnaW9uIFxyXG4vLyBEZXNhcnJvbGxhZG8gZW4gYmFzZSBhOiBcclxuLy8gIGh0dHBzOi8vYmwub2Nrcy5vcmcvYnVtYmVpc2h2aWxpLzA5YTAzYjgxYWU3ODhkMmQxNGY3NTBhZmU1OWViN2RlXHJcbi8vICBodHRwczovL2dpdGh1Yi5jb20vYnVtYmVpc2h2aWxpL2QzLW9yZ2FuaXphdGlvbi1jaGFydFxyXG4vLyNlbmRyZWdpb25cclxuaW1wb3J0ICogYXMgZDMgZnJvbSAnZDMnO1xyXG5pbXBvcnQgeyBJRDNOb2RlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcyc7XHJcbmltcG9ydCB7IFN1YmplY3QsIGZyb21FdmVudCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IEQzTm9kZUJhc2ljUGFyc2VyIH0gZnJvbSAnLi9AaXRlbXMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJRDNPcmdDaGFydE9wdGlvbnMge1xyXG4gIG5vZGVQYXJzZXI/OiBEM05vZGVCYXNpY1BhcnNlcjtcclxuICBkYXRhPzogSUQzTm9kZVtdO1xyXG4gIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcclxuICBkZWZhdWx0Rm9udD86IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJU2l6ZSB7XHJcbiAgd2lkdGg6IG51bWJlcjtcclxuICBoZWlnaHQ6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEQzT3JnQ2hhcnQge1xyXG4gIC8vI3JlZ2lvbiBEZWZhdWx0IE9wdGlvbnNcclxuICBwcm90ZWN0ZWQgb3B0aW9uczogSUQzT3JnQ2hhcnRPcHRpb25zID0ge1xyXG4gICAgYmFja2dyb3VuZENvbG9yOiAnIzAzQTNDNScsXHJcbiAgICBub2RlUGFyc2VyOiBuZXcgRDNOb2RlQmFzaWNQYXJzZXIoKSxcclxuICAgIGRhdGE6IFtdLFxyXG4gICAgZGVmYXVsdEZvbnQ6ICdUYWhvbWEnXHJcbiAgfVxyXG4gIC8vI2VuZHJlZ2lvblxyXG5cclxuICAvLyNyZWdpb24gU1ZHIGNvbXBvZW5udHNcclxuICBwcm90ZWN0ZWQgY29udGFpbmVyOiBkMy5TZWxlY3Rpb248SFRNTEVsZW1lbnQsIGFueSwgYW55LCBhbnk+O1xyXG4gIHByb3RlY3RlZCBzdmc6IGQzLlNlbGVjdGlvbjxkMy5CYXNlVHlwZSwgdW5rbm93biwgSFRNTEVsZW1lbnQsIHVua25vd24+O1xyXG4gIHByb3RlY3RlZCBjaGFydDogZDMuU2VsZWN0aW9uPGFueSwgYW55LCBhbnksIGFueT47XHJcbiAgcHJvdGVjdGVkIGNlbnRlckc6IGQzLlNlbGVjdGlvbjxhbnksIGFueSwgYW55LCBhbnk+O1xyXG4gIHByb3RlY3RlZCBkZWZzOiBkMy5TZWxlY3Rpb248YW55LCBhbnksIGFueSwgYW55PjtcclxuXHJcbiAgcHJvdGVjdGVkIGxhc3RUcmFuc2Zvcm06IGFueTtcclxuICAvLyNlbmRyZWdpb25cclxuXHJcbiAgLy8jcmVnaW9uIERBVEFcclxuICBwcm90ZWN0ZWQgcm9vdDogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+O1xyXG4gIHByb3RlY3RlZCBhbGxOb2RlczogYW55O1xyXG5cclxuICBwcm90ZWN0ZWQgX2RhdGE6IElEM05vZGVbXSA9IFtdO1xyXG4gIGdldCBkYXRhKCk6IElEM05vZGVbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YSB8fCBbXTtcclxuICB9XHJcblxyXG4gIHNldCBkYXRhKGRhdGE6IElEM05vZGVbXSkge1xyXG4gICAgdGhpcy5fZGF0YSA9IGRhdGE7XHJcbiAgICAvLyB0aGlzLnJlbmRlcigpXHJcbiAgfVxyXG4gIC8vI2VuZHJlZ2lvblxyXG5cclxuICAvLyNyZWdpb24gIE5PREUgUEFSU0VSXHJcbiAgcHJvdGVjdGVkIF9ub2RlUGFyc2VyOiBEM05vZGVCYXNpY1BhcnNlcjtcclxuICBnZXQgbm9kZVBhcnNlcigpOiBEM05vZGVCYXNpY1BhcnNlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fbm9kZVBhcnNlcjtcclxuICB9XHJcbiAgc2V0IG5vZGVQYXJzZXIocGFyc2VyOiBEM05vZGVCYXNpY1BhcnNlcikge1xyXG4gICAgdGhpcy5fbm9kZVBhcnNlciA9IHBhcnNlcjtcclxuICAgIC8vIHRoaXMucmVuZGVyKCk7XHJcbiAgfVxyXG4gIC8vI2VuZHJlZ2lvblxyXG5cclxuICBjdXJyZW50Wm9vbTogbnVtYmVyID0gMTtcclxuICB0cmVlbWFwOiBkMy5UcmVlTGF5b3V0PElEM05vZGU+O1xyXG5cclxuICBjb25zdHJ1Y3RvcihwckNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHByT3B0aW9ucz86IElEM09yZ0NoYXJ0T3B0aW9ucykge1xyXG4gICAgY29uc3QgbWUgPSB0aGlzO1xyXG5cclxuICAgIC8vIGluaXQgY29udGFpbmVyXHJcbiAgICBtZS5jb250YWluZXIgPSBkMy5zZWxlY3QocHJDb250YWluZXIpO1xyXG5cclxuICAgIC8vSWYgRGF0YSBhcmd1bWVudCBwYXNzZWQgLSB0aGVuIHNldCBpdFxyXG4gICAgaWYgKHByT3B0aW9ucz8uZGF0YSkgbWUuX2RhdGEgPSBwck9wdGlvbnMuZGF0YTtcclxuXHJcbiAgICAvLyBzZXR0aW5nIHBhcnNlclxyXG4gICAgbWUuX25vZGVQYXJzZXIgPSBwck9wdGlvbnM/Lm5vZGVQYXJzZXIgfHwgbWUub3B0aW9ucy5ub2RlUGFyc2VyO1xyXG5cclxuICAgIC8vIGFwcGx5aW5nIG9wdGlvbnNcclxuICAgIG1lLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKG1lLm9wdGlvbnMsIHByT3B0aW9ucyk7XHJcblxyXG4gICAgLy8gbW9uaXRvciByZXNpemVcclxuICAgIGZyb21FdmVudCh3aW5kb3csICdyZXNpemUnKVxyXG4gICAgICAucGlwZShcclxuICAgICAgICBkZWJvdW5jZVRpbWUoMzAwKVxyXG4gICAgICApLnN1YnNjcmliZShcclxuICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAvLyBIREMgLSBWRVIgdGhpcy5wcmVwYXJlQ2FudmFzKCk7XHJcbiAgICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgKVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgY29uc3QgbWUgPSB0aGlzO1xyXG4gICAgLy8gcHJlcGFyaW5nIHN2Z1xyXG4gICAgbWUucHJlcGFyZUNhbnZhcygpO1xyXG5cclxuICAgIC8vIGlmIG5vIGRhdGEgdGhlbiByZXR1cm5cclxuICAgIGlmICghbWUuZGF0YS5sZW5ndGgpIHJldHVybjtcclxuXHJcbiAgICAvLyBwcmVwYXJpbmcgZGF0YVxyXG4gICAgbWUucHJlcGFyZURhdGEoKTtcclxuXHJcbiAgICAvLyBzaG93aW5nIG5vZGVzXHJcbiAgICBtZS5zaG93Tm9kZXMoKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLy8gcHJlcGFyaW5nIGNhbnZhc1xyXG4gIHByb3RlY3RlZCBwcmVwYXJlQ2FudmFzKCkge1xyXG4gICAgY29uc3QgbWUgPSB0aGlzO1xyXG5cclxuICAgIC8vRHJhd2luZyBjb250YWluZXJzXHJcbiAgICBjb25zdCBjb250YWluZXJSZWN0ID0gbWUuY29udGFpbmVyLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIG1lLnN2ZyA9IG1lLmNvbnRhaW5lci5zZWxlY3RBbGwoJ3N2ZycpXHJcbiAgICAgIC5kYXRhKFt7IGlkOiAnc3ZnJyB9XSwgKGQ6IHsgaWQ6IHN0cmluZyB9KSA9PiBkLmlkKVxyXG4gICAgICAuam9pbihcclxuICAgICAgICBlbnRlciA9PiBlbnRlclxyXG4gICAgICAgICAgLmFwcGVuZCgnc3ZnJylcclxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdzdmctY2hhcnQtY29udGFpbmVyJylcclxuICAgICAgICAgIC5hdHRyKCdmb250LWZhbWlseScsIG1lLm9wdGlvbnMuZGVmYXVsdEZvbnQpXHJcbiAgICAgICAgICAuY2FsbChkMy56b29tKCkub24oXCJ6b29tXCIsIGQgPT4gdGhpcy56b29tZWQoKSkpXHJcbiAgICAgICAgICAuYXR0cignY3Vyc29yJywgJ21vdmUnKVxyXG4gICAgICAgICAgLnN0eWxlKCdiYWNrZ3JvdW5kLWNvbG9yJywgbWUub3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IpLFxyXG4gICAgICAgIHVwZGF0ZSA9PlxyXG4gICAgICAgICAgdXBkYXRlXHJcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIGNvbnRhaW5lclJlY3Qud2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCBjb250YWluZXJSZWN0LmhlaWdodClcclxuICAgICAgKTtcclxuICAgIC8vQWRkIGNvbnRhaW5lciBnIGVsZW1lbnRcclxuICAgIG1lLmNoYXJ0ID0gbWUuc3ZnLnNlbGVjdEFsbCgnZy5jaGFydCcpXHJcbiAgICAgIC5kYXRhKFt7IGlkOiAnY2hhcnQnIH1dLCAoZDogeyBpZDogc3RyaW5nIH0pID0+IGQuaWQpXHJcbiAgICAgIC5qb2luKFxyXG4gICAgICAgIGVudGVyID0+IGVudGVyXHJcbiAgICAgICAgICAuYXBwZW5kKCdnJylcclxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdjaGFydCcpXHJcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLDApYCksXHJcbiAgICAgICAgdXBkYXRlID0+IHVwZGF0ZVxyXG4gICAgICApXHJcblxyXG4gICAgLy8gQWRkIG9uZSBtb3JlIGNvbnRhaW5lciBnIGVsZW1lbnQsIGZvciBiZXR0ZXIgcG9zaXRpb25pbmcgY29udHJvbHNcclxuICAgIG1lLmNlbnRlckcgPSBtZS5jaGFydC5zZWxlY3RBbGwoJ2cuY2VudGVyLWdyb3VwJylcclxuICAgICAgLmRhdGEoW3sgaWQ6ICdjZW50ZXItZ3JvdXAnIH1dLCAoZDogeyBpZDogc3RyaW5nIH0pID0+IGQuaWQpXHJcbiAgICAgIC5qb2luKFxyXG4gICAgICAgIGVudGVyID0+IGVudGVyLmFwcGVuZCgnZycpXHJcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnY2VudGVyLWdyb3VwJyksXHJcbiAgICAgICAgdXBkYXRlID0+XHJcbiAgICAgICAgICB1cGRhdGVcclxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHtjb250YWluZXJSZWN0LndpZHRoIC8gMn0sJHt0aGlzLm5vZGVQYXJzZXIuaGVpZ2h0fSkgc2NhbGUoJHt0aGlzLmN1cnJlbnRab29tfSlgKVxyXG4gICAgICApXHJcblxyXG4gICAgLy8gZGVmc1xyXG4gICAgbWUuZGVmcyA9IG1lLnN2Zy5zZWxlY3RBbGwoJ2RlZnMuZ2xvYmFsRGVmcycpXHJcbiAgICAgIC5kYXRhKFt7IGlkOiAnZGVmcycgfV0sIChkOiB7IGlkOiBzdHJpbmcgfSkgPT4gZC5pZClcclxuICAgICAgLmpvaW4oXHJcbiAgICAgICAgZW50ZXIgPT4ge1xyXG4gICAgICAgICAgY29uc3QgZGVmcyA9IGVudGVyLmFwcGVuZCgnZGVmcycpLmF0dHIoJ2NsYXNzJywgJ2dsb2JhbERlZnMnKTtcclxuICAgICAgICAgIGRlZnMuYXBwZW5kKCdwYXR0ZXJuJylcclxuICAgICAgICAgICAgLmF0dHIoJ2lkJywgYGltZy1leHBhbmRgKVxyXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCAxKS5hdHRyKCdoZWlnaHQnLCAxKVxyXG4gICAgICAgICAgICAuYXBwZW5kKCdpbWFnZScpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieGxpbms6aHJlZlwiLCBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxcIiArIG1lLm5vZGVQYXJzZXIuZXhwYW5kQmFzZTY0SWNvbilcclxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgMzApXHJcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAzMClcclxuICAgICAgICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaW4gc2xpY2UnKTtcclxuICAgICAgICAgIGRlZnMuYXBwZW5kKCdwYXR0ZXJuJylcclxuICAgICAgICAgICAgLmF0dHIoJ2lkJywgYGltZy1jb2xsYXBzZWApXHJcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIDEpLmF0dHIoJ2hlaWdodCcsIDEpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2ltYWdlJylcclxuICAgICAgICAgICAgLmF0dHIoXCJ4bGluazpocmVmXCIsIFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LFwiICsgbWUubm9kZVBhcnNlci5jb2xsYXBzZUJhc2U2NEljb24pXHJcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIDMwKVxyXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgMzApXHJcbiAgICAgICAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaWRZTWluIHNsaWNlJyk7XHJcbiAgICAgICAgICAvLyBkZWZzLmFwcGVuZCgncGF0dGVybicpXHJcbiAgICAgICAgICAvLyAgIC5hdHRyKCdpZCcsIGBpbWctZXJyb3JgKVxyXG4gICAgICAgICAgLy8gICAuYXR0cignd2lkdGgnLCAxKS5hdHRyKCdoZWlnaHQnLCAxKVxyXG4gICAgICAgICAgLy8gICAuYXBwZW5kKCdpbWFnZScpXHJcbiAgICAgICAgICAvLyAgIC5hdHRyKFwieGxpbms6aHJlZlwiLCBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxcIiArIG1lLm5vZGVQYXJzZXIuZXJyb3JCYXNlNjRJY29uKVxyXG4gICAgICAgICAgLy8gICAuYXR0cignd2lkdGgnLCBtZS5ub2RlUGFyc2VyLmltYWdlRGVmcy53IClcclxuICAgICAgICAgIC8vICAgLmF0dHIoJ2hlaWdodCcsIG1lLm5vZGVQYXJzZXIuaW1hZ2VEZWZzLmgpXHJcbiAgICAgICAgICAvLyAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaWRZTWluIHNsaWNlJyk7ICAgICAgICAgICAgXHJcbiAgICAgICAgICByZXR1cm4gZGVmc1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdXBkYXRlID0+IHVwZGF0ZVxyXG4gICAgICApXHJcbiAgfVxyXG5cclxuICAvLyBwcmVwYXJpbmcgZGF0YVxyXG4gIHByb3RlY3RlZCBwcmVwYXJlRGF0YSgpIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuXHJcbiAgICAvLyBpZiBubyBkYXRhIHJldHVybiBcclxuICAgIGlmICghbWUuZGF0YS5sZW5ndGgpIHJldHVybjtcclxuXHJcbiAgICAvLyBDb252ZXJ0IGZsYXQgZGF0YSB0byBoaWVyYXJjaGljYWxcclxuICAgIGlmICghbWUucm9vdCkge1xyXG4gICAgICB0cnkgeyAvLyBwcmV2ZW50aW5nIG11bHRpcGxlIHJvb3RcclxuICAgICAgICBtZS5yb290ID0gZDMuc3RyYXRpZnk8SUQzTm9kZT4oKS5pZCgoeyBub2RlSWQgfSkgPT4gbm9kZUlkKS5wYXJlbnRJZCgoeyBwYXJlbnROb2RlSWQgfSkgPT4gcGFyZW50Tm9kZUlkKVxyXG4gICAgICAgIChtZS5kYXRhKSBhcyBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT47XHJcbiAgICAgIH0gY2F0Y2goIGVyciApIHtcclxuICAgICAgICBtZS5yb290ID0gZDMuc3RyYXRpZnk8SUQzTm9kZT4oKS5pZCgoeyBub2RlSWQgfSkgPT4gbm9kZUlkKS5wYXJlbnRJZCgoeyBwYXJlbnROb2RlSWQgfSkgPT4gcGFyZW50Tm9kZUlkKVxyXG4gICAgICAgIChbeyBcclxuICAgICAgICAgIG5vZGVJZDogJ3Jvb3QnLCBcclxuICAgICAgICAgIHBhcmVudE5vZGVJZDogJycsIFxyXG4gICAgICAgICAgdGl0bGU6ICdFcnJvcicsIFxyXG4gICAgICAgICAgZGVzY3JpcHRpb246IGVyci5tZXNzYWdlIHx8IGVycixcclxuICAgICAgICAgIG5vZGVJbWFnZToge1xyXG4gICAgICAgICAgICBiYXNlNjQ6IG1lLm5vZGVQYXJzZXIuZXJyb3JCYXNlNjRJY29uXHJcbiAgICAgICAgICB9ICBcclxuICAgICAgICB9XSkgYXMgZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHJlcGFyaW5nIHRyZWVtYXBcclxuICAgIGNvbnN0IGNvbnRhaW5lclJlY3QgPSBtZS5jb250YWluZXIubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgbWUudHJlZW1hcCA9IGQzLnRyZWU8SUQzTm9kZT4oKS5zaXplKFtjb250YWluZXJSZWN0LndpZHRoIHx8IDI1MCwgY29udGFpbmVyUmVjdC5oZWlnaHRdKVxyXG4gICAgICAubm9kZVNpemUoW3RoaXMubm9kZVBhcnNlci53aWR0aCArIHRoaXMubm9kZVBhcnNlci53aWR0aCAvIDIsIHRoaXMubm9kZVBhcnNlci5oZWlnaHQgKyB0aGlzLm5vZGVQYXJzZXIuaGVpZ2h0IC8gMS4yXSk7XHJcblxyXG4gICAgbWUuYWxsTm9kZXMgPSBtZS50cmVlbWFwKG1lLnJvb3QpLmRlc2NlbmRhbnRzKCk7XHJcbiAgICBtZS5jaGVja0V4cGFuZGVkKG1lLnJvb3QpO1xyXG4gIH1cclxuXHJcbiAgLy8gc2hvd2luZyBub2Rlc1xyXG4gIHByb3RlY3RlZCBzaG93Tm9kZXMocHJOb2RlOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4gPSBudWxsKSB7XHJcbiAgICBjb25zdCBtZSA9IHRoaXM7XHJcblxyXG4gICAgaWYgKCFwck5vZGUpIHByTm9kZSA9IG1lLnJvb3Q7XHJcbiAgICBjb25zdCB1cGRhdGVQb3NpdGlvbjogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9ID0ge1xyXG4gICAgICB4OiBwck5vZGUueCxcclxuICAgICAgeTogcHJOb2RlLnlcclxuICAgIH1cclxuXHJcbiAgICAvLyAgQXNzaWducyB0aGUgeCBhbmQgeSBwb3NpdGlvbiBmb3IgdGhlIG5vZGVzXHJcbiAgICBjb25zdCB0cmVlRGF0YSA9IG1lLnRyZWVtYXAobWUucm9vdCk7XHJcbiAgICAvLyBpdCBpcyBuZWNlc2FyeSBmb3Igc2NvcGUgXHJcbiAgICBjb25zdCBkcmF3Tm9kZXMgPSAoY29udGFpbmVyKSA9PiBtZS5ub2RlUGFyc2VyLmRyYXdOb2Rlcyhjb250YWluZXIpO1xyXG4gICAgY29uc3QgZHJhd0NvbGxhcHNlciA9IChub2RlR3JvdXA6IGQzLlNlbGVjdGlvbjxTVkdHRWxlbWVudCwgZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+LCBhbnksIGFueT4pID0+IHtcclxuICAgICAgbm9kZUdyb3VwLmVhY2goKGQsIGkpID0+IHtcclxuICAgICAgICAvLyBhZGRpbmcgY29sbGFwc2UgLyBleHBhbmQgYnV0dG9uXHJcbiAgICAgICAgbm9kZUdyb3VwLmFwcGVuZCgnY2lyY2xlJylcclxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdjb2xsYXBzZXInKVxyXG4gICAgICAgICAgLmF0dHIoJ2N4JywgbWUubm9kZVBhcnNlci53aWR0aCAvIDIpXHJcbiAgICAgICAgICAuYXR0cignY3knLCBtZS5ub2RlUGFyc2VyLmhlaWdodClcclxuICAgICAgICAgIC5hdHRyKCdyJywgMTUpXHJcbiAgICAgICAgICAuYXR0cignc3Ryb2tlJywgJ2JsYWNrJylcclxuICAgICAgICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCAyKVxyXG4gICAgICAgICAgLm9uKCdjbGljaycsIChub2RlKSA9PiB7XHJcbiAgICAgICAgICAgIG1lLmV4cGFuZChub2RlLCB0cnVlKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3Qgbm9kZXMgPSB0cmVlRGF0YS5kZXNjZW5kYW50cygpO1xyXG5cclxuICAgIC8vIHJlbmRlcmluZyBub2Rlc1xyXG5cclxuICAgIGNvbnN0IG5vZGVTdGFydFBvc2l0aW9uID0gKGQ6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPikgPT4ge1xyXG4gICAgICBpZiAocHJOb2RlKSB7XHJcbiAgICAgICAgcmV0dXJuIGB0cmFuc2xhdGUoJHt1cGRhdGVQb3NpdGlvbi54IC0gKG1lLm5vZGVQYXJzZXIud2lkdGggLyAyKX0sJHt1cGRhdGVQb3NpdGlvbi55fSlgXHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFkLnBhcmVudCkgcmV0dXJuIGB0cmFuc2xhdGUoJHtkLnggLSAobWUubm9kZVBhcnNlci53aWR0aCAvIDIpfSwke2QueX0pYDtcclxuICAgICAgcmV0dXJuIGB0cmFuc2xhdGUoJHtkLnBhcmVudC54IC0gKG1lLm5vZGVQYXJzZXIud2lkdGggLyAyKX0sJHtkLnBhcmVudC55fSlgXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgbm9kZVBvc2l0aW9uID0gKHBhcmFtczogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9KSA9PlxyXG4gICAgICBgdHJhbnNsYXRlKCR7cGFyYW1zLnggLSAobWUubm9kZVBhcnNlci53aWR0aCAvIDIpfSwke3BhcmFtcy55fSlgO1xyXG5cclxuICAgIGNvbnN0IGV4cGFuZEljb25WaXNpYmxlID1cclxuICAgICAgKGQ6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPiAmIHsgX2NoaWxkcmVuPzogYW55IH0pID0+IChkLmNoaWxkcmVuIHx8IGQuX2NoaWxkcmVuKSA/ICd2aXNpYmxlJyA6ICdoaWRkZW4nO1xyXG4gICAgY29uc3QgZXhwYW5kSWNvbiA9XHJcbiAgICAgIChkOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4gJiB7IF9jaGlsZHJlbj86IGFueSB9KSA9PiBleHBhbmRJY29uVmlzaWJsZShkKSA9PSAndmlzaWJsZScgPyAoZC5kYXRhLmV4cGFuZGVkID8gYHVybCgjaW1nLWNvbGxhcHNlKWAgOiBgdXJsKCNpbWctZXhwYW5kKWApIDogJyc7XHJcblxyXG5cclxuICAgIG1lLmNlbnRlckcuc2VsZWN0QWxsKCdnLm5vZGUnKVxyXG4gICAgICAuZGF0YShub2RlcywgKGQ6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPikgPT4gZC5kYXRhLm5vZGVJZClcclxuICAgICAgLmpvaW4oXHJcbiAgICAgICAgZW50ZXIgPT5cclxuICAgICAgICAgIGVudGVyLmFwcGVuZCgnZycpXHJcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ25vZGUnKVxyXG4gICAgICAgICAgICAuYXR0cignY3Vyc29yJywgJ3BvaW50ZXInKVxyXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgbm9kZVN0YXJ0UG9zaXRpb24pXHJcbiAgICAgICAgICAgIC5jYWxsKGRyYXdOb2RlcylcclxuICAgICAgICAgICAgLmNhbGwoZHJhd0NvbGxhcHNlcilcclxuICAgICAgICAgICAgLm9uKCdjbGljaycsIChub2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgbWUub25Ob2RlQ2xpY2submV4dCh7IGlkOiBub2RlLmRhdGEubm9kZUlkLCBub2RlOiBub2RlLmRhdGEgfSk7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgIHVwZGF0ZSA9PiB1cGRhdGUsXHJcbiAgICAgICAgZXhpdCA9PlxyXG4gICAgICAgICAgZXhpdFxyXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgIC5kdXJhdGlvbihtZS5ub2RlUGFyc2VyLnRyYW5zaXRpb25EdXJhdGlvbilcclxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIG5vZGVQb3NpdGlvbihwck5vZGUpKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApXHJcbiAgICAgICAgICAgIC5yZW1vdmUoKVxyXG4gICAgICApXHJcbiAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24obWUubm9kZVBhcnNlci50cmFuc2l0aW9uRHVyYXRpb24pXHJcbiAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMSlcclxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIG5vZGVQb3NpdGlvbilcclxuICAgICAgLnNlbGVjdEFsbCgnY2lyY2xlLmNvbGxhcHNlcicpXHJcbiAgICAgIC5hdHRyKCd2aXNpYmlsaXR5JywgZXhwYW5kSWNvblZpc2libGUpXHJcbiAgICAgIC5hdHRyKCdmaWxsJywgZXhwYW5kSWNvbilcclxuXHJcbiAgICAvLyByZW5kZXJpbmcgbGlua3NcclxuICAgIGNvbnN0IHBhdGhTdGFydGluZ0RpYWdvbmFsID0gKHBhcmFtczogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9KSA9PiB7XHJcbiAgICAgIGNvbnN0IHRhcmdldCA9IHsgeDogcGFyYW1zLngsIHk6IHBhcmFtcy55ICsgbWUubm9kZVBhcnNlci5oZWlnaHQgfTtcclxuICAgICAgcmV0dXJuIHRoaXMubGlua1BhdGgodGFyZ2V0LCB0YXJnZXQpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcGF0aERpYWdvbmFsID0gKGQ6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPikgPT4ge1xyXG4gICAgICBjb25zdCB0YXJnZXQgPSB7IHg6IGQucGFyZW50LngsIHk6IGQucGFyZW50LnkgKyBtZS5ub2RlUGFyc2VyLmhlaWdodCB9O1xyXG4gICAgICByZXR1cm4gdGhpcy5saW5rUGF0aChkLCB0YXJnZXQpXHJcbiAgICB9XHJcblxyXG4gICAgbWUuY2VudGVyRy5zZWxlY3RBbGwoJ3BhdGgubGluaycpXHJcbiAgICAgIC5kYXRhKG5vZGVzLnNsaWNlKDEpLCAoZDogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+KSA9PiBkLmRhdGEubm9kZUlkKVxyXG4gICAgICAuam9pbihcclxuICAgICAgICBlbnRlciA9PlxyXG4gICAgICAgICAgZW50ZXJcclxuICAgICAgICAgICAgLmluc2VydCgncGF0aCcsICdnJylcclxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xpbmsnKVxyXG4gICAgICAgICAgICAuYXR0cignZmlsbCcsICdub25lJylcclxuICAgICAgICAgICAgLmF0dHIoJ3N0cm9rZScsICdibHVlJylcclxuICAgICAgICAgICAgLmF0dHIoJ3N0cm9rZS13aWR0aCcsIDIpXHJcbiAgICAgICAgICAgIC5hdHRyKCdkJywgcGF0aFN0YXJ0aW5nRGlhZ29uYWwoeyB4OiB1cGRhdGVQb3NpdGlvbi54LCB5OiB1cGRhdGVQb3NpdGlvbi55IH0pKSxcclxuICAgICAgICB1cGRhdGUgPT4gdXBkYXRlLFxyXG4gICAgICAgIGV4aXQgPT5cclxuICAgICAgICAgIGV4aXRcclxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihtZS5ub2RlUGFyc2VyLnRyYW5zaXRpb25EdXJhdGlvbilcclxuICAgICAgICAgICAgLmF0dHIoJ2QnLCBwYXRoU3RhcnRpbmdEaWFnb25hbChwck5vZGUpKVxyXG4gICAgICAgICAgICAucmVtb3ZlKClcclxuICAgICAgKVxyXG4gICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG1lLm5vZGVQYXJzZXIudHJhbnNpdGlvbkR1cmF0aW9uKVxyXG4gICAgICAuYXR0cignZCcsIHBhdGhEaWFnb25hbCk7XHJcbiAgfVxyXG5cclxuICAvLyBab29tIGhhbmRsZXIgZnVuY3Rpb25cclxuICB6b29tZWQoKSB7XHJcbiAgICBjb25zdCBtZSA9IHRoaXM7XHJcbiAgICAvLyBTYXZpbmcgZDMgZXZlbnQncyB0cmFuc2Zvcm0gb2JqZWN0XHJcbiAgICBtZS5sYXN0VHJhbnNmb3JtID0gZDMuZXZlbnQudHJhbnNmb3JtO1xyXG4gICAgLy8gUmVwb3NpdGlvbiBhbmQgcmVzY2FsZSBjaGFydCBhY2NvcmRpbmdseVxyXG4gICAgbWUuY2hhcnQuYXR0cigndHJhbnNmb3JtJywgbWUubGFzdFRyYW5zZm9ybSk7XHJcbiAgfVxyXG4gIC8vI3JlZ2lvbiBFdmVudHNcclxuICAvLyBub2RlIGNsaWNrXHJcbiAgb25Ob2RlQ2xpY2s6IFN1YmplY3Q8eyBpZDogc3RyaW5nLCBub2RlOiBJRDNOb2RlIH0+ID0gbmV3IFN1YmplY3QoKTtcclxuICBwcm90ZWN0ZWQgX29uTm9kZUNsaWNrKG5vZGVJZDogc3RyaW5nLCBub2RlOiBJRDNOb2RlKSB7XHJcbiAgICB0aGlzLm9uTm9kZUNsaWNrLm5leHQoeyBpZDogbm9kZUlkLCBub2RlOiBub2RlIH0pO1xyXG4gIH1cclxuICAvLyNlbmRyZWdpb25cclxuXHJcbiAgLy9kcmF3Tm9kZShwck5vZGU6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPikge1xyXG4gIC8vICBjb25zdCBtZSA9IHRoaXM7XHJcbiAgLy8gIG1lLm5vZGVQYXJzZXIuZHJhdyhtZS5jZW50ZXJHLCBwck5vZGUpO1xyXG4gIC8vfVxyXG5cclxuXHJcbiAgLy8gR2VuZXJhdGUgY3VzdG9tIGRpYWdvbmFsIC0gcGxheSB3aXRoIGl0IGhlcmUgLSBodHRwczovL29ic2VydmFibGVocS5jb20vQGJ1bWJlaXNodmlsaS9jdXJ2ZWQtZWRnZXM/Y29sbGVjdGlvbj1AYnVtYmVpc2h2aWxpL3dvcmstY29tcG9uZW50c1xyXG4gIGxpbmtQYXRoKHNvdXJjZTogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9LCB0YXJnZXQ6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSkge1xyXG5cclxuICAgIC8vIENhbGN1bGF0ZSBzb21lIHZhcmlhYmxlcyBiYXNlZCBvbiBzb3VyY2UgYW5kIHRhcmdldCAocyx0KSBjb29yZGluYXRlc1xyXG4gICAgY29uc3QgeCA9IHNvdXJjZS54O1xyXG4gICAgY29uc3QgeSA9IHNvdXJjZS55O1xyXG4gICAgY29uc3QgZXggPSB0YXJnZXQueDtcclxuICAgIGNvbnN0IGV5ID0gdGFyZ2V0LnlcclxuICAgICAgO1xyXG4gICAgbGV0IHhydnMgPSBleCAtIHggPCAwID8gLTEgOiAxO1xyXG4gICAgbGV0IHlydnMgPSBleSAtIHkgPCAwID8gLTEgOiAxO1xyXG4gICAgbGV0IHJkZWYgPSAzNTtcclxuICAgIGxldCBySW5pdGlhbCA9IE1hdGguYWJzKGV4IC0geCkgLyAyIDwgcmRlZiA/IE1hdGguYWJzKGV4IC0geCkgLyAyIDogcmRlZjtcclxuICAgIGxldCByID0gTWF0aC5hYnMoZXkgLSB5KSAvIDIgPCBySW5pdGlhbCA/IE1hdGguYWJzKGV5IC0geSkgLyAyIDogckluaXRpYWw7XHJcbiAgICBsZXQgaCA9IE1hdGguYWJzKGV5IC0geSkgLyAyIC0gcjtcclxuICAgIGxldCB3ID0gTWF0aC5hYnMoZXggLSB4KSAtIHIgKiAyO1xyXG5cclxuICAgIC8vIEJ1aWxkIHRoZSBwYXRoXHJcbiAgICBjb25zdCBwYXRoID0gYFxyXG4gICAgICAgICAgICBNICR7eH0gJHt5fVxyXG4gICAgICAgICAgICBMICR7eH0gJHt5ICsgaCAqIHlydnN9XHJcbiAgICAgICAgICAgIEMgICR7eH0gJHt5ICsgaCAqIHlydnMgKyByICogeXJ2c30gJHt4fSAke3kgKyBoICogeXJ2cyArIHIgKiB5cnZzfSAke3ggKyByICogeHJ2c30gJHt5ICsgaCAqIHlydnMgKyByICogeXJ2c31cclxuICAgICAgICAgICAgTCAke3ggKyB3ICogeHJ2cyArIHIgKiB4cnZzfSAke3kgKyBoICogeXJ2cyArIHIgKiB5cnZzfVxyXG4gICAgICAgICAgICBDICR7ZXh9ICAke3kgKyBoICogeXJ2cyArIHIgKiB5cnZzfSAke2V4fSAgJHt5ICsgaCAqIHlydnMgKyByICogeXJ2c30gJHtleH0gJHtleSAtIGggKiB5cnZzfVxyXG4gICAgICAgICAgICBMICR7ZXh9ICR7ZXl9XHJcbiAgICAgICAgICBgXHJcbiAgICAvLyBSZXR1cm4gcmVzdWx0XHJcbiAgICByZXR1cm4gcGF0aDtcclxuICB9XHJcblxyXG4gIGNoZWNrRXhwYW5kZWQobm9kZTogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+ICYgeyBfY2hpbGRyZW4/OiBhbnkgfSkge1xyXG4gICAgY29uc3QgbWUgPSB0aGlzO1xyXG5cclxuICAgIC8vIGNoZWNraW5nIGV4cGFuZGVkXHJcbiAgICBpZiAobm9kZS5kYXRhLmV4cGFuZGVkKSB7XHJcbiAgICAgIGlmICghbm9kZS5jaGlsZHJlbiAmJiBub2RlLl9jaGlsZHJlbikge1xyXG4gICAgICAgIG5vZGUuY2hpbGRyZW4gPSBub2RlLl9jaGlsZHJlbjtcclxuICAgICAgICBub2RlLl9jaGlsZHJlbiA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7IC8vIGNvbGxhcHNlZFxyXG4gICAgICBpZiAobm9kZS5jaGlsZHJlbikge1xyXG4gICAgICAgIG5vZGUuX2NoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcclxuICAgICAgICBub2RlLmNoaWxkcmVuID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gY2hlY2tpbmcgY2hpbGRyZW5cclxuICAgIChub2RlLmNoaWxkcmVuIHx8IG5vZGUuX2NoaWxkcmVuIHx8IFtdKS5mb3JFYWNoKGN1cnJlbnQgPT4gbWUuY2hlY2tFeHBhbmRlZChjdXJyZW50KSlcclxuICB9XHJcblxyXG5cclxuXHJcbiAgZXhwYW5kKG5vZGU6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPiAmIHsgX2NoaWxkcmVuPzogYW55IH0sIHRvZ2dsZTogYm9vbGVhbiA9IGZhbHNlKSB7IC8vLCAgcmVuZGVyOiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuXHJcbiAgICAvLyBpZiB0b2dnbGUgLSBsZXRzIHRvZ2dsZVxyXG4gICAgaWYgKHRvZ2dsZSkgbm9kZS5kYXRhLmV4cGFuZGVkID0gIW5vZGUuZGF0YS5leHBhbmRlZDtcclxuXHJcbiAgICAvLyBjaGVja2luZyBleHBhbmRlZFxyXG4gICAgaWYgKG5vZGUuZGF0YS5leHBhbmRlZCkge1xyXG4gICAgICBpZiAoIW5vZGUuY2hpbGRyZW4gJiYgbm9kZS5fY2hpbGRyZW4pIHtcclxuICAgICAgICBub2RlLmNoaWxkcmVuID0gbm9kZS5fY2hpbGRyZW47XHJcbiAgICAgICAgbm9kZS5fY2hpbGRyZW4gPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgeyAvLyBjb2xsYXBzZWRcclxuICAgICAgaWYgKG5vZGUuY2hpbGRyZW4pIHtcclxuICAgICAgICBub2RlLl9jaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XHJcbiAgICAgICAgbm9kZS5jaGlsZHJlbiA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBjb25zdCBleHBhbmRlZCA9IG5vZGUuZGF0YS5leHBhbmRlZDtcclxuICAgIC8vIG5vZGUuZGF0YS5leHBhbmRlZCA9ICFleHBhbmRlZDtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdFeHBhbmRpbmQ6ICcsIG5vZGUuZGF0YS5ub2RlSWQpXHJcblxyXG4gICAgLy8gY29uc3QgZXhwYW5kID0gKGNoaWxkcmVuOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT5bXSwgZXhwYW5kZWQ6IGJvb2xlYW4pID0+IHtcclxuICAgIC8vICAgKGNoaWxkcmVuIHx8IFtdKS5mb3JFYWNoKGN1cnJlbnQgPT4ge1xyXG4gICAgLy8gICAgICAgY3VycmVudC5kYXRhLmhpZGRlbiA9ICFleHBhbmRlZDtcclxuICAgIC8vICAgICAgIGV4cGFuZChjdXJyZW50LmNoaWxkcmVuLCBleHBhbmRlZCk7IFxyXG4gICAgLy8gICAgIH0pO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIGV4cGFuZChub2RlLmNoaWxkcmVuLCBub2RlLmRhdGEuZXhwYW5kZWQpOyBcclxuICAgIGlmICh0b2dnbGUpIG1lLnNob3dOb2Rlcyhub2RlKTtcclxuICB9XHJcblxyXG59XHJcblxyXG4iXX0=