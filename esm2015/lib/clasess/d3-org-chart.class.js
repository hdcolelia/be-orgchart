//#region 
// Desarrollado en base a: 
//  https://bl.ocks.org/bumbeishvili/09a03b81ae788d2d14f750afe59eb7de
//  https://github.com/bumbeishvili/d3-organization-chart
//#endregion
import * as d3 from 'd3';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { D3NodeBasicParser } from './@items';
export class D3OrgChart {
    constructor(prContainer, prOptions) {
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
        const me = this;
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
            .call(d3.zoom().on("zoom", d => this.zoomed()))
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
            .attr('transform', `translate(${containerRect.width / 2},${this.nodeParser.height}) scale(${this.currentZoom})`));
        // defs
        me.defs = me.svg.selectAll('defs.globalDefs')
            .data([{ id: 'defs' }], (d) => d.id)
            .join(enter => {
            const defs = enter.append('defs').attr('class', 'globalDefs');
            defs.append('pattern')
                .attr('id', `img-expand`)
                .attr('width', 1).attr('height', 1)
                .append('image')
                .attr("xlink:href", "data:image/png;base64," + me.nodeParser.expandBase64Icon)
                .attr('width', 30)
                .attr('height', 30)
                .attr('preserveAspectRatio', 'xMidYMin slice');
            defs.append('pattern')
                .attr('id', `img-collapse`)
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
        }, update => update);
    }
    // preparing data
    prepareData() {
        const me = this;
        // if no data return 
        if (!me.data.length)
            return;
        // Convert flat data to hierarchical
        if (!me.root) {
            try { // preventing multiple root
                me.root = d3.stratify().id(({ nodeId }) => nodeId).parentId(({ parentNodeId }) => parentNodeId)(me.data);
            }
            catch (err) {
                me.root = d3.stratify().id(({ nodeId }) => nodeId).parentId(({ parentNodeId }) => parentNodeId)([{
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
        const containerRect = me.container.node().getBoundingClientRect();
        me.treemap = d3.tree().size([containerRect.width || 250, containerRect.height])
            .nodeSize([this.nodeParser.width + this.nodeParser.width / 2, this.nodeParser.height + this.nodeParser.height / 1.2]);
        me.allNodes = me.treemap(me.root).descendants();
        me.checkExpanded(me.root);
    }
    // showing nodes
    showNodes(prNode = null) {
        const me = this;
        if (!prNode)
            prNode = me.root;
        const updatePosition = {
            x: prNode.x,
            y: prNode.y
        };
        //  Assigns the x and y position for the nodes
        const treeData = me.treemap(me.root);
        // it is necesary for scope 
        const drawNodes = (container) => me.nodeParser.drawNodes(container);
        const drawCollapser = (nodeGroup) => {
            nodeGroup.each((d, i) => {
                // adding collapse / expand button
                nodeGroup.append('circle')
                    .attr('class', 'collapser')
                    .attr('cx', me.nodeParser.width / 2)
                    .attr('cy', me.nodeParser.height)
                    .attr('r', 15)
                    .attr('stroke', 'black')
                    .attr('stroke-width', 2)
                    .on('click', (node) => {
                    me.expand(node, true);
                });
            });
        };
        const nodes = treeData.descendants();
        // rendering nodes
        const nodeStartPosition = (d) => {
            if (prNode) {
                return `translate(${updatePosition.x - (me.nodeParser.width / 2)},${updatePosition.y})`;
            }
            if (!d.parent)
                return `translate(${d.x - (me.nodeParser.width / 2)},${d.y})`;
            return `translate(${d.parent.x - (me.nodeParser.width / 2)},${d.parent.y})`;
        };
        const nodePosition = (params) => `translate(${params.x - (me.nodeParser.width / 2)},${params.y})`;
        const expandIconVisible = (d) => (d.children || d._children) ? 'visible' : 'hidden';
        const expandIcon = (d) => expandIconVisible(d) == 'visible' ? (d.data.expanded ? `url(#img-collapse)` : `url(#img-expand)`) : '';
        me.centerG.selectAll('g.node')
            .data(nodes, (d) => d.data.nodeId)
            .join(enter => enter.append('g')
            .style("opacity", 0)
            .attr('class', 'node')
            .attr('cursor', 'pointer')
            .attr('transform', nodeStartPosition)
            .call(drawNodes)
            .call(drawCollapser)
            .on('click', (node) => {
            me.onNodeClick.next({ id: node.data.nodeId, node: node.data });
        }), update => update, exit => exit
            .transition()
            .duration(me.nodeParser.transitionDuration)
            .attr('transform', nodePosition(prNode))
            .style("opacity", 0)
            .remove())
            .transition().duration(me.nodeParser.transitionDuration)
            .style("opacity", 1)
            .attr('transform', nodePosition)
            .selectAll('circle.collapser')
            .attr('visibility', expandIconVisible)
            .attr('fill', expandIcon);
        // rendering links
        const pathStartingDiagonal = (params) => {
            const target = { x: params.x, y: params.y + me.nodeParser.height };
            return this.linkPath(target, target);
        };
        const pathDiagonal = (d) => {
            const target = { x: d.parent.x, y: d.parent.y + me.nodeParser.height };
            return this.linkPath(d, target);
        };
        me.centerG.selectAll('path.link')
            .data(nodes.slice(1), (d) => d.data.nodeId)
            .join(enter => enter
            .insert('path', 'g')
            .attr('class', 'link')
            .attr('fill', 'none')
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('d', pathStartingDiagonal({ x: updatePosition.x, y: updatePosition.y })), update => update, exit => exit
            .transition().duration(me.nodeParser.transitionDuration)
            .attr('d', pathStartingDiagonal(prNode))
            .remove())
            .transition().duration(me.nodeParser.transitionDuration)
            .attr('d', pathDiagonal);
    }
    // Zoom handler function
    zoomed() {
        const me = this;
        // Saving d3 event's transform object
        me.lastTransform = d3.event.transform;
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
    linkPath(source, target) {
        // Calculate some variables based on source and target (s,t) coordinates
        const x = source.x;
        const y = source.y;
        const ex = target.x;
        const ey = target.y;
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
    checkExpanded(node) {
        const me = this;
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
        (node.children || node._children || []).forEach(current => me.checkExpanded(current));
    }
    expand(node, toggle = false) {
        const me = this;
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
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZDMtb3JnLWNoYXJ0LmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGJlL29yZ2NoYXJ0LyIsInNvdXJjZXMiOlsibGliL2NsYXNlc3MvZDMtb3JnLWNoYXJ0LmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFVBQVU7QUFDViwyQkFBMkI7QUFDM0IscUVBQXFFO0FBQ3JFLHlEQUF5RDtBQUN6RCxZQUFZO0FBQ1osT0FBTyxLQUFLLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFFekIsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDMUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQWM3QyxNQUFNLE9BQU8sVUFBVTtJQWlEckIsWUFBWSxXQUF3QixFQUFFLFNBQThCOztRQWhEcEUseUJBQXlCO1FBQ2YsWUFBTyxHQUF1QjtZQUN0QyxlQUFlLEVBQUUsU0FBUztZQUMxQixVQUFVLEVBQUUsSUFBSSxpQkFBaUIsRUFBRTtZQUNuQyxJQUFJLEVBQUUsRUFBRTtZQUNSLFdBQVcsRUFBRSxRQUFRO1NBQ3RCLENBQUE7UUFpQlMsVUFBSyxHQUFjLEVBQUUsQ0FBQztRQW9CaEMsWUFBWTtRQUVaLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBMFJ4QixnQkFBZ0I7UUFDaEIsYUFBYTtRQUNiLGdCQUFXLEdBQTJDLElBQUksT0FBTyxFQUFFLENBQUM7UUF4UmxFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztRQUVoQixpQkFBaUI7UUFDakIsRUFBRSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRXRDLHVDQUF1QztRQUN2QyxVQUFJLFNBQVMsMENBQUUsSUFBSTtZQUFFLEVBQUUsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQztRQUUvQyxpQkFBaUI7UUFD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TUFBTTtZQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakMsQ0FBQztDQUVGIiwic291cmNlc0NvbnRlbnQiOlsiLy8jcmVnaW9uIFxyXG4vLyBEZXNhcnJvbGxhZG8gZW4gYmFzZSBhOiBcclxuLy8gIGh0dHBzOi8vYmwub2Nrcy5vcmcvYnVtYmVpc2h2aWxpLzA5YTAzYjgxYWU3ODhkMmQxNGY3NTBhZmU1OWViN2RlXHJcbi8vICBodHRwczovL2dpdGh1Yi5jb20vYnVtYmVpc2h2aWxpL2QzLW9yZ2FuaXphdGlvbi1jaGFydFxyXG4vLyNlbmRyZWdpb25cclxuaW1wb3J0ICogYXMgZDMgZnJvbSAnZDMnO1xyXG5pbXBvcnQgeyBJRDNOb2RlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcyc7XHJcbmltcG9ydCB7IFN1YmplY3QsIGZyb21FdmVudCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IEQzTm9kZUJhc2ljUGFyc2VyIH0gZnJvbSAnLi9AaXRlbXMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJRDNPcmdDaGFydE9wdGlvbnMge1xyXG4gIG5vZGVQYXJzZXI/OiBEM05vZGVCYXNpY1BhcnNlcjtcclxuICBkYXRhPzogSUQzTm9kZVtdO1xyXG4gIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcclxuICBkZWZhdWx0Rm9udD86IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJU2l6ZSB7XHJcbiAgd2lkdGg6IG51bWJlcjtcclxuICBoZWlnaHQ6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEQzT3JnQ2hhcnQge1xyXG4gIC8vI3JlZ2lvbiBEZWZhdWx0IE9wdGlvbnNcclxuICBwcm90ZWN0ZWQgb3B0aW9uczogSUQzT3JnQ2hhcnRPcHRpb25zID0ge1xyXG4gICAgYmFja2dyb3VuZENvbG9yOiAnIzAzQTNDNScsXHJcbiAgICBub2RlUGFyc2VyOiBuZXcgRDNOb2RlQmFzaWNQYXJzZXIoKSxcclxuICAgIGRhdGE6IFtdLFxyXG4gICAgZGVmYXVsdEZvbnQ6ICdUYWhvbWEnXHJcbiAgfVxyXG4gIC8vI2VuZHJlZ2lvblxyXG5cclxuICAvLyNyZWdpb24gU1ZHIGNvbXBvZW5udHNcclxuICBwcm90ZWN0ZWQgY29udGFpbmVyOiBkMy5TZWxlY3Rpb248SFRNTEVsZW1lbnQsIGFueSwgYW55LCBhbnk+O1xyXG4gIHByb3RlY3RlZCBzdmc6IGQzLlNlbGVjdGlvbjxkMy5CYXNlVHlwZSwgdW5rbm93biwgSFRNTEVsZW1lbnQsIHVua25vd24+O1xyXG4gIHByb3RlY3RlZCBjaGFydDogZDMuU2VsZWN0aW9uPGFueSwgYW55LCBhbnksIGFueT47XHJcbiAgcHJvdGVjdGVkIGNlbnRlckc6IGQzLlNlbGVjdGlvbjxhbnksIGFueSwgYW55LCBhbnk+O1xyXG4gIHByb3RlY3RlZCBkZWZzOiBkMy5TZWxlY3Rpb248YW55LCBhbnksIGFueSwgYW55PjtcclxuXHJcbiAgcHJvdGVjdGVkIGxhc3RUcmFuc2Zvcm06IGFueTtcclxuICAvLyNlbmRyZWdpb25cclxuXHJcbiAgLy8jcmVnaW9uIERBVEFcclxuICBwcm90ZWN0ZWQgcm9vdDogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+O1xyXG4gIHByb3RlY3RlZCBhbGxOb2RlczogYW55O1xyXG5cclxuICBwcm90ZWN0ZWQgX2RhdGE6IElEM05vZGVbXSA9IFtdO1xyXG4gIGdldCBkYXRhKCk6IElEM05vZGVbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YSB8fCBbXTtcclxuICB9XHJcblxyXG4gIHNldCBkYXRhKGRhdGE6IElEM05vZGVbXSkge1xyXG4gICAgdGhpcy5fZGF0YSA9IGRhdGE7XHJcbiAgICAvLyB0aGlzLnJlbmRlcigpXHJcbiAgfVxyXG4gIC8vI2VuZHJlZ2lvblxyXG5cclxuICAvLyNyZWdpb24gIE5PREUgUEFSU0VSXHJcbiAgcHJvdGVjdGVkIF9ub2RlUGFyc2VyOiBEM05vZGVCYXNpY1BhcnNlcjtcclxuICBnZXQgbm9kZVBhcnNlcigpOiBEM05vZGVCYXNpY1BhcnNlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fbm9kZVBhcnNlcjtcclxuICB9XHJcbiAgc2V0IG5vZGVQYXJzZXIocGFyc2VyOiBEM05vZGVCYXNpY1BhcnNlcikge1xyXG4gICAgdGhpcy5fbm9kZVBhcnNlciA9IHBhcnNlcjtcclxuICAgIC8vIHRoaXMucmVuZGVyKCk7XHJcbiAgfVxyXG4gIC8vI2VuZHJlZ2lvblxyXG5cclxuICBjdXJyZW50Wm9vbTogbnVtYmVyID0gMTtcclxuICB0cmVlbWFwOiBkMy5UcmVlTGF5b3V0PElEM05vZGU+O1xyXG5cclxuICBjb25zdHJ1Y3RvcihwckNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHByT3B0aW9ucz86IElEM09yZ0NoYXJ0T3B0aW9ucykge1xyXG4gICAgY29uc3QgbWUgPSB0aGlzO1xyXG5cclxuICAgIC8vIGluaXQgY29udGFpbmVyXHJcbiAgICBtZS5jb250YWluZXIgPSBkMy5zZWxlY3QocHJDb250YWluZXIpO1xyXG5cclxuICAgIC8vSWYgRGF0YSBhcmd1bWVudCBwYXNzZWQgLSB0aGVuIHNldCBpdFxyXG4gICAgaWYgKHByT3B0aW9ucz8uZGF0YSkgbWUuX2RhdGEgPSBwck9wdGlvbnMuZGF0YTtcclxuXHJcbiAgICAvLyBzZXR0aW5nIHBhcnNlclxyXG4gICAgbWUuX25vZGVQYXJzZXIgPSBwck9wdGlvbnM/Lm5vZGVQYXJzZXIgfHwgbWUub3B0aW9ucy5ub2RlUGFyc2VyO1xyXG5cclxuICAgIC8vIGFwcGx5aW5nIG9wdGlvbnNcclxuICAgIG1lLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKG1lLm9wdGlvbnMsIHByT3B0aW9ucyk7XHJcblxyXG4gICAgLy8gbW9uaXRvciByZXNpemVcclxuICAgIGZyb21FdmVudCh3aW5kb3csICdyZXNpemUnKVxyXG4gICAgICAucGlwZShcclxuICAgICAgICBkZWJvdW5jZVRpbWUoMzAwKVxyXG4gICAgICApLnN1YnNjcmliZShcclxuICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAvLyBIREMgLSBWRVIgdGhpcy5wcmVwYXJlQ2FudmFzKCk7XHJcbiAgICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgKVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgY29uc3QgbWUgPSB0aGlzO1xyXG4gICAgLy8gcHJlcGFyaW5nIHN2Z1xyXG4gICAgbWUucHJlcGFyZUNhbnZhcygpO1xyXG5cclxuICAgIC8vIGlmIG5vIGRhdGEgdGhlbiByZXR1cm5cclxuICAgIGlmICghbWUuZGF0YS5sZW5ndGgpIHJldHVybjtcclxuXHJcbiAgICAvLyBwcmVwYXJpbmcgZGF0YVxyXG4gICAgbWUucHJlcGFyZURhdGEoKTtcclxuXHJcbiAgICAvLyBzaG93aW5nIG5vZGVzXHJcbiAgICBtZS5zaG93Tm9kZXMoKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLy8gcHJlcGFyaW5nIGNhbnZhc1xyXG4gIHByb3RlY3RlZCBwcmVwYXJlQ2FudmFzKCkge1xyXG4gICAgY29uc3QgbWUgPSB0aGlzO1xyXG5cclxuICAgIC8vRHJhd2luZyBjb250YWluZXJzXHJcbiAgICBjb25zdCBjb250YWluZXJSZWN0ID0gbWUuY29udGFpbmVyLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIG1lLnN2ZyA9IG1lLmNvbnRhaW5lci5zZWxlY3RBbGwoJ3N2ZycpXHJcbiAgICAgIC5kYXRhKFt7IGlkOiAnc3ZnJyB9XSwgKGQ6IHsgaWQ6IHN0cmluZyB9KSA9PiBkLmlkKVxyXG4gICAgICAuam9pbihcclxuICAgICAgICBlbnRlciA9PiBlbnRlclxyXG4gICAgICAgICAgLmFwcGVuZCgnc3ZnJylcclxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdzdmctY2hhcnQtY29udGFpbmVyJylcclxuICAgICAgICAgIC5hdHRyKCdmb250LWZhbWlseScsIG1lLm9wdGlvbnMuZGVmYXVsdEZvbnQpXHJcbiAgICAgICAgICAuY2FsbChkMy56b29tKCkub24oXCJ6b29tXCIsIGQgPT4gdGhpcy56b29tZWQoKSkpXHJcbiAgICAgICAgICAuYXR0cignY3Vyc29yJywgJ21vdmUnKVxyXG4gICAgICAgICAgLnN0eWxlKCdiYWNrZ3JvdW5kLWNvbG9yJywgbWUub3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IpLFxyXG4gICAgICAgIHVwZGF0ZSA9PlxyXG4gICAgICAgICAgdXBkYXRlXHJcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIGNvbnRhaW5lclJlY3Qud2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCBjb250YWluZXJSZWN0LmhlaWdodClcclxuICAgICAgKTtcclxuICAgIC8vQWRkIGNvbnRhaW5lciBnIGVsZW1lbnRcclxuICAgIG1lLmNoYXJ0ID0gbWUuc3ZnLnNlbGVjdEFsbCgnZy5jaGFydCcpXHJcbiAgICAgIC5kYXRhKFt7IGlkOiAnY2hhcnQnIH1dLCAoZDogeyBpZDogc3RyaW5nIH0pID0+IGQuaWQpXHJcbiAgICAgIC5qb2luKFxyXG4gICAgICAgIGVudGVyID0+IGVudGVyXHJcbiAgICAgICAgICAuYXBwZW5kKCdnJylcclxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdjaGFydCcpXHJcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLDApYCksXHJcbiAgICAgICAgdXBkYXRlID0+IHVwZGF0ZVxyXG4gICAgICApXHJcblxyXG4gICAgLy8gQWRkIG9uZSBtb3JlIGNvbnRhaW5lciBnIGVsZW1lbnQsIGZvciBiZXR0ZXIgcG9zaXRpb25pbmcgY29udHJvbHNcclxuICAgIG1lLmNlbnRlckcgPSBtZS5jaGFydC5zZWxlY3RBbGwoJ2cuY2VudGVyLWdyb3VwJylcclxuICAgICAgLmRhdGEoW3sgaWQ6ICdjZW50ZXItZ3JvdXAnIH1dLCAoZDogeyBpZDogc3RyaW5nIH0pID0+IGQuaWQpXHJcbiAgICAgIC5qb2luKFxyXG4gICAgICAgIGVudGVyID0+IGVudGVyLmFwcGVuZCgnZycpXHJcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnY2VudGVyLWdyb3VwJyksXHJcbiAgICAgICAgdXBkYXRlID0+XHJcbiAgICAgICAgICB1cGRhdGVcclxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHtjb250YWluZXJSZWN0LndpZHRoIC8gMn0sJHt0aGlzLm5vZGVQYXJzZXIuaGVpZ2h0fSkgc2NhbGUoJHt0aGlzLmN1cnJlbnRab29tfSlgKVxyXG4gICAgICApXHJcblxyXG4gICAgLy8gZGVmc1xyXG4gICAgbWUuZGVmcyA9IG1lLnN2Zy5zZWxlY3RBbGwoJ2RlZnMuZ2xvYmFsRGVmcycpXHJcbiAgICAgIC5kYXRhKFt7IGlkOiAnZGVmcycgfV0sIChkOiB7IGlkOiBzdHJpbmcgfSkgPT4gZC5pZClcclxuICAgICAgLmpvaW4oXHJcbiAgICAgICAgZW50ZXIgPT4ge1xyXG4gICAgICAgICAgY29uc3QgZGVmcyA9IGVudGVyLmFwcGVuZCgnZGVmcycpLmF0dHIoJ2NsYXNzJywgJ2dsb2JhbERlZnMnKTtcclxuICAgICAgICAgIGRlZnMuYXBwZW5kKCdwYXR0ZXJuJylcclxuICAgICAgICAgICAgLmF0dHIoJ2lkJywgYGltZy1leHBhbmRgKVxyXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCAxKS5hdHRyKCdoZWlnaHQnLCAxKVxyXG4gICAgICAgICAgICAuYXBwZW5kKCdpbWFnZScpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieGxpbms6aHJlZlwiLCBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxcIiArIG1lLm5vZGVQYXJzZXIuZXhwYW5kQmFzZTY0SWNvbilcclxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgMzApXHJcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAzMClcclxuICAgICAgICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaW4gc2xpY2UnKTtcclxuICAgICAgICAgIGRlZnMuYXBwZW5kKCdwYXR0ZXJuJylcclxuICAgICAgICAgICAgLmF0dHIoJ2lkJywgYGltZy1jb2xsYXBzZWApXHJcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIDEpLmF0dHIoJ2hlaWdodCcsIDEpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2ltYWdlJylcclxuICAgICAgICAgICAgLmF0dHIoXCJ4bGluazpocmVmXCIsIFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LFwiICsgbWUubm9kZVBhcnNlci5jb2xsYXBzZUJhc2U2NEljb24pXHJcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIDMwKVxyXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgMzApXHJcbiAgICAgICAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaWRZTWluIHNsaWNlJyk7XHJcbiAgICAgICAgICAvLyBkZWZzLmFwcGVuZCgncGF0dGVybicpXHJcbiAgICAgICAgICAvLyAgIC5hdHRyKCdpZCcsIGBpbWctZXJyb3JgKVxyXG4gICAgICAgICAgLy8gICAuYXR0cignd2lkdGgnLCAxKS5hdHRyKCdoZWlnaHQnLCAxKVxyXG4gICAgICAgICAgLy8gICAuYXBwZW5kKCdpbWFnZScpXHJcbiAgICAgICAgICAvLyAgIC5hdHRyKFwieGxpbms6aHJlZlwiLCBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxcIiArIG1lLm5vZGVQYXJzZXIuZXJyb3JCYXNlNjRJY29uKVxyXG4gICAgICAgICAgLy8gICAuYXR0cignd2lkdGgnLCBtZS5ub2RlUGFyc2VyLmltYWdlRGVmcy53IClcclxuICAgICAgICAgIC8vICAgLmF0dHIoJ2hlaWdodCcsIG1lLm5vZGVQYXJzZXIuaW1hZ2VEZWZzLmgpXHJcbiAgICAgICAgICAvLyAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaWRZTWluIHNsaWNlJyk7ICAgICAgICAgICAgXHJcbiAgICAgICAgICByZXR1cm4gZGVmc1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdXBkYXRlID0+IHVwZGF0ZVxyXG4gICAgICApXHJcbiAgfVxyXG5cclxuICAvLyBwcmVwYXJpbmcgZGF0YVxyXG4gIHByb3RlY3RlZCBwcmVwYXJlRGF0YSgpIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuXHJcbiAgICAvLyBpZiBubyBkYXRhIHJldHVybiBcclxuICAgIGlmICghbWUuZGF0YS5sZW5ndGgpIHJldHVybjtcclxuXHJcbiAgICAvLyBDb252ZXJ0IGZsYXQgZGF0YSB0byBoaWVyYXJjaGljYWxcclxuICAgIGlmICghbWUucm9vdCkge1xyXG4gICAgICB0cnkgeyAvLyBwcmV2ZW50aW5nIG11bHRpcGxlIHJvb3RcclxuICAgICAgICBtZS5yb290ID0gZDMuc3RyYXRpZnk8SUQzTm9kZT4oKS5pZCgoeyBub2RlSWQgfSkgPT4gbm9kZUlkKS5wYXJlbnRJZCgoeyBwYXJlbnROb2RlSWQgfSkgPT4gcGFyZW50Tm9kZUlkKVxyXG4gICAgICAgIChtZS5kYXRhKSBhcyBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT47XHJcbiAgICAgIH0gY2F0Y2goIGVyciApIHtcclxuICAgICAgICBtZS5yb290ID0gZDMuc3RyYXRpZnk8SUQzTm9kZT4oKS5pZCgoeyBub2RlSWQgfSkgPT4gbm9kZUlkKS5wYXJlbnRJZCgoeyBwYXJlbnROb2RlSWQgfSkgPT4gcGFyZW50Tm9kZUlkKVxyXG4gICAgICAgIChbeyBcclxuICAgICAgICAgIG5vZGVJZDogJ3Jvb3QnLCBcclxuICAgICAgICAgIHBhcmVudE5vZGVJZDogJycsIFxyXG4gICAgICAgICAgdGl0bGU6ICdFcnJvcicsIFxyXG4gICAgICAgICAgZGVzY3JpcHRpb246IGVyci5tZXNzYWdlIHx8IGVycixcclxuICAgICAgICAgIG5vZGVJbWFnZToge1xyXG4gICAgICAgICAgICBiYXNlNjQ6IG1lLm5vZGVQYXJzZXIuZXJyb3JCYXNlNjRJY29uXHJcbiAgICAgICAgICB9ICBcclxuICAgICAgICB9XSkgYXMgZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHJlcGFyaW5nIHRyZWVtYXBcclxuICAgIGNvbnN0IGNvbnRhaW5lclJlY3QgPSBtZS5jb250YWluZXIubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgbWUudHJlZW1hcCA9IGQzLnRyZWU8SUQzTm9kZT4oKS5zaXplKFtjb250YWluZXJSZWN0LndpZHRoIHx8IDI1MCwgY29udGFpbmVyUmVjdC5oZWlnaHRdKVxyXG4gICAgICAubm9kZVNpemUoW3RoaXMubm9kZVBhcnNlci53aWR0aCArIHRoaXMubm9kZVBhcnNlci53aWR0aCAvIDIsIHRoaXMubm9kZVBhcnNlci5oZWlnaHQgKyB0aGlzLm5vZGVQYXJzZXIuaGVpZ2h0IC8gMS4yXSk7XHJcblxyXG4gICAgbWUuYWxsTm9kZXMgPSBtZS50cmVlbWFwKG1lLnJvb3QpLmRlc2NlbmRhbnRzKCk7XHJcbiAgICBtZS5jaGVja0V4cGFuZGVkKG1lLnJvb3QpO1xyXG4gIH1cclxuXHJcbiAgLy8gc2hvd2luZyBub2Rlc1xyXG4gIHByb3RlY3RlZCBzaG93Tm9kZXMocHJOb2RlOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4gPSBudWxsKSB7XHJcbiAgICBjb25zdCBtZSA9IHRoaXM7XHJcblxyXG4gICAgaWYgKCFwck5vZGUpIHByTm9kZSA9IG1lLnJvb3Q7XHJcbiAgICBjb25zdCB1cGRhdGVQb3NpdGlvbjogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9ID0ge1xyXG4gICAgICB4OiBwck5vZGUueCxcclxuICAgICAgeTogcHJOb2RlLnlcclxuICAgIH1cclxuXHJcbiAgICAvLyAgQXNzaWducyB0aGUgeCBhbmQgeSBwb3NpdGlvbiBmb3IgdGhlIG5vZGVzXHJcbiAgICBjb25zdCB0cmVlRGF0YSA9IG1lLnRyZWVtYXAobWUucm9vdCk7XHJcbiAgICAvLyBpdCBpcyBuZWNlc2FyeSBmb3Igc2NvcGUgXHJcbiAgICBjb25zdCBkcmF3Tm9kZXMgPSAoY29udGFpbmVyKSA9PiBtZS5ub2RlUGFyc2VyLmRyYXdOb2Rlcyhjb250YWluZXIpO1xyXG4gICAgY29uc3QgZHJhd0NvbGxhcHNlciA9IChub2RlR3JvdXA6IGQzLlNlbGVjdGlvbjxTVkdHRWxlbWVudCwgZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+LCBhbnksIGFueT4pID0+IHtcclxuICAgICAgbm9kZUdyb3VwLmVhY2goKGQsIGkpID0+IHtcclxuICAgICAgICAvLyBhZGRpbmcgY29sbGFwc2UgLyBleHBhbmQgYnV0dG9uXHJcbiAgICAgICAgbm9kZUdyb3VwLmFwcGVuZCgnY2lyY2xlJylcclxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdjb2xsYXBzZXInKVxyXG4gICAgICAgICAgLmF0dHIoJ2N4JywgbWUubm9kZVBhcnNlci53aWR0aCAvIDIpXHJcbiAgICAgICAgICAuYXR0cignY3knLCBtZS5ub2RlUGFyc2VyLmhlaWdodClcclxuICAgICAgICAgIC5hdHRyKCdyJywgMTUpXHJcbiAgICAgICAgICAuYXR0cignc3Ryb2tlJywgJ2JsYWNrJylcclxuICAgICAgICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCAyKVxyXG4gICAgICAgICAgLm9uKCdjbGljaycsIChub2RlKSA9PiB7XHJcbiAgICAgICAgICAgIG1lLmV4cGFuZChub2RlLCB0cnVlKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3Qgbm9kZXMgPSB0cmVlRGF0YS5kZXNjZW5kYW50cygpO1xyXG5cclxuICAgIC8vIHJlbmRlcmluZyBub2Rlc1xyXG5cclxuICAgIGNvbnN0IG5vZGVTdGFydFBvc2l0aW9uID0gKGQ6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPikgPT4ge1xyXG4gICAgICBpZiAocHJOb2RlKSB7XHJcbiAgICAgICAgcmV0dXJuIGB0cmFuc2xhdGUoJHt1cGRhdGVQb3NpdGlvbi54IC0gKG1lLm5vZGVQYXJzZXIud2lkdGggLyAyKX0sJHt1cGRhdGVQb3NpdGlvbi55fSlgXHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFkLnBhcmVudCkgcmV0dXJuIGB0cmFuc2xhdGUoJHtkLnggLSAobWUubm9kZVBhcnNlci53aWR0aCAvIDIpfSwke2QueX0pYDtcclxuICAgICAgcmV0dXJuIGB0cmFuc2xhdGUoJHtkLnBhcmVudC54IC0gKG1lLm5vZGVQYXJzZXIud2lkdGggLyAyKX0sJHtkLnBhcmVudC55fSlgXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgbm9kZVBvc2l0aW9uID0gKHBhcmFtczogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9KSA9PlxyXG4gICAgICBgdHJhbnNsYXRlKCR7cGFyYW1zLnggLSAobWUubm9kZVBhcnNlci53aWR0aCAvIDIpfSwke3BhcmFtcy55fSlgO1xyXG5cclxuICAgIGNvbnN0IGV4cGFuZEljb25WaXNpYmxlID1cclxuICAgICAgKGQ6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPiAmIHsgX2NoaWxkcmVuPzogYW55IH0pID0+IChkLmNoaWxkcmVuIHx8IGQuX2NoaWxkcmVuKSA/ICd2aXNpYmxlJyA6ICdoaWRkZW4nO1xyXG4gICAgY29uc3QgZXhwYW5kSWNvbiA9XHJcbiAgICAgIChkOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4gJiB7IF9jaGlsZHJlbj86IGFueSB9KSA9PiBleHBhbmRJY29uVmlzaWJsZShkKSA9PSAndmlzaWJsZScgPyAoZC5kYXRhLmV4cGFuZGVkID8gYHVybCgjaW1nLWNvbGxhcHNlKWAgOiBgdXJsKCNpbWctZXhwYW5kKWApIDogJyc7XHJcblxyXG5cclxuICAgIG1lLmNlbnRlckcuc2VsZWN0QWxsKCdnLm5vZGUnKVxyXG4gICAgICAuZGF0YShub2RlcywgKGQ6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPikgPT4gZC5kYXRhLm5vZGVJZClcclxuICAgICAgLmpvaW4oXHJcbiAgICAgICAgZW50ZXIgPT5cclxuICAgICAgICAgIGVudGVyLmFwcGVuZCgnZycpXHJcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMClcclxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ25vZGUnKVxyXG4gICAgICAgICAgICAuYXR0cignY3Vyc29yJywgJ3BvaW50ZXInKVxyXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgbm9kZVN0YXJ0UG9zaXRpb24pXHJcbiAgICAgICAgICAgIC5jYWxsKGRyYXdOb2RlcylcclxuICAgICAgICAgICAgLmNhbGwoZHJhd0NvbGxhcHNlcilcclxuICAgICAgICAgICAgLm9uKCdjbGljaycsIChub2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgbWUub25Ob2RlQ2xpY2submV4dCh7IGlkOiBub2RlLmRhdGEubm9kZUlkLCBub2RlOiBub2RlLmRhdGEgfSk7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgIHVwZGF0ZSA9PiB1cGRhdGUsXHJcbiAgICAgICAgZXhpdCA9PlxyXG4gICAgICAgICAgZXhpdFxyXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgIC5kdXJhdGlvbihtZS5ub2RlUGFyc2VyLnRyYW5zaXRpb25EdXJhdGlvbilcclxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIG5vZGVQb3NpdGlvbihwck5vZGUpKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApXHJcbiAgICAgICAgICAgIC5yZW1vdmUoKVxyXG4gICAgICApXHJcbiAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24obWUubm9kZVBhcnNlci50cmFuc2l0aW9uRHVyYXRpb24pXHJcbiAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMSlcclxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIG5vZGVQb3NpdGlvbilcclxuICAgICAgLnNlbGVjdEFsbCgnY2lyY2xlLmNvbGxhcHNlcicpXHJcbiAgICAgIC5hdHRyKCd2aXNpYmlsaXR5JywgZXhwYW5kSWNvblZpc2libGUpXHJcbiAgICAgIC5hdHRyKCdmaWxsJywgZXhwYW5kSWNvbilcclxuXHJcbiAgICAvLyByZW5kZXJpbmcgbGlua3NcclxuICAgIGNvbnN0IHBhdGhTdGFydGluZ0RpYWdvbmFsID0gKHBhcmFtczogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9KSA9PiB7XHJcbiAgICAgIGNvbnN0IHRhcmdldCA9IHsgeDogcGFyYW1zLngsIHk6IHBhcmFtcy55ICsgbWUubm9kZVBhcnNlci5oZWlnaHQgfTtcclxuICAgICAgcmV0dXJuIHRoaXMubGlua1BhdGgodGFyZ2V0LCB0YXJnZXQpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcGF0aERpYWdvbmFsID0gKGQ6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPikgPT4ge1xyXG4gICAgICBjb25zdCB0YXJnZXQgPSB7IHg6IGQucGFyZW50LngsIHk6IGQucGFyZW50LnkgKyBtZS5ub2RlUGFyc2VyLmhlaWdodCB9O1xyXG4gICAgICByZXR1cm4gdGhpcy5saW5rUGF0aChkLCB0YXJnZXQpXHJcbiAgICB9XHJcblxyXG4gICAgbWUuY2VudGVyRy5zZWxlY3RBbGwoJ3BhdGgubGluaycpXHJcbiAgICAgIC5kYXRhKG5vZGVzLnNsaWNlKDEpLCAoZDogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+KSA9PiBkLmRhdGEubm9kZUlkKVxyXG4gICAgICAuam9pbihcclxuICAgICAgICBlbnRlciA9PlxyXG4gICAgICAgICAgZW50ZXJcclxuICAgICAgICAgICAgLmluc2VydCgncGF0aCcsICdnJylcclxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xpbmsnKVxyXG4gICAgICAgICAgICAuYXR0cignZmlsbCcsICdub25lJylcclxuICAgICAgICAgICAgLmF0dHIoJ3N0cm9rZScsICdibHVlJylcclxuICAgICAgICAgICAgLmF0dHIoJ3N0cm9rZS13aWR0aCcsIDIpXHJcbiAgICAgICAgICAgIC5hdHRyKCdkJywgcGF0aFN0YXJ0aW5nRGlhZ29uYWwoeyB4OiB1cGRhdGVQb3NpdGlvbi54LCB5OiB1cGRhdGVQb3NpdGlvbi55IH0pKSxcclxuICAgICAgICB1cGRhdGUgPT4gdXBkYXRlLFxyXG4gICAgICAgIGV4aXQgPT5cclxuICAgICAgICAgIGV4aXRcclxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihtZS5ub2RlUGFyc2VyLnRyYW5zaXRpb25EdXJhdGlvbilcclxuICAgICAgICAgICAgLmF0dHIoJ2QnLCBwYXRoU3RhcnRpbmdEaWFnb25hbChwck5vZGUpKVxyXG4gICAgICAgICAgICAucmVtb3ZlKClcclxuICAgICAgKVxyXG4gICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG1lLm5vZGVQYXJzZXIudHJhbnNpdGlvbkR1cmF0aW9uKVxyXG4gICAgICAuYXR0cignZCcsIHBhdGhEaWFnb25hbCk7XHJcbiAgfVxyXG5cclxuICAvLyBab29tIGhhbmRsZXIgZnVuY3Rpb25cclxuICB6b29tZWQoKSB7XHJcbiAgICBjb25zdCBtZSA9IHRoaXM7XHJcbiAgICAvLyBTYXZpbmcgZDMgZXZlbnQncyB0cmFuc2Zvcm0gb2JqZWN0XHJcbiAgICBtZS5sYXN0VHJhbnNmb3JtID0gZDMuZXZlbnQudHJhbnNmb3JtO1xyXG4gICAgLy8gUmVwb3NpdGlvbiBhbmQgcmVzY2FsZSBjaGFydCBhY2NvcmRpbmdseVxyXG4gICAgbWUuY2hhcnQuYXR0cigndHJhbnNmb3JtJywgbWUubGFzdFRyYW5zZm9ybSk7XHJcbiAgfVxyXG4gIC8vI3JlZ2lvbiBFdmVudHNcclxuICAvLyBub2RlIGNsaWNrXHJcbiAgb25Ob2RlQ2xpY2s6IFN1YmplY3Q8eyBpZDogc3RyaW5nLCBub2RlOiBJRDNOb2RlIH0+ID0gbmV3IFN1YmplY3QoKTtcclxuICBwcm90ZWN0ZWQgX29uTm9kZUNsaWNrKG5vZGVJZDogc3RyaW5nLCBub2RlOiBJRDNOb2RlKSB7XHJcbiAgICB0aGlzLm9uTm9kZUNsaWNrLm5leHQoeyBpZDogbm9kZUlkLCBub2RlOiBub2RlIH0pO1xyXG4gIH1cclxuICAvLyNlbmRyZWdpb25cclxuXHJcbiAgLy9kcmF3Tm9kZShwck5vZGU6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPikge1xyXG4gIC8vICBjb25zdCBtZSA9IHRoaXM7XHJcbiAgLy8gIG1lLm5vZGVQYXJzZXIuZHJhdyhtZS5jZW50ZXJHLCBwck5vZGUpO1xyXG4gIC8vfVxyXG5cclxuXHJcbiAgLy8gR2VuZXJhdGUgY3VzdG9tIGRpYWdvbmFsIC0gcGxheSB3aXRoIGl0IGhlcmUgLSBodHRwczovL29ic2VydmFibGVocS5jb20vQGJ1bWJlaXNodmlsaS9jdXJ2ZWQtZWRnZXM/Y29sbGVjdGlvbj1AYnVtYmVpc2h2aWxpL3dvcmstY29tcG9uZW50c1xyXG4gIGxpbmtQYXRoKHNvdXJjZTogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9LCB0YXJnZXQ6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSkge1xyXG5cclxuICAgIC8vIENhbGN1bGF0ZSBzb21lIHZhcmlhYmxlcyBiYXNlZCBvbiBzb3VyY2UgYW5kIHRhcmdldCAocyx0KSBjb29yZGluYXRlc1xyXG4gICAgY29uc3QgeCA9IHNvdXJjZS54O1xyXG4gICAgY29uc3QgeSA9IHNvdXJjZS55O1xyXG4gICAgY29uc3QgZXggPSB0YXJnZXQueDtcclxuICAgIGNvbnN0IGV5ID0gdGFyZ2V0LnlcclxuICAgICAgO1xyXG4gICAgbGV0IHhydnMgPSBleCAtIHggPCAwID8gLTEgOiAxO1xyXG4gICAgbGV0IHlydnMgPSBleSAtIHkgPCAwID8gLTEgOiAxO1xyXG4gICAgbGV0IHJkZWYgPSAzNTtcclxuICAgIGxldCBySW5pdGlhbCA9IE1hdGguYWJzKGV4IC0geCkgLyAyIDwgcmRlZiA/IE1hdGguYWJzKGV4IC0geCkgLyAyIDogcmRlZjtcclxuICAgIGxldCByID0gTWF0aC5hYnMoZXkgLSB5KSAvIDIgPCBySW5pdGlhbCA/IE1hdGguYWJzKGV5IC0geSkgLyAyIDogckluaXRpYWw7XHJcbiAgICBsZXQgaCA9IE1hdGguYWJzKGV5IC0geSkgLyAyIC0gcjtcclxuICAgIGxldCB3ID0gTWF0aC5hYnMoZXggLSB4KSAtIHIgKiAyO1xyXG5cclxuICAgIC8vIEJ1aWxkIHRoZSBwYXRoXHJcbiAgICBjb25zdCBwYXRoID0gYFxyXG4gICAgICAgICAgICBNICR7eH0gJHt5fVxyXG4gICAgICAgICAgICBMICR7eH0gJHt5ICsgaCAqIHlydnN9XHJcbiAgICAgICAgICAgIEMgICR7eH0gJHt5ICsgaCAqIHlydnMgKyByICogeXJ2c30gJHt4fSAke3kgKyBoICogeXJ2cyArIHIgKiB5cnZzfSAke3ggKyByICogeHJ2c30gJHt5ICsgaCAqIHlydnMgKyByICogeXJ2c31cclxuICAgICAgICAgICAgTCAke3ggKyB3ICogeHJ2cyArIHIgKiB4cnZzfSAke3kgKyBoICogeXJ2cyArIHIgKiB5cnZzfVxyXG4gICAgICAgICAgICBDICR7ZXh9ICAke3kgKyBoICogeXJ2cyArIHIgKiB5cnZzfSAke2V4fSAgJHt5ICsgaCAqIHlydnMgKyByICogeXJ2c30gJHtleH0gJHtleSAtIGggKiB5cnZzfVxyXG4gICAgICAgICAgICBMICR7ZXh9ICR7ZXl9XHJcbiAgICAgICAgICBgXHJcbiAgICAvLyBSZXR1cm4gcmVzdWx0XHJcbiAgICByZXR1cm4gcGF0aDtcclxuICB9XHJcblxyXG4gIGNoZWNrRXhwYW5kZWQobm9kZTogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+ICYgeyBfY2hpbGRyZW4/OiBhbnkgfSkge1xyXG4gICAgY29uc3QgbWUgPSB0aGlzO1xyXG5cclxuICAgIC8vIGNoZWNraW5nIGV4cGFuZGVkXHJcbiAgICBpZiAobm9kZS5kYXRhLmV4cGFuZGVkKSB7XHJcbiAgICAgIGlmICghbm9kZS5jaGlsZHJlbiAmJiBub2RlLl9jaGlsZHJlbikge1xyXG4gICAgICAgIG5vZGUuY2hpbGRyZW4gPSBub2RlLl9jaGlsZHJlbjtcclxuICAgICAgICBub2RlLl9jaGlsZHJlbiA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7IC8vIGNvbGxhcHNlZFxyXG4gICAgICBpZiAobm9kZS5jaGlsZHJlbikge1xyXG4gICAgICAgIG5vZGUuX2NoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcclxuICAgICAgICBub2RlLmNoaWxkcmVuID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gY2hlY2tpbmcgY2hpbGRyZW5cclxuICAgIChub2RlLmNoaWxkcmVuIHx8IG5vZGUuX2NoaWxkcmVuIHx8IFtdKS5mb3JFYWNoKGN1cnJlbnQgPT4gbWUuY2hlY2tFeHBhbmRlZChjdXJyZW50KSlcclxuICB9XHJcblxyXG5cclxuXHJcbiAgZXhwYW5kKG5vZGU6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPiAmIHsgX2NoaWxkcmVuPzogYW55IH0sIHRvZ2dsZTogYm9vbGVhbiA9IGZhbHNlKSB7IC8vLCAgcmVuZGVyOiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuXHJcbiAgICAvLyBpZiB0b2dnbGUgLSBsZXRzIHRvZ2dsZVxyXG4gICAgaWYgKHRvZ2dsZSkgbm9kZS5kYXRhLmV4cGFuZGVkID0gIW5vZGUuZGF0YS5leHBhbmRlZDtcclxuXHJcbiAgICAvLyBjaGVja2luZyBleHBhbmRlZFxyXG4gICAgaWYgKG5vZGUuZGF0YS5leHBhbmRlZCkge1xyXG4gICAgICBpZiAoIW5vZGUuY2hpbGRyZW4gJiYgbm9kZS5fY2hpbGRyZW4pIHtcclxuICAgICAgICBub2RlLmNoaWxkcmVuID0gbm9kZS5fY2hpbGRyZW47XHJcbiAgICAgICAgbm9kZS5fY2hpbGRyZW4gPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgeyAvLyBjb2xsYXBzZWRcclxuICAgICAgaWYgKG5vZGUuY2hpbGRyZW4pIHtcclxuICAgICAgICBub2RlLl9jaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XHJcbiAgICAgICAgbm9kZS5jaGlsZHJlbiA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBjb25zdCBleHBhbmRlZCA9IG5vZGUuZGF0YS5leHBhbmRlZDtcclxuICAgIC8vIG5vZGUuZGF0YS5leHBhbmRlZCA9ICFleHBhbmRlZDtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdFeHBhbmRpbmQ6ICcsIG5vZGUuZGF0YS5ub2RlSWQpXHJcblxyXG4gICAgLy8gY29uc3QgZXhwYW5kID0gKGNoaWxkcmVuOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT5bXSwgZXhwYW5kZWQ6IGJvb2xlYW4pID0+IHtcclxuICAgIC8vICAgKGNoaWxkcmVuIHx8IFtdKS5mb3JFYWNoKGN1cnJlbnQgPT4ge1xyXG4gICAgLy8gICAgICAgY3VycmVudC5kYXRhLmhpZGRlbiA9ICFleHBhbmRlZDtcclxuICAgIC8vICAgICAgIGV4cGFuZChjdXJyZW50LmNoaWxkcmVuLCBleHBhbmRlZCk7IFxyXG4gICAgLy8gICAgIH0pO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIGV4cGFuZChub2RlLmNoaWxkcmVuLCBub2RlLmRhdGEuZXhwYW5kZWQpOyBcclxuICAgIGlmICh0b2dnbGUpIG1lLnNob3dOb2Rlcyhub2RlKTtcclxuICB9XHJcblxyXG59XHJcblxyXG4iXX0=