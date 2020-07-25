import * as d3 from 'd3';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { D3NodeBasicParser } from './@items';
import { calcGFit, setPattern, addDefaultDefs, buildTree } from './d3x/d3x';
export class D3OrgChart {
    constructor(prContainer, prOptions) {
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
        this.zoomFunc = d3.zoom().scaleExtent([0.1, 20]).on("zoom", d => this.zoomed());
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
    get nodeParser() {
        if (!this._nodeParser)
            this._nodeParser = new D3NodeBasicParser();
        return this._nodeParser;
    }
    set nodeParser(parser) {
        this._nodeParser = parser;
        // this.render();
    }
    get data() {
        return this._data || [];
    }
    set data(data) {
        this._data = data;
        // this.render()
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
            // .call(d3.zoom().on("zoom", d => this.zoomed()))
            .call(this.zoomFunc)
            .on("dblclick.zoom", null)
            .attr('cursor', 'move')
            .style('background-color', me.options.backgroundColor), update => update
            .attr('width', containerRect.width)
            .attr('height', containerRect.height)
            .attr('font-family', me.options.defaultFont)
            .style('background-color', me.options.backgroundColor));
        //Add container g element
        me.chart = me.svg.selectAll('g.chart')
            .data([{ id: 'chart' }], (d) => d.id)
            .join(enter => enter
            .append('g')
            .attr('class', 'chart')
            .attr('transform', `translate(0,0)`), update => update);
        if (!me.lastTransform)
            me.svg.transition().duration(200).call(me.zoomFunc.transform, d3.zoomIdentity.translate(containerRect.width / 2, this.nodeParser.height).scale(1));
        //Add container g element
        me.tb = me.svg.selectAll('g.toolbar')
            .data([{ id: 'toolbar' }], (d) => d.id)
            .join(enter => enter
            .append('g')
            .attr('class', 'toolbar')
            .attr('transform', `translate(10,10)`)
            .append('rect')
            .attr('width', 30)
            .attr('height', 30)
            .attr('fill', 'url(#img-fit-icon)')
            .attr('cursor', 'pointer')
            .on('click', () => me.fit()), update => update);
        me.prepareDefs();
    }
    // preparing defs
    prepareDefs() {
        const me = this;
        // defs
        me.defs = me.svg.selectAll('defs.globalDefs')
            .data([{ id: 'defs' }], (d) => d.id)
            .join(enter => {
            const defs = enter.append('defs').attr('class', 'globalDefs');
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
                            type: 'base64',
                            data: me.nodeParser.errorBase64Icon
                        }
                    }]);
            }
        }
        // preparing treemap
        const containerRect = me.container.node().getBoundingClientRect();
        me.treemap = d3.tree() //.size([containerRect.width || 250, containerRect.height])
            .nodeSize([
            (me.nodeParser.width + (this.nodeParser.width * me.options.nodeHorizontalSpaceScale || 0.5)) * 0,
            (me.nodeParser.height + (this.nodeParser.height * me.options.nodeVerticalSpaceScale || 0.8)) * 0
        ])
            .separation((a, b) => {
            return 1;
        });
        // me.allNodes = me.treemap(me.root).descendants();
        me.checkExpanded(me.root);
    }
    // showing nodes
    showNodes(prNode = null) {
        const me = this;
        if (!prNode)
            prNode = me.root;
        const nodeRef = {
            x: prNode.x || 0,
            y: prNode.y || 0,
            parent: prNode.parent
        };
        // console.log('Node Before: ', nodeRef.x);
        const updatePosition = {
            x: prNode.x || 0,
            y: prNode.y || 0
        };
        //  Assigns the x and y position for the nodes
        const treeData = me.treemap(me.root);
        // it is necesary for scope 
        const drawNodes = (container) => me.nodeParser.drawNodes(container, me.onNodeClick);
        const drawCollapser = (nodeGroup) => {
            nodeGroup.append('circle')
                .attr('class', 'collapser')
                .attr('cx', me.nodeParser.width / 2)
                .attr('cy', me.nodeParser.height)
                .attr('r', 15)
                .attr('stroke', 'black')
                .attr('stroke-width', 2)
                .on('click', (node) => {
                // console.log('Node X: ', node.x)
                d3.event.preventDefault();
                me.expand(node, true);
            });
        };
        // console.log('Node ref: ', prNode.x, nodeRef.x, nodeRef )
        const nodes = treeData.descendants();
        // probanding
        buildTree(me.root, {
            w: me.nodeParser.width + (this.nodeParser.width * me.options.nodeHorizontalSpaceScale || 0.5),
            h: me.nodeParser.height + (this.nodeParser.height * me.options.nodeVerticalSpaceScale || 0.8)
        });
        // console.log('Nodes: ', nodes);
        // preparing all definitions for nodes
        me.defs.selectAll('pattern.node')
            .data(nodes, (d) => d.data.nodeId)
            .join(enter => enter.filter(d => d.data.nodeImage != null)
            .append('pattern').attr('class', 'node')
            .each((nodeData, i, enterNodes) => {
            // adding pattern
            const pattern = d3.select(enterNodes[i]);
            setPattern(pattern, nodeData.data, me.nodeParser);
        }), update => update, exit => exit
            .transition()
            .duration(me.nodeParser.transitionDuration)
            .style("opacity", 0)
            .remove());
        // rendering nodes
        const nodeStartPosition = (d) => {
            if (nodeRef) {
                return `translate(${nodeRef.x - (me.nodeParser.width / 2)},${nodeRef.y})`;
            }
            if (!d.parent)
                return `translate(${d.x - (me.nodeParser.width / 2)},${d.y})`;
            return `translate(${d.parent.x - (me.nodeParser.width / 2)},${d.parent.y})`;
        };
        const nodePosition = (params) => `translate(${params.x - (me.nodeParser.width / 2)},${params.y})`;
        const expandIconVisible = (d) => (d.children || d._children) ? 'visible' : 'hidden';
        const expandIcon = (d) => expandIconVisible(d) == 'visible' ? (d.data.expanded ? `url(#img-collapse-icon)` : `url(#img-expand-icon)`) : '';
        me.chart.selectAll('g.node')
            .data(nodes, (d) => d.data.nodeId)
            .join(enter => enter.append('g')
            .style("opacity", 0)
            .attr('class', 'node')
            .attr('cursor', 'pointer')
            .attr('transform', nodeStartPosition)
            .call(drawNodes)
            .call(drawCollapser)
            .on('dblclick', (node) => {
            const containerRect = me.container.node().getBoundingClientRect();
            me.traslateTo((containerRect.width / 2) - node.x, ((containerRect.height - me.nodeParser.height) / 2) - node.y);
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
        const pathStartingDiagonal = (d) => {
            return this.linkPath(d, d);
        };
        const pathDiagonal = (d) => {
            const target = { x: d.parent.x, y: d.parent.y + me.nodeParser.height };
            return this.linkPath(d, d.parent);
        };
        me.chart.selectAll('path.link')
            .data(nodes.slice(1), (d) => d.data.nodeId)
            .join(enter => enter
            .insert('path', 'g')
            .attr('class', 'link')
            .attr('fill', 'none')
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('d', pathStartingDiagonal(nodeRef)), update => update, exit => exit
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
        me.chart.attr('transform', d3.event.transform);
    }
    _onNodeClick(nodeId, node) {
        this.onNodeClick.next({ id: nodeId, node: node });
    }
    //#endregion
    // Generate custom diagonal - play with it here - https://observablehq.com/@bumbeishvili/curved-edges?collection=@bumbeishvili/work-components
    linkPath(source, target) {
        const me = this;
        // Calculate some variables based on source and target (s,t) coordinates
        let x = source.x;
        let y = source.y;
        const ex = target.x;
        const ey = target.y + me.nodeParser.height;
        const linkHeight = 25;
        const curveRadius = Math.abs(x - ex) != 0 ? 15 : 0;
        let xrvs = ex - x < 0 ? -1 : 1;
        let yrvs = ey - y < 0 ? -1 : 1;
        let w = Math.abs(ex - x) - (curveRadius * 2);
        const path = `
      M ${x} ${y}
      L ${x} ${y + (linkHeight * yrvs)}
      C ${x} ${y + ((linkHeight + curveRadius) * yrvs)} ${x} ${y + ((linkHeight + curveRadius) * yrvs)} ${x + (curveRadius * xrvs)} ${y + ((linkHeight + curveRadius) * yrvs)}
      L ${x + ((w + curveRadius) * xrvs)} ${y + ((linkHeight + curveRadius) * yrvs)}
      C ${ex}  ${y + ((linkHeight + curveRadius) * yrvs)} ${ex}  ${y + ((linkHeight + curveRadius) * yrvs)} ${ex} ${y + ((linkHeight + curveRadius) * yrvs) + (curveRadius * yrvs)}
      L ${ex} ${ey}
    `;
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
        const nodeRef = Object.assign(node);
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
    }
    traslateTo(prX, prY) {
        const me = this;
        me.svg
            .transition().duration(me.nodeParser.transitionDuration)
            .call(me.zoomFunc.transform, d3.zoomIdentity.translate(prX, prY));
    }
    fit() {
        const me = this;
        // const zoom = d3.zoom().on("zoom", d => this.zoomed())
        const fit = calcGFit(me.chart, me.svg, me.root, me.nodeParser);
        me.svg.transition().duration(me.nodeParser.transitionDuration).call(me.zoomFunc.transform, d3.zoomIdentity.translate(fit.x, fit.y).scale(fit.scale));
    }
    setOptions(prOptions) {
        const me = this;
        me.options = Object.assign(me.options, prOptions);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZDMtb3JnLWNoYXJ0LmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYmUtb3JnY2hhcnQvIiwic291cmNlcyI6WyJsaWIvY2xhc2Vzcy9kMy1vcmctY2hhcnQuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFFekIsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDMUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUU3QyxPQUFPLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFhLE1BQU0sV0FBVyxDQUFDO0FBWXZGLE1BQU0sT0FBTyxVQUFVO0lBd0RyQixZQUFZLFdBQXdCLEVBQUUsU0FBOEI7O1FBdkRwRSx5QkFBeUI7UUFDZixZQUFPLEdBQXVCO1lBQ3RDLGVBQWUsRUFBRSxTQUFTO1lBQzFCLFVBQVUsRUFBRSxJQUFJLGlCQUFpQixFQUFFO1lBQ25DLElBQUksRUFBRSxFQUFFO1lBQ1IsV0FBVyxFQUFFLFFBQVE7WUFDckIsd0JBQXdCLEVBQUUsR0FBRztZQUM3QixzQkFBc0IsRUFBRSxHQUFHO1NBQzVCLENBQUE7UUE2QkQsMkJBQTJCO1FBRWpCLFVBQUssR0FBYyxFQUFFLENBQUM7UUFTaEMsWUFBWTtRQUVaLGFBQVEsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBRTNFLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBMlZ4QixnQkFBZ0I7UUFDaEIsYUFBYTtRQUNiLGdCQUFXLEdBQTJDLElB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QUFFLENBQUMsR0FBRzthQUNILFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDO2FBQ3ZELElBQUksQ0FDSCxFQUFFLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFDckIsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUNwQyxDQUFDO0lBQ04sQ0FBQztJQUVELEdBQUc7UUFDRCxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDaEIsd0RBQXdEO1FBRXhELE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDOUQsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLElBQUksQ0FDakUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQ3JCLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQ3pELENBQUM7SUFDSixDQUFDO0lBRUQsVUFBVSxDQUFDLFNBQXNDO1FBQy9DLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztRQUNoQixFQUFFLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNwRCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBkMyBmcm9tICdkMyc7XHJcbmltcG9ydCB7IElEM05vZGUsIElJbWFnZURlZiB9IGZyb20gJy4uL2ludGVyZmFjZXMnO1xyXG5pbXBvcnQgeyBTdWJqZWN0LCBmcm9tRXZlbnQgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgZGVib3VuY2VUaW1lIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBEM05vZGVCYXNpY1BhcnNlciB9IGZyb20gJy4vQGl0ZW1zJztcclxuXHJcbmltcG9ydCB7IGNhbGNHRml0LCBzZXRQYXR0ZXJuLCBhZGREZWZhdWx0RGVmcywgYnVpbGRUcmVlLCBJUm9vdE5vZGUgfSBmcm9tICcuL2QzeC9kM3gnO1xyXG5pbXBvcnQgeyBCYXNlVHlwZSB9IGZyb20gJ2QzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUQzT3JnQ2hhcnRPcHRpb25zIHtcclxuICBub2RlUGFyc2VyPzogRDNOb2RlQmFzaWNQYXJzZXI7XHJcbiAgZGF0YT86IElEM05vZGVbXTtcclxuICBiYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XHJcbiAgZGVmYXVsdEZvbnQ/OiBzdHJpbmc7XHJcbiAgbm9kZUhvcml6b250YWxTcGFjZVNjYWxlPzogbnVtYmVyO1xyXG4gIG5vZGVWZXJ0aWNhbFNwYWNlU2NhbGU/OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBEM09yZ0NoYXJ0IHtcclxuICAvLyNyZWdpb24gRGVmYXVsdCBPcHRpb25zXHJcbiAgcHJvdGVjdGVkIG9wdGlvbnM6IElEM09yZ0NoYXJ0T3B0aW9ucyA9IHtcclxuICAgIGJhY2tncm91bmRDb2xvcjogJyMwM0EzQzUnLFxyXG4gICAgbm9kZVBhcnNlcjogbmV3IEQzTm9kZUJhc2ljUGFyc2VyKCksXHJcbiAgICBkYXRhOiBbXSxcclxuICAgIGRlZmF1bHRGb250OiAnVGFob21hJyxcclxuICAgIG5vZGVIb3Jpem9udGFsU3BhY2VTY2FsZTogMC41LFxyXG4gICAgbm9kZVZlcnRpY2FsU3BhY2VTY2FsZTogMC44XHJcbiAgfVxyXG4gIC8vI2VuZHJlZ2lvblxyXG5cclxuICAvLyNyZWdpb24gIE5PREUgUEFSU0VSXHJcbiAgcHJvdGVjdGVkIF9ub2RlUGFyc2VyOiBEM05vZGVCYXNpY1BhcnNlcjtcclxuICBnZXQgbm9kZVBhcnNlcigpOiBEM05vZGVCYXNpY1BhcnNlciB7XHJcbiAgICBpZiAoIXRoaXMuX25vZGVQYXJzZXIpIHRoaXMuX25vZGVQYXJzZXIgPSBuZXcgRDNOb2RlQmFzaWNQYXJzZXIoKTtcclxuICAgIHJldHVybiB0aGlzLl9ub2RlUGFyc2VyO1xyXG4gIH1cclxuICBzZXQgbm9kZVBhcnNlcihwYXJzZXI6IEQzTm9kZUJhc2ljUGFyc2VyKSB7XHJcbiAgICB0aGlzLl9ub2RlUGFyc2VyID0gcGFyc2VyO1xyXG4gICAgLy8gdGhpcy5yZW5kZXIoKTtcclxuICB9XHJcbiAgLy8jZW5kcmVnaW9uXHJcblxyXG4gIC8vI3JlZ2lvbiBTVkcgY29tcG9uZW50c1xyXG4gIHByb3RlY3RlZCBjb250YWluZXI6IGQzLlNlbGVjdGlvbjxIVE1MRWxlbWVudCwgYW55LCBhbnksIGFueT47XHJcbiAgcHJvdGVjdGVkIHN2ZzogZDMuU2VsZWN0aW9uPFNWR0VsZW1lbnQsIHVua25vd24sIEhUTUxFbGVtZW50LCB1bmtub3duPjtcclxuICBwcm90ZWN0ZWQgdGI6IGQzLlNlbGVjdGlvbjxhbnksIGFueSwgYW55LCBhbnk+O1xyXG5cclxuICBwcm90ZWN0ZWQgY2hhcnQ6IGQzLlNlbGVjdGlvbjxTVkdHRWxlbWVudCwgYW55LCBCYXNlVHlwZSwgYW55PjtcclxuICAvLyBwcm90ZWN0ZWQgY2VudGVyRzogZDMuU2VsZWN0aW9uPGFueSwgYW55LCBhbnksIGFueT47XHJcbiAgcHJvdGVjdGVkIGRlZnM6IGQzLlNlbGVjdGlvbjxhbnksIGFueSwgYW55LCBhbnk+O1xyXG5cclxuICBwcm90ZWN0ZWQgbGFzdFRyYW5zZm9ybTogYW55O1xyXG4gIC8vI2VuZHJlZ2lvblxyXG5cclxuICAvLyNyZWdpb24gREFUQVxyXG4gIHByb3RlY3RlZCByb290OiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT47XHJcbiAgLy8gcHJvdGVjdGVkIGFsbE5vZGVzOiBhbnk7XHJcblxyXG4gIHByb3RlY3RlZCBfZGF0YTogSUQzTm9kZVtdID0gW107XHJcbiAgZ2V0IGRhdGEoKTogSUQzTm9kZVtdIHtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhIHx8IFtdO1xyXG4gIH1cclxuXHJcbiAgc2V0IGRhdGEoZGF0YTogSUQzTm9kZVtdKSB7XHJcbiAgICB0aGlzLl9kYXRhID0gZGF0YTtcclxuICAgIC8vIHRoaXMucmVuZGVyKClcclxuICB9XHJcbiAgLy8jZW5kcmVnaW9uXHJcblxyXG4gIHpvb21GdW5jID0gZDMuem9vbSgpLnNjYWxlRXh0ZW50KFswLjEsIDIwXSkub24oXCJ6b29tXCIsIGQgPT4gdGhpcy56b29tZWQoKSk7XHJcblxyXG4gIGN1cnJlbnRab29tOiBudW1iZXIgPSAxO1xyXG4gIHRyZWVtYXA6IGQzLlRyZWVMYXlvdXQ8SUQzTm9kZT47XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByQ29udGFpbmVyOiBIVE1MRWxlbWVudCwgcHJPcHRpb25zPzogSUQzT3JnQ2hhcnRPcHRpb25zKSB7XHJcbiAgICBjb25zdCBtZSA9IHRoaXM7XHJcblxyXG4gICAgLy8gaW5pdCBjb250YWluZXJcclxuICAgIG1lLmNvbnRhaW5lciA9IGQzLnNlbGVjdChwckNvbnRhaW5lcik7XHJcblxyXG4gICAgLy9JZiBEYXRhIGFyZ3VtZW50IHBhc3NlZCAtIHRoZW4gc2V0IGl0XHJcbiAgICBpZiAocHJPcHRpb25zPy5kYXRhKSBtZS5fZGF0YSA9IHByT3B0aW9ucy5kYXRhO1xyXG5cclxuICAgIC8vIHNldHRpbmcgcGFyc2VyXHJcbiAgICBtZS5fbm9kZVBhcnNlciA9IHByT3B0aW9ucz8ubm9kZVBhcnNlciB8fCBtZS5vcHRpb25zLm5vZGVQYXJzZXI7XHJcblxyXG4gICAgLy8gYXBwbHlpbmcgb3B0aW9uc1xyXG4gICAgbWUub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24obWUub3B0aW9ucywgcHJPcHRpb25zKTtcclxuXHJcbiAgICAvLyBtb25pdG9yIHJlc2l6ZVxyXG4gICAgZnJvbUV2ZW50KHdpbmRvdywgJ3Jlc2l6ZScpXHJcbiAgICAgIC5waXBlKFxyXG4gICAgICAgIGRlYm91bmNlVGltZSgzMDApXHJcbiAgICAgICkuc3Vic2NyaWJlKFxyXG4gICAgICAgICgpID0+IHtcclxuICAgICAgICAgIC8vIEhEQyAtIFZFUiB0aGlzLnByZXBhcmVDYW52YXMoKTtcclxuICAgICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICApXHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICBjb25zdCBtZSA9IHRoaXM7XHJcbiAgICAvLyBwcmVwYXJpbmcgc3ZnXHJcbiAgICBtZS5wcmVwYXJlQ2FudmFzKCk7XHJcblxyXG4gICAgLy8gaWYgbm8gZGF0YSB0aGVuIHJldHVyblxyXG4gICAgaWYgKCFtZS5kYXRhLmxlbmd0aCkgcmV0dXJuO1xyXG5cclxuICAgIC8vIHByZXBhcmluZyBkYXRhXHJcbiAgICBtZS5wcmVwYXJlRGF0YSgpO1xyXG5cclxuICAgIC8vIHNob3dpbmcgbm9kZXNcclxuICAgIG1lLnNob3dOb2RlcygpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvLyBwcmVwYXJpbmcgY2FudmFzXHJcbiAgcHJvdGVjdGVkIHByZXBhcmVDYW52YXMoKSB7XHJcbiAgICBjb25zdCBtZSA9IHRoaXM7XHJcblxyXG4gICAgLy9EcmF3aW5nIGNvbnRhaW5lcnNcclxuICAgIGNvbnN0IGNvbnRhaW5lclJlY3QgPSBtZS5jb250YWluZXIubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgbWUuc3ZnID0gbWUuY29udGFpbmVyLnNlbGVjdEFsbDxTVkdFbGVtZW50LCBhbnk+KCdzdmcnKVxyXG4gICAgICAuZGF0YShbeyBpZDogJ3N2ZycgfV0sIChkOiB7IGlkOiBzdHJpbmcgfSkgPT4gZC5pZClcclxuICAgICAgLmpvaW4oXHJcbiAgICAgICAgZW50ZXIgPT5cclxuICAgICAgICAgIGVudGVyXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJ3N2ZycpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdzdmctY2hhcnQtY29udGFpbmVyJylcclxuICAgICAgICAgICAgLmF0dHIoJ2ZvbnQtZmFtaWx5JywgbWUub3B0aW9ucy5kZWZhdWx0Rm9udClcclxuICAgICAgICAgICAgLy8gLmNhbGwoZDMuem9vbSgpLm9uKFwiem9vbVwiLCBkID0+IHRoaXMuem9vbWVkKCkpKVxyXG4gICAgICAgICAgICAuY2FsbCh0aGlzLnpvb21GdW5jKVxyXG4gICAgICAgICAgICAub24oXCJkYmxjbGljay56b29tXCIsIG51bGwpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjdXJzb3InLCAnbW92ZScpXHJcbiAgICAgICAgICAgIC5zdHlsZSgnYmFja2dyb3VuZC1jb2xvcicsIG1lLm9wdGlvbnMuYmFja2dyb3VuZENvbG9yKSxcclxuICAgICAgICB1cGRhdGUgPT5cclxuICAgICAgICAgIHVwZGF0ZVxyXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCBjb250YWluZXJSZWN0LndpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgY29udGFpbmVyUmVjdC5oZWlnaHQpXHJcbiAgICAgICAgICAgIC5hdHRyKCdmb250LWZhbWlseScsIG1lLm9wdGlvbnMuZGVmYXVsdEZvbnQpXHJcbiAgICAgICAgICAgIC5zdHlsZSgnYmFja2dyb3VuZC1jb2xvcicsIG1lLm9wdGlvbnMuYmFja2dyb3VuZENvbG9yKVxyXG4gICAgICApO1xyXG5cclxuICAgIC8vQWRkIGNvbnRhaW5lciBnIGVsZW1lbnRcclxuICAgIG1lLmNoYXJ0ID0gbWUuc3ZnLnNlbGVjdEFsbDxTVkdHRWxlbWVudCwgYW55PignZy5jaGFydCcpXHJcbiAgICAgIC5kYXRhKFt7IGlkOiAnY2hhcnQnIH1dLCAoZDogeyBpZDogc3RyaW5nIH0pID0+IGQuaWQpXHJcbiAgICAgIC5qb2luKFxyXG4gICAgICAgIGVudGVyID0+IGVudGVyXHJcbiAgICAgICAgICAuYXBwZW5kKCdnJylcclxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdjaGFydCcpXHJcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLDApYCksXHJcbiAgICAgICAgdXBkYXRlID0+IHVwZGF0ZVxyXG4gICAgICApXHJcbiAgICBpZiAoIW1lLmxhc3RUcmFuc2Zvcm0pXHJcbiAgICAgIG1lLnN2Zy50cmFuc2l0aW9uKCkuZHVyYXRpb24oMjAwKS5jYWxsKFxyXG4gICAgICAgIG1lLnpvb21GdW5jLnRyYW5zZm9ybSxcclxuICAgICAgICBkMy56b29tSWRlbnRpdHkudHJhbnNsYXRlKGNvbnRhaW5lclJlY3Qud2lkdGggLyAyLCB0aGlzLm5vZGVQYXJzZXIuaGVpZ2h0KS5zY2FsZSgxKVxyXG4gICAgICApO1xyXG5cclxuICAgIC8vQWRkIGNvbnRhaW5lciBnIGVsZW1lbnRcclxuICAgIG1lLnRiID0gbWUuc3ZnLnNlbGVjdEFsbCgnZy50b29sYmFyJylcclxuICAgICAgLmRhdGEoW3sgaWQ6ICd0b29sYmFyJyB9XSwgKGQ6IHsgaWQ6IHN0cmluZyB9KSA9PiBkLmlkKVxyXG4gICAgICAuam9pbihcclxuICAgICAgICBlbnRlciA9PiBlbnRlclxyXG4gICAgICAgICAgLmFwcGVuZCgnZycpXHJcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAndG9vbGJhcicpXHJcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgxMCwxMClgKVxyXG4gICAgICAgICAgLmFwcGVuZCgncmVjdCcpXHJcbiAgICAgICAgICAuYXR0cignd2lkdGgnLCAzMClcclxuICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAzMClcclxuICAgICAgICAgIC5hdHRyKCdmaWxsJywgJ3VybCgjaW1nLWZpdC1pY29uKScpXHJcbiAgICAgICAgICAuYXR0cignY3Vyc29yJywgJ3BvaW50ZXInKVxyXG4gICAgICAgICAgLm9uKCdjbGljaycsICgpID0+IG1lLmZpdCgpKSxcclxuICAgICAgICB1cGRhdGUgPT4gdXBkYXRlXHJcbiAgICAgIClcclxuICAgIG1lLnByZXBhcmVEZWZzKCk7XHJcbiAgfVxyXG5cclxuICAvLyBwcmVwYXJpbmcgZGVmc1xyXG4gIHByZXBhcmVEZWZzKCkge1xyXG4gICAgY29uc3QgbWUgPSB0aGlzO1xyXG4gICAgLy8gZGVmc1xyXG4gICAgbWUuZGVmcyA9IG1lLnN2Zy5zZWxlY3RBbGwoJ2RlZnMuZ2xvYmFsRGVmcycpXHJcbiAgICAgIC5kYXRhKFt7IGlkOiAnZGVmcycgfV0sIChkOiB7IGlkOiBzdHJpbmcgfSkgPT4gZC5pZClcclxuICAgICAgLmpvaW4oXHJcbiAgICAgICAgZW50ZXIgPT4ge1xyXG4gICAgICAgICAgY29uc3QgZGVmcyA9IGVudGVyLmFwcGVuZCgnZGVmcycpLmF0dHIoJ2NsYXNzJywgJ2dsb2JhbERlZnMnKTtcclxuICAgICAgICAgIGFkZERlZmF1bHREZWZzKGRlZnMsIHtcclxuICAgICAgICAgICAgJ2V4cGFuZC1pY29uJzoge1xyXG4gICAgICAgICAgICAgIHR5cGU6ICdpY29uJyxcclxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjMDVDMzU2JyxcclxuICAgICAgICAgICAgICBzY2FsZTogMC42LFxyXG4gICAgICAgICAgICAgIGNvbG9yOiAnI0VBRkE0OCcsXHJcbiAgICAgICAgICAgICAgbmFtZTogJ2ZhUGx1cydcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2NvbGxhcHNlLWljb24nOiB7XHJcbiAgICAgICAgICAgICAgdHlwZTogJ2ljb24nLFxyXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNEMTAzMDMnLFxyXG4gICAgICAgICAgICAgIHNjYWxlOiAwLjYsXHJcbiAgICAgICAgICAgICAgY29sb3I6ICcjRUFGQTQ4JyxcclxuICAgICAgICAgICAgICBuYW1lOiAnZmFNaW51cydcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2ZpdC1pY29uJzoge1xyXG4gICAgICAgICAgICAgIHR5cGU6ICdpY29uJyxcclxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjMDc0RUYzJyxcclxuICAgICAgICAgICAgICBzY2FsZTogMC45LFxyXG4gICAgICAgICAgICAgIGNvbG9yOiAnI0VBRkE0OCcsXHJcbiAgICAgICAgICAgICAgbmFtZTogJ2ZhRXhwYW5kJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnZGVmYXVsdC1ub2RlLWltZyc6IG1lLm5vZGVQYXJzZXIuZGVmYXVsdEltYWdlIGFzIElJbWFnZURlZlxyXG4gICAgICAgICAgfSwgbWUubm9kZVBhcnNlcilcclxuICAgICAgICAgIC8vYWRkRGVmcyhkZWZzLCBtZS5kZWZzRWxlbWVudHMpO1xyXG4gICAgICAgICAgcmV0dXJuIGRlZnNcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVwZGF0ZSA9PiB1cGRhdGVcclxuICAgICAgKVxyXG4gIH1cclxuXHJcbiAgLy8gcHJlcGFyaW5nIGRhdGFcclxuICBwcm90ZWN0ZWQgcHJlcGFyZURhdGEoKSB7XHJcbiAgICBjb25zdCBtZSA9IHRoaXM7XHJcblxyXG4gICAgLy8gaWYgbm8gZGF0YSByZXR1cm4gXHJcbiAgICBpZiAoIW1lLmRhdGEubGVuZ3RoKSByZXR1cm47XHJcblxyXG4gICAgLy8gQ29udmVydCBmbGF0IGRhdGEgdG8gaGllcmFyY2hpY2FsXHJcbiAgICBpZiAoIW1lLnJvb3QpIHtcclxuICAgICAgdHJ5IHsgLy8gcHJldmVudGluZyBtdWx0aXBsZSByb290XHJcbiAgICAgICAgbWUucm9vdCA9IGQzLnN0cmF0aWZ5PElEM05vZGU+KCkuaWQoKHsgbm9kZUlkIH0pID0+IG5vZGVJZCkucGFyZW50SWQoKHsgcGFyZW50Tm9kZUlkIH0pID0+IHBhcmVudE5vZGVJZClcclxuICAgICAgICAgIChtZS5kYXRhKSBhcyBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT47XHJcbiAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIG1lLnJvb3QgPSBkMy5zdHJhdGlmeTxJRDNOb2RlPigpLmlkKCh7IG5vZGVJZCB9KSA9PiBub2RlSWQpLnBhcmVudElkKCh7IHBhcmVudE5vZGVJZCB9KSA9PiBwYXJlbnROb2RlSWQpXHJcbiAgICAgICAgICAoW3tcclxuICAgICAgICAgICAgbm9kZUlkOiAncm9vdCcsXHJcbiAgICAgICAgICAgIHBhcmVudE5vZGVJZDogJycsXHJcbiAgICAgICAgICAgIHRpdGxlOiAnRXJyb3InLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogZXJyLm1lc3NhZ2UgfHwgZXJyLFxyXG4gICAgICAgICAgICBub2RlSW1hZ2U6IHtcclxuICAgICAgICAgICAgICB0eXBlOiAnYmFzZTY0JyxcclxuICAgICAgICAgICAgICBkYXRhOiBtZS5ub2RlUGFyc2VyLmVycm9yQmFzZTY0SWNvblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XSkgYXMgZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHJlcGFyaW5nIHRyZWVtYXBcclxuICAgIGNvbnN0IGNvbnRhaW5lclJlY3QgPSBtZS5jb250YWluZXIubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgbWUudHJlZW1hcCA9IGQzLnRyZWU8SUQzTm9kZT4oKSAvLy5zaXplKFtjb250YWluZXJSZWN0LndpZHRoIHx8IDI1MCwgY29udGFpbmVyUmVjdC5oZWlnaHRdKVxyXG4gICAgICAubm9kZVNpemUoW1xyXG4gICAgICAgIChtZS5ub2RlUGFyc2VyLndpZHRoICsgKHRoaXMubm9kZVBhcnNlci53aWR0aCAqIG1lLm9wdGlvbnMubm9kZUhvcml6b250YWxTcGFjZVNjYWxlIHx8IDAuNSkpICogMCxcclxuICAgICAgICAobWUubm9kZVBhcnNlci5oZWlnaHQgKyAodGhpcy5ub2RlUGFyc2VyLmhlaWdodCAqIG1lLm9wdGlvbnMubm9kZVZlcnRpY2FsU3BhY2VTY2FsZSB8fCAwLjgpKSAqIDBcclxuICAgICAgXSlcclxuICAgICAgLnNlcGFyYXRpb24oKGE6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPiwgYjogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+KSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIDFcclxuICAgICAgfSlcclxuICAgIC8vIG1lLmFsbE5vZGVzID0gbWUudHJlZW1hcChtZS5yb290KS5kZXNjZW5kYW50cygpO1xyXG4gICAgbWUuY2hlY2tFeHBhbmRlZChtZS5yb290KTtcclxuICB9XHJcblxyXG4gIC8vIHNob3dpbmcgbm9kZXNcclxuICBwcm90ZWN0ZWQgc2hvd05vZGVzKHByTm9kZTogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+ID0gbnVsbCkge1xyXG4gICAgY29uc3QgbWUgPSB0aGlzO1xyXG5cclxuICAgIGlmICghcHJOb2RlKSBwck5vZGUgPSBtZS5yb290O1xyXG4gICAgY29uc3Qgbm9kZVJlZiA9IHtcclxuICAgICAgeDogcHJOb2RlLnggfHwgMCxcclxuICAgICAgeTogcHJOb2RlLnkgfHwgMCxcclxuICAgICAgcGFyZW50OiBwck5vZGUucGFyZW50XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCdOb2RlIEJlZm9yZTogJywgbm9kZVJlZi54KTtcclxuICAgIGNvbnN0IHVwZGF0ZVBvc2l0aW9uOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0gPSB7XHJcbiAgICAgIHg6IHByTm9kZS54IHx8IDAsXHJcbiAgICAgIHk6IHByTm9kZS55IHx8IDBcclxuICAgIH1cclxuXHJcbiAgICAvLyAgQXNzaWducyB0aGUgeCBhbmQgeSBwb3NpdGlvbiBmb3IgdGhlIG5vZGVzXHJcbiAgICBjb25zdCB0cmVlRGF0YSA9IG1lLnRyZWVtYXAobWUucm9vdCk7XHJcbiAgICAvLyBpdCBpcyBuZWNlc2FyeSBmb3Igc2NvcGUgXHJcbiAgICBjb25zdCBkcmF3Tm9kZXMgPSAoY29udGFpbmVyKSA9PiBtZS5ub2RlUGFyc2VyLmRyYXdOb2Rlcyhjb250YWluZXIsIG1lLm9uTm9kZUNsaWNrKTtcclxuICAgIGNvbnN0IGRyYXdDb2xsYXBzZXIgPSAobm9kZUdyb3VwOiBkMy5TZWxlY3Rpb248U1ZHR0VsZW1lbnQsIGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPiwgYW55LCBhbnk+KSA9PiB7XHJcbiAgICAgIG5vZGVHcm91cC5hcHBlbmQoJ2NpcmNsZScpXHJcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2NvbGxhcHNlcicpXHJcbiAgICAgICAgLmF0dHIoJ2N4JywgbWUubm9kZVBhcnNlci53aWR0aCAvIDIpXHJcbiAgICAgICAgLmF0dHIoJ2N5JywgbWUubm9kZVBhcnNlci5oZWlnaHQpXHJcbiAgICAgICAgLmF0dHIoJ3InLCAxNSlcclxuICAgICAgICAuYXR0cignc3Ryb2tlJywgJ2JsYWNrJylcclxuICAgICAgICAuYXR0cignc3Ryb2tlLXdpZHRoJywgMilcclxuICAgICAgICAub24oJ2NsaWNrJywgKG5vZGUpID0+IHtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdOb2RlIFg6ICcsIG5vZGUueClcclxuICAgICAgICAgIGQzLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBtZS5leHBhbmQobm9kZSwgdHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgLy8gY29uc29sZS5sb2coJ05vZGUgcmVmOiAnLCBwck5vZGUueCwgbm9kZVJlZi54LCBub2RlUmVmIClcclxuICAgIGNvbnN0IG5vZGVzID0gdHJlZURhdGEuZGVzY2VuZGFudHMoKTtcclxuXHJcbiAgICAvLyBwcm9iYW5kaW5nXHJcbiAgICBidWlsZFRyZWUoXHJcbiAgICAgIG1lLnJvb3QsXHJcbiAgICAgIHtcclxuICAgICAgICB3OiBtZS5ub2RlUGFyc2VyLndpZHRoICsgKHRoaXMubm9kZVBhcnNlci53aWR0aCAqIG1lLm9wdGlvbnMubm9kZUhvcml6b250YWxTcGFjZVNjYWxlIHx8IDAuNSksXHJcbiAgICAgICAgaDogbWUubm9kZVBhcnNlci5oZWlnaHQgKyAodGhpcy5ub2RlUGFyc2VyLmhlaWdodCAqIG1lLm9wdGlvbnMubm9kZVZlcnRpY2FsU3BhY2VTY2FsZSB8fCAwLjgpXHJcbiAgICAgIH1cclxuICAgICk7XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ05vZGVzOiAnLCBub2Rlcyk7XHJcbiAgICAvLyBwcmVwYXJpbmcgYWxsIGRlZmluaXRpb25zIGZvciBub2Rlc1xyXG4gICAgbWUuZGVmcy5zZWxlY3RBbGwoJ3BhdHRlcm4ubm9kZScpXHJcbiAgICAgIC5kYXRhKG5vZGVzLCAoZDogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+KSA9PiBkLmRhdGEubm9kZUlkKVxyXG4gICAgICAuam9pbihcclxuICAgICAgICBlbnRlciA9PlxyXG4gICAgICAgICAgZW50ZXIuZmlsdGVyKGQgPT4gZC5kYXRhLm5vZGVJbWFnZSAhPSBudWxsKVxyXG4gICAgICAgICAgICAuYXBwZW5kKCdwYXR0ZXJuJykuYXR0cignY2xhc3MnLCAnbm9kZScpXHJcbiAgICAgICAgICAgIC5lYWNoKChub2RlRGF0YSwgaSwgZW50ZXJOb2RlcykgPT4ge1xyXG4gICAgICAgICAgICAgIC8vIGFkZGluZyBwYXR0ZXJuXHJcbiAgICAgICAgICAgICAgY29uc3QgcGF0dGVybiA9IGQzLnNlbGVjdChlbnRlck5vZGVzW2ldKTtcclxuICAgICAgICAgICAgICBzZXRQYXR0ZXJuKHBhdHRlcm4sIG5vZGVEYXRhLmRhdGEsIG1lLm5vZGVQYXJzZXIpO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICB1cGRhdGUgPT4gdXBkYXRlLFxyXG4gICAgICAgIGV4aXQgPT4gZXhpdFxyXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgLmR1cmF0aW9uKG1lLm5vZGVQYXJzZXIudHJhbnNpdGlvbkR1cmF0aW9uKVxyXG4gICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKVxyXG4gICAgICAgICAgLnJlbW92ZSgpXHJcbiAgICAgIClcclxuXHJcbiAgICAvLyByZW5kZXJpbmcgbm9kZXNcclxuICAgIGNvbnN0IG5vZGVTdGFydFBvc2l0aW9uID0gKGQ6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPikgPT4ge1xyXG4gICAgICBpZiAobm9kZVJlZikge1xyXG4gICAgICAgIHJldHVybiBgdHJhbnNsYXRlKCR7bm9kZVJlZi54IC0gKG1lLm5vZGVQYXJzZXIud2lkdGggLyAyKX0sJHtub2RlUmVmLnl9KWBcclxuICAgICAgfVxyXG4gICAgICBpZiAoIWQucGFyZW50KSByZXR1cm4gYHRyYW5zbGF0ZSgke2QueCAtIChtZS5ub2RlUGFyc2VyLndpZHRoIC8gMil9LCR7ZC55fSlgO1xyXG4gICAgICByZXR1cm4gYHRyYW5zbGF0ZSgke2QucGFyZW50LnggLSAobWUubm9kZVBhcnNlci53aWR0aCAvIDIpfSwke2QucGFyZW50Lnl9KWBcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBub2RlUG9zaXRpb24gPSAocGFyYW1zOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0pID0+XHJcbiAgICAgIGB0cmFuc2xhdGUoJHtwYXJhbXMueCAtIChtZS5ub2RlUGFyc2VyLndpZHRoIC8gMil9LCR7cGFyYW1zLnl9KWA7XHJcblxyXG4gICAgY29uc3QgZXhwYW5kSWNvblZpc2libGUgPVxyXG4gICAgICAoZDogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+ICYgeyBfY2hpbGRyZW4/OiBhbnkgfSkgPT4gKGQuY2hpbGRyZW4gfHwgZC5fY2hpbGRyZW4pID8gJ3Zpc2libGUnIDogJ2hpZGRlbic7XHJcbiAgICBjb25zdCBleHBhbmRJY29uID1cclxuICAgICAgKGQ6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPiAmIHsgX2NoaWxkcmVuPzogYW55IH0pID0+IGV4cGFuZEljb25WaXNpYmxlKGQpID09ICd2aXNpYmxlJyA/IChkLmRhdGEuZXhwYW5kZWQgPyBgdXJsKCNpbWctY29sbGFwc2UtaWNvbilgIDogYHVybCgjaW1nLWV4cGFuZC1pY29uKWApIDogJyc7XHJcblxyXG5cclxuICAgIG1lLmNoYXJ0LnNlbGVjdEFsbCgnZy5ub2RlJylcclxuICAgICAgLmRhdGEobm9kZXMsIChkOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4pID0+IGQuZGF0YS5ub2RlSWQpXHJcbiAgICAgIC5qb2luKFxyXG4gICAgICAgIGVudGVyID0+XHJcbiAgICAgICAgICBlbnRlci5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdub2RlJylcclxuICAgICAgICAgICAgLmF0dHIoJ2N1cnNvcicsICdwb2ludGVyJylcclxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIG5vZGVTdGFydFBvc2l0aW9uKVxyXG4gICAgICAgICAgICAuY2FsbChkcmF3Tm9kZXMpXHJcbiAgICAgICAgICAgIC5jYWxsKGRyYXdDb2xsYXBzZXIpXHJcbiAgICAgICAgICAgIC5vbignZGJsY2xpY2snLCAobm9kZSkgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lclJlY3QgPSBtZS5jb250YWluZXIubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICAgIG1lLnRyYXNsYXRlVG8oKGNvbnRhaW5lclJlY3Qud2lkdGggLyAyKSAtIG5vZGUueCwgKChjb250YWluZXJSZWN0LmhlaWdodCAtIG1lLm5vZGVQYXJzZXIuaGVpZ2h0KSAvIDIpIC0gbm9kZS55KVxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICB1cGRhdGUgPT4gdXBkYXRlLFxyXG4gICAgICAgIGV4aXQgPT5cclxuICAgICAgICAgIGV4aXRcclxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAuZHVyYXRpb24obWUubm9kZVBhcnNlci50cmFuc2l0aW9uRHVyYXRpb24pXHJcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBub2RlUG9zaXRpb24ocHJOb2RlKSlcclxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKVxyXG4gICAgICAgICAgICAucmVtb3ZlKClcclxuICAgICAgKVxyXG4gICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG1lLm5vZGVQYXJzZXIudHJhbnNpdGlvbkR1cmF0aW9uKVxyXG4gICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDEpXHJcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBub2RlUG9zaXRpb24pXHJcbiAgICAgIC5zZWxlY3RBbGwoJ2NpcmNsZS5jb2xsYXBzZXInKVxyXG4gICAgICAuYXR0cigndmlzaWJpbGl0eScsIGV4cGFuZEljb25WaXNpYmxlKVxyXG4gICAgICAuYXR0cignZmlsbCcsIGV4cGFuZEljb24pXHJcblxyXG4gICAgLy8gcmVuZGVyaW5nIGxpbmtzXHJcbiAgICBjb25zdCBwYXRoU3RhcnRpbmdEaWFnb25hbCA9IChkOiB7IHg6IG51bWJlciwgeTogbnVtYmVyLCBwYXJlbnQ6IElSb290Tm9kZTxJRDNOb2RlPiB9KSA9PiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmxpbmtQYXRoKGQsIGQpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcGF0aERpYWdvbmFsID0gKGQ6IElSb290Tm9kZTxJRDNOb2RlPikgPT4ge1xyXG4gICAgICBjb25zdCB0YXJnZXQgPSB7IHg6IGQucGFyZW50LngsIHk6IGQucGFyZW50LnkgKyBtZS5ub2RlUGFyc2VyLmhlaWdodCB9O1xyXG4gICAgICByZXR1cm4gdGhpcy5saW5rUGF0aChkLCBkLnBhcmVudClcclxuICAgIH1cclxuXHJcbiAgICBtZS5jaGFydC5zZWxlY3RBbGwoJ3BhdGgubGluaycpXHJcbiAgICAgIC5kYXRhKG5vZGVzLnNsaWNlKDEpLCAoZDogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+KSA9PiBkLmRhdGEubm9kZUlkKVxyXG4gICAgICAuam9pbihcclxuICAgICAgICBlbnRlciA9PlxyXG4gICAgICAgICAgZW50ZXJcclxuICAgICAgICAgICAgLmluc2VydCgncGF0aCcsICdnJylcclxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xpbmsnKVxyXG4gICAgICAgICAgICAuYXR0cignZmlsbCcsICdub25lJylcclxuICAgICAgICAgICAgLmF0dHIoJ3N0cm9rZScsICdibHVlJylcclxuICAgICAgICAgICAgLmF0dHIoJ3N0cm9rZS13aWR0aCcsIDIpXHJcbiAgICAgICAgICAgIC5hdHRyKCdkJywgcGF0aFN0YXJ0aW5nRGlhZ29uYWwobm9kZVJlZikpLFxyXG4gICAgICAgIHVwZGF0ZSA9PiB1cGRhdGUsXHJcbiAgICAgICAgZXhpdCA9PlxyXG4gICAgICAgICAgZXhpdFxyXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG1lLm5vZGVQYXJzZXIudHJhbnNpdGlvbkR1cmF0aW9uKVxyXG4gICAgICAgICAgICAuYXR0cignZCcsIHBhdGhTdGFydGluZ0RpYWdvbmFsKHByTm9kZSkpXHJcbiAgICAgICAgICAgIC5yZW1vdmUoKVxyXG4gICAgICApXHJcbiAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24obWUubm9kZVBhcnNlci50cmFuc2l0aW9uRHVyYXRpb24pXHJcbiAgICAgIC5hdHRyKCdkJywgcGF0aERpYWdvbmFsKTtcclxuICB9XHJcblxyXG4gIC8vIFpvb20gaGFuZGxlciBmdW5jdGlvblxyXG4gIHpvb21lZCgpIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuICAgIC8vIFNhdmluZyBkMyBldmVudCdzIHRyYW5zZm9ybSBvYmplY3RcclxuICAgIG1lLmxhc3RUcmFuc2Zvcm0gPSBkMy5ldmVudC50cmFuc2Zvcm07XHJcbiAgICAvLyBSZXBvc2l0aW9uIGFuZCByZXNjYWxlIGNoYXJ0IGFjY29yZGluZ2x5XHJcbiAgICBtZS5jaGFydC5hdHRyKCd0cmFuc2Zvcm0nLCBkMy5ldmVudC50cmFuc2Zvcm0pO1xyXG4gIH1cclxuXHJcbiAgLy8jcmVnaW9uIEV2ZW50c1xyXG4gIC8vIG5vZGUgY2xpY2tcclxuICBvbk5vZGVDbGljazogU3ViamVjdDx7IGlkOiBzdHJpbmcsIG5vZGU6IElEM05vZGUgfT4gPSBuZXcgU3ViamVjdCgpO1xyXG4gIHByb3RlY3RlZCBfb25Ob2RlQ2xpY2sobm9kZUlkOiBzdHJpbmcsIG5vZGU6IElEM05vZGUpIHtcclxuICAgIHRoaXMub25Ob2RlQ2xpY2submV4dCh7IGlkOiBub2RlSWQsIG5vZGU6IG5vZGUgfSk7XHJcbiAgfVxyXG4gIC8vI2VuZHJlZ2lvblxyXG5cclxuICAvLyBHZW5lcmF0ZSBjdXN0b20gZGlhZ29uYWwgLSBwbGF5IHdpdGggaXQgaGVyZSAtIGh0dHBzOi8vb2JzZXJ2YWJsZWhxLmNvbS9AYnVtYmVpc2h2aWxpL2N1cnZlZC1lZGdlcz9jb2xsZWN0aW9uPUBidW1iZWlzaHZpbGkvd29yay1jb21wb25lbnRzXHJcbiAgbGlua1BhdGgoc291cmNlOiB7IHg6IG51bWJlciwgeTogbnVtYmVyLCBwYXJlbnQ6IElSb290Tm9kZTxJRDNOb2RlPiB9LCB0YXJnZXQ6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIsIHBhcmVudDogSVJvb3ROb2RlPElEM05vZGU+IH0pIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuXHJcbiAgICAvLyBDYWxjdWxhdGUgc29tZSB2YXJpYWJsZXMgYmFzZWQgb24gc291cmNlIGFuZCB0YXJnZXQgKHMsdCkgY29vcmRpbmF0ZXNcclxuICAgIGxldCB4ID0gc291cmNlLng7XHJcbiAgICBsZXQgeSA9IHNvdXJjZS55O1xyXG4gICAgY29uc3QgZXggPSB0YXJnZXQueDtcclxuICAgIGNvbnN0IGV5ID0gdGFyZ2V0LnkgKyBtZS5ub2RlUGFyc2VyLmhlaWdodDtcclxuXHJcbiAgICBjb25zdCBsaW5rSGVpZ2h0ID0gMjU7XHJcbiAgICBjb25zdCBjdXJ2ZVJhZGl1cyA9IE1hdGguYWJzKHggLSBleCkgIT0gMCA/IDE1IDogMDtcclxuXHJcbiAgICBsZXQgeHJ2cyA9IGV4IC0geCA8IDAgPyAtMSA6IDE7XHJcbiAgICBsZXQgeXJ2cyA9IGV5IC0geSA8IDAgPyAtMSA6IDE7XHJcbiAgICBsZXQgdyA9IE1hdGguYWJzKGV4IC0geCkgLSAoY3VydmVSYWRpdXMgKiAyKTtcclxuXHJcbiAgICBjb25zdCBwYXRoID0gYFxyXG4gICAgICBNICR7eH0gJHt5fVxyXG4gICAgICBMICR7eH0gJHt5ICsgKGxpbmtIZWlnaHQgKiB5cnZzKX1cclxuICAgICAgQyAke3h9ICR7eSArICgobGlua0hlaWdodCArIGN1cnZlUmFkaXVzKSAqIHlydnMpfSAke3h9ICR7eSArICgobGlua0hlaWdodCArIGN1cnZlUmFkaXVzKSAqIHlydnMpfSAke3ggKyAoY3VydmVSYWRpdXMgKiB4cnZzKX0gJHt5ICsgKChsaW5rSGVpZ2h0ICsgY3VydmVSYWRpdXMpICogeXJ2cyl9XHJcbiAgICAgIEwgJHt4ICsgKCh3ICsgY3VydmVSYWRpdXMpICogeHJ2cyl9ICR7eSArICgobGlua0hlaWdodCArIGN1cnZlUmFkaXVzKSAqIHlydnMpfVxyXG4gICAgICBDICR7ZXh9ICAke3kgKyAoKGxpbmtIZWlnaHQgKyBjdXJ2ZVJhZGl1cykgKiB5cnZzKX0gJHtleH0gICR7eSArICgobGlua0hlaWdodCArIGN1cnZlUmFkaXVzKSAqIHlydnMpfSAke2V4fSAke3kgKyAoKGxpbmtIZWlnaHQgKyBjdXJ2ZVJhZGl1cykgKiB5cnZzKSArIChjdXJ2ZVJhZGl1cyAqIHlydnMpfVxyXG4gICAgICBMICR7ZXh9ICR7ZXl9XHJcbiAgICBgO1xyXG4gICAgcmV0dXJuIHBhdGg7XHJcbiAgfVxyXG5cclxuICBjaGVja0V4cGFuZGVkKG5vZGU6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPiAmIHsgX2NoaWxkcmVuPzogYW55IH0pIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuXHJcbiAgICAvLyBjaGVja2luZyBleHBhbmRlZFxyXG4gICAgaWYgKG5vZGUuZGF0YS5leHBhbmRlZCkge1xyXG4gICAgICBpZiAoIW5vZGUuY2hpbGRyZW4gJiYgbm9kZS5fY2hpbGRyZW4pIHtcclxuICAgICAgICBub2RlLmNoaWxkcmVuID0gbm9kZS5fY2hpbGRyZW47XHJcbiAgICAgICAgbm9kZS5fY2hpbGRyZW4gPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgeyAvLyBjb2xsYXBzZWRcclxuICAgICAgaWYgKG5vZGUuY2hpbGRyZW4pIHtcclxuICAgICAgICBub2RlLl9jaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XHJcbiAgICAgICAgbm9kZS5jaGlsZHJlbiA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIGNoZWNraW5nIGNoaWxkcmVuXHJcbiAgICAobm9kZS5jaGlsZHJlbiB8fCBub2RlLl9jaGlsZHJlbiB8fCBbXSkuZm9yRWFjaChjdXJyZW50ID0+IG1lLmNoZWNrRXhwYW5kZWQoY3VycmVudCkpXHJcbiAgfVxyXG5cclxuICBleHBhbmQobm9kZTogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+ICYgeyBfY2hpbGRyZW4/OiBhbnkgfSwgdG9nZ2xlOiBib29sZWFuID0gZmFsc2UpIHsgLy8sICByZW5kZXI6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgY29uc3QgbWUgPSB0aGlzO1xyXG5cclxuICAgIGNvbnN0IG5vZGVSZWYgPSBPYmplY3QuYXNzaWduKG5vZGUpO1xyXG5cclxuICAgIC8vIGlmIHRvZ2dsZSAtIGxldHMgdG9nZ2xlXHJcbiAgICBpZiAodG9nZ2xlKSBub2RlLmRhdGEuZXhwYW5kZWQgPSAhbm9kZS5kYXRhLmV4cGFuZGVkO1xyXG5cclxuICAgIC8vIGNoZWNraW5nIGV4cGFuZGVkXHJcbiAgICBpZiAobm9kZS5kYXRhLmV4cGFuZGVkKSB7XHJcbiAgICAgIGlmICghbm9kZS5jaGlsZHJlbiAmJiBub2RlLl9jaGlsZHJlbikge1xyXG4gICAgICAgIG5vZGUuY2hpbGRyZW4gPSBub2RlLl9jaGlsZHJlbjtcclxuICAgICAgICBub2RlLl9jaGlsZHJlbiA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7IC8vIGNvbGxhcHNlZFxyXG4gICAgICBpZiAobm9kZS5jaGlsZHJlbikge1xyXG4gICAgICAgIG5vZGUuX2NoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcclxuICAgICAgICBub2RlLmNoaWxkcmVuID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGV4cGFuZChub2RlLmNoaWxkcmVuLCBub2RlLmRhdGEuZXhwYW5kZWQpO1xyXG4gICAgLy8gY29uc29sZS5sb2coJ0JlZm9yZSBleHBhbmQ6ICcsIG5vZGVSZWYueCwgIG5vZGUueClcclxuICAgIGlmICh0b2dnbGUpIG1lLnNob3dOb2Rlcyhub2RlKTtcclxuICB9XHJcblxyXG4gIHRyYXNsYXRlVG8ocHJYLCBwclkpIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuICAgIG1lLnN2Z1xyXG4gICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKG1lLm5vZGVQYXJzZXIudHJhbnNpdGlvbkR1cmF0aW9uKVxyXG4gICAgICAuY2FsbChcclxuICAgICAgICBtZS56b29tRnVuYy50cmFuc2Zvcm0sXHJcbiAgICAgICAgZDMuem9vbUlkZW50aXR5LnRyYW5zbGF0ZShwclgsIHByWSlcclxuICAgICAgKTtcclxuICB9XHJcblxyXG4gIGZpdCgpIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuICAgIC8vIGNvbnN0IHpvb20gPSBkMy56b29tKCkub24oXCJ6b29tXCIsIGQgPT4gdGhpcy56b29tZWQoKSlcclxuXHJcbiAgICBjb25zdCBmaXQgPSBjYWxjR0ZpdChtZS5jaGFydCwgbWUuc3ZnLCBtZS5yb290LCBtZS5ub2RlUGFyc2VyKVxyXG4gICAgbWUuc3ZnLnRyYW5zaXRpb24oKS5kdXJhdGlvbihtZS5ub2RlUGFyc2VyLnRyYW5zaXRpb25EdXJhdGlvbikuY2FsbChcclxuICAgICAgbWUuem9vbUZ1bmMudHJhbnNmb3JtLFxyXG4gICAgICBkMy56b29tSWRlbnRpdHkudHJhbnNsYXRlKGZpdC54LCBmaXQueSkuc2NhbGUoZml0LnNjYWxlKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHNldE9wdGlvbnMocHJPcHRpb25zOiBQYXJ0aWFsPElEM09yZ0NoYXJ0T3B0aW9ucz4pIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuICAgIG1lLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKG1lLm9wdGlvbnMsIHByT3B0aW9ucyk7XHJcbiAgfVxyXG59XHJcblxyXG4iXX0=