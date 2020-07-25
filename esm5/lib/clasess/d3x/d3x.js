import { __values } from "tslib";
import { max, min } from 'd3';
import * as fa from '@fortawesome/free-solid-svg-icons';
export var applyAttrs = function (sel, attrs) {
    // applying  attrs
    var currentSel = sel;
    for (var key in attrs) {
        var value = attrs[key];
        currentSel = currentSel.attr(key, value);
    }
    return currentSel;
};
export var addDefs = function (container, defs) {
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
export var calcIconGTransform = function (prIcon, prScale) {
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
export var calcGFit = function (prG, prContainer, prRoot, prNodeParser, prPadding) {
    if (prPadding === void 0) { prPadding = 50; }
    //defining variables
    var cWidth = prContainer.node().getBoundingClientRect().width;
    var cHeight = prContainer.node().getBoundingClientRect().height;
    var gWidth = prG.node().getBBox().width; // adding margin
    var gHeight = prG.node().getBBox().height; // adding margin
    var scale = min([(cHeight / (gHeight + prPadding)), (cWidth / (gWidth + prPadding))]);
    var minX = Math.abs(min(prRoot.descendants().map(function (current) { return current.x; })) - (prNodeParser.width / 2));
    var maxX = max(prRoot.descendants().map(function (current) { return current.x; })) + (prNodeParser.width / 2);
    var centerX = cWidth / 2;
    var currentx = centerX + (((minX - maxX) * scale) / 2);
    var currenty = ((cHeight - (gHeight * scale)) / 2);
    // console.log(`Min X: ${minX} - Max X: ${maxX} - diff: ${minX - maxX} - center: ${currentx} - g sclae: ${gScale}`)
    return { scale: scale, y: currenty, x: currentx };
};
export var addDefaultDefs = function (container, defs, prNodeParser) {
    // adding defs
    for (var key in defs) {
        var currentDef = defs[key];
        // creating pattern
        var pattern = container.append('pattern');
        setPattern(pattern, { nodeId: key, nodeImage: currentDef }, prNodeParser);
    }
};
export var addFaIconDefs = function (container, defs) {
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
        var sideSize = max([+faIcon_1.icon[0], +faIcon_1.icon[1]]) / currentDef.scale;
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
export var setPattern = function (prPattern, prNodeData, prNodeParser) {
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
        var sideSize = max([+icon.icon[0], +icon.icon[1]]);
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
export var lastChidrenLevel = function (prRoot) {
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
export var buildTree = function (prRoot, nodeSize) {
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
        var minX = min(nodes_1.map(function (current) { return current.x; }));
        var maxX = max(nodes_1.map(function (current) { return current.x; }));
        var moveX = (Math.abs(minX) - Math.abs(maxX)) / 2;
        //console.log('Centranding...: ', moveX);
        moveNode(prRoot.children[0], moveX, 0, true);
    }
};
export { ɵ0, ɵ1 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZDN4LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYmUtb3JnY2hhcnQvIiwic291cmNlcyI6WyJsaWIvY2xhc2Vzcy9kM3gvZDN4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLElBQUksQ0FBQztBQU05QixPQUFPLEtBQUssRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBSXhELE1BQU0sQ0FBQyxJQUFNLFVBQVUsR0FBRyxVQUFDLEdBQXFDLEVBQUUsS0FBYTtJQUM3RSxrQkFBa0I7SUFDbEIsSUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDO0lBQ3JCLEtBQUssSUFBTSxHQUFHLElBQUksS0FBSyxFQUFFO1FBQ3ZCLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QixVQUFVLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDMUM7SUFDRCxPQUFPLFVBQVUsQ0FBQztBQUNwQixDQUFDLENBQUE7QUFRRCxNQUFNLENBQUMsSUFBTSxPQUFPLEdBQUcsVUFBQyxTQUEyQyxFQUFFLElBQStCO0lBQ2xHLGNBQWM7SUFDZCxLQUFLLElBQU0sR0FBRyxJQUFJLElBQUksRUFBRTtRQUN0QixJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0IsSUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQy9GLEtBQUssSUFBTSxZQUFZLElBQUksVUFBVSxDQUFDLFVBQVUsRUFBRTtZQUNoRCxJQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3pELElBQU0sU0FBUyxHQUFHLFVBQVUs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UyxDQUFDLENBQUMsQ0FBQztRQUNsRCxJQUFNLElBQUksR0FBRyxHQUFHLENBQUMsT0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLE9BQU8sSUFBSSxPQUFBLE9BQU8sQ0FBQyxDQUFDLEVBQVQsQ0FBUyxDQUFDLENBQUMsQ0FBQztRQUNsRCxJQUFNLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVwRCx5Q0FBeUM7UUFDekMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUM5QztBQUVILENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1heCwgbWluIH0gZnJvbSAnZDMnO1xyXG5pbXBvcnQgeyBJY29uRGVmaW5pdGlvbiB9IGZyb20gJ0Bmb3J0YXdlc29tZS9mcmVlLXNvbGlkLXN2Zy1pY29ucyc7XHJcbmltcG9ydCB7IElEM05vZGUsIElJY29uRGVmLCBJSW1hZ2VEZWYgfSBmcm9tICcuLy4uLy4uL2ludGVyZmFjZXMnO1xyXG5pbXBvcnQgeyBEM05vZGVCYXNpY1BhcnNlciB9IGZyb20gJy4vLi4vQGl0ZW1zJztcclxuaW1wb3J0ICogYXMgZDMgZnJvbSAnZDMnO1xyXG5cclxuaW1wb3J0ICogYXMgZmEgZnJvbSAnQGZvcnRhd2Vzb21lL2ZyZWUtc29saWQtc3ZnLWljb25zJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUF0dHJzIHsgW2luZGV4OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfVxyXG5cclxuZXhwb3J0IGNvbnN0IGFwcGx5QXR0cnMgPSAoc2VsOiBkMy5TZWxlY3Rpb248YW55LCBhbnksIGFueSwgYW55PiwgYXR0cnM6IElBdHRycykgPT4ge1xyXG4gIC8vIGFwcGx5aW5nICBhdHRyc1xyXG4gIGxldCBjdXJyZW50U2VsID0gc2VsO1xyXG4gIGZvciAoY29uc3Qga2V5IGluIGF0dHJzKSB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IGF0dHJzW2tleV07XHJcbiAgICBjdXJyZW50U2VsID0gY3VycmVudFNlbC5hdHRyKGtleSwgdmFsdWUpO1xyXG4gIH1cclxuICByZXR1cm4gY3VycmVudFNlbDtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJRGVmIHtcclxuICB0eXBlOiBzdHJpbmc7XHJcbiAgYXR0cnM6IElBdHRycztcclxuICBjb21wb25lbnRzPzogeyBbaW5kZXg6IHN0cmluZ106IElEZWYgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgYWRkRGVmcyA9IChjb250YWluZXI6IGQzLlNlbGVjdGlvbjxhbnksIGFueSwgYW55LCBhbnk+LCBkZWZzOiB7IFtpbmRleDogc3RyaW5nXTogSURlZiB9KSA9PiB7XHJcbiAgLy8gYWRkaW5nIGRlZnNcclxuICBmb3IgKGNvbnN0IGtleSBpbiBkZWZzKSB7XHJcbiAgICBjb25zdCBjdXJyZW50RGVmID0gZGVmc1trZXldO1xyXG4gICAgY29uc3QgcGF0dGVybiA9IGFwcGx5QXR0cnMoY29udGFpbmVyLmFwcGVuZChjdXJyZW50RGVmLnR5cGUpLmF0dHIoJ2lkJywga2V5KSwgY3VycmVudERlZi5hdHRycylcclxuICAgIGZvciAoY29uc3QgY29tcG9uZW50S2V5IGluIGN1cnJlbnREZWYuY29tcG9uZW50cykge1xyXG4gICAgICBjb25zdCBjb21wb25lbnREZWYgPSBjdXJyZW50RGVmLmNvbXBvbmVudHNbY29tcG9uZW50S2V5XTtcclxuICAgICAgY29uc3QgY29tcG9uZW50ID0gYXBwbHlBdHRycyhcclxuICAgICAgICBwYXR0ZXJuLmFwcGVuZChjb21wb25lbnREZWYudHlwZSksXHJcbiAgICAgICAgY29tcG9uZW50RGVmLmF0dHJzXHJcbiAgICAgIClcclxuICAgICAgaWYgKGNvbXBvbmVudERlZi5jb21wb25lbnRzKSBhZGREZWZzKGNvbXBvbmVudCwgY29tcG9uZW50RGVmLmNvbXBvbmVudHMpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGNhbGNJY29uR1RyYW5zZm9ybSA9IChwckljb246IEljb25EZWZpbml0aW9uLCBwclNjYWxlOiBudW1iZXIpOiBzdHJpbmcgPT4ge1xyXG4gIC8vZGVmaW5pbmcgdmFyaWFibGVzXHJcbiAgbGV0IHRyYXNsYXRlWDogbnVtYmVyID0gMDtcclxuICBsZXQgdHJhc2xhdGVZOiBudW1iZXIgPSAwO1xyXG4gIGxldCBzY2FsZTogbnVtYmVyID0gMTtcclxuICBwclNjYWxlID0gcHJTY2FsZSB8fCAxO1xyXG5cclxuICBjb25zdCBpY29uV2lkdGg6IG51bWJlciA9ICtwckljb24uaWNvblswXTtcclxuICBjb25zdCBpY29uSGVpZ2h0OiBudW1iZXIgPSArcHJJY29uLmljb25bMV07XHJcblxyXG4gIGlmICgoaWNvbldpZHRoID4gaWNvbkhlaWdodCkgfHwgKGljb25XaWR0aCA9PSBpY29uSGVpZ2h0KSkgeyAvLyBpZiB3aWR0aCA+IGhlaWdodCBvciBlcXVhbFxyXG4gICAgc2NhbGUgPSAoMSAvIGljb25XaWR0aCk7XHJcbiAgICBjb25zdCBtYXJnaW4gPSAoaWNvbldpZHRoIC0gaWNvbkhlaWdodCkgLyAyO1xyXG4gICAgdHJhc2xhdGVZID0gbWFyZ2luICogc2NhbGU7XHJcbiAgICBpZiAocHJTY2FsZSAhPSAxKSB7XHJcbiAgICAgIHRyYXNsYXRlWSArPSAoKGljb25IZWlnaHQgKiBzY2FsZSkgLSAoaWNvbkhlaWdodCAqIHNjYWxlICogcHJTY2FsZSkpIC8gMjtcclxuICAgICAgdHJhc2xhdGVYID0gKDEgLSBwclNjYWxlKSAvIDI7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHNjYWxlID0gKDEgLyBpY29uSGVpZ2h0KTtcclxuICAgIGNvbnN0IG1hcmdpbiA9IChpY29uSGVpZ2h0IC0gaWNvbldpZHRoKSAvIDI7XHJcbiAgICB0cmFzbGF0ZVggPSBtYXJnaW4gKiBzY2FsZTtcclxuICAgIGlmIChwclNjYWxlICE9IDEpIHtcclxuICAgICAgdHJhc2xhdGVYICs9ICgoaWNvbldpZHRoICogc2NhbGUpIC0gKGljb25XaWR0aCAqIHNjYWxlICogcHJTY2FsZSkpIC8gMjtcclxuICAgICAgdHJhc2xhdGVZID0gKDEgLSBwclNjYWxlKSAvIDI7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYHRyYW5zbGF0ZSgke3RyYXNsYXRlWH0sICR7dHJhc2xhdGVZfSkgc2NhbGUoJHtzY2FsZSAqIHByU2NhbGV9KWA7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBjYWxjR0ZpdCA9IChcclxuICBwckc6IGQzLlNlbGVjdGlvbjxTVkdHRWxlbWVudCwgYW55LCBhbnksIGFueT4sXHJcbiAgcHJDb250YWluZXI6IGQzLlNlbGVjdGlvbjxTVkdFbGVtZW50LCBhbnksIGFueSwgYW55PixcclxuICBwclJvb3Q6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPixcclxuICBwck5vZGVQYXJzZXI6IEQzTm9kZUJhc2ljUGFyc2VyLFxyXG4gIHByUGFkZGluZzogbnVtYmVyID0gNTBcclxuKSA9PiB7XHJcbiAgLy9kZWZpbmluZyB2YXJpYWJsZXNcclxuICBjb25zdCBjV2lkdGg6IG51bWJlciA9IHByQ29udGFpbmVyLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcclxuICBjb25zdCBjSGVpZ2h0OiBudW1iZXIgPSBwckNvbnRhaW5lci5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xyXG4gIGNvbnN0IGdXaWR0aDogbnVtYmVyID0gcHJHLm5vZGUoKS5nZXRCQm94KCkud2lkdGg7IC8vIGFkZGluZyBtYXJnaW5cclxuICBjb25zdCBnSGVpZ2h0OiBudW1iZXIgPSBwckcubm9kZSgpLmdldEJCb3goKS5oZWlnaHQ7IC8vIGFkZGluZyBtYXJnaW5cclxuXHJcbiAgY29uc3Qgc2NhbGUgPSBtaW4oWyhjSGVpZ2h0IC8gKGdIZWlnaHQgKyBwclBhZGRpbmcpKSwgKGNXaWR0aCAvIChnV2lkdGggKyBwclBhZGRpbmcpKV0pO1xyXG5cclxuICBjb25zdCBtaW5YID0gTWF0aC5hYnMobWluKHByUm9vdC5kZXNjZW5kYW50cygpLm1hcChjdXJyZW50ID0+IGN1cnJlbnQueCkpIC0gKHByTm9kZVBhcnNlci53aWR0aCAvIDIpKTtcclxuICBjb25zdCBtYXhYID0gbWF4KHByUm9vdC5kZXNjZW5kYW50cygpLm1hcChjdXJyZW50ID0+IGN1cnJlbnQueCkpICsgKHByTm9kZVBhcnNlci53aWR0aCAvIDIpO1xyXG5cclxuICBjb25zdCBjZW50ZXJYID0gY1dpZHRoIC8gMjtcclxuXHJcbiAgY29uc3QgY3VycmVudHggPSBjZW50ZXJYICsgKCgobWluWCAtIG1heFgpICogc2NhbGUpIC8gMik7XHJcbiAgY29uc3QgY3VycmVudHkgPSAoKGNIZWlnaHQgLSAoZ0hlaWdodCAqIHNjYWxlKSkgLyAyKTtcclxuICAvLyBjb25zb2xlLmxvZyhgTWluIFg6ICR7bWluWH0gLSBNYXggWDogJHttYXhYfSAtIGRpZmY6ICR7bWluWCAtIG1heFh9IC0gY2VudGVyOiAke2N1cnJlbnR4fSAtIGcgc2NsYWU6ICR7Z1NjYWxlfWApXHJcbiAgcmV0dXJuIHsgc2NhbGU6IHNjYWxlLCB5OiBjdXJyZW50eSwgeDogY3VycmVudHggfTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGFkZERlZmF1bHREZWZzID0gKGNvbnRhaW5lcjogZDMuU2VsZWN0aW9uPGFueSwgYW55LCBhbnksIGFueT4sIGRlZnM6IHsgW2luZGV4OiBzdHJpbmddOiBJSWNvbkRlZiB8IElJbWFnZURlZiB9LCBwck5vZGVQYXJzZXI6IEQzTm9kZUJhc2ljUGFyc2VyKSA9PiB7XHJcbiAgLy8gYWRkaW5nIGRlZnNcclxuICBmb3IgKGNvbnN0IGtleSBpbiBkZWZzKSB7XHJcbiAgICBjb25zdCBjdXJyZW50RGVmID0gZGVmc1trZXldO1xyXG4gICAgLy8gY3JlYXRpbmcgcGF0dGVyblxyXG4gICAgY29uc3QgcGF0dGVybiA9IGNvbnRhaW5lci5hcHBlbmQoJ3BhdHRlcm4nKTtcclxuICAgIHNldFBhdHRlcm4ocGF0dGVybiwgeyBub2RlSWQ6IGtleSwgbm9kZUltYWdlOiBjdXJyZW50RGVmIH0sIHByTm9kZVBhcnNlcik7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGFkZEZhSWNvbkRlZnMgPSAoY29udGFpbmVyOiBkMy5TZWxlY3Rpb248YW55LCBhbnksIGFueSwgYW55PiwgZGVmczogeyBbaW5kZXg6IHN0cmluZ106IElJY29uRGVmIH0pID0+IHtcclxuICAvLyBhZGRpbmcgZGVmc1xyXG4gIGZvciAoY29uc3Qga2V5IGluIGRlZnMpIHtcclxuICAgIGNvbnN0IGN1cnJlbnREZWYgPSBkZWZzW2tleV07XHJcblxyXG4gICAgY3VycmVudERlZi5zY2FsZSA9IGN1cnJlbnREZWYuc2NhbGUgfHwgMTtcclxuXHJcbiAgICAvLyBjcmVhdGluZyBwYXR0ZXJuXHJcbiAgICBjb25zdCBwYXR0ZXJuID0gYXBwbHlBdHRycyhcclxuICAgICAgY29udGFpbmVyLmFwcGVuZCgncGF0dGVybicpLmF0dHIoJ2lkJywga2V5KSxcclxuICAgICAge1xyXG4gICAgICAgIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBwYXR0ZXJuQ29udGVudFVuaXRzOiAnb2JqZWN0Qm91bmRpbmdCb3gnXHJcbiAgICAgIH1cclxuICAgICk7XHJcblxyXG4gICAgLy8gY3JlYXRpbmcgcmVjdFxyXG4gICAgY29uc3QgZmFJY29uID0gZmFbY3VycmVudERlZi5uYW1lXTtcclxuXHJcbiAgICAvLyBjcmVhdGluZyBnXHJcbiAgICBjb25zdCBnID0gYXBwbHlBdHRycyhwYXR0ZXJuLmFwcGVuZCgnZycpLCB7XHJcbiAgICAgIHRyYW5zZm9ybTogY2FsY0ljb25HVHJhbnNmb3JtKGZhSWNvbiwgY3VycmVudERlZi5zY2FsZSksXHJcbiAgICAgIGZpbGw6IGN1cnJlbnREZWYuY29sb3JcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHNpZGVTaXplID0gbWF4KFsrZmFJY29uLmljb25bMF0sICtmYUljb24uaWNvblsxXV0pIC8gY3VycmVudERlZi5zY2FsZTtcclxuICAgIGFwcGx5QXR0cnMoZy5hcHBlbmQoJ3JlY3QnKSwge1xyXG4gICAgICBmaWxsOiBjdXJyZW50RGVmLmJhY2tncm91bmRDb2xvcixcclxuICAgICAgeDogLXNpZGVTaXplIC8gMyxcclxuICAgICAgeTogLXNpZGVTaXplIC8gMyxcclxuICAgICAgd2lkdGg6IChzaWRlU2l6ZSAqIDMpLFxyXG4gICAgICBoZWlnaHQ6IChzaWRlU2l6ZSAqIDMpXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIGNyZWF0aW5nIHBhdGhcclxuICAgIGFwcGx5QXR0cnMoZy5hcHBlbmQoJ3BhdGgnKSwge1xyXG4gICAgICBkOiBmYUljb24uaWNvbls0XSBhcyBzdHJpbmdcclxuICAgIH0pXHJcblxyXG4gIH1cclxufVxyXG5cclxuY29uc3QgaW1hZ2VMaW5rID0gKG5vZGVJbWFnZTogSUltYWdlRGVmKSA9PiB7XHJcbiAgaWYgKG5vZGVJbWFnZSAmJiBub2RlSW1hZ2UudHlwZSA9PSAnbGluaycpIHJldHVybiBub2RlSW1hZ2UuZGF0YTtcclxuICBpZiAobm9kZUltYWdlICYmIG5vZGVJbWFnZS50eXBlID09ICdiYXNlNjQnKSByZXR1cm4gYGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCwke25vZGVJbWFnZS5kYXRhfWA7XHJcbiAgcmV0dXJuICcnO1xyXG59XHJcblxyXG5jb25zdCBmYUljb24gPSAoZDogSUljb25EZWYpID0+IHtcclxuICBpZiAoIWQgfHwgIShkLnR5cGUgPT0gJ2ljb24nKSkgcmV0dXJuIG51bGw7XHJcbiAgY29uc3QgaWNvbjogSWNvbkRlZmluaXRpb24gPSBmYVtkLm5hbWVdO1xyXG4gIHJldHVybiBpY29uO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2V0UGF0dGVybiA9IChwclBhdHRlcm46IGQzLlNlbGVjdGlvbjxhbnksIGFueSwgYW55LCBhbnk+LCBwck5vZGVEYXRhOiBQYXJ0aWFsPElEM05vZGU+LCBwck5vZGVQYXJzZXI6IEQzTm9kZUJhc2ljUGFyc2VyKSA9PiB7XHJcbiAgLy8gY29uZmlndXJpbiBwYXR0ZXJuXHJcbiAgY29uc3QgbGluayA9IGltYWdlTGluayhwck5vZGVEYXRhLm5vZGVJbWFnZSBhcyBJSW1hZ2VEZWYpO1xyXG4gIGlmIChsaW5rICE9ICcnKSB7XHJcbiAgICBwclBhdHRlcm5cclxuICAgICAgLmF0dHIoJ2lkJywgYGltZy0ke3ByTm9kZURhdGEubm9kZUlkfWApXHJcbiAgICAgIC5hdHRyKCd3aWR0aCcsIDEpXHJcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCAxKVxyXG4gICAgICAuYXBwZW5kKCdpbWFnZScpXHJcbiAgICAgIC5hdHRyKCd4bGluazpocmVmJywgbGluaylcclxuICAgICAgLmF0dHIoJ3dpZHRoJywgcHJOb2RlUGFyc2VyLmltYWdlRGVmcy53KVxyXG4gICAgICAuYXR0cignaGVpZ2h0JywgcHJOb2RlUGFyc2VyLmltYWdlRGVmcy5oKVxyXG4gICAgICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWlkWU1pbiBzbGljZScpO1xyXG4gICAgcmV0dXJuOyAvLyBleGl0IGJlY2F1c2UgaW1hZ2UgaXMgcHJpb3JpdHlcclxuICB9XHJcblxyXG4gIGNvbnN0IGljb24gPSBmYUljb24ocHJOb2RlRGF0YS5ub2RlSW1hZ2UgYXMgSUljb25EZWYpO1xyXG4gIGlmIChpY29uKSB7XHJcbiAgICBjb25zdCBpY29uRGVmOiBJSWNvbkRlZiA9IHByTm9kZURhdGEubm9kZUltYWdlIGFzIElJY29uRGVmO1xyXG4gICAgYXBwbHlBdHRycyhwclBhdHRlcm4sIHtcclxuICAgICAgaWQ6IGBpbWctJHtwck5vZGVEYXRhLm5vZGVJZH1gLFxyXG4gICAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgICAgcGF0dGVybkNvbnRlbnRVbml0czogJ29iamVjdEJvdW5kaW5nQm94J1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gY3JlYXRpbmcgZ1xyXG4gICAgY29uc3QgZyA9IGFwcGx5QXR0cnMocHJQYXR0ZXJuLmFwcGVuZCgnZycpLCB7XHJcbiAgICAgIHRyYW5zZm9ybTogY2FsY0ljb25HVHJhbnNmb3JtKGljb24sIGljb25EZWYuc2NhbGUgfHwgMC44KSxcclxuICAgICAgZmlsbDogaWNvbkRlZi5jb2xvciB8fCAnd2hpdGUnXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBjcmVhdGluZyByZWN0XHJcbiAgICBjb25zdCBzaWRlU2l6ZSA9IG1heChbK2ljb24uaWNvblswXSwgK2ljb24uaWNvblsxXV0pO1xyXG4gICAgYXBwbHlBdHRycyhnLmFwcGVuZCgncmVjdCcpLCB7XHJcbiAgICAgIGZpbGw6IGljb25EZWYuYmFja2dyb3VuZENvbG9yIHx8ICcjMDc0RUYzJyxcclxuICAgICAgeDogLXNpZGVTaXplIC8gMixcclxuICAgICAgeTogLXNpZGVTaXplIC8gMixcclxuICAgICAgd2lkdGg6IChzaWRlU2l6ZSAqIDIpLFxyXG4gICAgICBoZWlnaHQ6IChzaWRlU2l6ZSAqIDIpXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIGNyZWF0aW5nIHBhdGhcclxuICAgIGFwcGx5QXR0cnMoZy5hcHBlbmQoJ3BhdGgnKSwge1xyXG4gICAgICBkOiBpY29uLmljb25bNF0gYXMgc3RyaW5nXHJcbiAgICB9KVxyXG5cclxuICAgIHJldHVybjsgLy8gZXhpdCBiZWNhdXNlIGljb24gaXMgc2Vjb25kIHByaW9yaXR5XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQb3NpdGlvbiB7XHJcbiAgeDogbnVtYmVyO1xyXG4gIHk6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJU2l6ZSB7XHJcbiAgdzogbnVtYmVyO1xyXG4gIGg6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJTWF4TWluWCB7XHJcbiAgbWlueDogbnVtYmVyO1xyXG4gIG1heHg6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUm9vdE5vZGU8VD4gZXh0ZW5kcyBkMy5IaWVyYXJjaHlQb2ludE5vZGU8VD4ge1xyXG4gIGNoaWxkcmVuV2lkdGg/OiBudW1iZXI7XHJcbiAgbWlueD86IG51bWJlcjtcclxuICBtYXh4PzogbnVtYmVyO1xyXG4gIGxpbmtEaXJlY3Rpb24/OiAndG9wJyB8ICdsZWZ0JyB8ICdyaWdodCc7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgY29uc3QgbGFzdENoaWRyZW5MZXZlbCA9IChwclJvb3Q6IElSb290Tm9kZTxJRDNOb2RlPik6IGJvb2xlYW4gPT4ge1xyXG4gIGZvciAoY29uc3QgY3VycmVudCBvZiBwclJvb3QuY2hpbGRyZW4pIHtcclxuICAgIGlmIChjdXJyZW50LmNoaWxkcmVuKSByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG4gIHJldHVybiB0cnVlO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGJ1aWxkVHJlZSA9IChwclJvb3Q6IElSb290Tm9kZTxJRDNOb2RlPiwgbm9kZVNpemU6IElTaXplKSA9PiB7XHJcbiAgaWYgKCFwclJvb3QuY2hpbGRyZW4gfHwgIXByUm9vdC5jaGlsZHJlbi5sZW5ndGgpIHJldHVybjtcclxuXHJcbiAgLy8jcmVnaW9uIGxvY2FsIEZ1bmN0aW9uc1xyXG4gIGNvbnN0IHNldENoaWxkcmVuUG9zID0gKHByTm9kZTogSVJvb3ROb2RlPElEM05vZGU+LCBub2RlU2l6ZTogSVNpemUpID0+IHtcclxuICAgIHByTm9kZS5taW54ID0gcHJOb2RlLng7XHJcbiAgICBwck5vZGUubWF4eCA9IHByTm9kZS54O1xyXG5cclxuICAgIGlmICghcHJOb2RlLmNoaWxkcmVuKSByZXR1cm47XHJcblxyXG4gICAgbGV0IHN0YXJ0aW5nWCA9IHByTm9kZS54IC0gKChwck5vZGUuY2hpbGRyZW4ubGVuZ3RoIC0gMSkgLyAyKSAqIG5vZGVTaXplLnc7XHJcbiAgICBwck5vZGUubWlueCA9IHN0YXJ0aW5nWDtcclxuXHJcbiAgICBjb25zdCBsYXN0TGV2ZWwgPSBsYXN0Q2hpZHJlbkxldmVsKHByTm9kZSk7XHJcblxyXG4gICAgbGV0IGRpc3RyaWJ1dGlvbiA9IHByTm9kZS5kYXRhLmNoaWxkcmVuRGlzdDtcclxuICAgIGlmICghbGFzdExldmVsKSBkaXN0cmlidXRpb24gPSBcImhvcml6b250YWxcIjtcclxuXHJcbiAgICBzd2l0Y2ggKGRpc3RyaWJ1dGlvbikge1xyXG4gICAgICBjYXNlIFwidmVydGljYWxcIjpcclxuICAgICAgICBzdGFydGluZ1ggPSBwck5vZGUueCAtIG5vZGVTaXplLncgLyAyO1xyXG4gICAgICAgIHByTm9kZS5taW54ID0gc3RhcnRpbmdYO1xyXG4gICAgICAgIHByTm9kZS5tYXh4ID0gc3RhcnRpbmdYICsgbm9kZVNpemUudztcclxuICAgICAgICBsZXQgbGV2ZWwgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBwck5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICBjb25zdCBjdXJyZW50Q2hpbGQgPSBwck5vZGUuY2hpbGRyZW5baW5kZXhdO1xyXG4gICAgICAgICAgY3VycmVudENoaWxkLnggPSBzdGFydGluZ1g7XHJcbiAgICAgICAgICBzdGFydGluZ1ggKz0gbm9kZVNpemUudztcclxuICAgICAgICAgIGN1cnJlbnRDaGlsZC5saW5rRGlyZWN0aW9uID0gJ3JpZ2h0JztcclxuICAgICAgICAgIGN1cnJlbnRDaGlsZC55ID0gKGN1cnJlbnRDaGlsZC5kZXB0aCArIGxldmVsKSAqIG5vZGVTaXplLmg7XHJcbiAgICAgICAgICBpZiAoaW5kZXggJSAyID09IDEpIHtcclxuICAgICAgICAgICAgY3VycmVudENoaWxkLmxpbmtEaXJlY3Rpb24gPSAnbGVmdCc7XHJcbiAgICAgICAgICAgIHN0YXJ0aW5nWCA9IHByTm9kZS54IC0gbm9kZVNpemUudyAvIDI7XHJcbiAgICAgICAgICAgIGxldmVsKys7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFwiaG9yaXpvbnRhbFwiOlxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGZvciAoY29uc3QgY3VycmVudENoaWxkIG9mIHByTm9kZS5jaGlsZHJlbiB8fCBbXSkge1xyXG4gICAgICAgICAgY3VycmVudENoaWxkLnggPSBzdGFydGluZ1g7XHJcbiAgICAgICAgICBwck5vZGUubWF4eCA9IHN0YXJ0aW5nWDtcclxuICAgICAgICAgIHN0YXJ0aW5nWCArPSBub2RlU2l6ZS53O1xyXG4gICAgICAgICAgY3VycmVudENoaWxkLmxpbmtEaXJlY3Rpb24gPSAndG9wJztcclxuICAgICAgICAgIGN1cnJlbnRDaGlsZC55ID0gY3VycmVudENoaWxkLmRlcHRoICogbm9kZVNpemUuaDtcclxuICAgICAgICAgIHNldENoaWxkcmVuUG9zKGN1cnJlbnRDaGlsZCwgbm9kZVNpemUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcblxyXG4gIH1cclxuXHJcbiAgY29uc3QgbW92ZU5vZGUgPSAocHJOb2RlOiBJUm9vdE5vZGU8SUQzTm9kZT4sIG1vdmV4OiBudW1iZXIsIHBvc2l0aW9uT25QYXJlbnQ6IG51bWJlciwgbW92ZUJyb3RoZXJzOiBib29sZWFuKSA9PiB7XHJcbiAgICBpZiAobW92ZXggPT0gMCkgcmV0dXJuO1xyXG5cclxuICAgIHByTm9kZS5taW54ICs9IG1vdmV4O1xyXG4gICAgcHJOb2RlLm1heHggKz0gbW92ZXg7XHJcbiAgICBwck5vZGUueCArPSBtb3ZleDtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdNb3Zpbmc6ICcsIHByTm9kZS5kYXRhLm5vZGVJZCwgbW92ZXgpXHJcbiAgICAvLyBpZighcHJOb2RlLmNoaWxkcmVuKSByZXR1cm47XHJcblxyXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IChwck5vZGUuY2hpbGRyZW4gfHwgW10pLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICBjb25zdCBjdXJyZW50Q2hpbGQgPSBwck5vZGUuY2hpbGRyZW5baW5kZXhdXHJcbiAgICAgIC8vIGN1cnJlbnRDaGlsZC54ICs9IG1vdmV4O1xyXG4gICAgICBtb3ZlTm9kZShjdXJyZW50Q2hpbGQsIG1vdmV4LCBpbmRleCwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIG1vdmluZyBicm90aGVyc1xyXG4gICAgaWYgKCFtb3ZlQnJvdGhlcnMpIHJldHVybjtcclxuICAgIGlmICghcHJOb2RlLnBhcmVudCkgcmV0dXJuO1xyXG4gICAgY29uc3QgbmV4dFRvTW92ZSA9IHByTm9kZS5wYXJlbnQuY2hpbGRyZW5bcG9zaXRpb25PblBhcmVudCArIDFdO1xyXG4gICAgaWYgKG5leHRUb01vdmUpIG1vdmVOb2RlKG5leHRUb01vdmUsIG1vdmV4LCBwb3NpdGlvbk9uUGFyZW50ICsgMSwgdHJ1ZSk7XHJcbiAgfVxyXG4gIC8vI2VuZHJlZ2lvbiBsb2NhbCBGdW5jdGlvbnNcclxuXHJcbiAgLy8gc2V0dGluZyB0aGUgZmlyc3QgeCAvIHkgcG9zaXRpb25cclxuICBzZXRDaGlsZHJlblBvcyhwclJvb3QsIG5vZGVTaXplKTtcclxuXHJcbiAgY29uc3QgZ2V0cmVsYXRpdmVQb3NpdGlvbiA9IChjdXJyZW50OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKTogbnVtYmVyID0+IHtcclxuICAgIGNvbnN0IGluY3JlbWVudCA9IDEgLyBsZW5ndGg7XHJcbiAgICBjb25zdCBwb3MgPSBpbmNyZW1lbnQgKiBjdXJyZW50O1xyXG5cclxuICAgIGlmIChpbmNyZW1lbnQgPT0gMSkgcmV0dXJuIDA7IC8vIG1pZGRsZVxyXG4gICAgaWYgKHBvcyA9PSAxKSByZXR1cm4gMTsgLy8gbWlkZGxlXHJcbiAgICBpZiAocG9zIDw9IDAuNSkgcmV0dXJuIC0xOyAvLyBsZWZ0XHJcbiAgICBjb25zdCBwcmV2UG9zID0gaW5jcmVtZW50IC0gKGN1cnJlbnQgLSAxKTsgLy8gbGVmdFxyXG4gICAgaWYgKHBvcyA+PSAwLjUgJiYgcHJldlBvcyA8PSAwLjUpIHJldHVybiAwOyAvLyBtaWRkbGVcclxuXHJcbiAgICByZXR1cm4gMTsgLy8gcmlnaHQgICAgXHJcbiAgfVxyXG5cclxuICBjb25zdCBnZXROZXh0Tm9kZVdpdGhDaGlsZHJlbiA9IChwck5vZGU6IElSb290Tm9kZTxJRDNOb2RlPiwgcG9zaXRpb25PblBhcmVudDogbnVtYmVyKSA9PiB7XHJcbiAgICBmb3IgKGxldCBpbmRleCA9IHBvc2l0aW9uT25QYXJlbnQ7IGluZGV4IDwgcHJOb2RlLnBhcmVudC5jaGlsZHJlbi5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgY29uc3QgY2hpbGQgPSBwck5vZGUucGFyZW50LmNoaWxkcmVuW2luZGV4XTtcclxuICAgICAgaWYgKGNoaWxkLmNoaWxkcmVuKSByZXR1cm4ge1xyXG4gICAgICAgIGluZGV4OiBpbmRleCxcclxuICAgICAgICBub2RlOiBjaGlsZFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpbmRleDogLTEsXHJcbiAgICAgIG5vZGU6IG51bGxcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICAvL2FuYWxpemFtb3MgbGFzIHBvc2ljaW9uZXMgeSBjb3JyZW1vcyBkZSBzZXIgbmVjZXNhcmlvXHJcbiAgbGV0IGxhc3RYOiB7IGRlZmluZWQ6IGJvb2xlYW4sIHg6IG51bWJlciB9ID0geyBkZWZpbmVkOiBmYWxzZSwgeDogMCB9O1xyXG4gIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBwclJvb3QuY2hpbGRyZW4ubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICBjb25zdCBjdXJyZW50Q2hpbGQgPSBwclJvb3QuY2hpbGRyZW5baW5kZXhdO1xyXG5cclxuICAgIGlmIChjdXJyZW50Q2hpbGQuY2hpbGRyZW4pIHtcclxuICAgICAgLy8gYmVmb3JlIGFueXRoaW5nXHJcbiAgICAgIGJ1aWxkVHJlZShjdXJyZW50Q2hpbGQsIG5vZGVTaXplKVxyXG5cclxuICAgICAgaWYgKCFsYXN0WC5kZWZpbmVkIHx8IGN1cnJlbnRDaGlsZC5tYXh4ID4gbGFzdFgueCkge1xyXG4gICAgICAgIGxhc3RYLmRlZmluZWQgPSB0cnVlO1xyXG4gICAgICAgIGxhc3RYLnggPSBjdXJyZW50Q2hpbGQubWF4eDtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgcG9zaXRpb24gPSBnZXRyZWxhdGl2ZVBvc2l0aW9uKGluZGV4ICsgMSwgcHJSb290LmNoaWxkcmVuLmxlbmd0aClcclxuICAgICAgLy8gdG8gdGhlIGxlZnRcclxuICAgICAgY29uc3QgbmV4dENoaWxkOiB7IGluZGV4OiBudW1iZXIsIG5vZGU6IElSb290Tm9kZTxJRDNOb2RlPiB9ID0gZ2V0TmV4dE5vZGVXaXRoQ2hpbGRyZW4oY3VycmVudENoaWxkLCBpbmRleCArIDEpOyAvL3ByUm9vdC5jaGlsZHJlbltpbmRleCsxXTtcclxuICAgICAgaWYgKCFuZXh0Q2hpbGQubm9kZSkgY29udGludWU7XHJcbiAgICAgIGxldCBtb3ZlOiBudW1iZXI7XHJcbiAgICAgIGlmIChuZXh0Q2hpbGQubm9kZS5taW54IDwgKGxhc3RYLnggKyBub2RlU2l6ZS53KSkge1xyXG4gICAgICAgIG1vdmUgPSAobGFzdFgueCArIG5vZGVTaXplLncpIC0gbmV4dENoaWxkLm5vZGUubWlueDtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgTk9ERTogJHtjdXJyZW50Q2hpbGQuZGF0YS5ub2RlSWR9IC0+ICR7bW92ZX1gKVxyXG4gICAgICAgIG1vdmVOb2RlKG5leHRDaGlsZC5ub2RlLCBtb3ZlLCBuZXh0Q2hpbGQuaW5kZXgsIHRydWUpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIC8vIGxldCBwcmV2Q2hpbGQ6IElSb290Tm9kZTxJRDNOb2RlPiwgbmV4dENoaWxkOiBJUm9vdE5vZGU8SUQzTm9kZT47XHJcbiAgICAgIC8vIHN3aXRjaChwb3NpdGlvbikge1xyXG4gICAgICAvLyAgIGNhc2UgLTE6IC8vIGxlZnRcclxuICAgICAgLy8gICAgIHByZXZDaGlsZCA9IHByUm9vdC5jaGlsZHJlbltpbmRleC0xXTtcclxuICAgICAgLy8gICAgIGlmKCFwcmV2Q2hpbGQgfHwgIXByZXZDaGlsZC5jaGlsZHJlbikgY29udGludWU7XHJcbiAgICAgIC8vICAgICBtb3ZlID0gKE1hdGguYWJzKGN1cnJlbnRDaGlsZC5taW54IC0gcHJldkNoaWxkLm1heHgpICsgbm9kZVNpemUudykgKiAtMTsgXHJcbiAgICAgIC8vICAgICBtb3ZlTm9kZShwcmV2Q2hpbGQsIG1vdmUsIGluZGV4LTEsIHRydWUpICAgXHJcbiAgICAgIC8vICAgICBicmVhaztcclxuICAgICAgLy8gICBjYXNlIDA6IC8vIGNlbnRlclxyXG4gICAgICAvLyAgICAgcHJldkNoaWxkID0gcHJSb290LmNoaWxkcmVuW2luZGV4LTFdO1xyXG4gICAgICAvLyAgICAgaWYocHJldkNoaWxkICYmIHByZXZDaGlsZC5jaGlsZHJlbikge1xyXG4gICAgICAvLyAgICAgICBtb3ZlID0gKE1hdGguYWJzKGN1cnJlbnRDaGlsZC5taW54IC0gcHJldkNoaWxkLm1heHgpICsgbm9kZVNpemUudykgKiAtMTsgXHJcbiAgICAgIC8vICAgICAgIG1vdmVOb2RlKHByZXZDaGlsZCwgbW92ZSwgaW5kZXgtMSwgdHJ1ZSkgICBcclxuICAgICAgLy8gICAgIH1cclxuXHJcbiAgICAgIC8vICAgICBuZXh0Q2hpbGQgPSBwclJvb3QuY2hpbGRyZW5baW5kZXgrMV07XHJcbiAgICAgIC8vICAgICBpZighbmV4dENoaWxkIHx8ICFuZXh0Q2hpbGQuY2hpbGRyZW4pIGNvbnRpbnVlO1xyXG4gICAgICAvLyAgICAgbW92ZSA9IChNYXRoLmFicyhuZXh0Q2hpbGQubWlueCAtIGN1cnJlbnRDaGlsZC5tYXh4KSArIG5vZGVTaXplLncpOyBcclxuICAgICAgLy8gICAgIG1vdmVOb2RlKG5leHRDaGlsZCwgbW92ZSwgaW5kZXgrMSwgdHJ1ZSlcclxuICAgICAgLy8gICAgIGJyZWFrO1xyXG4gICAgICAvLyAgIGNhc2UgMTogLy8gcmlndGhcclxuICAgICAgLy8gICAgIG5leHRDaGlsZCA9ICBnZXRCcm90aGVyV2l0aENoaWxkcmVuKGN1cnJlbnRDaGlsZCwgaW5kZXgsIDEpOyAvL3ByUm9vdC5jaGlsZHJlbltpbmRleCsxXTtcclxuICAgICAgLy8gICAgIGlmKCFuZXh0Q2hpbGQgfHwgIW5leHRDaGlsZC5jaGlsZHJlbikgY29udGludWU7XHJcbiAgICAgIC8vICAgICBtb3ZlID0gKE1hdGguYWJzKG5leHRDaGlsZC5taW54IC0gY3VycmVudENoaWxkLm1heHgpICsgbm9kZVNpemUudyk7IFxyXG4gICAgICAvLyAgICAgbW92ZU5vZGUobmV4dENoaWxkLCBtb3ZlLCBpbmRleCsxLCB0cnVlKVxyXG4gICAgICAvLyAgICAgYnJlYWs7XHJcbiAgICAgIC8vIH1cclxuXHJcbiAgICAgIC8vIGJ1aWxkVHJlZShjdXJyZW50Q2hpbGQsIG5vZGVTaXplKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gaWYgcm9vdCB0aGVuIHB1dCByb290IGluIHRoZSBtaWRkbGVcclxuICBpZiAoIXByUm9vdC5wYXJlbnQpIHtcclxuICAgIGNvbnN0IG5vZGVzOiBJUm9vdE5vZGU8SUQzTm9kZT5bXSA9IFtdO1xyXG4gICAgY29uc3QgZ2V0Tm9kZXMgPSAocHJOb2RlOiBJUm9vdE5vZGU8SUQzTm9kZT4pID0+IHtcclxuICAgICAgbm9kZXMucHVzaChwck5vZGUpO1xyXG4gICAgICBmb3IgKGNvbnN0IGN1cnJlbnROb2RlIG9mIHByTm9kZS5jaGlsZHJlbiB8fCBbXSkge1xyXG4gICAgICAgIGdldE5vZGVzKGN1cnJlbnROb2RlKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Tm9kZXMocHJSb290KTtcclxuXHJcbiAgICBjb25zdCBtaW5YID0gbWluKG5vZGVzLm1hcChjdXJyZW50ID0+IGN1cnJlbnQueCkpO1xyXG4gICAgY29uc3QgbWF4WCA9IG1heChub2Rlcy5tYXAoY3VycmVudCA9PiBjdXJyZW50LngpKTtcclxuICAgIGNvbnN0IG1vdmVYID0gKE1hdGguYWJzKG1pblgpIC0gTWF0aC5hYnMobWF4WCkpIC8gMjtcclxuXHJcbiAgICAvL2NvbnNvbGUubG9nKCdDZW50cmFuZGluZy4uLjogJywgbW92ZVgpO1xyXG4gICAgbW92ZU5vZGUocHJSb290LmNoaWxkcmVuWzBdLCBtb3ZlWCwgMCwgdHJ1ZSk7XHJcbiAgfVxyXG5cclxufSJdfQ==