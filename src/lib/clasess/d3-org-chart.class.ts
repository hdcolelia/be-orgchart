//#region 
// Desarrollado en base a: 
//  https://bl.ocks.org/bumbeishvili/09a03b81ae788d2d14f750afe59eb7de
//  https://github.com/bumbeishvili/d3-organization-chart
//#endregion
import * as d3 from 'd3';
import { ID3Node } from '../interfaces';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { D3NodeBasicParser } from './@items';

export interface ID3OrgChartOptions {
  nodeParser?: D3NodeBasicParser;
  data?: ID3Node[];
  backgroundColor?: string;
  defaultFont?: string;
}

export interface ISize {
  width: number;
  height: number;
}

export class D3OrgChart {
  //#region Default Options
  protected options: ID3OrgChartOptions = {
    backgroundColor: '#03A3C5',
    nodeParser: new D3NodeBasicParser(),
    data: [],
    defaultFont: 'Tahoma'
  }
  //#endregion

  //#region SVG compoennts
  protected container: d3.Selection<HTMLElement, any, any, any>;
  protected svg: d3.Selection<d3.BaseType, unknown, HTMLElement, unknown>;
  protected chart: d3.Selection<any, any, any, any>;
  protected centerG: d3.Selection<any, any, any, any>;
  protected defs: d3.Selection<any, any, any, any>;

  protected lastTransform: any;
  //#endregion

  //#region DATA
  protected root: d3.HierarchyPointNode<ID3Node>;
  protected allNodes: any;

  protected _data: ID3Node[] = [];
  get data(): ID3Node[] {
    return this._data || [];
  }

  set data(data: ID3Node[]) {
    this._data = data;
    // this.render()
  }
  //#endregion

  //#region  NODE PARSER
  protected _nodeParser: D3NodeBasicParser;
  get nodeParser(): D3NodeBasicParser {
    return this._nodeParser;
  }
  set nodeParser(parser: D3NodeBasicParser) {
    this._nodeParser = parser;
    // this.render();
  }
  //#endregion

  currentZoom: number = 1;
  treemap: d3.TreeLayout<ID3Node>;

  constructor(prContainer: HTMLElement, prOptions?: ID3OrgChartOptions) {
    const me = this;

    // init container
    me.container = d3.select(prContainer);

    //If Data argument passed - then set it
    if (prOptions?.data) me._data = prOptions.data;

    // setting parser
    me._nodeParser = prOptions?.nodeParser || me.options.nodeParser;

    // applying options
    me.options = Object.assign(me.options, prOptions);

    // monitor resize
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(300)
      ).subscribe(
        () => {
          // HDC - VER this.prepareCanvas();
          this.render();
        }
      )
  }

  render() {
    const me = this;
    // preparing svg
    me.prepareCanvas();

    // if no data then return
    if (!me.data.length) return;

    // preparing data
    me.prepareData();

    // showing nodes
    me.showNodes();
    return this;
  }

  // preparing canvas
  protected prepareCanvas() {
    const me = this;

    //Drawing containers
    const containerRect = me.container.node().getBoundingClientRect();
    me.svg = me.container.selectAll('svg')
      .data([{ id: 'svg' }], (d: { id: string }) => d.id)
      .join(
        enter => enter
          .append('svg')
          .attr('class', 'svg-chart-container')
          .attr('font-family', me.options.defaultFont)
          .call(d3.zoom().on("zoom", d => this.zoomed()))
          .attr('cursor', 'move')
          .style('background-color', me.options.backgroundColor),
        update =>
          update
            .attr('width', containerRect.width)
            .attr('height', containerRect.height)
      );
    //Add container g element
    me.chart = me.svg.selectAll('g.chart')
      .data([{ id: 'chart' }], (d: { id: string }) => d.id)
      .join(
        enter => enter
          .append('g')
          .attr('class', 'chart')
          .attr('transform', `translate(0,0)`),
        update => update
      )

    // Add one more container g element, for better positioning controls
    me.centerG = me.chart.selectAll('g.center-group')
      .data([{ id: 'center-group' }], (d: { id: string }) => d.id)
      .join(
        enter => enter.append('g')
          .attr('class', 'center-group'),
        update =>
          update
            .attr('transform', `translate(${containerRect.width / 2},${this.nodeParser.height}) scale(${this.currentZoom})`)
      )

    // defs
    me.defs = me.svg.selectAll('defs.globalDefs')
      .data([{ id: 'defs' }], (d: { id: string }) => d.id)
      .join(
        enter => {
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
          return defs
        },
        update => update
      )
  }

  // preparing data
  protected prepareData() {
    const me = this;

    // if no data return 
    if (!me.data.length) return;

    // Convert flat data to hierarchical
    if (!me.root) {
      try { // preventing multiple root
        me.root = d3.stratify<ID3Node>().id(({ nodeId }) => nodeId).parentId(({ parentNodeId }) => parentNodeId)
        (me.data) as d3.HierarchyPointNode<ID3Node>;
      } catch( err ) {
        me.root = d3.stratify<ID3Node>().id(({ nodeId }) => nodeId).parentId(({ parentNodeId }) => parentNodeId)
        ([{ 
          nodeId: 'root', 
          parentNodeId: '', 
          title: 'Error', 
          description: err.message || err,
          nodeImage: {
            base64: me.nodeParser.errorBase64Icon
          }  
        }]) as d3.HierarchyPointNode<ID3Node>;
      }
    }

    // preparing treemap
    const containerRect = me.container.node().getBoundingClientRect();
    me.treemap = d3.tree<ID3Node>().size([containerRect.width || 250, containerRect.height])
      .nodeSize([this.nodeParser.width + this.nodeParser.width / 2, this.nodeParser.height + this.nodeParser.height / 1.2]);

    me.allNodes = me.treemap(me.root).descendants();
    me.checkExpanded(me.root);
  }

  // showing nodes
  protected showNodes(prNode: d3.HierarchyPointNode<ID3Node> = null) {
    const me = this;

    if (!prNode) prNode = me.root;
    const updatePosition: { x: number, y: number } = {
      x: prNode.x,
      y: prNode.y
    }

    //  Assigns the x and y position for the nodes
    const treeData = me.treemap(me.root);
    // it is necesary for scope 
    const drawNodes = (container) => me.nodeParser.drawNodes(container);
    const drawCollapser = (nodeGroup: d3.Selection<SVGGElement, d3.HierarchyPointNode<ID3Node>, any, any>) => {
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

    const nodeStartPosition = (d: d3.HierarchyPointNode<ID3Node>) => {
      if (prNode) {
        return `translate(${updatePosition.x - (me.nodeParser.width / 2)},${updatePosition.y})`
      }
      if (!d.parent) return `translate(${d.x - (me.nodeParser.width / 2)},${d.y})`;
      return `translate(${d.parent.x - (me.nodeParser.width / 2)},${d.parent.y})`
    }

    const nodePosition = (params: { x: number, y: number }) =>
      `translate(${params.x - (me.nodeParser.width / 2)},${params.y})`;

    const expandIconVisible =
      (d: d3.HierarchyPointNode<ID3Node> & { _children?: any }) => (d.children || d._children) ? 'visible' : 'hidden';
    const expandIcon =
      (d: d3.HierarchyPointNode<ID3Node> & { _children?: any }) => expandIconVisible(d) == 'visible' ? (d.data.expanded ? `url(#img-collapse)` : `url(#img-expand)`) : '';


    me.centerG.selectAll('g.node')
      .data(nodes, (d: d3.HierarchyPointNode<ID3Node>) => d.data.nodeId)
      .join(
        enter =>
          enter.append('g')
            .style("opacity", 0)
            .attr('class', 'node')
            .attr('cursor', 'pointer')
            .attr('transform', nodeStartPosition)
            .call(drawNodes)
            .call(drawCollapser)
            .on('click', (node) => {
              me.onNodeClick.next({ id: node.data.nodeId, node: node.data });
            }),
        update => update,
        exit =>
          exit
            .transition()
            .duration(me.nodeParser.transitionDuration)
            .attr('transform', nodePosition(prNode))
            .style("opacity", 0)
            .remove()
      )
      .transition().duration(me.nodeParser.transitionDuration)
      .style("opacity", 1)
      .attr('transform', nodePosition)
      .selectAll('circle.collapser')
      .attr('visibility', expandIconVisible)
      .attr('fill', expandIcon)

    // rendering links
    const pathStartingDiagonal = (params: { x: number, y: number }) => {
      const target = { x: params.x, y: params.y + me.nodeParser.height };
      return this.linkPath(target, target)
    }

    const pathDiagonal = (d: d3.HierarchyPointNode<ID3Node>) => {
      const target = { x: d.parent.x, y: d.parent.y + me.nodeParser.height };
      return this.linkPath(d, target)
    }

    me.centerG.selectAll('path.link')
      .data(nodes.slice(1), (d: d3.HierarchyPointNode<ID3Node>) => d.data.nodeId)
      .join(
        enter =>
          enter
            .insert('path', 'g')
            .attr('class', 'link')
            .attr('fill', 'none')
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('d', pathStartingDiagonal({ x: updatePosition.x, y: updatePosition.y })),
        update => update,
        exit =>
          exit
            .transition().duration(me.nodeParser.transitionDuration)
            .attr('d', pathStartingDiagonal(prNode))
            .remove()
      )
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
  //#region Events
  // node click
  onNodeClick: Subject<{ id: string, node: ID3Node }> = new Subject();
  protected _onNodeClick(nodeId: string, node: ID3Node) {
    this.onNodeClick.next({ id: nodeId, node: node });
  }
  //#endregion

  //drawNode(prNode: d3.HierarchyPointNode<ID3Node>) {
  //  const me = this;
  //  me.nodeParser.draw(me.centerG, prNode);
  //}


  // Generate custom diagonal - play with it here - https://observablehq.com/@bumbeishvili/curved-edges?collection=@bumbeishvili/work-components
  linkPath(source: { x: number, y: number }, target: { x: number, y: number }) {

    // Calculate some variables based on source and target (s,t) coordinates
    const x = source.x;
    const y = source.y;
    const ex = target.x;
    const ey = target.y
      ;
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
          `
    // Return result
    return path;
  }

  checkExpanded(node: d3.HierarchyPointNode<ID3Node> & { _children?: any }) {
    const me = this;

    // checking expanded
    if (node.data.expanded) {
      if (!node.children && node._children) {
        node.children = node._children;
        node._children = null;
      }
    } else { // collapsed
      if (node.children) {
        node._children = node.children;
        node.children = null;
      }
    }
    // checking children
    (node.children || node._children || []).forEach(current => me.checkExpanded(current))
  }



  expand(node: d3.HierarchyPointNode<ID3Node> & { _children?: any }, toggle: boolean = false) { //,  render: boolean = false) {
    const me = this;

    // if toggle - lets toggle
    if (toggle) node.data.expanded = !node.data.expanded;

    // checking expanded
    if (node.data.expanded) {
      if (!node.children && node._children) {
        node.children = node._children;
        node._children = null;
      }
    } else { // collapsed
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
    if (toggle) me.showNodes(node);
  }

}

