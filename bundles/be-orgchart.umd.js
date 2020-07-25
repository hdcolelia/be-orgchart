(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3'), require('rxjs'), require('rxjs/operators'), require('@fortawesome/free-solid-svg-icons'), require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('be-orgchart', ['exports', 'd3', 'rxjs', 'rxjs/operators', '@fortawesome/free-solid-svg-icons', '@angular/core'], factory) :
    (global = global || self, factory(global['be-orgchart'] = {}, global.d3, global.rxjs, global.rxjs.operators, global.fa, global.ng.core));
}(this, (function (exports, d3, rxjs, operators, fa, core) { 'use strict';

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

    var errorBase64Data = "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";

    // getting base64 icons
    var D3NodeBasicParser = /** @class */ (function () {
        function D3NodeBasicParser() {
            // dimensions
            this.width = 240;
            this.height = 100;
            this.defaultImage = {
                type: 'link',
                data: "https://raw.githubusercontent.com/hdcolelia/be-orgchart/master/src/lib/assets/images/root.png"
            };
            // error icon
            this.errorBase64Icon = errorBase64Data;
            this.imageDefs = {
                x: -20, y: -15, h: 60, w: 60, rx: 60
            };
            this.transitionDuration = 600;
        }
        D3NodeBasicParser.prototype.addImage = function () {
        };
        D3NodeBasicParser.prototype.drawNodes = function (prGroup, prClickEvent) {
            var me = this;
            // adding rect
            prGroup.append('rect').attr('class', 'node-rect')
                .attr('width', me.width).attr('height', me.height)
                .attr('stroke', 'blue').attr('stroke-width', 1)
                .attr('fill', '#02B2AC').attr('rx', 12)
                .on('click', function (node) {
                prClickEvent.next({ id: node.data.nodeId, node: node.data });
            });
            // adding title
            prGroup.append('text').append('tspan').text(function (d) { return d.data.title; })
                .attr('font-size', 15).attr('x', 50).attr('y', 25);
            // adding description
            prGroup.append('text').append('tspan').text(function (d) { return d.data.description; })
                .attr('font-size', 10).attr('x', 50).attr('y', 45);
            // adding description
            prGroup.append('text').text(function (d) { return d.data.nodeId; })
                .attr('font-size', 10).attr('x', 50).attr('y', 65);
            // adding image
            var imageUrl = function (d) {
                if (d.data.nodeImage)
                    return "url(#img-" + d.data.nodeId + ")";
                if (me.defaultImage)
                    return "url(#img-default-node-img)";
                return '';
            };
            prGroup.filter(function (d) { return imageUrl(d) != ''; })
                .append('rect').attr('class', 'node-image')
                .attr('x', me.imageDefs.x).attr('y', me.imageDefs.y)
                .attr('width', me.imageDefs.w).attr('height', me.imageDefs.h)
                .attr('fill', function (d) { return imageUrl(d); }).attr('rx', me.imageDefs.rx)
                .on('click', function (node) {
                prClickEvent.next({ id: node.data.nodeId, node: node.data });
            });
        };
        return D3NodeBasicParser;
    }());

    var applyAttrs = function (sel, attrs) {
        // applying  attrs
        var currentSel = sel;
        for (var key in attrs) {
            var value = attrs[key];
            currentSel = currentSel.attr(key, value);
        }
        return currentSel;
    };
    var addDefs = function (container, defs) {
        // adding defs
        for (var key in defs) {
            var currentDef = defs[key];
            var pattern = applyAttrs(container.append(currentDef.type).attr('id', key), currentDef.attrs);
            for (var componentKey in currentDef.components) {
                var componentDef = currentDef.components[componentKey];
                var component = applyAttrs(pattern.append(componentDef.type), componentDef.attrs);
                if (componentDef.components)
                    addDefs(component, componentDef.components);
            }
        }
    };
    var calcIconGTransform = function (prIcon, prScale) {
        //defining variables
        var traslateX = 0;
        var traslateY = 0;
        var scale = 1;
        prScale = prScale || 1;
        var iconWidth = +prIcon.icon[0];
        var iconHeight = +prIcon.icon[1];
        if ((iconWidth > iconHeight) || (iconWidth == iconHeight)) { // if width > height or equal
            scale = (1 / iconWidth);
            var margin = (iconWidth - iconHeight) / 2;
            traslateY = margin * scale;
            if (prScale != 1) {
                traslateY += ((iconHeight * scale) - (iconHeight * scale * prScale)) / 2;
                traslateX = (1 - prScale) / 2;
            }
        }
        else {
            scale = (1 / iconHeight);
            var margin = (iconHeight - iconWidth) / 2;
            traslateX = margin * scale;
            if (prScale != 1) {
                traslateX += ((iconWidth * scale) - (iconWidth * scale * prScale)) / 2;
                traslateY = (1 - prScale) / 2;
            }
        }
        return "translate(" + traslateX + ", " + traslateY + ") scale(" + scale * prScale + ")";
    };
    var calcGFit = function (prG, prContainer, prRoot, prNodeParser, prPadding) {
        if (prPadding === void 0) { prPadding = 50; }
        //defining variables
        var cWidth = prContainer.node().getBoundingClientRect().width;
        var cHeight = prContainer.node().getBoundingClientRect().height;
        var gWidth = prG.node().getBBox().width; // adding margin
        var gHeight = prG.node().getBBox().height; // adding margin
        var scale = d3.min([(cHeight / (gHeight + prPadding)), (cWidth / (gWidth + prPadding))]);
        var minX = Math.abs(d3.min(prRoot.descendants().map(function (current) { return current.x; })) - (prNodeParser.width / 2));
        var maxX = d3.max(prRoot.descendants().map(function (current) { return current.x; })) + (prNodeParser.width / 2);
        var centerX = cWidth / 2;
        var currentx = centerX + (((minX - maxX) * scale) / 2);
        var currenty = ((cHeight - (gHeight * scale)) / 2);
        // console.log(`Min X: ${minX} - Max X: ${maxX} - diff: ${minX - maxX} - center: ${currentx} - g sclae: ${gScale}`)
        return { scale: scale, y: currenty, x: currentx };
    };
    var addDefaultDefs = function (container, defs, prNodeParser) {
        // adding defs
        for (var key in defs) {
            var currentDef = defs[key];
            // creating pattern
            var pattern = container.append('pattern');
            setPattern(pattern, { nodeId: key, nodeImage: currentDef }, prNodeParser);
        }
    };
    var addFaIconDefs = function (container, defs) {
        // adding defs
        for (var key in defs) {
            var currentDef = defs[key];
            currentDef.scale = currentDef.scale || 1;
            // creating pattern
            var pattern = applyAttrs(container.append('pattern').attr('id', key), {
                width: '100%', height: '100%', patternContentUnits: 'objectBoundingBox'
            });
            // creating rect
            var faIcon_1 = fa[currentDef.name];
            // creating g
            var g = applyAttrs(pattern.append('g'), {
                transform: calcIconGTransform(faIcon_1, currentDef.scale),
                fill: currentDef.color
            });
            var sideSize = d3.max([+faIcon_1.icon[0], +faIcon_1.icon[1]]) / currentDef.scale;
            applyAttrs(g.append('rect'), {
                fill: currentDef.backgroundColor,
                x: -sideSize / 3,
                y: -sideSize / 3,
                width: (sideSize * 3),
                height: (sideSize * 3)
            });
            // creating path
            applyAttrs(g.append('path'), {
                d: faIcon_1.icon[4]
            });
        }
    };
    var imageLink = function (nodeImage) {
        if (nodeImage && nodeImage.type == 'link')
            return nodeImage.data;
        if (nodeImage && nodeImage.type == 'base64')
            return "data:image/png;base64," + nodeImage.data;
        return '';
    };
    var ɵ0 = imageLink;
    var faIcon = function (d) {
        if (!d || !(d.type == 'icon'))
            return null;
        var icon = fa[d.name];
        return icon;
    };
    var ɵ1 = faIcon;
    var setPattern = function (prPattern, prNodeData, prNodeParser) {
        // configurin pattern
        var link = imageLink(prNodeData.nodeImage);
        if (link != '') {
            prPattern
                .attr('id', "img-" + prNodeData.nodeId)
                .attr('width', 1)
                .attr('height', 1)
                .append('image')
                .attr('xlink:href', link)
                .attr('width', prNodeParser.imageDefs.w)
                .attr('height', prNodeParser.imageDefs.h)
                .attr('preserveAspectRatio', 'xMidYMin slice');
            return; // exit because image is priority
        }
        var icon = faIcon(prNodeData.nodeImage);
        if (icon) {
            var iconDef = prNodeData.nodeImage;
            applyAttrs(prPattern, {
                id: "img-" + prNodeData.nodeId,
                width: '100%',
                height: '100%',
                patternContentUnits: 'objectBoundingBox'
            });
            // creating g
            var g = applyAttrs(prPattern.append('g'), {
                transform: calcIconGTransform(icon, iconDef.scale || 0.8),
                fill: iconDef.color || 'white'
            });
            // creating rect
            var sideSize = d3.max([+icon.icon[0], +icon.icon[1]]);
            applyAttrs(g.append('rect'), {
                fill: iconDef.backgroundColor || '#074EF3',
                x: -sideSize / 2,
                y: -sideSize / 2,
                width: (sideSize * 2),
                height: (sideSize * 2)
            });
            // creating path
            applyAttrs(g.append('path'), {
                d: icon.icon[4]
            });
            return; // exit because icon is second priority
        }
    };
    var lastChidrenLevel = function (prRoot) {
        var e_1, _a;
        try {
            for (var _b = __values(prRoot.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var current = _c.value;
                if (current.children)
                    return false;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return true;
    };
    var buildTree = function (prRoot, nodeSize) {
        if (!prRoot.children || !prRoot.children.length)
            return;
        //#region local Functions
        var setChildrenPos = function (prNode, nodeSize) {
            var e_2, _a;
            prNode.minx = prNode.x;
            prNode.maxx = prNode.x;
            if (!prNode.children)
                return;
            var startingX = prNode.x - ((prNode.children.length - 1) / 2) * nodeSize.w;
            prNode.minx = startingX;
            var lastLevel = lastChidrenLevel(prNode);
            var distribution = prNode.data.childrenDist;
            if (!lastLevel)
                distribution = "horizontal";
            switch (distribution) {
                case "vertical":
                    startingX = prNode.x - nodeSize.w / 2;
                    prNode.minx = startingX;
                    prNode.maxx = startingX + nodeSize.w;
                    var level = 0;
                    for (var index = 0; index < prNode.children.length; index++) {
                        var currentChild = prNode.children[index];
                        currentChild.x = startingX;
                        startingX += nodeSize.w;
                        currentChild.linkDirection = 'right';
                        currentChild.y = (currentChild.depth + level) * nodeSize.h;
                        if (index % 2 == 1) {
                            currentChild.linkDirection = 'left';
                            startingX = prNode.x - nodeSize.w / 2;
                            level++;
                        }
                    }
                    break;
                case "horizontal":
                default:
                    try {
                        for (var _b = __values(prNode.children || []), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var currentChild = _c.value;
                            currentChild.x = startingX;
                            prNode.maxx = startingX;
                            startingX += nodeSize.w;
                            currentChild.linkDirection = 'top';
                            currentChild.y = currentChild.depth * nodeSize.h;
                            setChildrenPos(currentChild, nodeSize);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    break;
            }
        };
        var moveNode = function (prNode, movex, positionOnParent, moveBrothers) {
            if (movex == 0)
                return;
            prNode.minx += movex;
            prNode.maxx += movex;
            prNode.x += movex;
            // console.log('Moving: ', prNode.data.nodeId, movex)
            // if(!prNode.children) return;
            for (var index = 0; index < (prNode.children || []).length; index++) {
                var currentChild = prNode.children[index];
                // currentChild.x += movex;
                moveNode(currentChild, movex, index, false);
            }
            // moving brothers
            if (!moveBrothers)
                return;
            if (!prNode.parent)
                return;
            var nextToMove = prNode.parent.children[positionOnParent + 1];
            if (nextToMove)
                moveNode(nextToMove, movex, positionOnParent + 1, true);
        };
        //#endregion local Functions
        // setting the first x / y position
        setChildrenPos(prRoot, nodeSize);
        var getrelativePosition = function (current, length) {
            var increment = 1 / length;
            var pos = increment * current;
            if (increment == 1)
                return 0; // middle
            if (pos == 1)
                return 1; // middle
            if (pos <= 0.5)
                return -1; // left
            var prevPos = increment - (current - 1); // left
            if (pos >= 0.5 && prevPos <= 0.5)
                return 0; // middle
            return 1; // right    
        };
        var getNextNodeWithChildren = function (prNode, positionOnParent) {
            for (var index = positionOnParent; index < prNode.parent.children.length; index++) {
                var child = prNode.parent.children[index];
                if (child.children)
                    return {
                        index: index,
                        node: child
                    };
            }
            return {
                index: -1,
                node: null
            };
        };
        //analizamos las posiciones y corremos de ser necesario
        var lastX = { defined: false, x: 0 };
        for (var index = 0; index < prRoot.children.length; index++) {
            var currentChild = prRoot.children[index];
            if (currentChild.children) {
                // before anything
                buildTree(currentChild, nodeSize);
                if (!lastX.defined || currentChild.maxx > lastX.x) {
                    lastX.defined = true;
                    lastX.x = currentChild.maxx;
                }
                var position = getrelativePosition(index + 1, prRoot.children.length);
                // to the left
                var nextChild = getNextNodeWithChildren(currentChild, index + 1); //prRoot.children[index+1];
                if (!nextChild.node)
                    continue;
                var move = void 0;
                if (nextChild.node.minx < (lastX.x + nodeSize.w)) {
                    move = (lastX.x + nodeSize.w) - nextChild.node.minx;
                    // console.log(`NODE: ${currentChild.data.nodeId} -> ${move}`)
                    moveNode(nextChild.node, move, nextChild.index, true);
                }
                // // let prevChild: IRootNode<ID3Node>, nextChild: IRootNode<ID3Node>;
                // switch(position) {
                //   case -1: // left
                //     prevChild = prRoot.children[index-1];
                //     if(!prevChild || !prevChild.children) continue;
                //     move = (Math.abs(currentChild.minx - prevChild.maxx) + nodeSize.w) * -1; 
                //     moveNode(prevChild, move, index-1, true)   
                //     break;
                //   case 0: // center
                //     prevChild = prRoot.children[index-1];
                //     if(prevChild && prevChild.children) {
                //       move = (Math.abs(currentChild.minx - prevChild.maxx) + nodeSize.w) * -1; 
                //       moveNode(prevChild, move, index-1, true)   
                //     }
                //     nextChild = prRoot.children[index+1];
                //     if(!nextChild || !nextChild.children) continue;
                //     move = (Math.abs(nextChild.minx - currentChild.maxx) + nodeSize.w); 
                //     moveNode(nextChild, move, index+1, true)
                //     break;
                //   case 1: // rigth
                //     nextChild =  getBrotherWithChildren(currentChild, index, 1); //prRoot.children[index+1];
                //     if(!nextChild || !nextChild.children) continue;
                //     move = (Math.abs(nextChild.minx - currentChild.maxx) + nodeSize.w); 
                //     moveNode(nextChild, move, index+1, true)
                //     break;
                // }
                // buildTree(currentChild, nodeSize)
            }
        }
        // if root then put root in the middle
        if (!prRoot.parent) {
            var nodes_1 = [];
            var getNodes_1 = function (prNode) {
                var e_3, _a;
                nodes_1.push(prNode);
                try {
                    for (var _b = __values(prNode.children || []), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var currentNode = _c.value;
                        getNodes_1(currentNode);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            };
            getNodes_1(prRoot);
            var minX = d3.min(nodes_1.map(function (current) { return current.x; }));
            var maxX = d3.max(nodes_1.map(function (current) { return current.x; }));
            var moveX = (Math.abs(minX) - Math.abs(maxX)) / 2;
            //console.log('Centranding...: ', moveX);
            moveNode(prRoot.children[0], moveX, 0, true);
        }
    };

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

    var BEOrgchartComponent = /** @class */ (function () {
        //#endregion
        function BEOrgchartComponent(prEl) {
            this.prEl = prEl;
            this.onNodeClick = new core.EventEmitter();
        }
        Object.defineProperty(BEOrgchartComponent.prototype, "chart", {
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
        BEOrgchartComponent.prototype.ngAfterViewInit = function () {
            this.init();
        };
        BEOrgchartComponent.prototype.ngOnChanges = function (changes) {
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
        BEOrgchartComponent.prototype.init = function () {
            var me = this;
            // init the canvas
            var chart = me.chart; // Must be like this to ensure chart init
            me.chart.render();
            // setting data
            me.chart.onNodeClick.subscribe(function (data) {
                me.onNodeClick.next(data.node);
            });
        };
        BEOrgchartComponent.prototype.assignData = function (data, clear) {
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
        BEOrgchartComponent.prototype.assignNodeParser = function (prParser) {
            var me = this;
            var chart = me.chart; // Must be like this to ensure chart init
            chart.nodeParser = prParser;
            chart.render();
        };
        BEOrgchartComponent.prototype.assignOptions = function (prOptions) {
            var me = this;
            me.chart.setOptions(prOptions);
        };
        BEOrgchartComponent.ctorParameters = function () { return [
            { type: core.ElementRef }
        ]; };
        __decorate([
            core.Input()
        ], BEOrgchartComponent.prototype, "nodes", void 0);
        __decorate([
            core.Input()
        ], BEOrgchartComponent.prototype, "nodeParser", void 0);
        __decorate([
            core.Input()
        ], BEOrgchartComponent.prototype, "options", void 0);
        __decorate([
            core.Output()
        ], BEOrgchartComponent.prototype, "onNodeClick", void 0);
        BEOrgchartComponent = __decorate([
            core.Component({
                selector: 'be-orgchart',
                template: "<div #orgchart class=\"container\"></div>\r\n\r\n<ng-template #defaultTemplate>\r\n  <svg height=\"400\" width=\"450\">\r\n    <path id=\"lineAB\" d=\"M 100 350 l 150 -300\" stroke=\"red\" stroke-width=\"3\" fill=\"none\" />\r\n      <path id=\"lineBC\" d=\"M 250 50 l 150 300\" stroke=\"red\" stroke-width=\"3\" fill=\"none\" />\r\n      <path d=\"M 175 200 l 150 0\" stroke=\"green\" stroke-width=\"3\" fill=\"none\" />\r\n      <path d=\"M 100 350 q 150 -300 300 0\" stroke=\"blue\" stroke-width=\"5\" fill=\"none\" />\r\n      <!-- Mark relevant points -->\r\n      <g stroke=\"black\" stroke-width=\"3\" fill=\"black\"> \r\n        <circle id=\"pointA\" cx=\"100\" cy=\"350\" r=\"3\" />\r\n        <circle id=\"pointB\" cx=\"250\" cy=\"50\" r=\"3\" />\r\n        <circle id=\"pointC\" cx=\"400\" cy=\"350\" r=\"3\" />\r\n      </g>\r\n      <!-- Label the points -->\r\n      <g font-size=\"30\" font-family=\"sans-serif\" fill=\"black\" stroke=\"none\" text-anchor=\"middle\">\r\n        <text x=\"100\" y=\"350\" dx=\"-30\">A</text>\r\n        <text x=\"250\" y=\"50\" dy=\"-10\">B</text>\r\n        <text x=\"400\" y=\"350\" dx=\"30\">C</text>\r\n      </g>\r\n    </svg>\r\n</ng-template>\r\n\r\n<ng-template #nodeTemplate>\r\n  <div>\r\n    <p>$$title</p>\r\n    <p>$$id</p>\r\n  </div>\r\n</ng-template> ",
                styles: [":host{display:flex;flex-direction:column;overflow:hidden}image.rounded{border-radius:50%;border-color:#00f;border-width:2px}"]
            })
        ], BEOrgchartComponent);
        return BEOrgchartComponent;
    }());

    // import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
    var BEOrgchartModule = /** @class */ (function () {
        function BEOrgchartModule() {
        }
        BEOrgchartModule = __decorate([
            core.NgModule({
                declarations: [BEOrgchartComponent],
                exports: [BEOrgchartComponent]
            })
        ], BEOrgchartModule);
        return BEOrgchartModule;
    }());

    exports.BEOrgchartComponent = BEOrgchartComponent;
    exports.BEOrgchartModule = BEOrgchartModule;
    exports.D3NodeBasicParser = D3NodeBasicParser;
    exports.D3OrgChart = D3OrgChart;
    exports.ɵa = BEOrgchartComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=be-orgchart.umd.js.map
