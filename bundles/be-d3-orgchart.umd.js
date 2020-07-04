(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('d3'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('be-d3-orgchart', ['exports', '@angular/core', 'd3', 'rxjs', 'rxjs/operators'], factory) :
    (global = global || self, factory(global['be-d3-orgchart'] = {}, global.ng.core, global.d3, global.rxjs, global.rxjs.operators));
}(this, (function (exports, core, d3, rxjs, operators) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }

    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

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
            this.onNodeClick = new rxjs.Subject();
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
            rxjs.fromEvent(window, 'resize')
                .pipe(operators.debounceTime(300)).subscribe(function () {
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
            me.root = d3.stratify()
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
            me.treemap = d3.tree().size([containerRect.width || 250, containerRect.height])
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
        core["ɵɵnamespaceSVG"]();
        core["ɵɵelementStart"](0, "svg", 4);
        core["ɵɵelement"](1, "path", 5);
        core["ɵɵelement"](2, "path", 6);
        core["ɵɵelement"](3, "path", 7);
        core["ɵɵelement"](4, "path", 8);
        core["ɵɵelementStart"](5, "g", 9);
        core["ɵɵelement"](6, "circle", 10);
        core["ɵɵelement"](7, "circle", 11);
        core["ɵɵelement"](8, "circle", 12);
        core["ɵɵelementEnd"]();
        core["ɵɵelementStart"](9, "g", 13);
        core["ɵɵelementStart"](10, "text", 14);
        core["ɵɵtext"](11, "A");
        core["ɵɵelementEnd"]();
        core["ɵɵelementStart"](12, "text", 15);
        core["ɵɵtext"](13, "B");
        core["ɵɵelementEnd"]();
        core["ɵɵelementStart"](14, "text", 16);
        core["ɵɵtext"](15, "C");
        core["ɵɵelementEnd"]();
        core["ɵɵelementEnd"]();
        core["ɵɵelementEnd"]();
    } }
    function BED3OrgchartComponent_ng_template_4_Template(rf, ctx) { if (rf & 1) {
        core["ɵɵelementStart"](0, "div");
        core["ɵɵelementStart"](1, "p");
        core["ɵɵtext"](2, "$$title");
        core["ɵɵelementEnd"]();
        core["ɵɵelementStart"](3, "p");
        core["ɵɵtext"](4, "$$id");
        core["ɵɵelementEnd"]();
        core["ɵɵelementEnd"]();
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
        BED3OrgchartComponent.ɵfac = function BED3OrgchartComponent_Factory(t) { return new (t || BED3OrgchartComponent)(core["ɵɵdirectiveInject"](core.ElementRef)); };
        BED3OrgchartComponent.ɵcmp = core["ɵɵdefineComponent"]({ type: BED3OrgchartComponent, selectors: [["be-d3-orgchart"]], inputs: { nodes: "nodes", nodeParser: "nodeParser" }, features: [core["ɵɵNgOnChangesFeature"]], decls: 6, vars: 0, consts: [[1, "container"], ["orgchart", ""], ["defaultTemplate", ""], ["nodeTemplate", ""], ["height", "400", "width", "450"], ["id", "lineAB", "d", "M 100 350 l 150 -300", "stroke", "red", "stroke-width", "3", "fill", "none"], ["id", "lineBC", "d", "M 250 50 l 150 300", "stroke", "red", "stroke-width", "3", "fill", "none"], ["d", "M 175 200 l 150 0", "stroke", "green", "stroke-width", "3", "fill", "none"], ["d", "M 100 350 q 150 -300 300 0", "stroke", "blue", "stroke-width", "5", "fill", "none"], ["stroke", "black", "stroke-width", "3", "fill", "black"], ["id", "pointA", "cx", "100", "cy", "350", "r", "3"], ["id", "pointB", "cx", "250", "cy", "50", "r", "3"], ["id", "pointC", "cx", "400", "cy", "350", "r", "3"], ["font-size", "30", "font-family", "sans-serif", "fill", "black", "stroke", "none", "text-anchor", "middle"], ["x", "100", "y", "350", "dx", "-30"], ["x", "250", "y", "50", "dy", "-10"], ["x", "400", "y", "350", "dx", "30"]], template: function BED3OrgchartComponent_Template(rf, ctx) { if (rf & 1) {
                core["ɵɵelement"](0, "div", 0, 1);
                core["ɵɵtemplate"](2, BED3OrgchartComponent_ng_template_2_Template, 16, 0, "ng-template", null, 2, core["ɵɵtemplateRefExtractor"]);
                core["ɵɵtemplate"](4, BED3OrgchartComponent_ng_template_4_Template, 5, 0, "ng-template", null, 3, core["ɵɵtemplateRefExtractor"]);
            } }, styles: ["[_nghost-%COMP%]{display:flex;flex-direction:column;overflow:hidden}image.rounded[_ngcontent-%COMP%]{border-radius:50%;border-color:#00f;border-width:2px}"] });
        return BED3OrgchartComponent;
    }());
    /*@__PURE__*/ (function () { core["ɵsetClassMetadata"](BED3OrgchartComponent, [{
            type: core.Component,
            args: [{
                    selector: 'be-d3-orgchart',
                    templateUrl: './be-d3-orgchart.component.html',
                    styleUrls: ['./be-d3-orgchart.component.scss']
                }]
        }], function () { return [{ type: core.ElementRef }]; }, { nodes: [{
                type: core.Input
            }], nodeParser: [{
                type: core.Input
            }] }); })();

    var BED3OrgchartModule = /** @class */ (function () {
        function BED3OrgchartModule() {
        }
        BED3OrgchartModule.ɵmod = core["ɵɵdefineNgModule"]({ type: BED3OrgchartModule });
        BED3OrgchartModule.ɵinj = core["ɵɵdefineInjector"]({ factory: function BED3OrgchartModule_Factory(t) { return new (t || BED3OrgchartModule)(); }, imports: [[]] });
        return BED3OrgchartModule;
    }());
    (function () { (typeof ngJitMode === "undefined" || ngJitMode) && core["ɵɵsetNgModuleScope"](BED3OrgchartModule, { declarations: [BED3OrgchartComponent], exports: [BED3OrgchartComponent] }); })();
    /*@__PURE__*/ (function () { core["ɵsetClassMetadata"](BED3OrgchartModule, [{
            type: core.NgModule,
            args: [{
                    declarations: [BED3OrgchartComponent],
                    imports: [],
                    exports: [BED3OrgchartComponent]
                }]
        }], null, null); })();

    exports.BED3OrgchartComponent = BED3OrgchartComponent;
    exports.BED3OrgchartModule = BED3OrgchartModule;
    exports.NodeItemParser = NodeItemParser;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=be-d3-orgchart.umd.js.map
