import * as d3 from 'd3';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { D3NodeBasicParser } from './@items';
import { calcGFit, setPattern, addDefaultDefs, buildTree } from './d3x/d3x';
var D3OrgChart = /** @class */ (function () {
    function D3OrgChart(prContainer, prOptions) {
        var _this = this;
        var _a, _b;
        //#region Default Options
        this.options = {
            backgroundColor: '#03A3C5',
            nodeParser: new D3NodeBasicParser(),
            data: [],
            defaultFont: 'Tahoma',
            nodeHorizontalSpaceScale: 0.5,
            nodeVerticalSpaceScale: 0.8
        };
        // protected allNodes: any;
        this._data = [];
        //#endregion
        this.zoomFunc = d3.zoom().scaleExtent([0.1, 20]).on("zoom", function (d) { return _this.zoomed(); });
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
    Object.defineProperty(D3OrgChart.prototype, "nodeParser", {
        get: function () {
            if (!this._nodeParser)
                this._nodeParser = new D3NodeBasicParser();
            return this._nodeParser;
        },
        set: function (parser) {
            this._nodeParser = parser;
            // this.render();
        },
        enumerable: true,
        configurable: true
    });
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
            .join(function (enter) {
            return enter
                .append('svg')
                .attr('class', 'svg-chart-container')
                .attr('font-family', me.options.defaultFont)
                // .call(d3.zoom().on("zoom", d => this.zoomed()))
                .call(_this.zoomFunc)
                .on("dblclick.zoom", null)
                .attr('cursor', 'move')
                .style('background-color', me.options.backgroundColor);
        }, function (update) {
            return update
                .attr('width', containerRect.width)
                .attr('height', containerRect.height)
                .attr('font-family', me.options.defaultFont)
                .style('background-color', me.options.backgroundColor);
        });
        //Add container g element
        me.chart = me.svg.selectAll('g.chart')
            .data([{ id: 'chart' }], function (d) { return d.id; })
            .join(function (enter) { return enter
            .append('g')
            .attr('class', 'chart')
            .attr('transform', "translate(0,0)"); }, function (update) { return update; });
        if (!me.lastTransform)
            me.svg.transition().duration(200).call(me.zoomFunc.transform, d3.zoomIdentity.translate(containerRect.width / 2, this.nodeParser.height).scale(1));
        //Add container g element
        me.tb = me.svg.selectAll('g.toolbar')
            .data([{ id: 'toolbar' }], function (d) { return d.id; })
            .join(function (enter) { return enter
            .append('g')
            .attr('class', 'toolbar')
            .attr('transform', "translate(10,10)")
            .append('rect')
            .attr('width', 30)
            .attr('height', 30)
            .attr('fill', 'url(#img-fit-icon)')
            .attr('cursor', 'pointer')
            .on('click', function () { return me.fit(); }); }, function (update) { return update; });
        me.prepareDefs();
    };
    // preparing defs
    D3OrgChart.prototype.prepareDefs = function () {
        var me = this;
        // defs
        me.defs = me.svg.selectAll('defs.globalDefs')
            .data([{ id: 'defs' }], function (d) { return d.id; })
            .join(function (enter) {
            var defs = enter.append('defs').attr('class', 'globalDefs');
            addDefaultDefs(defs, {
                'expand-icon': {
                    type: 'icon',
                    backgroundColor: '#05C356',
                    scale: 0.6,
                    color: '#EAFA48',
                    name: 'faPlus'
                },
                'collapse-icon': {
                    type: 'icon',
                    backgroundColor: '#D10303',
                    scale: 0.6,
                    color: '#EAFA48',
                    name: 'faMinus'
                },
                'fit-icon': {
                    type: 'icon',
                    backgroundColor: '#074EF3',
                    scale: 0.9,
                    color: '#EAFA48',
                    name: 'faExpand'
                },
                'default-node-img': me.nodeParser.defaultImage
            }, me.nodeParser);
            //addDefs(defs, me.defsElements);
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
                            type: 'base64',
                            data: me.nodeParser.errorBase64Icon
                        }
                    }]);
            }
        }
        // preparing treemap
        var containerRect = me.container.node().getBoundingClientRect();
        me.treemap = d3.tree() //.size([containerRect.width || 250, containerRect.height])
            .nodeSize([
            (me.nodeParser.width + (this.nodeParser.width * me.options.nodeHorizontalSpaceScale || 0.5)) * 0,
            (me.nodeParser.height + (this.nodeParser.height * me.options.nodeVerticalSpaceScale || 0.8)) * 0
        ])
            .separation(function (a, b) {
            return 1;
        });
        // me.allNodes = me.treemap(me.root).descendants();
        me.checkExpanded(me.root);
    };
    // showing nodes
    D3OrgChart.prototype.showNodes = function (prNode) {
        var _this = this;
        if (prNode === void 0) { prNode = null; }
        var me = this;
        if (!prNode)
            prNode = me.root;
        var nodeRef = {
            x: prNode.x || 0,
            y: prNode.y || 0,
            parent: prNode.parent
        };
        // console.log('Node Before: ', nodeRef.x);
        var updatePosition = {
            x: prNode.x || 0,
            y: prNode.y || 0
        };
        //  Assigns the x and y position for the nodes
        var treeData = me.treemap(me.root);
        // it is necesary for scope 
        var drawNodes = function (container) { return me.nodeParser.drawNodes(container, me.onNodeClick); };
        var drawCollapser = function (nodeGroup) {
            nodeGroup.append('circle')
                .attr('class', 'collapser')
                .attr('cx', me.nodeParser.width / 2)
                .attr('cy', me.nodeParser.height)
                .attr('r', 15)
                .attr('stroke', 'black')
                .attr('stroke-width', 2)
                .on('click', function (node) {
                // console.log('Node X: ', node.x)
                d3.event.preventDefault();
                me.expand(node, true);
            });
        };
        // console.log('Node ref: ', prNode.x, nodeRef.x, nodeRef )
        var nodes = treeData.descendants();
        // probanding
        buildTree(me.root, {
            w: me.nodeParser.width + (this.nodeParser.width * me.options.nodeHorizontalSpaceScale || 0.5),
            h: me.nodeParser.height + (this.nodeParser.height * me.options.nodeVerticalSpaceScale || 0.8)
        });
        // console.log('Nodes: ', nodes);
        // preparing all definitions for nodes
        me.defs.selectAll('pattern.node')
            .data(nodes, function (d) { return d.data.nodeId; })
            .join(function (enter) {
            return enter.filter(function (d) { return d.data.nodeImage != null; })
                .append('pattern').attr('class', 'node')
                .each(function (nodeData, i, enterNodes) {
                // adding pattern
                var pattern = d3.select(enterNodes[i]);
                setPattern(pattern, nodeData.data, me.nodeParser);
            });
        }, function (update) { return update; }, function (exit) { return exit
            .transition()
            .duration(me.nodeParser.transitionDuration)
            .style("opacity", 0)
            .remove(); });
        // rendering nodes
        var nodeStartPosition = function (d) {
            if (nodeRef) {
                return "translate(" + (nodeRef.x - (me.nodeParser.width / 2)) + "," + nodeRef.y + ")";
            }
            if (!d.parent)
                return "translate(" + (d.x - (me.nodeParser.width / 2)) + "," + d.y + ")";
            return "translate(" + (d.parent.x - (me.nodeParser.width / 2)) + "," + d.parent.y + ")";
        };
        var nodePosition = function (params) {
            return "translate(" + (params.x - (me.nodeParser.width / 2)) + "," + params.y + ")";
        };
        var expandIconVisible = function (d) { return (d.children || d._children) ? 'visible' : 'hidden'; };
        var expandIcon = function (d) { return expandIconVisible(d) == 'visible' ? (d.data.expanded ? "url(#img-collapse-icon)" : "url(#img-expand-icon)") : ''; };
        me.chart.selectAll('g.node')
            .data(nodes, function (d) { return d.data.nodeId; })
            .join(function (enter) {
            return enter.append('g')
                .style("opacity", 0)
                .attr('class', 'node')
                .attr('cursor', 'pointer')
                .attr('transform', nodeStartPosition)
                .call(drawNodes)
                .call(drawCollapser)
                .on('dblclick', function (node) {
                var containerRect = me.container.node().getBoundingClientRect();
                me.traslateTo((containerRect.width / 2) - node.x, ((containerRect.height - me.nodeParser.height) / 2) - node.y);
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
        var pathStartingDiagonal = function (d) {
            return _this.linkPath(d, d);
        };
        var pathDiagonal = function (d) {
            var target = { x: d.parent.x, y: d.parent.y + me.nodeParser.height };
            return _this.linkPath(d, d.parent);
        };
        me.chart.selectAll('path.link')
            .data(nodes.slice(1), function (d) { return d.data.nodeId; })
            .join(function (enter) {
            return enter
                .insert('path', 'g')
                .attr('class', 'link')
                .attr('fill', 'none')
                .attr('stroke', 'blue')
                .attr('stroke-width', 2)
                .attr('d', pathStartingDiagonal(nodeRef));
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
        me.chart.attr('transform', d3.event.transform);
    };
    D3OrgChart.prototype._onNodeClick = function (nodeId, node) {
        this.onNodeClick.next({ id: nodeId, node: node });
    };
    //#endregion
    // Generate custom diagonal - play with it here - https://observablehq.com/@bumbeishvili/curved-edges?collection=@bumbeishvili/work-components
    D3OrgChart.prototype.linkPath = function (source, target) {
        var me = this;
        // Calculate some variables based on source and target (s,t) coordinates
        var x = source.x;
        var y = source.y;
        var ex = target.x;
        var ey = target.y + me.nodeParser.height;
        var linkHeight = 25;
        var curveRadius = Math.abs(x - ex) != 0 ? 15 : 0;
        var xrvs = ex - x < 0 ? -1 : 1;
        var yrvs = ey - y < 0 ? -1 : 1;
        var w = Math.abs(ex - x) - (curveRadius * 2);
        var path = "\n      M " + x + " " + y + "\n      L " + x + " " + (y + (linkHeight * yrvs)) + "\n      C " + x + " " + (y + ((linkHeight + curveRadius) * yrvs)) + " " + x + " " + (y + ((linkHeight + curveRadius) * yrvs)) + " " + (x + (curveRadius * xrvs)) + " " + (y + ((linkHeight + curveRadius) * yrvs)) + "\n      L " + (x + ((w + curveRadius) * xrvs)) + " " + (y + ((linkHeight + curveRadius) * yrvs)) + "\n      C " + ex + "  " + (y + ((linkHeight + curveRadius) * yrvs)) + " " + ex + "  " + (y + ((linkHeight + curveRadius) * yrvs)) + " " + ex + " " + (y + ((linkHeight + curveRadius) * yrvs) + (curveRadius * yrvs)) + "\n      L " + ex + " " + ey + "\n    ";
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
        var nodeRef = Object.assign(node);
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
        // expand(node.children, node.data.expanded);
        // console.log('Before expand: ', nodeRef.x,  node.x)
        if (toggle)
            me.showNodes(node);
    };
    D3OrgChart.prototype.traslateTo = function (prX, prY) {
        var me = this;
        me.svg
            .transition().duration(me.nodeParser.transitionDuration)
            .call(me.zoomFunc.transform, d3.zoomIdentity.translate(prX, prY));
    };
    D3OrgChart.prototype.fit = function () {
        var me = this;
        // const zoom = d3.zoom().on("zoom", d => this.zoomed())
        var fit = calcGFit(me.chart, me.svg, me.root, me.nodeParser);
        me.svg.transition().duration(me.nodeParser.transitionDuration).call(me.zoomFunc.transform, d3.zoomIdentity.translate(fit.x, fit.y).scale(fit.scale));
    };
    D3OrgChart.prototype.setOptions = function (prOptions) {
        var me = this;
        me.options = Object.assign(me.options, prOptions);
    };
    return D3OrgChart;
}());
export { D3OrgChart };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZDMtb3JnLWNoYXJ0LmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYmUtb3JnY2hhcnQvIiwic291cmNlcyI6WyJsaWIvY2xhc2Vzcy9kMy1vcmctY2hhcnQuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFFekIsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDMUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUU3QyxPQUFPLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFhLE1BQU0sV0FBVyxDQUFDO0FBWXZGO0lBd0RFLG9CQUFZLFdBQXdCLEVBQUUsU0FBOEI7UUFBcEUsaUJBeUJDOztRQWhGRCx5QkFBeUI7UUFDZixZQUFPLEdBQXVCO1lBQ3RDLGVBQWUsRUFBRSxTQUFTO1lBQzFCLFVBQVUsRUFBRSxJQUFJLGlCQUFpQixFQUFFO1lBQ25DLElBQUksRUFBRSxFQUFFO1lBQ1IsV0FBVyxFQUFFLFFBQVE7WUFDckIsd0JBQXdCLEVBQUUsR0FBRztZQUM3QixzQkFBc0IsRUFBRSxHQUFHO1NBQzVCLENBQUE7UUE2QkQsMkJBQTJCO1FBRWpCLFVBQUssR0FBYyxFQUFFLENBQUM7UUFTaEMsWUFBWTtRQUVaLGFBQVEsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUksQ0FBQyxNQUFNLEVBQUUsRUFBYixDQUFhLENBQUMsQ0FBQztRQUUzRSxnQkFBVyxHQUFXLENBQUMsQ0FBQztRQTJWeEIsZ0JBQWdCO1FBQ2hCLGFBQWE7UUFDYixnQkFBVyxH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QixFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUN6RCxDQUFDO0lBQ0osQ0FBQztJQUVELCtCQUFVLEdBQVYsVUFBVyxTQUFzQztRQUMvQyxJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDaEIsRUFBRSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0FBQyxBQTFmRCxJQTBmQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGQzIGZyb20gJ2QzJztcclxuaW1wb3J0IHsgSUQzTm9kZSwgSUltYWdlRGVmIH0gZnJvbSAnLi4vaW50ZXJmYWNlcyc7XHJcbmltcG9ydCB7IFN1YmplY3QsIGZyb21FdmVudCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IEQzTm9kZUJhc2ljUGFyc2VyIH0gZnJvbSAnLi9AaXRlbXMnO1xyXG5cclxuaW1wb3J0IHsgY2FsY0dGaXQsIHNldFBhdHRlcm4sIGFkZERlZmF1bHREZWZzLCBidWlsZFRyZWUsIElSb290Tm9kZSB9IGZyb20gJy4vZDN4L2QzeCc7XHJcbmltcG9ydCB7IEJhc2VUeXBlIH0gZnJvbSAnZDMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJRDNPcmdDaGFydE9wdGlvbnMge1xyXG4gIG5vZGVQYXJzZXI/OiBEM05vZGVCYXNpY1BhcnNlcjtcclxuICBkYXRhPzogSUQzTm9kZVtdO1xyXG4gIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcclxuICBkZWZhdWx0Rm9udD86IHN0cmluZztcclxuICBub2RlSG9yaXpvbnRhbFNwYWNlU2NhbGU/OiBudW1iZXI7XHJcbiAgbm9kZVZlcnRpY2FsU3BhY2VTY2FsZT86IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEQzT3JnQ2hhcnQge1xyXG4gIC8vI3JlZ2lvbiBEZWZhdWx0IE9wdGlvbnNcclxuICBwcm90ZWN0ZWQgb3B0aW9uczogSUQzT3JnQ2hhcnRPcHRpb25zID0ge1xyXG4gICAgYmFja2dyb3VuZENvbG9yOiAnIzAzQTNDNScsXHJcbiAgICBub2RlUGFyc2VyOiBuZXcgRDNOb2RlQmFzaWNQYXJzZXIoKSxcclxuICAgIGRhdGE6IFtdLFxyXG4gICAgZGVmYXVsdEZvbnQ6ICdUYWhvbWEnLFxyXG4gICAgbm9kZUhvcml6b250YWxTcGFjZVNjYWxlOiAwLjUsXHJcbiAgICBub2RlVmVydGljYWxTcGFjZVNjYWxlOiAwLjhcclxuICB9XHJcbiAgLy8jZW5kcmVnaW9uXHJcblxyXG4gIC8vI3JlZ2lvbiAgTk9ERSBQQVJTRVJcclxuICBwcm90ZWN0ZWQgX25vZGVQYXJzZXI6IEQzTm9kZUJhc2ljUGFyc2VyO1xyXG4gIGdldCBub2RlUGFyc2VyKCk6IEQzTm9kZUJhc2ljUGFyc2VyIHtcclxuICAgIGlmICghdGhpcy5fbm9kZVBhcnNlcikgdGhpcy5fbm9kZVBhcnNlciA9IG5ldyBEM05vZGVCYXNpY1BhcnNlcigpO1xyXG4gICAgcmV0dXJuIHRoaXMuX25vZGVQYXJzZXI7XHJcbiAgfVxyXG4gIHNldCBub2RlUGFyc2VyKHBhcnNlcjogRDNOb2RlQmFzaWNQYXJzZXIpIHtcclxuICAgIHRoaXMuX25vZGVQYXJzZXIgPSBwYXJzZXI7XHJcbiAgICAvLyB0aGlzLnJlbmRlcigpO1xyXG4gIH1cclxuICAvLyNlbmRyZWdpb25cclxuXHJcbiAgLy8jcmVnaW9uIFNWRyBjb21wb25lbnRzXHJcbiAgcHJvdGVjdGVkIGNvbnRhaW5lcjogZDMuU2VsZWN0aW9uPEhUTUxFbGVtZW50LCBhbnksIGFueSwgYW55PjtcclxuICBwcm90ZWN0ZWQgc3ZnOiBkMy5TZWxlY3Rpb248U1ZHRWxlbWVudCwgdW5rbm93biwgSFRNTEVsZW1lbnQsIHVua25vd24+O1xyXG4gIHByb3RlY3RlZCB0YjogZDMuU2VsZWN0aW9uPGFueSwgYW55LCBhbnksIGFueT47XHJcblxyXG4gIHByb3RlY3RlZCBjaGFydDogZDMuU2VsZWN0aW9uPFNWR0dFbGVtZW50LCBhbnksIEJhc2VUeXBlLCBhbnk+O1xyXG4gIC8vIHByb3RlY3RlZCBjZW50ZXJHOiBkMy5TZWxlY3Rpb248YW55LCBhbnksIGFueSwgYW55PjtcclxuICBwcm90ZWN0ZWQgZGVmczogZDMuU2VsZWN0aW9uPGFueSwgYW55LCBhbnksIGFueT47XHJcblxyXG4gIHByb3RlY3RlZCBsYXN0VHJhbnNmb3JtOiBhbnk7XHJcbiAgLy8jZW5kcmVnaW9uXHJcblxyXG4gIC8vI3JlZ2lvbiBEQVRBXHJcbiAgcHJvdGVjdGVkIHJvb3Q6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPjtcclxuICAvLyBwcm90ZWN0ZWQgYWxsTm9kZXM6IGFueTtcclxuXHJcbiAgcHJvdGVjdGVkIF9kYXRhOiBJRDNOb2RlW10gPSBbXTtcclxuICBnZXQgZGF0YSgpOiBJRDNOb2RlW10ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEgfHwgW107XHJcbiAgfVxyXG5cclxuICBzZXQgZGF0YShkYXRhOiBJRDNOb2RlW10pIHtcclxuICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xyXG4gICAgLy8gdGhpcy5yZW5kZXIoKVxyXG4gIH1cclxuICAvLyNlbmRyZWdpb25cclxuXHJcbiAgem9vbUZ1bmMgPSBkMy56b29tKCkuc2NhbGVFeHRlbnQoWzAuMSwgMjBdKS5vbihcInpvb21cIiwgZCA9PiB0aGlzLnpvb21lZCgpKTtcclxuXHJcbiAgY3VycmVudFpvb206IG51bWJlciA9IDE7XHJcbiAgdHJlZW1hcDogZDMuVHJlZUxheW91dDxJRDNOb2RlPjtcclxuXHJcbiAgY29uc3RydWN0b3IocHJDb250YWluZXI6IEhUTUxFbGVtZW50LCBwck9wdGlvbnM/OiBJRDNPcmdDaGFydE9wdGlvbnMpIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuXHJcbiAgICAvLyBpbml0IGNvbnRhaW5lclxyXG4gICAgbWUuY29udGFpbmVyID0gZDMuc2VsZWN0KHByQ29udGFpbmVyKTtcclxuXHJcbiAgICAvL0lmIERhdGEgYXJndW1lbnQgcGFzc2VkIC0gdGhlbiBzZXQgaXRcclxuICAgIGlmIChwck9wdGlvbnM/LmRhdGEpIG1lLl9kYXRhID0gcHJPcHRpb25zLmRhdGE7XHJcblxyXG4gICAgLy8gc2V0dGluZyBwYXJzZXJcclxuICAgIG1lLl9ub2RlUGFyc2VyID0gcHJPcHRpb25zPy5ub2RlUGFyc2VyIHx8IG1lLm9wdGlvbnMubm9kZVBhcnNlcjtcclxuXHJcbiAgICAvLyBhcHBseWluZyBvcHRpb25zXHJcbiAgICBtZS5vcHRpb25zID0gT2JqZWN0LmFzc2lnbihtZS5vcHRpb25zLCBwck9wdGlvbnMpO1xyXG5cclxuICAgIC8vIG1vbml0b3IgcmVzaXplXHJcbiAgICBmcm9tRXZlbnQod2luZG93LCAncmVzaXplJylcclxuICAgICAgLnBpcGUoXHJcbiAgICAgICAgZGVib3VuY2VUaW1lKDMwMClcclxuICAgICAgKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgLy8gSERDIC0gVkVSIHRoaXMucHJlcGFyZUNhbnZhcygpO1xyXG4gICAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgIClcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuICAgIC8vIHByZXBhcmluZyBzdmdcclxuICAgIG1lLnByZXBhcmVDYW52YXMoKTtcclxuXHJcbiAgICAvLyBpZiBubyBkYXRhIHRoZW4gcmV0dXJuXHJcbiAgICBpZiAoIW1lLmRhdGEubGVuZ3RoKSByZXR1cm47XHJcblxyXG4gICAgLy8gcHJlcGFyaW5nIGRhdGFcclxuICAgIG1lLnByZXBhcmVEYXRhKCk7XHJcblxyXG4gICAgLy8gc2hvd2luZyBub2Rlc1xyXG4gICAgbWUuc2hvd05vZGVzKCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIHByZXBhcmluZyBjYW52YXNcclxuICBwcm90ZWN0ZWQgcHJlcGFyZUNhbnZhcygpIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuXHJcbiAgICAvL0RyYXdpbmcgY29udGFpbmVyc1xyXG4gICAgY29uc3QgY29udGFpbmVyUmVjdCA9IG1lLmNvbnRhaW5lci5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBtZS5zdmcgPSBtZS5jb250YWluZXIuc2VsZWN0QWxsPFNWR0VsZW1lbnQsIGFueT4oJ3N2ZycpXHJcbiAgICAgIC5kYXRhKFt7IGlkOiAnc3ZnJyB9XSwgKGQ6IHsgaWQ6IHN0cmluZyB9KSA9PiBkLmlkKVxyXG4gICAgICAuam9pbihcclxuICAgICAgICBlbnRlciA9PlxyXG4gICAgICAgICAgZW50ZXJcclxuICAgICAgICAgICAgLmFwcGVuZCgnc3ZnJylcclxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3N2Zy1jaGFydC1jb250YWluZXInKVxyXG4gICAgICAgICAgICAuYXR0cignZm9udC1mYW1pbHknLCBtZS5vcHRpb25zLmRlZmF1bHRGb250KVxyXG4gICAgICAgICAgICAvLyAuY2FsbChkMy56b29tKCkub24oXCJ6b29tXCIsIGQgPT4gdGhpcy56b29tZWQoKSkpXHJcbiAgICAgICAgICAgIC5jYWxsKHRoaXMuem9vbUZ1bmMpXHJcbiAgICAgICAgICAgIC5vbihcImRibGNsaWNrLnpvb21cIiwgbnVsbClcclxuICAgICAgICAgICAgLmF0dHIoJ2N1cnNvcicsICdtb3ZlJylcclxuICAgICAgICAgICAgLnN0eWxlKCdiYWNrZ3JvdW5kLWNvbG9yJywgbWUub3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IpLFxyXG4gICAgICAgIHVwZGF0ZSA9PlxyXG4gICAgICAgICAgdXBkYXRlXHJcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIGNvbnRhaW5lclJlY3Qud2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCBjb250YWluZXJSZWN0LmhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoJ2ZvbnQtZmFtaWx5JywgbWUub3B0aW9ucy5kZWZhdWx0Rm9udClcclxuICAgICAgICAgICAgLnN0eWxlKCdiYWNrZ3JvdW5kLWNvbG9yJywgbWUub3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IpXHJcbiAgICAgICk7XHJcblxyXG4gICAgLy9BZGQgY29udGFpbmVyIGcgZWxlbWVudFxyXG4gICAgbWUuY2hhcnQgPSBtZS5zdmcuc2VsZWN0QWxsPFNWR0dFbGVtZW50LCBhbnk+KCdnLmNoYXJ0JylcclxuICAgICAgLmRhdGEoW3sgaWQ6ICdjaGFydCcgfV0sIChkOiB7IGlkOiBzdHJpbmcgfSkgPT4gZC5pZClcclxuICAgICAgLmpvaW4oXHJcbiAgICAgICAgZW50ZXIgPT4gZW50ZXJcclxuICAgICAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2NoYXJ0JylcclxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsMClgKSxcclxuICAgICAgICB1cGRhdGUgPT4gdXBkYXRlXHJcbiAgICAgIClcclxuICAgIGlmICghbWUubGFzdFRyYW5zZm9ybSlcclxuICAgICAgbWUuc3ZnLnRyYW5zaXRpb24oKS5kdXJhdGlvbigyMDApLmNhbGwoXHJcbiAgICAgICAgbWUuem9vbUZ1bmMudHJhbnNmb3JtLFxyXG4gICAgICAgIGQzLnpvb21JZGVudGl0eS50cmFuc2xhdGUoY29udGFpbmVyUmVjdC53aWR0aCAvIDIsIHRoaXMubm9kZVBhcnNlci5oZWlnaHQpLnNjYWxlKDEpXHJcbiAgICAgICk7XHJcblxyXG4gICAgLy9BZGQgY29udGFpbmVyIGcgZWxlbWVudFxyXG4gICAgbWUudGIgPSBtZS5zdmcuc2VsZWN0QWxsKCdnLnRvb2xiYXInKVxyXG4gICAgICAuZGF0YShbeyBpZDogJ3Rvb2xiYXInIH1dLCAoZDogeyBpZDogc3RyaW5nIH0pID0+IGQuaWQpXHJcbiAgICAgIC5qb2luKFxyXG4gICAgICAgIGVudGVyID0+IGVudGVyXHJcbiAgICAgICAgICAuYXBwZW5kKCdnJylcclxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd0b29sYmFyJylcclxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDEwLDEwKWApXHJcbiAgICAgICAgICAuYXBwZW5kKCdyZWN0JylcclxuICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIDMwKVxyXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIDMwKVxyXG4gICAgICAgICAgLmF0dHIoJ2ZpbGwnLCAndXJsKCNpbWctZml0LWljb24pJylcclxuICAgICAgICAgIC5hdHRyKCdjdXJzb3InLCAncG9pbnRlcicpXHJcbiAgICAgICAgICAub24oJ2NsaWNrJywgKCkgPT4gbWUuZml0KCkpLFxyXG4gICAgICAgIHVwZGF0ZSA9PiB1cGRhdGVcclxuICAgICAgKVxyXG4gICAgbWUucHJlcGFyZURlZnMoKTtcclxuICB9XHJcblxyXG4gIC8vIHByZXBhcmluZyBkZWZzXHJcbiAgcHJlcGFyZURlZnMoKSB7XHJcbiAgICBjb25zdCBtZSA9IHRoaXM7XHJcbiAgICAvLyBkZWZzXHJcbiAgICBtZS5kZWZzID0gbWUuc3ZnLnNlbGVjdEFsbCgnZGVmcy5nbG9iYWxEZWZzJylcclxuICAgICAgLmRhdGEoW3sgaWQ6ICdkZWZzJyB9XSwgKGQ6IHsgaWQ6IHN0cmluZyB9KSA9PiBkLmlkKVxyXG4gICAgICAuam9pbihcclxuICAgICAgICBlbnRlciA9PiB7XHJcbiAgICAgICAgICBjb25zdCBkZWZzID0gZW50ZXIuYXBwZW5kKCdkZWZzJykuYXR0cignY2xhc3MnLCAnZ2xvYmFsRGVmcycpO1xyXG4gICAgICAgICAgYWRkRGVmYXVsdERlZnMoZGVmcywge1xyXG4gICAgICAgICAgICAnZXhwYW5kLWljb24nOiB7XHJcbiAgICAgICAgICAgICAgdHlwZTogJ2ljb24nLFxyXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyMwNUMzNTYnLFxyXG4gICAgICAgICAgICAgIHNjYWxlOiAwLjYsXHJcbiAgICAgICAgICAgICAgY29sb3I6ICcjRUFGQTQ4JyxcclxuICAgICAgICAgICAgICBuYW1lOiAnZmFQbHVzJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnY29sbGFwc2UtaWNvbic6IHtcclxuICAgICAgICAgICAgICB0eXBlOiAnaWNvbicsXHJcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI0QxMDMwMycsXHJcbiAgICAgICAgICAgICAgc2NhbGU6IDAuNixcclxuICAgICAgICAgICAgICBjb2xvcjogJyNFQUZBNDgnLFxyXG4gICAgICAgICAgICAgIG5hbWU6ICdmYU1pbnVzJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnZml0LWljb24nOiB7XHJcbiAgICAgICAgICAgICAgdHlwZTogJ2ljb24nLFxyXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyMwNzRFRjMnLFxyXG4gICAgICAgICAgICAgIHNjYWxlOiAwLjksXHJcbiAgICAgICAgICAgICAgY29sb3I6ICcjRUFGQTQ4JyxcclxuICAgICAgICAgICAgICBuYW1lOiAnZmFFeHBhbmQnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdkZWZhdWx0LW5vZGUtaW1nJzogbWUubm9kZVBhcnNlci5kZWZhdWx0SW1hZ2UgYXMgSUltYWdlRGVmXHJcbiAgICAgICAgICB9LCBtZS5ub2RlUGFyc2VyKVxyXG4gICAgICAgICAgLy9hZGREZWZzKGRlZnMsIG1lLmRlZnNFbGVtZW50cyk7XHJcbiAgICAgICAgICByZXR1cm4gZGVmc1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdXBkYXRlID0+IHVwZGF0ZVxyXG4gICAgICApXHJcbiAgfVxyXG5cclxuICAvLyBwcmVwYXJpbmcgZGF0YVxyXG4gIHByb3RlY3RlZCBwcmVwYXJlRGF0YSgpIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuXHJcbiAgICAvLyBpZiBubyBkYXRhIHJldHVybiBcclxuICAgIGlmICghbWUuZGF0YS5sZW5ndGgpIHJldHVybjtcclxuXHJcbiAgICAvLyBDb252ZXJ0IGZsYXQgZGF0YSB0byBoaWVyYXJjaGljYWxcclxuICAgIGlmICghbWUucm9vdCkge1xyXG4gICAgICB0cnkgeyAvLyBwcmV2ZW50aW5nIG11bHRpcGxlIHJvb3RcclxuICAgICAgICBtZS5yb290ID0gZDMuc3RyYXRpZnk8SUQzTm9kZT4oKS5pZCgoeyBub2RlSWQgfSkgPT4gbm9kZUlkKS5wYXJlbnRJZCgoeyBwYXJlbnROb2RlSWQgfSkgPT4gcGFyZW50Tm9kZUlkKVxyXG4gICAgICAgICAgKG1lLmRhdGEpIGFzIGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPjtcclxuICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgbWUucm9vdCA9IGQzLnN0cmF0aWZ5PElEM05vZGU+KCkuaWQoKHsgbm9kZUlkIH0pID0+IG5vZGVJZCkucGFyZW50SWQoKHsgcGFyZW50Tm9kZUlkIH0pID0+IHBhcmVudE5vZGVJZClcclxuICAgICAgICAgIChbe1xyXG4gICAgICAgICAgICBub2RlSWQ6ICdyb290JyxcclxuICAgICAgICAgICAgcGFyZW50Tm9kZUlkOiAnJyxcclxuICAgICAgICAgICAgdGl0bGU6ICdFcnJvcicsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBlcnIubWVzc2FnZSB8fCBlcnIsXHJcbiAgICAgICAgICAgIG5vZGVJbWFnZToge1xyXG4gICAgICAgICAgICAgIHR5cGU6ICdiYXNlNjQnLFxyXG4gICAgICAgICAgICAgIGRhdGE6IG1lLm5vZGVQYXJzZXIuZXJyb3JCYXNlNjRJY29uXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1dKSBhcyBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT47XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBwcmVwYXJpbmcgdHJlZW1hcFxyXG4gICAgY29uc3QgY29udGFpbmVyUmVjdCA9IG1lLmNvbnRhaW5lci5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBtZS50cmVlbWFwID0gZDMudHJlZTxJRDNOb2RlPigpIC8vLnNpemUoW2NvbnRhaW5lclJlY3Qud2lkdGggfHwgMjUwLCBjb250YWluZXJSZWN0LmhlaWdodF0pXHJcbiAgICAgIC5ub2RlU2l6ZShbXHJcbiAgICAgICAgKG1lLm5vZGVQYXJzZXIud2lkdGggKyAodGhpcy5ub2RlUGFyc2VyLndpZHRoICogbWUub3B0aW9ucy5ub2RlSG9yaXpvbnRhbFNwYWNlU2NhbGUgfHwgMC41KSkgKiAwLFxyXG4gICAgICAgIChtZS5ub2RlUGFyc2VyLmhlaWdodCArICh0aGlzLm5vZGVQYXJzZXIuaGVpZ2h0ICogbWUub3B0aW9ucy5ub2RlVmVydGljYWxTcGFjZVNjYWxlIHx8IDAuOCkpICogMFxyXG4gICAgICBdKVxyXG4gICAgICAuc2VwYXJhdGlvbigoYTogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+LCBiOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4pID0+IHtcclxuICAgICAgICByZXR1cm4gMVxyXG4gICAgICB9KVxyXG4gICAgLy8gbWUuYWxsTm9kZXMgPSBtZS50cmVlbWFwKG1lLnJvb3QpLmRlc2NlbmRhbnRzKCk7XHJcbiAgICBtZS5jaGVja0V4cGFuZGVkKG1lLnJvb3QpO1xyXG4gIH1cclxuXHJcbiAgLy8gc2hvd2luZyBub2Rlc1xyXG4gIHByb3RlY3RlZCBzaG93Tm9kZXMocHJOb2RlOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4gPSBudWxsKSB7XHJcbiAgICBjb25zdCBtZSA9IHRoaXM7XHJcblxyXG4gICAgaWYgKCFwck5vZGUpIHByTm9kZSA9IG1lLnJvb3Q7XHJcbiAgICBjb25zdCBub2RlUmVmID0ge1xyXG4gICAgICB4OiBwck5vZGUueCB8fCAwLFxyXG4gICAgICB5OiBwck5vZGUueSB8fCAwLFxyXG4gICAgICBwYXJlbnQ6IHByTm9kZS5wYXJlbnRcclxuICAgIH07XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ05vZGUgQmVmb3JlOiAnLCBub2RlUmVmLngpO1xyXG4gICAgY29uc3QgdXBkYXRlUG9zaXRpb246IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSA9IHtcclxuICAgICAgeDogcHJOb2RlLnggfHwgMCxcclxuICAgICAgeTogcHJOb2RlLnkgfHwgMFxyXG4gICAgfVxyXG5cclxuICAgIC8vICBBc3NpZ25zIHRoZSB4IGFuZCB5IHBvc2l0aW9uIGZvciB0aGUgbm9kZXNcclxuICAgIGNvbnN0IHRyZWVEYXRhID0gbWUudHJlZW1hcChtZS5yb290KTtcclxuICAgIC8vIGl0IGlzIG5lY2VzYXJ5IGZvciBzY29wZSBcclxuICAgIGNvbnN0IGRyYXdOb2RlcyA9IChjb250YWluZXIpID0+IG1lLm5vZGVQYXJzZXIuZHJhd05vZGVzKGNvbnRhaW5lciwgbWUub25Ob2RlQ2xpY2spO1xyXG4gICAgY29uc3QgZHJhd0NvbGxhcHNlciA9IChub2RlR3JvdXA6IGQzLlNlbGVjdGlvbjxTVkdHRWxlbWVudCwgZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+LCBhbnksIGFueT4pID0+IHtcclxuICAgICAgbm9kZUdyb3VwLmFwcGVuZCgnY2lyY2xlJylcclxuICAgICAgICAuYXR0cignY2xhc3MnLCAnY29sbGFwc2VyJylcclxuICAgICAgICAuYXR0cignY3gnLCBtZS5ub2RlUGFyc2VyLndpZHRoIC8gMilcclxuICAgICAgICAuYXR0cignY3knLCBtZS5ub2RlUGFyc2VyLmhlaWdodClcclxuICAgICAgICAuYXR0cigncicsIDE1KVxyXG4gICAgICAgIC5hdHRyKCdzdHJva2UnLCAnYmxhY2snKVxyXG4gICAgICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCAyKVxyXG4gICAgICAgIC5vbignY2xpY2snLCAobm9kZSkgPT4ge1xyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ05vZGUgWDogJywgbm9kZS54KVxyXG4gICAgICAgICAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIG1lLmV4cGFuZChub2RlLCB0cnVlKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICAvLyBjb25zb2xlLmxvZygnTm9kZSByZWY6ICcsIHByTm9kZS54LCBub2RlUmVmLngsIG5vZGVSZWYgKVxyXG4gICAgY29uc3Qgbm9kZXMgPSB0cmVlRGF0YS5kZXNjZW5kYW50cygpO1xyXG5cclxuICAgIC8vIHByb2JhbmRpbmdcclxuICAgIGJ1aWxkVHJlZShcclxuICAgICAgbWUucm9vdCxcclxuICAgICAge1xyXG4gICAgICAgIHc6IG1lLm5vZGVQYXJzZXIud2lkdGggKyAodGhpcy5ub2RlUGFyc2VyLndpZHRoICogbWUub3B0aW9ucy5ub2RlSG9yaXpvbnRhbFNwYWNlU2NhbGUgfHwgMC41KSxcclxuICAgICAgICBoOiBtZS5ub2RlUGFyc2VyLmhlaWdodCArICh0aGlzLm5vZGVQYXJzZXIuaGVpZ2h0ICogbWUub3B0aW9ucy5ub2RlVmVydGljYWxTcGFjZVNjYWxlIHx8IDAuOClcclxuICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygnTm9kZXM6ICcsIG5vZGVzKTtcclxuICAgIC8vIHByZXBhcmluZyBhbGwgZGVmaW5pdGlvbnMgZm9yIG5vZGVzXHJcbiAgICBtZS5kZWZzLnNlbGVjdEFsbCgncGF0dGVybi5ub2RlJylcclxuICAgICAgLmRhdGEobm9kZXMsIChkOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4pID0+IGQuZGF0YS5ub2RlSWQpXHJcbiAgICAgIC5qb2luKFxyXG4gICAgICAgIGVudGVyID0+XHJcbiAgICAgICAgICBlbnRlci5maWx0ZXIoZCA9PiBkLmRhdGEubm9kZUltYWdlICE9IG51bGwpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJ3BhdHRlcm4nKS5hdHRyKCdjbGFzcycsICdub2RlJylcclxuICAgICAgICAgICAgLmVhY2goKG5vZGVEYXRhLCBpLCBlbnRlck5vZGVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgLy8gYWRkaW5nIHBhdHRlcm5cclxuICAgICAgICAgICAgICBjb25zdCBwYXR0ZXJuID0gZDMuc2VsZWN0KGVudGVyTm9kZXNbaV0pO1xyXG4gICAgICAgICAgICAgIHNldFBhdHRlcm4ocGF0dGVybiwgbm9kZURhdGEuZGF0YSwgbWUubm9kZVBhcnNlcik7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgIHVwZGF0ZSA9PiB1cGRhdGUsXHJcbiAgICAgICAgZXhpdCA9PiBleGl0XHJcbiAgICAgICAgICAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAuZHVyYXRpb24obWUubm9kZVBhcnNlci50cmFuc2l0aW9uRHVyYXRpb24pXHJcbiAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApXHJcbiAgICAgICAgICAucmVtb3ZlKClcclxuICAgICAgKVxyXG5cclxuICAgIC8vIHJlbmRlcmluZyBub2Rlc1xyXG4gICAgY29uc3Qgbm9kZVN0YXJ0UG9zaXRpb24gPSAoZDogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+KSA9PiB7XHJcbiAgICAgIGlmIChub2RlUmVmKSB7XHJcbiAgICAgICAgcmV0dXJuIGB0cmFuc2xhdGUoJHtub2RlUmVmLnggLSAobWUubm9kZVBhcnNlci53aWR0aCAvIDIpfSwke25vZGVSZWYueX0pYFxyXG4gICAgICB9XHJcbiAgICAgIGlmICghZC5wYXJlbnQpIHJldHVybiBgdHJhbnNsYXRlKCR7ZC54IC0gKG1lLm5vZGVQYXJzZXIud2lkdGggLyAyKX0sJHtkLnl9KWA7XHJcbiAgICAgIHJldHVybiBgdHJhbnNsYXRlKCR7ZC5wYXJlbnQueCAtIChtZS5ub2RlUGFyc2VyLndpZHRoIC8gMil9LCR7ZC5wYXJlbnQueX0pYFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG5vZGVQb3NpdGlvbiA9IChwYXJhbXM6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSkgPT5cclxuICAgICAgYHRyYW5zbGF0ZSgke3BhcmFtcy54IC0gKG1lLm5vZGVQYXJzZXIud2lkdGggLyAyKX0sJHtwYXJhbXMueX0pYDtcclxuXHJcbiAgICBjb25zdCBleHBhbmRJY29uVmlzaWJsZSA9XHJcbiAgICAgIChkOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4gJiB7IF9jaGlsZHJlbj86IGFueSB9KSA9PiAoZC5jaGlsZHJlbiB8fCBkLl9jaGlsZHJlbikgPyAndmlzaWJsZScgOiAnaGlkZGVuJztcclxuICAgIGNvbnN0IGV4cGFuZEljb24gPVxyXG4gICAgICAoZDogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+ICYgeyBfY2hpbGRyZW4/OiBhbnkgfSkgPT4gZXhwYW5kSWNvblZpc2libGUoZCkgPT0gJ3Zpc2libGUnID8gKGQuZGF0YS5leHBhbmRlZCA/IGB1cmwoI2ltZy1jb2xsYXBzZS1pY29uKWAgOiBgdXJsKCNpbWctZXhwYW5kLWljb24pYCkgOiAnJztcclxuXHJcblxyXG4gICAgbWUuY2hhcnQuc2VsZWN0QWxsKCdnLm5vZGUnKVxyXG4gICAgICAuZGF0YShub2RlcywgKGQ6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPikgPT4gZC5kYXRhLm5vZGVJZClcclxuICAgICAgLmpvaW4oXHJcbiAgICAgICAgZW50ZXIgPT5cclxuICAgICAgICAgIGVudGVyLmFwcGVuZCgnZycpXHJcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ25vZGUnKVxyXG4gICAgICAgICAgICAuYXR0cignY3Vyc29yJywgJ3BvaW50ZXInKVxyXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgbm9kZVN0YXJ0UG9zaXRpb24pXHJcbiAgICAgICAgICAgIC5jYWxsKGRyYXdOb2RlcylcclxuICAgICAgICAgICAgLmNhbGwoZHJhd0NvbGxhcHNlcilcclxuICAgICAgICAgICAgLm9uKCdkYmxjbGljaycsIChub2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgY29udGFpbmVyUmVjdCA9IG1lLmNvbnRhaW5lci5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICAgICAgbWUudHJhc2xhdGVUbygoY29udGFpbmVyUmVjdC53aWR0aCAvIDIpIC0gbm9kZS54LCAoKGNvbnRhaW5lclJlY3QuaGVpZ2h0IC0gbWUubm9kZVBhcnNlci5oZWlnaHQpIC8gMikgLSBub2RlLnkpXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgIHVwZGF0ZSA9PiB1cGRhdGUsXHJcbiAgICAgICAgZXhpdCA9PlxyXG4gICAgICAgICAgZXhpdFxyXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgIC5kdXJhdGlvbihtZS5ub2RlUGFyc2VyLnRyYW5zaXRpb25EdXJhdGlvbilcclxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIG5vZGVQb3NpdGlvbihwck5vZGUpKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApXHJcbiAgICAgICAgICAgIC5yZW1vdmUoKVxyXG4gICAgICApXHJcbiAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24obWUubm9kZVBhcnNlci50cmFuc2l0aW9uRHVyYXRpb24pXHJcbiAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMSlcclxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIG5vZGVQb3NpdGlvbilcclxuICAgICAgLnNlbGVjdEFsbCgnY2lyY2xlLmNvbGxhcHNlcicpXHJcbiAgICAgIC5hdHRyKCd2aXNpYmlsaXR5JywgZXhwYW5kSWNvblZpc2libGUpXHJcbiAgICAgIC5hdHRyKCdmaWxsJywgZXhwYW5kSWNvbilcclxuXHJcbiAgICAvLyByZW5kZXJpbmcgbGlua3NcclxuICAgIGNvbnN0IHBhdGhTdGFydGluZ0RpYWdvbmFsID0gKGQ6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIsIHBhcmVudDogSVJvb3ROb2RlPElEM05vZGU+IH0pID0+IHtcclxuICAgICAgcmV0dXJuIHRoaXMubGlua1BhdGgoZCwgZClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwYXRoRGlhZ29uYWwgPSAoZDogSVJvb3ROb2RlPElEM05vZGU+KSA9PiB7XHJcbiAgICAgIGNvbnN0IHRhcmdldCA9IHsgeDogZC5wYXJlbnQueCwgeTogZC5wYXJlbnQueSArIG1lLm5vZGVQYXJzZXIuaGVpZ2h0IH07XHJcbiAgICAgIHJldHVybiB0aGlzLmxpbmtQYXRoKGQsIGQucGFyZW50KVxyXG4gICAgfVxyXG5cclxuICAgIG1lLmNoYXJ0LnNlbGVjdEFsbCgncGF0aC5saW5rJylcclxuICAgICAgLmRhdGEobm9kZXMuc2xpY2UoMSksIChkOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4pID0+IGQuZGF0YS5ub2RlSWQpXHJcbiAgICAgIC5qb2luKFxyXG4gICAgICAgIGVudGVyID0+XHJcbiAgICAgICAgICBlbnRlclxyXG4gICAgICAgICAgICAuaW5zZXJ0KCdwYXRoJywgJ2cnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGluaycpXHJcbiAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgJ25vbmUnKVxyXG4gICAgICAgICAgICAuYXR0cignc3Ryb2tlJywgJ2JsdWUnKVxyXG4gICAgICAgICAgICAuYXR0cignc3Ryb2tlLXdpZHRoJywgMilcclxuICAgICAgICAgICAgLmF0dHIoJ2QnLCBwYXRoU3RhcnRpbmdEaWFnb25hbChub2RlUmVmKSksXHJcbiAgICAgICAgdXBkYXRlID0+IHVwZGF0ZSxcclxuICAgICAgICBleGl0ID0+XHJcbiAgICAgICAgICBleGl0XHJcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24obWUubm9kZVBhcnNlci50cmFuc2l0aW9uRHVyYXRpb24pXHJcbiAgICAgICAgICAgIC5hdHRyKCdkJywgcGF0aFN0YXJ0aW5nRGlhZ29uYWwocHJOb2RlKSlcclxuICAgICAgICAgICAgLnJlbW92ZSgpXHJcbiAgICAgIClcclxuICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihtZS5ub2RlUGFyc2VyLnRyYW5zaXRpb25EdXJhdGlvbilcclxuICAgICAgLmF0dHIoJ2QnLCBwYXRoRGlhZ29uYWwpO1xyXG4gIH1cclxuXHJcbiAgLy8gWm9vbSBoYW5kbGVyIGZ1bmN0aW9uXHJcbiAgem9vbWVkKCkge1xyXG4gICAgY29uc3QgbWUgPSB0aGlzO1xyXG4gICAgLy8gU2F2aW5nIGQzIGV2ZW50J3MgdHJhbnNmb3JtIG9iamVjdFxyXG4gICAgbWUubGFzdFRyYW5zZm9ybSA9IGQzLmV2ZW50LnRyYW5zZm9ybTtcclxuICAgIC8vIFJlcG9zaXRpb24gYW5kIHJlc2NhbGUgY2hhcnQgYWNjb3JkaW5nbHlcclxuICAgIG1lLmNoYXJ0LmF0dHIoJ3RyYW5zZm9ybScsIGQzLmV2ZW50LnRyYW5zZm9ybSk7XHJcbiAgfVxyXG5cclxuICAvLyNyZWdpb24gRXZlbnRzXHJcbiAgLy8gbm9kZSBjbGlja1xyXG4gIG9uTm9kZUNsaWNrOiBTdWJqZWN0PHsgaWQ6IHN0cmluZywgbm9kZTogSUQzTm9kZSB9PiA9IG5ldyBTdWJqZWN0KCk7XHJcbiAgcHJvdGVjdGVkIF9vbk5vZGVDbGljayhub2RlSWQ6IHN0cmluZywgbm9kZTogSUQzTm9kZSkge1xyXG4gICAgdGhpcy5vbk5vZGVDbGljay5uZXh0KHsgaWQ6IG5vZGVJZCwgbm9kZTogbm9kZSB9KTtcclxuICB9XHJcbiAgLy8jZW5kcmVnaW9uXHJcblxyXG4gIC8vIEdlbmVyYXRlIGN1c3RvbSBkaWFnb25hbCAtIHBsYXkgd2l0aCBpdCBoZXJlIC0gaHR0cHM6Ly9vYnNlcnZhYmxlaHEuY29tL0BidW1iZWlzaHZpbGkvY3VydmVkLWVkZ2VzP2NvbGxlY3Rpb249QGJ1bWJlaXNodmlsaS93b3JrLWNvbXBvbmVudHNcclxuICBsaW5rUGF0aChzb3VyY2U6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIsIHBhcmVudDogSVJvb3ROb2RlPElEM05vZGU+IH0sIHRhcmdldDogeyB4OiBudW1iZXIsIHk6IG51bWJlciwgcGFyZW50OiBJUm9vdE5vZGU8SUQzTm9kZT4gfSkge1xyXG4gICAgY29uc3QgbWUgPSB0aGlzO1xyXG5cclxuICAgIC8vIENhbGN1bGF0ZSBzb21lIHZhcmlhYmxlcyBiYXNlZCBvbiBzb3VyY2UgYW5kIHRhcmdldCAocyx0KSBjb29yZGluYXRlc1xyXG4gICAgbGV0IHggPSBzb3VyY2UueDtcclxuICAgIGxldCB5ID0gc291cmNlLnk7XHJcbiAgICBjb25zdCBleCA9IHRhcmdldC54O1xyXG4gICAgY29uc3QgZXkgPSB0YXJnZXQueSArIG1lLm5vZGVQYXJzZXIuaGVpZ2h0O1xyXG5cclxuICAgIGNvbnN0IGxpbmtIZWlnaHQgPSAyNTtcclxuICAgIGNvbnN0IGN1cnZlUmFkaXVzID0gTWF0aC5hYnMoeCAtIGV4KSAhPSAwID8gMTUgOiAwO1xyXG5cclxuICAgIGxldCB4cnZzID0gZXggLSB4IDwgMCA/IC0xIDogMTtcclxuICAgIGxldCB5cnZzID0gZXkgLSB5IDwgMCA/IC0xIDogMTtcclxuICAgIGxldCB3ID0gTWF0aC5hYnMoZXggLSB4KSAtIChjdXJ2ZVJhZGl1cyAqIDIpO1xyXG5cclxuICAgIGNvbnN0IHBhdGggPSBgXHJcbiAgICAgIE0gJHt4fSAke3l9XHJcbiAgICAgIEwgJHt4fSAke3kgKyAobGlua0hlaWdodCAqIHlydnMpfVxyXG4gICAgICBDICR7eH0gJHt5ICsgKChsaW5rSGVpZ2h0ICsgY3VydmVSYWRpdXMpICogeXJ2cyl9ICR7eH0gJHt5ICsgKChsaW5rSGVpZ2h0ICsgY3VydmVSYWRpdXMpICogeXJ2cyl9ICR7eCArIChjdXJ2ZVJhZGl1cyAqIHhydnMpfSAke3kgKyAoKGxpbmtIZWlnaHQgKyBjdXJ2ZVJhZGl1cykgKiB5cnZzKX1cclxuICAgICAgTCAke3ggKyAoKHcgKyBjdXJ2ZVJhZGl1cykgKiB4cnZzKX0gJHt5ICsgKChsaW5rSGVpZ2h0ICsgY3VydmVSYWRpdXMpICogeXJ2cyl9XHJcbiAgICAgIEMgJHtleH0gICR7eSArICgobGlua0hlaWdodCArIGN1cnZlUmFkaXVzKSAqIHlydnMpfSAke2V4fSAgJHt5ICsgKChsaW5rSGVpZ2h0ICsgY3VydmVSYWRpdXMpICogeXJ2cyl9ICR7ZXh9ICR7eSArICgobGlua0hlaWdodCArIGN1cnZlUmFkaXVzKSAqIHlydnMpICsgKGN1cnZlUmFkaXVzICogeXJ2cyl9XHJcbiAgICAgIEwgJHtleH0gJHtleX1cclxuICAgIGA7XHJcbiAgICByZXR1cm4gcGF0aDtcclxuICB9XHJcblxyXG4gIGNoZWNrRXhwYW5kZWQobm9kZTogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+ICYgeyBfY2hpbGRyZW4/OiBhbnkgfSkge1xyXG4gICAgY29uc3QgbWUgPSB0aGlzO1xyXG5cclxuICAgIC8vIGNoZWNraW5nIGV4cGFuZGVkXHJcbiAgICBpZiAobm9kZS5kYXRhLmV4cGFuZGVkKSB7XHJcbiAgICAgIGlmICghbm9kZS5jaGlsZHJlbiAmJiBub2RlLl9jaGlsZHJlbikge1xyXG4gICAgICAgIG5vZGUuY2hpbGRyZW4gPSBub2RlLl9jaGlsZHJlbjtcclxuICAgICAgICBub2RlLl9jaGlsZHJlbiA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7IC8vIGNvbGxhcHNlZFxyXG4gICAgICBpZiAobm9kZS5jaGlsZHJlbikge1xyXG4gICAgICAgIG5vZGUuX2NoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcclxuICAgICAgICBub2RlLmNoaWxkcmVuID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gY2hlY2tpbmcgY2hpbGRyZW5cclxuICAgIChub2RlLmNoaWxkcmVuIHx8IG5vZGUuX2NoaWxkcmVuIHx8IFtdKS5mb3JFYWNoKGN1cnJlbnQgPT4gbWUuY2hlY2tFeHBhbmRlZChjdXJyZW50KSlcclxuICB9XHJcblxyXG4gIGV4cGFuZChub2RlOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4gJiB7IF9jaGlsZHJlbj86IGFueSB9LCB0b2dnbGU6IGJvb2xlYW4gPSBmYWxzZSkgeyAvLywgIHJlbmRlcjogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICBjb25zdCBtZSA9IHRoaXM7XHJcblxyXG4gICAgY29uc3Qgbm9kZVJlZiA9IE9iamVjdC5hc3NpZ24obm9kZSk7XHJcblxyXG4gICAgLy8gaWYgdG9nZ2xlIC0gbGV0cyB0b2dnbGVcclxuICAgIGlmICh0b2dnbGUpIG5vZGUuZGF0YS5leHBhbmRlZCA9ICFub2RlLmRhdGEuZXhwYW5kZWQ7XHJcblxyXG4gICAgLy8gY2hlY2tpbmcgZXhwYW5kZWRcclxuICAgIGlmIChub2RlLmRhdGEuZXhwYW5kZWQpIHtcclxuICAgICAgaWYgKCFub2RlLmNoaWxkcmVuICYmIG5vZGUuX2NoaWxkcmVuKSB7XHJcbiAgICAgICAgbm9kZS5jaGlsZHJlbiA9IG5vZGUuX2NoaWxkcmVuO1xyXG4gICAgICAgIG5vZGUuX2NoaWxkcmVuID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHsgLy8gY29sbGFwc2VkXHJcbiAgICAgIGlmIChub2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgbm9kZS5fY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xyXG4gICAgICAgIG5vZGUuY2hpbGRyZW4gPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZXhwYW5kKG5vZGUuY2hpbGRyZW4sIG5vZGUuZGF0YS5leHBhbmRlZCk7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnQmVmb3JlIGV4cGFuZDogJywgbm9kZVJlZi54LCAgbm9kZS54KVxyXG4gICAgaWYgKHRvZ2dsZSkgbWUuc2hvd05vZGVzKG5vZGUpO1xyXG4gIH1cclxuXHJcbiAgdHJhc2xhdGVUbyhwclgsIHByWSkge1xyXG4gICAgY29uc3QgbWUgPSB0aGlzO1xyXG4gICAgbWUuc3ZnXHJcbiAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24obWUubm9kZVBhcnNlci50cmFuc2l0aW9uRHVyYXRpb24pXHJcbiAgICAgIC5jYWxsKFxyXG4gICAgICAgIG1lLnpvb21GdW5jLnRyYW5zZm9ybSxcclxuICAgICAgICBkMy56b29tSWRlbnRpdHkudHJhbnNsYXRlKHByWCwgcHJZKVxyXG4gICAgICApO1xyXG4gIH1cclxuXHJcbiAgZml0KCkge1xyXG4gICAgY29uc3QgbWUgPSB0aGlzO1xyXG4gICAgLy8gY29uc3Qgem9vbSA9IGQzLnpvb20oKS5vbihcInpvb21cIiwgZCA9PiB0aGlzLnpvb21lZCgpKVxyXG5cclxuICAgIGNvbnN0IGZpdCA9IGNhbGNHRml0KG1lLmNoYXJ0LCBtZS5zdmcsIG1lLnJvb3QsIG1lLm5vZGVQYXJzZXIpXHJcbiAgICBtZS5zdmcudHJhbnNpdGlvbigpLmR1cmF0aW9uKG1lLm5vZGVQYXJzZXIudHJhbnNpdGlvbkR1cmF0aW9uKS5jYWxsKFxyXG4gICAgICBtZS56b29tRnVuYy50cmFuc2Zvcm0sXHJcbiAgICAgIGQzLnpvb21JZGVudGl0eS50cmFuc2xhdGUoZml0LngsIGZpdC55KS5zY2FsZShmaXQuc2NhbGUpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgc2V0T3B0aW9ucyhwck9wdGlvbnM6IFBhcnRpYWw8SUQzT3JnQ2hhcnRPcHRpb25zPikge1xyXG4gICAgY29uc3QgbWUgPSB0aGlzO1xyXG4gICAgbWUub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24obWUub3B0aW9ucywgcHJPcHRpb25zKTtcclxuICB9XHJcbn1cclxuXHJcbiJdfQ==