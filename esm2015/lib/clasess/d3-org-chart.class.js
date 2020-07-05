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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZDMtb3JnLWNoYXJ0LmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGJlL29yZ2NoYXJ0LyIsInNvdXJjZXMiOlsibGliL2NsYXNlc3MvZDMtb3JnLWNoYXJ0LmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFVBQVU7QUFDViwyQkFBMkI7QUFDM0IscUVBQXFFO0FBQ3JFLHlEQUF5RDtBQUN6RCxZQUFZO0FBQ1osT0FBTyxLQUFLLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFFekIsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDMUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQWM3QyxNQUFNLE9BQU8sVUFBVTtJQWlEckIsWUFBWSxXQUF3QixFQUFFLFNBQThCOztRQWhEcEUseUJBQXlCO1FBQ2YsWUFBTyxHQUF1QjtZQUN0QyxlQUFlLEVBQUUsU0FBUztZQUMxQixVQUFVLEVBQUUsSUFBSSxpQkFBaUIsRUFBRTtZQUNuQyxJQUFJLEVBQUUsRUFBRTtZQUNSLFdBQVcsRUFBRSxRQUFRO1NBQ3RCLENBQUE7UUFpQlMsVUFBSyxHQUFjLEVBQUUsQ0FBQztRQW9CaEMsWUFBWTtRQUVaLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBdVJ4QixnQkFBZ0I7UUFDaEIsYUFBYTtRQUNiLGdCQUFXLEdBQTJDLElBQUksT0FBTyxFQUFFLENBQUM7UUFyUmxFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztRQUVoQixpQkFBaUI7UUFDakIsRUFBRSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRXRDLHVDQUF1QztRQUN2QyxVQUFJLFNBQVMsMENBQUUsSUFBSTtZQUFFLEVBQUUsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQztRQUUvQyxpQkFBaUI7UUFD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LEVBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUNoQjtRQUNILElBQUksSUFBSSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9CLElBQUksSUFBSSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9CLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNkLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ3pFLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1FBQzFFLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVqQyxpQkFBaUI7UUFDakIsTUFBTSxJQUFJLEdBQUc7Z0JBQ0QsQ0FBQyxJQUFJLENBQUM7Z0JBQ04sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSTtpQkFDaEIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcs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clxuLy8gRGVzYXJyb2xsYWRvIGVuIGJhc2UgYTogXHJcbi8vICBodHRwczovL2JsLm9ja3Mub3JnL2J1bWJlaXNodmlsaS8wOWEwM2I4MWFlNzg4ZDJkMTRmNzUwYWZlNTllYjdkZVxyXG4vLyAgaHR0cHM6Ly9naXRodWIuY29tL2J1bWJlaXNodmlsaS9kMy1vcmdhbml6YXRpb24tY2hhcnRcclxuLy8jZW5kcmVnaW9uXHJcbmltcG9ydCAqIGFzIGQzIGZyb20gJ2QzJztcclxuaW1wb3J0IHsgSUQzTm9kZSB9IGZyb20gJy4uL2ludGVyZmFjZXMnO1xyXG5pbXBvcnQgeyBTdWJqZWN0LCBmcm9tRXZlbnQgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgZGVib3VuY2VUaW1lIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBEM05vZGVCYXNpY1BhcnNlciB9IGZyb20gJy4vQGl0ZW1zJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUQzT3JnQ2hhcnRPcHRpb25zIHtcclxuICBub2RlUGFyc2VyPzogRDNOb2RlQmFzaWNQYXJzZXI7XHJcbiAgZGF0YT86IElEM05vZGVbXTtcclxuICBiYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XHJcbiAgZGVmYXVsdEZvbnQ/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVNpemUge1xyXG4gIHdpZHRoOiBudW1iZXI7XHJcbiAgaGVpZ2h0OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBEM09yZ0NoYXJ0IHtcclxuICAvLyNyZWdpb24gRGVmYXVsdCBPcHRpb25zXHJcbiAgcHJvdGVjdGVkIG9wdGlvbnM6IElEM09yZ0NoYXJ0T3B0aW9ucyA9IHtcclxuICAgIGJhY2tncm91bmRDb2xvcjogJyMwM0EzQzUnLFxyXG4gICAgbm9kZVBhcnNlcjogbmV3IEQzTm9kZUJhc2ljUGFyc2VyKCksXHJcbiAgICBkYXRhOiBbXSxcclxuICAgIGRlZmF1bHRGb250OiAnVGFob21hJ1xyXG4gIH1cclxuICAvLyNlbmRyZWdpb25cclxuXHJcbiAgLy8jcmVnaW9uIFNWRyBjb21wb2VubnRzXHJcbiAgcHJvdGVjdGVkIGNvbnRhaW5lcjogZDMuU2VsZWN0aW9uPEhUTUxFbGVtZW50LCBhbnksIGFueSwgYW55PjtcclxuICBwcm90ZWN0ZWQgc3ZnOiBkMy5TZWxlY3Rpb248ZDMuQmFzZVR5cGUsIHVua25vd24sIEhUTUxFbGVtZW50LCB1bmtub3duPjtcclxuICBwcm90ZWN0ZWQgY2hhcnQ6IGQzLlNlbGVjdGlvbjxhbnksIGFueSwgYW55LCBhbnk+O1xyXG4gIHByb3RlY3RlZCBjZW50ZXJHOiBkMy5TZWxlY3Rpb248YW55LCBhbnksIGFueSwgYW55PjtcclxuICBwcm90ZWN0ZWQgZGVmczogZDMuU2VsZWN0aW9uPGFueSwgYW55LCBhbnksIGFueT47XHJcblxyXG4gIHByb3RlY3RlZCBsYXN0VHJhbnNmb3JtOiBhbnk7XHJcbiAgLy8jZW5kcmVnaW9uXHJcblxyXG4gIC8vI3JlZ2lvbiBEQVRBXHJcbiAgcHJvdGVjdGVkIHJvb3Q6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPjtcclxuICBwcm90ZWN0ZWQgYWxsTm9kZXM6IGFueTtcclxuXHJcbiAgcHJvdGVjdGVkIF9kYXRhOiBJRDNOb2RlW10gPSBbXTtcclxuICBnZXQgZGF0YSgpOiBJRDNOb2RlW10ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEgfHwgW107XHJcbiAgfVxyXG5cclxuICBzZXQgZGF0YShkYXRhOiBJRDNOb2RlW10pIHtcclxuICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xyXG4gICAgLy8gdGhpcy5yZW5kZXIoKVxyXG4gIH1cclxuICAvLyNlbmRyZWdpb25cclxuXHJcbiAgLy8jcmVnaW9uICBOT0RFIFBBUlNFUlxyXG4gIHByb3RlY3RlZCBfbm9kZVBhcnNlcjogRDNOb2RlQmFzaWNQYXJzZXI7XHJcbiAgZ2V0IG5vZGVQYXJzZXIoKTogRDNOb2RlQmFzaWNQYXJzZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX25vZGVQYXJzZXI7XHJcbiAgfVxyXG4gIHNldCBub2RlUGFyc2VyKHBhcnNlcjogRDNOb2RlQmFzaWNQYXJzZXIpIHtcclxuICAgIHRoaXMuX25vZGVQYXJzZXIgPSBwYXJzZXI7XHJcbiAgICAvLyB0aGlzLnJlbmRlcigpO1xyXG4gIH1cclxuICAvLyNlbmRyZWdpb25cclxuXHJcbiAgY3VycmVudFpvb206IG51bWJlciA9IDE7XHJcbiAgdHJlZW1hcDogZDMuVHJlZUxheW91dDxJRDNOb2RlPjtcclxuXHJcbiAgY29uc3RydWN0b3IocHJDb250YWluZXI6IEhUTUxFbGVtZW50LCBwck9wdGlvbnM/OiBJRDNPcmdDaGFydE9wdGlvbnMpIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuXHJcbiAgICAvLyBpbml0IGNvbnRhaW5lclxyXG4gICAgbWUuY29udGFpbmVyID0gZDMuc2VsZWN0KHByQ29udGFpbmVyKTtcclxuXHJcbiAgICAvL0lmIERhdGEgYXJndW1lbnQgcGFzc2VkIC0gdGhlbiBzZXQgaXRcclxuICAgIGlmIChwck9wdGlvbnM/LmRhdGEpIG1lLl9kYXRhID0gcHJPcHRpb25zLmRhdGE7XHJcblxyXG4gICAgLy8gc2V0dGluZyBwYXJzZXJcclxuICAgIG1lLl9ub2RlUGFyc2VyID0gcHJPcHRpb25zPy5ub2RlUGFyc2VyIHx8IG1lLm9wdGlvbnMubm9kZVBhcnNlcjtcclxuXHJcbiAgICAvLyBhcHBseWluZyBvcHRpb25zXHJcbiAgICBtZS5vcHRpb25zID0gT2JqZWN0LmFzc2lnbihtZS5vcHRpb25zLCBwck9wdGlvbnMpO1xyXG5cclxuICAgIC8vIG1vbml0b3IgcmVzaXplXHJcbiAgICBmcm9tRXZlbnQod2luZG93LCAncmVzaXplJylcclxuICAgICAgLnBpcGUoXHJcbiAgICAgICAgZGVib3VuY2VUaW1lKDMwMClcclxuICAgICAgKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgLy8gSERDIC0gVkVSIHRoaXMucHJlcGFyZUNhbnZhcygpO1xyXG4gICAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgIClcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuICAgIC8vIHByZXBhcmluZyBzdmdcclxuICAgIG1lLnByZXBhcmVDYW52YXMoKTtcclxuXHJcbiAgICAvLyBpZiBubyBkYXRhIHRoZW4gcmV0dXJuXHJcbiAgICBpZiAoIW1lLmRhdGEubGVuZ3RoKSByZXR1cm47XHJcblxyXG4gICAgLy8gcHJlcGFyaW5nIGRhdGFcclxuICAgIG1lLnByZXBhcmVEYXRhKCk7XHJcblxyXG4gICAgLy8gc2hvd2luZyBub2Rlc1xyXG4gICAgbWUuc2hvd05vZGVzKCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIHByZXBhcmluZyBjYW52YXNcclxuICBwcm90ZWN0ZWQgcHJlcGFyZUNhbnZhcygpIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuXHJcbiAgICAvL0RyYXdpbmcgY29udGFpbmVyc1xyXG4gICAgY29uc3QgY29udGFpbmVyUmVjdCA9IG1lLmNvbnRhaW5lci5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBtZS5zdmcgPSBtZS5jb250YWluZXIuc2VsZWN0QWxsKCdzdmcnKVxyXG4gICAgICAuZGF0YShbeyBpZDogJ3N2ZycgfV0sIChkOiB7IGlkOiBzdHJpbmcgfSkgPT4gZC5pZClcclxuICAgICAgLmpvaW4oXHJcbiAgICAgICAgZW50ZXIgPT4gZW50ZXJcclxuICAgICAgICAgIC5hcHBlbmQoJ3N2ZycpXHJcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnc3ZnLWNoYXJ0LWNvbnRhaW5lcicpXHJcbiAgICAgICAgICAuYXR0cignZm9udC1mYW1pbHknLCBtZS5vcHRpb25zLmRlZmF1bHRGb250KVxyXG4gICAgICAgICAgLmNhbGwoZDMuem9vbSgpLm9uKFwiem9vbVwiLCBkID0+IHRoaXMuem9vbWVkKCkpKVxyXG4gICAgICAgICAgLmF0dHIoJ2N1cnNvcicsICdtb3ZlJylcclxuICAgICAgICAgIC5zdHlsZSgnYmFja2dyb3VuZC1jb2xvcicsIG1lLm9wdGlvbnMuYmFja2dyb3VuZENvbG9yKSxcclxuICAgICAgICB1cGRhdGUgPT5cclxuICAgICAgICAgIHVwZGF0ZVxyXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCBjb250YWluZXJSZWN0LndpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgY29udGFpbmVyUmVjdC5oZWlnaHQpXHJcbiAgICAgICk7XHJcbiAgICAvL0FkZCBjb250YWluZXIgZyBlbGVtZW50XHJcbiAgICBtZS5jaGFydCA9IG1lLnN2Zy5zZWxlY3RBbGwoJ2cuY2hhcnQnKVxyXG4gICAgICAuZGF0YShbeyBpZDogJ2NoYXJ0JyB9XSwgKGQ6IHsgaWQ6IHN0cmluZyB9KSA9PiBkLmlkKVxyXG4gICAgICAuam9pbihcclxuICAgICAgICBlbnRlciA9PiBlbnRlclxyXG4gICAgICAgICAgLmFwcGVuZCgnZycpXHJcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnY2hhcnQnKVxyXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwwKWApLFxyXG4gICAgICAgIHVwZGF0ZSA9PiB1cGRhdGVcclxuICAgICAgKVxyXG5cclxuICAgIC8vIEFkZCBvbmUgbW9yZSBjb250YWluZXIgZyBlbGVtZW50LCBmb3IgYmV0dGVyIHBvc2l0aW9uaW5nIGNvbnRyb2xzXHJcbiAgICBtZS5jZW50ZXJHID0gbWUuY2hhcnQuc2VsZWN0QWxsKCdnLmNlbnRlci1ncm91cCcpXHJcbiAgICAgIC5kYXRhKFt7IGlkOiAnY2VudGVyLWdyb3VwJyB9XSwgKGQ6IHsgaWQ6IHN0cmluZyB9KSA9PiBkLmlkKVxyXG4gICAgICAuam9pbihcclxuICAgICAgICBlbnRlciA9PiBlbnRlci5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2NlbnRlci1ncm91cCcpLFxyXG4gICAgICAgIHVwZGF0ZSA9PlxyXG4gICAgICAgICAgdXBkYXRlXHJcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7Y29udGFpbmVyUmVjdC53aWR0aCAvIDJ9LCR7dGhpcy5ub2RlUGFyc2VyLmhlaWdodH0pIHNjYWxlKCR7dGhpcy5jdXJyZW50Wm9vbX0pYClcclxuICAgICAgKVxyXG5cclxuICAgIC8vIGRlZnNcclxuICAgIG1lLmRlZnMgPSBtZS5zdmcuc2VsZWN0QWxsKCdkZWZzLmdsb2JhbERlZnMnKVxyXG4gICAgICAuZGF0YShbeyBpZDogJ2RlZnMnIH1dLCAoZDogeyBpZDogc3RyaW5nIH0pID0+IGQuaWQpXHJcbiAgICAgIC5qb2luKFxyXG4gICAgICAgIGVudGVyID0+IHtcclxuICAgICAgICAgIGNvbnN0IGRlZnMgPSBlbnRlci5hcHBlbmQoJ2RlZnMnKS5hdHRyKCdjbGFzcycsICdnbG9iYWxEZWZzJyk7XHJcbiAgICAgICAgICBkZWZzLmFwcGVuZCgncGF0dGVybicpXHJcbiAgICAgICAgICAgIC5hdHRyKCdpZCcsIGBpbWctZXhwYW5kYClcclxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgMSkuYXR0cignaGVpZ2h0JywgMSlcclxuICAgICAgICAgICAgLmFwcGVuZCgnaW1hZ2UnKVxyXG4gICAgICAgICAgICAuYXR0cihcInhsaW5rOmhyZWZcIiwgXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsXCIgKyBtZS5ub2RlUGFyc2VyLmV4cGFuZEJhc2U2NEljb24pXHJcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIDMwKVxyXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgMzApXHJcbiAgICAgICAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaWRZTWluIHNsaWNlJyk7XHJcbiAgICAgICAgICBkZWZzLmFwcGVuZCgncGF0dGVybicpXHJcbiAgICAgICAgICAgIC5hdHRyKCdpZCcsIGBpbWctY29sbGFwc2VgKVxyXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCAxKS5hdHRyKCdoZWlnaHQnLCAxKVxyXG4gICAgICAgICAgICAuYXBwZW5kKCdpbWFnZScpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieGxpbms6aHJlZlwiLCBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxcIiArIG1lLm5vZGVQYXJzZXIuY29sbGFwc2VCYXNlNjRJY29uKVxyXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCAzMClcclxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIDMwKVxyXG4gICAgICAgICAgICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWlkWU1pbiBzbGljZScpO1xyXG4gICAgICAgICAgLy8gZGVmcy5hcHBlbmQoJ3BhdHRlcm4nKVxyXG4gICAgICAgICAgLy8gICAuYXR0cignaWQnLCBgaW1nLWVycm9yYClcclxuICAgICAgICAgIC8vICAgLmF0dHIoJ3dpZHRoJywgMSkuYXR0cignaGVpZ2h0JywgMSlcclxuICAgICAgICAgIC8vICAgLmFwcGVuZCgnaW1hZ2UnKVxyXG4gICAgICAgICAgLy8gICAuYXR0cihcInhsaW5rOmhyZWZcIiwgXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsXCIgKyBtZS5ub2RlUGFyc2VyLmVycm9yQmFzZTY0SWNvbilcclxuICAgICAgICAgIC8vICAgLmF0dHIoJ3dpZHRoJywgbWUubm9kZVBhcnNlci5pbWFnZURlZnMudyApXHJcbiAgICAgICAgICAvLyAgIC5hdHRyKCdoZWlnaHQnLCBtZS5ub2RlUGFyc2VyLmltYWdlRGVmcy5oKVxyXG4gICAgICAgICAgLy8gICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWlkWU1pbiBzbGljZScpOyAgICAgICAgICAgIFxyXG4gICAgICAgICAgcmV0dXJuIGRlZnNcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVwZGF0ZSA9PiB1cGRhdGVcclxuICAgICAgKVxyXG4gIH1cclxuXHJcbiAgLy8gcHJlcGFyaW5nIGRhdGFcclxuICBwcm90ZWN0ZWQgcHJlcGFyZURhdGEoKSB7XHJcbiAgICBjb25zdCBtZSA9IHRoaXM7XHJcblxyXG4gICAgLy8gaWYgbm8gZGF0YSByZXR1cm4gXHJcbiAgICBpZiAoIW1lLmRhdGEubGVuZ3RoKSByZXR1cm47XHJcblxyXG4gICAgLy8gQ29udmVydCBmbGF0IGRhdGEgdG8gaGllcmFyY2hpY2FsXHJcbiAgICBpZiAoIW1lLnJvb3QpIHtcclxuICAgICAgdHJ5IHsgLy8gcHJldmVudGluZyBtdWx0aXBsZSByb290XHJcbiAgICAgICAgbWUucm9vdCA9IGQzLnN0cmF0aWZ5PElEM05vZGU+KCkuaWQoKHsgbm9kZUlkIH0pID0+IG5vZGVJZCkucGFyZW50SWQoKHsgcGFyZW50Tm9kZUlkIH0pID0+IHBhcmVudE5vZGVJZClcclxuICAgICAgICAgIChtZS5kYXRhKSBhcyBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT47XHJcbiAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIG1lLnJvb3QgPSBkMy5zdHJhdGlmeTxJRDNOb2RlPigpLmlkKCh7IG5vZGVJZCB9KSA9PiBub2RlSWQpLnBhcmVudElkKCh7IHBhcmVudE5vZGVJZCB9KSA9PiBwYXJlbnROb2RlSWQpXHJcbiAgICAgICAgICAoW3tcclxuICAgICAgICAgICAgbm9kZUlkOiAncm9vdCcsXHJcbiAgICAgICAgICAgIHBhcmVudE5vZGVJZDogJycsXHJcbiAgICAgICAgICAgIHRpdGxlOiAnRXJyb3InLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogZXJyLm1lc3NhZ2UgfHwgZXJyLFxyXG4gICAgICAgICAgICBub2RlSW1hZ2U6IHtcclxuICAgICAgICAgICAgICBiYXNlNjQ6IG1lLm5vZGVQYXJzZXIuZXJyb3JCYXNlNjRJY29uXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1dKSBhcyBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT47XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBwcmVwYXJpbmcgdHJlZW1hcFxyXG4gICAgY29uc3QgY29udGFpbmVyUmVjdCA9IG1lLmNvbnRhaW5lci5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBtZS50cmVlbWFwID0gZDMudHJlZTxJRDNOb2RlPigpLnNpemUoW2NvbnRhaW5lclJlY3Qud2lkdGggfHwgMjUwLCBjb250YWluZXJSZWN0LmhlaWdodF0pXHJcbiAgICAgIC5ub2RlU2l6ZShbdGhpcy5ub2RlUGFyc2VyLndpZHRoICsgdGhpcy5ub2RlUGFyc2VyLndpZHRoIC8gMiwgdGhpcy5ub2RlUGFyc2VyLmhlaWdodCArIHRoaXMubm9kZVBhcnNlci5oZWlnaHQgLyAxLjJdKTtcclxuXHJcbiAgICBtZS5hbGxOb2RlcyA9IG1lLnRyZWVtYXAobWUucm9vdCkuZGVzY2VuZGFudHMoKTtcclxuICAgIG1lLmNoZWNrRXhwYW5kZWQobWUucm9vdCk7XHJcbiAgfVxyXG5cclxuICAvLyBzaG93aW5nIG5vZGVzXHJcbiAgcHJvdGVjdGVkIHNob3dOb2Rlcyhwck5vZGU6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPiA9IG51bGwpIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuXHJcbiAgICBpZiAoIXByTm9kZSkgcHJOb2RlID0gbWUucm9vdDtcclxuICAgIGNvbnN0IHVwZGF0ZVBvc2l0aW9uOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0gPSB7XHJcbiAgICAgIHg6IHByTm9kZS54LFxyXG4gICAgICB5OiBwck5vZGUueVxyXG4gICAgfVxyXG5cclxuICAgIC8vICBBc3NpZ25zIHRoZSB4IGFuZCB5IHBvc2l0aW9uIGZvciB0aGUgbm9kZXNcclxuICAgIGNvbnN0IHRyZWVEYXRhID0gbWUudHJlZW1hcChtZS5yb290KTtcclxuICAgIC8vIGl0IGlzIG5lY2VzYXJ5IGZvciBzY29wZSBcclxuICAgIGNvbnN0IGRyYXdOb2RlcyA9IChjb250YWluZXIpID0+IG1lLm5vZGVQYXJzZXIuZHJhd05vZGVzKGNvbnRhaW5lcik7XHJcbiAgICBjb25zdCBkcmF3Q29sbGFwc2VyID0gKG5vZGVHcm91cDogZDMuU2VsZWN0aW9uPFNWR0dFbGVtZW50LCBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4sIGFueSwgYW55PikgPT4ge1xyXG4gICAgICBub2RlR3JvdXAuYXBwZW5kKCdjaXJjbGUnKVxyXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdjb2xsYXBzZXInKVxyXG4gICAgICAgIC5hdHRyKCdjeCcsIG1lLm5vZGVQYXJzZXIud2lkdGggLyAyKVxyXG4gICAgICAgIC5hdHRyKCdjeScsIG1lLm5vZGVQYXJzZXIuaGVpZ2h0KVxyXG4gICAgICAgIC5hdHRyKCdyJywgMTUpXHJcbiAgICAgICAgLmF0dHIoJ3N0cm9rZScsICdibGFjaycpXHJcbiAgICAgICAgLmF0dHIoJ3N0cm9rZS13aWR0aCcsIDIpXHJcbiAgICAgICAgLm9uKCdjbGljaycsIChub2RlKSA9PiB7XHJcbiAgICAgICAgICBtZS5leHBhbmQobm9kZSwgdHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IG5vZGVzID0gdHJlZURhdGEuZGVzY2VuZGFudHMoKTtcclxuXHJcbiAgICAvLyByZW5kZXJpbmcgbm9kZXNcclxuXHJcbiAgICBjb25zdCBub2RlU3RhcnRQb3NpdGlvbiA9IChkOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4pID0+IHtcclxuICAgICAgaWYgKHByTm9kZSkge1xyXG4gICAgICAgIHJldHVybiBgdHJhbnNsYXRlKCR7dXBkYXRlUG9zaXRpb24ueCAtIChtZS5ub2RlUGFyc2VyLndpZHRoIC8gMil9LCR7dXBkYXRlUG9zaXRpb24ueX0pYFxyXG4gICAgICB9XHJcbiAgICAgIGlmICghZC5wYXJlbnQpIHJldHVybiBgdHJhbnNsYXRlKCR7ZC54IC0gKG1lLm5vZGVQYXJzZXIud2lkdGggLyAyKX0sJHtkLnl9KWA7XHJcbiAgICAgIHJldHVybiBgdHJhbnNsYXRlKCR7ZC5wYXJlbnQueCAtIChtZS5ub2RlUGFyc2VyLndpZHRoIC8gMil9LCR7ZC5wYXJlbnQueX0pYFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG5vZGVQb3NpdGlvbiA9IChwYXJhbXM6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSkgPT5cclxuICAgICAgYHRyYW5zbGF0ZSgke3BhcmFtcy54IC0gKG1lLm5vZGVQYXJzZXIud2lkdGggLyAyKX0sJHtwYXJhbXMueX0pYDtcclxuXHJcbiAgICBjb25zdCBleHBhbmRJY29uVmlzaWJsZSA9XHJcbiAgICAgIChkOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4gJiB7IF9jaGlsZHJlbj86IGFueSB9KSA9PiAoZC5jaGlsZHJlbiB8fCBkLl9jaGlsZHJlbikgPyAndmlzaWJsZScgOiAnaGlkZGVuJztcclxuICAgIGNvbnN0IGV4cGFuZEljb24gPVxyXG4gICAgICAoZDogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+ICYgeyBfY2hpbGRyZW4/OiBhbnkgfSkgPT4gZXhwYW5kSWNvblZpc2libGUoZCkgPT0gJ3Zpc2libGUnID8gKGQuZGF0YS5leHBhbmRlZCA/IGB1cmwoI2ltZy1jb2xsYXBzZSlgIDogYHVybCgjaW1nLWV4cGFuZClgKSA6ICcnO1xyXG5cclxuXHJcbiAgICBtZS5jZW50ZXJHLnNlbGVjdEFsbCgnZy5ub2RlJylcclxuICAgICAgLmRhdGEobm9kZXMsIChkOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4pID0+IGQuZGF0YS5ub2RlSWQpXHJcbiAgICAgIC5qb2luKFxyXG4gICAgICAgIGVudGVyID0+XHJcbiAgICAgICAgICBlbnRlci5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdub2RlJylcclxuICAgICAgICAgICAgLmF0dHIoJ2N1cnNvcicsICdwb2ludGVyJylcclxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIG5vZGVTdGFydFBvc2l0aW9uKVxyXG4gICAgICAgICAgICAuY2FsbChkcmF3Tm9kZXMpXHJcbiAgICAgICAgICAgIC5jYWxsKGRyYXdDb2xsYXBzZXIpXHJcbiAgICAgICAgICAgIC5vbignY2xpY2snLCAobm9kZSkgPT4ge1xyXG4gICAgICAgICAgICAgIG1lLm9uTm9kZUNsaWNrLm5leHQoeyBpZDogbm9kZS5kYXRhLm5vZGVJZCwgbm9kZTogbm9kZS5kYXRhIH0pO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICB1cGRhdGUgPT4gdXBkYXRlLFxyXG4gICAgICAgIGV4aXQgPT5cclxuICAgICAgICAgIGV4aXRcclxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAuZHVyYXRpb24obWUubm9kZVBhcnNlci50cmFuc2l0aW9uRHVyYXRpb24pXHJcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBub2RlUG9zaXRpb24ocHJOb2RlKSlcclxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKVxyXG4gICAgICAgICAgICAucmVtb3ZlKClcclxuICAgICAgKVxyXG4gICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG1lLm5vZGVQYXJzZXIudHJhbnNpdGlvbkR1cmF0aW9uKVxyXG4gICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDEpXHJcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBub2RlUG9zaXRpb24pXHJcbiAgICAgIC5zZWxlY3RBbGwoJ2NpcmNsZS5jb2xsYXBzZXInKVxyXG4gICAgICAuYXR0cigndmlzaWJpbGl0eScsIGV4cGFuZEljb25WaXNpYmxlKVxyXG4gICAgICAuYXR0cignZmlsbCcsIGV4cGFuZEljb24pXHJcblxyXG4gICAgLy8gcmVuZGVyaW5nIGxpbmtzXHJcbiAgICBjb25zdCBwYXRoU3RhcnRpbmdEaWFnb25hbCA9IChwYXJhbXM6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSkgPT4ge1xyXG4gICAgICBjb25zdCB0YXJnZXQgPSB7IHg6IHBhcmFtcy54LCB5OiBwYXJhbXMueSArIG1lLm5vZGVQYXJzZXIuaGVpZ2h0IH07XHJcbiAgICAgIHJldHVybiB0aGlzLmxpbmtQYXRoKHRhcmdldCwgdGFyZ2V0KVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHBhdGhEaWFnb25hbCA9IChkOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4pID0+IHtcclxuICAgICAgY29uc3QgdGFyZ2V0ID0geyB4OiBkLnBhcmVudC54LCB5OiBkLnBhcmVudC55ICsgbWUubm9kZVBhcnNlci5oZWlnaHQgfTtcclxuICAgICAgcmV0dXJuIHRoaXMubGlua1BhdGgoZCwgdGFyZ2V0KVxyXG4gICAgfVxyXG5cclxuICAgIG1lLmNlbnRlckcuc2VsZWN0QWxsKCdwYXRoLmxpbmsnKVxyXG4gICAgICAuZGF0YShub2Rlcy5zbGljZSgxKSwgKGQ6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPikgPT4gZC5kYXRhLm5vZGVJZClcclxuICAgICAgLmpvaW4oXHJcbiAgICAgICAgZW50ZXIgPT5cclxuICAgICAgICAgIGVudGVyXHJcbiAgICAgICAgICAgIC5pbnNlcnQoJ3BhdGgnLCAnZycpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsaW5rJylcclxuICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCAnbm9uZScpXHJcbiAgICAgICAgICAgIC5hdHRyKCdzdHJva2UnLCAnYmx1ZScpXHJcbiAgICAgICAgICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCAyKVxyXG4gICAgICAgICAgICAuYXR0cignZCcsIHBhdGhTdGFydGluZ0RpYWdvbmFsKHsgeDogdXBkYXRlUG9zaXRpb24ueCwgeTogdXBkYXRlUG9zaXRpb24ueSB9KSksXHJcbiAgICAgICAgdXBkYXRlID0+IHVwZGF0ZSxcclxuICAgICAgICBleGl0ID0+XHJcbiAgICAgICAgICBleGl0XHJcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24obWUubm9kZVBhcnNlci50cmFuc2l0aW9uRHVyYXRpb24pXHJcbiAgICAgICAgICAgIC5hdHRyKCdkJywgcGF0aFN0YXJ0aW5nRGlhZ29uYWwocHJOb2RlKSlcclxuICAgICAgICAgICAgLnJlbW92ZSgpXHJcbiAgICAgIClcclxuICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihtZS5ub2RlUGFyc2VyLnRyYW5zaXRpb25EdXJhdGlvbilcclxuICAgICAgLmF0dHIoJ2QnLCBwYXRoRGlhZ29uYWwpO1xyXG4gIH1cclxuXHJcbiAgLy8gWm9vbSBoYW5kbGVyIGZ1bmN0aW9uXHJcbiAgem9vbWVkKCkge1xyXG4gICAgY29uc3QgbWUgPSB0aGlzO1xyXG4gICAgLy8gU2F2aW5nIGQzIGV2ZW50J3MgdHJhbnNmb3JtIG9iamVjdFxyXG4gICAgbWUubGFzdFRyYW5zZm9ybSA9IGQzLmV2ZW50LnRyYW5zZm9ybTtcclxuICAgIC8vIFJlcG9zaXRpb24gYW5kIHJlc2NhbGUgY2hhcnQgYWNjb3JkaW5nbHlcclxuICAgIG1lLmNoYXJ0LmF0dHIoJ3RyYW5zZm9ybScsIG1lLmxhc3RUcmFuc2Zvcm0pO1xyXG4gIH1cclxuICAvLyNyZWdpb24gRXZlbnRzXHJcbiAgLy8gbm9kZSBjbGlja1xyXG4gIG9uTm9kZUNsaWNrOiBTdWJqZWN0PHsgaWQ6IHN0cmluZywgbm9kZTogSUQzTm9kZSB9PiA9IG5ldyBTdWJqZWN0KCk7XHJcbiAgcHJvdGVjdGVkIF9vbk5vZGVDbGljayhub2RlSWQ6IHN0cmluZywgbm9kZTogSUQzTm9kZSkge1xyXG4gICAgdGhpcy5vbk5vZGVDbGljay5uZXh0KHsgaWQ6IG5vZGVJZCwgbm9kZTogbm9kZSB9KTtcclxuICB9XHJcbiAgLy8jZW5kcmVnaW9uXHJcblxyXG4gIC8vZHJhd05vZGUocHJOb2RlOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4pIHtcclxuICAvLyAgY29uc3QgbWUgPSB0aGlzO1xyXG4gIC8vICBtZS5ub2RlUGFyc2VyLmRyYXcobWUuY2VudGVyRywgcHJOb2RlKTtcclxuICAvL31cclxuXHJcblxyXG4gIC8vIEdlbmVyYXRlIGN1c3RvbSBkaWFnb25hbCAtIHBsYXkgd2l0aCBpdCBoZXJlIC0gaHR0cHM6Ly9vYnNlcnZhYmxlaHEuY29tL0BidW1iZWlzaHZpbGkvY3VydmVkLWVkZ2VzP2NvbGxlY3Rpb249QGJ1bWJlaXNodmlsaS93b3JrLWNvbXBvbmVudHNcclxuICBsaW5rUGF0aChzb3VyY2U6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSwgdGFyZ2V0OiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0pIHtcclxuXHJcbiAgICAvLyBDYWxjdWxhdGUgc29tZSB2YXJpYWJsZXMgYmFzZWQgb24gc291cmNlIGFuZCB0YXJnZXQgKHMsdCkgY29vcmRpbmF0ZXNcclxuICAgIGNvbnN0IHggPSBzb3VyY2UueDtcclxuICAgIGNvbnN0IHkgPSBzb3VyY2UueTtcclxuICAgIGNvbnN0IGV4ID0gdGFyZ2V0Lng7XHJcbiAgICBjb25zdCBleSA9IHRhcmdldC55XHJcbiAgICAgIDtcclxuICAgIGxldCB4cnZzID0gZXggLSB4IDwgMCA/IC0xIDogMTtcclxuICAgIGxldCB5cnZzID0gZXkgLSB5IDwgMCA/IC0xIDogMTtcclxuICAgIGxldCByZGVmID0gMzU7XHJcbiAgICBsZXQgckluaXRpYWwgPSBNYXRoLmFicyhleCAtIHgpIC8gMiA8IHJkZWYgPyBNYXRoLmFicyhleCAtIHgpIC8gMiA6IHJkZWY7XHJcbiAgICBsZXQgciA9IE1hdGguYWJzKGV5IC0geSkgLyAyIDwgckluaXRpYWwgPyBNYXRoLmFicyhleSAtIHkpIC8gMiA6IHJJbml0aWFsO1xyXG4gICAgbGV0IGggPSBNYXRoLmFicyhleSAtIHkpIC8gMiAtIHI7XHJcbiAgICBsZXQgdyA9IE1hdGguYWJzKGV4IC0geCkgLSByICogMjtcclxuXHJcbiAgICAvLyBCdWlsZCB0aGUgcGF0aFxyXG4gICAgY29uc3QgcGF0aCA9IGBcclxuICAgICAgICAgICAgTSAke3h9ICR7eX1cclxuICAgICAgICAgICAgTCAke3h9ICR7eSArIGggKiB5cnZzfVxyXG4gICAgICAgICAgICBDICAke3h9ICR7eSArIGggKiB5cnZzICsgciAqIHlydnN9ICR7eH0gJHt5ICsgaCAqIHlydnMgKyByICogeXJ2c30gJHt4ICsgciAqIHhydnN9ICR7eSArIGggKiB5cnZzICsgciAqIHlydnN9XHJcbiAgICAgICAgICAgIEwgJHt4ICsgdyAqIHhydnMgKyByICogeHJ2c30gJHt5ICsgaCAqIHlydnMgKyByICogeXJ2c31cclxuICAgICAgICAgICAgQyAke2V4fSAgJHt5ICsgaCAqIHlydnMgKyByICogeXJ2c30gJHtleH0gICR7eSArIGggKiB5cnZzICsgciAqIHlydnN9ICR7ZXh9ICR7ZXkgLSBoICogeXJ2c31cclxuICAgICAgICAgICAgTCAke2V4fSAke2V5fVxyXG4gICAgICAgICAgYFxyXG4gICAgLy8gUmV0dXJuIHJlc3VsdFxyXG4gICAgcmV0dXJuIHBhdGg7XHJcbiAgfVxyXG5cclxuICBjaGVja0V4cGFuZGVkKG5vZGU6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPiAmIHsgX2NoaWxkcmVuPzogYW55IH0pIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuXHJcbiAgICAvLyBjaGVja2luZyBleHBhbmRlZFxyXG4gICAgaWYgKG5vZGUuZGF0YS5leHBhbmRlZCkge1xyXG4gICAgICBpZiAoIW5vZGUuY2hpbGRyZW4gJiYgbm9kZS5fY2hpbGRyZW4pIHtcclxuICAgICAgICBub2RlLmNoaWxkcmVuID0gbm9kZS5fY2hpbGRyZW47XHJcbiAgICAgICAgbm9kZS5fY2hpbGRyZW4gPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgeyAvLyBjb2xsYXBzZWRcclxuICAgICAgaWYgKG5vZGUuY2hpbGRyZW4pIHtcclxuICAgICAgICBub2RlLl9jaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XHJcbiAgICAgICAgbm9kZS5jaGlsZHJlbiA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIGNoZWNraW5nIGNoaWxkcmVuXHJcbiAgICAobm9kZS5jaGlsZHJlbiB8fCBub2RlLl9jaGlsZHJlbiB8fCBbXSkuZm9yRWFjaChjdXJyZW50ID0+IG1lLmNoZWNrRXhwYW5kZWQoY3VycmVudCkpXHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIGV4cGFuZChub2RlOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4gJiB7IF9jaGlsZHJlbj86IGFueSB9LCB0b2dnbGU6IGJvb2xlYW4gPSBmYWxzZSkgeyAvLywgIHJlbmRlcjogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICBjb25zdCBtZSA9IHRoaXM7XHJcblxyXG4gICAgLy8gaWYgdG9nZ2xlIC0gbGV0cyB0b2dnbGVcclxuICAgIGlmICh0b2dnbGUpIG5vZGUuZGF0YS5leHBhbmRlZCA9ICFub2RlLmRhdGEuZXhwYW5kZWQ7XHJcblxyXG4gICAgLy8gY2hlY2tpbmcgZXhwYW5kZWRcclxuICAgIGlmIChub2RlLmRhdGEuZXhwYW5kZWQpIHtcclxuICAgICAgaWYgKCFub2RlLmNoaWxkcmVuICYmIG5vZGUuX2NoaWxkcmVuKSB7XHJcbiAgICAgICAgbm9kZS5jaGlsZHJlbiA9IG5vZGUuX2NoaWxkcmVuO1xyXG4gICAgICAgIG5vZGUuX2NoaWxkcmVuID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHsgLy8gY29sbGFwc2VkXHJcbiAgICAgIGlmIChub2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgbm9kZS5fY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xyXG4gICAgICAgIG5vZGUuY2hpbGRyZW4gPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29uc3QgZXhwYW5kZWQgPSBub2RlLmRhdGEuZXhwYW5kZWQ7XHJcbiAgICAvLyBub2RlLmRhdGEuZXhwYW5kZWQgPSAhZXhwYW5kZWQ7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnRXhwYW5kaW5kOiAnLCBub2RlLmRhdGEubm9kZUlkKVxyXG5cclxuICAgIC8vIGNvbnN0IGV4cGFuZCA9IChjaGlsZHJlbjogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+W10sIGV4cGFuZGVkOiBib29sZWFuKSA9PiB7XHJcbiAgICAvLyAgIChjaGlsZHJlbiB8fCBbXSkuZm9yRWFjaChjdXJyZW50ID0+IHtcclxuICAgIC8vICAgICAgIGN1cnJlbnQuZGF0YS5oaWRkZW4gPSAhZXhwYW5kZWQ7XHJcbiAgICAvLyAgICAgICBleHBhbmQoY3VycmVudC5jaGlsZHJlbiwgZXhwYW5kZWQpOyBcclxuICAgIC8vICAgICB9KTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBleHBhbmQobm9kZS5jaGlsZHJlbiwgbm9kZS5kYXRhLmV4cGFuZGVkKTsgXHJcbiAgICBpZiAodG9nZ2xlKSBtZS5zaG93Tm9kZXMobm9kZSk7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuIl19