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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZDN4LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYmUtb3JnY2hhcnQvIiwic291cmNlcyI6WyJsaWIvY2xhc2Vzcy9kM3gvZDN4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBYSxNQUFNLElBQUksQ0FBQztBQUl6QyxPQUFPLEtBQUssRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBSXhELE1BQU0sQ0FBQyxJQUFNLFVBQVUsR0FBRyxVQUFDLEdBQXFDLEVBQUUsS0FBYTtJQUM3RSxrQkFBa0I7SUFDbEIsSUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDO0lBQ3JCLEtBQUssSUFBTSxHQUFHLElBQUksS0FBSyxFQUFFO1FBQ3ZCLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QixVQUFVLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDMUM7SUFDRCxPQUFPLFVBQVUsQ0FBQztBQUNwQixDQUFDLENBQUE7QUFRRCxNQUFNLENBQUMsSUFBTSxPQUFPLEdBQUcsVUFBQyxTQUEyQyxFQUFFLElBQStCO0lBQ2xHLGNBQWM7SUFDZCxLQUFLLElBQU0sR0FBRyxJQUFJLElBQUksRUFBRTtRQUN0QixJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0IsSUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQy9GLEtBQUssSUFBTSxZQUFZLElBQUksVUFBVSxDQUFDLFVBQVUsRUFBRTtZQUNoRCxJQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3pELElBQU0sU0FBUyxHQUFHLFVBQVUs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UyxDQUFDLENBQUMsQ0FBQztRQUNuRCxJQUFNLElBQUksR0FBRyxHQUFHLENBQUMsT0FBSyxDQUFDLEdBQUcsQ0FBRSxVQUFBLE9BQU8sSUFBSSxPQUFBLE9BQU8sQ0FBQyxDQUFDLEVBQVQsQ0FBUyxDQUFDLENBQUMsQ0FBQztRQUNuRCxJQUFNLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVwRCx5Q0FBeUM7UUFDekMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUM5QztBQUVILENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1heCwgbWluLCBzdW0sIHRyZWUgfSBmcm9tICdkMyc7XHJcbmltcG9ydCB7IEljb25EZWZpbml0aW9uIH0gZnJvbSAnQGZvcnRhd2Vzb21lL2ZyZWUtc29saWQtc3ZnLWljb25zJztcclxuaW1wb3J0IHsgSUQzTm9kZSwgSUljb25EZWYsIElJbWFnZURlZiB9IGZyb20gJy4vLi4vLi4vaW50ZXJmYWNlcyc7XHJcbmltcG9ydCB7IEQzTm9kZUJhc2ljUGFyc2VyIH0gZnJvbSAnLi8uLi9AaXRlbXMnO1xyXG5pbXBvcnQgKiBhcyBmYSBmcm9tICdAZm9ydGF3ZXNvbWUvZnJlZS1zb2xpZC1zdmctaWNvbnMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQXR0cnMgeyBbaW5kZXg6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB9XHJcblxyXG5leHBvcnQgY29uc3QgYXBwbHlBdHRycyA9IChzZWw6IGQzLlNlbGVjdGlvbjxhbnksIGFueSwgYW55LCBhbnk+LCBhdHRyczogSUF0dHJzKSA9PiB7XHJcbiAgLy8gYXBwbHlpbmcgIGF0dHJzXHJcbiAgbGV0IGN1cnJlbnRTZWwgPSBzZWw7XHJcbiAgZm9yIChjb25zdCBrZXkgaW4gYXR0cnMpIHtcclxuICAgIGNvbnN0IHZhbHVlID0gYXR0cnNba2V5XTtcclxuICAgIGN1cnJlbnRTZWwgPSBjdXJyZW50U2VsLmF0dHIoa2V5LCB2YWx1ZSk7XHJcbiAgfVxyXG4gIHJldHVybiBjdXJyZW50U2VsO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElEZWYge1xyXG4gIHR5cGU6IHN0cmluZztcclxuICBhdHRyczogSUF0dHJzO1xyXG4gIGNvbXBvbmVudHM/OiB7IFtpbmRleDogc3RyaW5nXTogSURlZiB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBhZGREZWZzID0gKGNvbnRhaW5lcjogZDMuU2VsZWN0aW9uPGFueSwgYW55LCBhbnksIGFueT4sIGRlZnM6IHsgW2luZGV4OiBzdHJpbmddOiBJRGVmIH0pID0+IHtcclxuICAvLyBhZGRpbmcgZGVmc1xyXG4gIGZvciAoY29uc3Qga2V5IGluIGRlZnMpIHtcclxuICAgIGNvbnN0IGN1cnJlbnREZWYgPSBkZWZzW2tleV07XHJcbiAgICBjb25zdCBwYXR0ZXJuID0gYXBwbHlBdHRycyhjb250YWluZXIuYXBwZW5kKGN1cnJlbnREZWYudHlwZSkuYXR0cignaWQnLCBrZXkpLCBjdXJyZW50RGVmLmF0dHJzKVxyXG4gICAgZm9yIChjb25zdCBjb21wb25lbnRLZXkgaW4gY3VycmVudERlZi5jb21wb25lbnRzKSB7XHJcbiAgICAgIGNvbnN0IGNvbXBvbmVudERlZiA9IGN1cnJlbnREZWYuY29tcG9uZW50c1tjb21wb25lbnRLZXldO1xyXG4gICAgICBjb25zdCBjb21wb25lbnQgPSBhcHBseUF0dHJzKFxyXG4gICAgICAgIHBhdHRlcm4uYXBwZW5kKGNvbXBvbmVudERlZi50eXBlKSxcclxuICAgICAgICBjb21wb25lbnREZWYuYXR0cnNcclxuICAgICAgKVxyXG4gICAgICBpZiAoY29tcG9uZW50RGVmLmNvbXBvbmVudHMpIGFkZERlZnMoY29tcG9uZW50LCBjb21wb25lbnREZWYuY29tcG9uZW50cyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY2FsY0ljb25HVHJhbnNmb3JtID0gKHBySWNvbjogSWNvbkRlZmluaXRpb24sIHByU2NhbGU6IG51bWJlcik6IHN0cmluZyA9PiB7XHJcbiAgLy9kZWZpbmluZyB2YXJpYWJsZXNcclxuICBsZXQgdHJhc2xhdGVYOiBudW1iZXIgPSAwO1xyXG4gIGxldCB0cmFzbGF0ZVk6IG51bWJlciA9IDA7XHJcbiAgbGV0IHNjYWxlOiBudW1iZXIgPSAxO1xyXG4gIHByU2NhbGUgPSBwclNjYWxlIHx8IDE7XHJcblxyXG4gIGNvbnN0IGljb25XaWR0aDogbnVtYmVyID0gK3BySWNvbi5pY29uWzBdO1xyXG4gIGNvbnN0IGljb25IZWlnaHQ6IG51bWJlciA9ICtwckljb24uaWNvblsxXTtcclxuXHJcbiAgaWYgKChpY29uV2lkdGggPiBpY29uSGVpZ2h0KSB8fCAoaWNvbldpZHRoID09IGljb25IZWlnaHQpKSB7IC8vIGlmIHdpZHRoID4gaGVpZ2h0IG9yIGVxdWFsXHJcbiAgICBzY2FsZSA9ICgxIC8gaWNvbldpZHRoKTtcclxuICAgIGNvbnN0IG1hcmdpbiA9IChpY29uV2lkdGggLSBpY29uSGVpZ2h0KSAvIDI7XHJcbiAgICB0cmFzbGF0ZVkgPSBtYXJnaW4gKiBzY2FsZTtcclxuICAgIGlmIChwclNjYWxlICE9IDEpIHtcclxuICAgICAgdHJhc2xhdGVZICs9ICgoaWNvbkhlaWdodCAqIHNjYWxlKSAtIChpY29uSGVpZ2h0ICogc2NhbGUgKiBwclNjYWxlKSkgLyAyO1xyXG4gICAgICB0cmFzbGF0ZVggPSAoMSAtIHByU2NhbGUpIC8gMjtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgc2NhbGUgPSAoMSAvIGljb25IZWlnaHQpO1xyXG4gICAgY29uc3QgbWFyZ2luID0gKGljb25IZWlnaHQgLSBpY29uV2lkdGgpIC8gMjtcclxuICAgIHRyYXNsYXRlWCA9IG1hcmdpbiAqIHNjYWxlO1xyXG4gICAgaWYgKHByU2NhbGUgIT0gMSkge1xyXG4gICAgICB0cmFzbGF0ZVggKz0gKChpY29uV2lkdGggKiBzY2FsZSkgLSAoaWNvbldpZHRoICogc2NhbGUgKiBwclNjYWxlKSkgLyAyO1xyXG4gICAgICB0cmFzbGF0ZVkgPSAoMSAtIHByU2NhbGUpIC8gMjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBgdHJhbnNsYXRlKCR7dHJhc2xhdGVYfSwgJHt0cmFzbGF0ZVl9KSBzY2FsZSgke3NjYWxlICogcHJTY2FsZX0pYDtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGNhbGNHRml0ID0gKFxyXG4gIHByRzogZDMuU2VsZWN0aW9uPFNWR0dFbGVtZW50LCBhbnksIGFueSwgYW55PixcclxuICBwckNvbnRhaW5lcjogZDMuU2VsZWN0aW9uPFNWR0VsZW1lbnQsIGFueSwgYW55LCBhbnk+LFxyXG4gIHByUm9vdDogZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+LFxyXG4gIHByTm9kZVBhcnNlcjogRDNOb2RlQmFzaWNQYXJzZXIsXHJcbiAgcHJQYWRkaW5nOiBudW1iZXIgPSA1MFxyXG4pID0+IHtcclxuICAvL2RlZmluaW5nIHZhcmlhYmxlc1xyXG4gIGNvbnN0IGNXaWR0aDogbnVtYmVyID0gcHJDb250YWluZXIubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xyXG4gIGNvbnN0IGNIZWlnaHQ6IG51bWJlciA9IHByQ29udGFpbmVyLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XHJcbiAgY29uc3QgZ1dpZHRoOiBudW1iZXIgPSBwckcubm9kZSgpLmdldEJCb3goKS53aWR0aDsgLy8gYWRkaW5nIG1hcmdpblxyXG4gIGNvbnN0IGdIZWlnaHQ6IG51bWJlciA9IHByRy5ub2RlKCkuZ2V0QkJveCgpLmhlaWdodDsgLy8gYWRkaW5nIG1hcmdpblxyXG5cclxuICBjb25zdCBzY2FsZSA9IG1pbihbKGNIZWlnaHQgLyAoZ0hlaWdodCArIHByUGFkZGluZykpLCAoY1dpZHRoIC8gKGdXaWR0aCArIHByUGFkZGluZykpXSk7XHJcblxyXG4gIGNvbnN0IG1pblggPSBNYXRoLmFicyhtaW4ocHJSb290LmRlc2NlbmRhbnRzKCkubWFwKGN1cnJlbnQgPT4gY3VycmVudC54KSkgLSAocHJOb2RlUGFyc2VyLndpZHRoIC8gMikpO1xyXG4gIGNvbnN0IG1heFggPSBtYXgocHJSb290LmRlc2NlbmRhbnRzKCkubWFwKGN1cnJlbnQgPT4gY3VycmVudC54KSkgKyAocHJOb2RlUGFyc2VyLndpZHRoIC8gMik7XHJcblxyXG4gIGNvbnN0IGNlbnRlclggPSBjV2lkdGggLyAyO1xyXG5cclxuICBjb25zdCBjdXJyZW50eCA9IGNlbnRlclggKyAoKChtaW5YIC0gbWF4WCkgKiBzY2FsZSkgLyAyKTtcclxuICBjb25zdCBjdXJyZW50eSA9ICgoY0hlaWdodCAtIChnSGVpZ2h0ICogc2NhbGUpKSAvIDIpO1xyXG4gIC8vIGNvbnNvbGUubG9nKGBNaW4gWDogJHttaW5YfSAtIE1heCBYOiAke21heFh9IC0gZGlmZjogJHttaW5YIC0gbWF4WH0gLSBjZW50ZXI6ICR7Y3VycmVudHh9IC0gZyBzY2xhZTogJHtnU2NhbGV9YClcclxuICByZXR1cm4geyBzY2FsZTogc2NhbGUsIHk6IGN1cnJlbnR5LCB4OiBjdXJyZW50eCB9O1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgYWRkRGVmYXVsdERlZnMgPSAoY29udGFpbmVyOiBkMy5TZWxlY3Rpb248YW55LCBhbnksIGFueSwgYW55PiwgZGVmczogeyBbaW5kZXg6IHN0cmluZ106IElJY29uRGVmIHwgSUltYWdlRGVmIH0sIHByTm9kZVBhcnNlcjogRDNOb2RlQmFzaWNQYXJzZXIpID0+IHtcclxuICAvLyBhZGRpbmcgZGVmc1xyXG4gIGZvciAoY29uc3Qga2V5IGluIGRlZnMpIHtcclxuICAgIGNvbnN0IGN1cnJlbnREZWYgPSBkZWZzW2tleV07XHJcbiAgICAvLyBjcmVhdGluZyBwYXR0ZXJuXHJcbiAgICBjb25zdCBwYXR0ZXJuID0gY29udGFpbmVyLmFwcGVuZCgncGF0dGVybicpO1xyXG4gICAgc2V0UGF0dGVybihwYXR0ZXJuLCB7IG5vZGVJZDoga2V5LCBub2RlSW1hZ2U6IGN1cnJlbnREZWYgfSwgcHJOb2RlUGFyc2VyKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgY29uc3QgYWRkRmFJY29uRGVmcyA9IChjb250YWluZXI6IGQzLlNlbGVjdGlvbjxhbnksIGFueSwgYW55LCBhbnk+LCBkZWZzOiB7IFtpbmRleDogc3RyaW5nXTogSUljb25EZWYgfSkgPT4ge1xyXG4gIC8vIGFkZGluZyBkZWZzXHJcbiAgZm9yIChjb25zdCBrZXkgaW4gZGVmcykge1xyXG4gICAgY29uc3QgY3VycmVudERlZiA9IGRlZnNba2V5XTtcclxuXHJcbiAgICBjdXJyZW50RGVmLnNjYWxlID0gY3VycmVudERlZi5zY2FsZSB8fCAxO1xyXG5cclxuICAgIC8vIGNyZWF0aW5nIHBhdHRlcm5cclxuICAgIGNvbnN0IHBhdHRlcm4gPSBhcHBseUF0dHJzKFxyXG4gICAgICBjb250YWluZXIuYXBwZW5kKCdwYXR0ZXJuJykuYXR0cignaWQnLCBrZXkpLFxyXG4gICAgICB7XHJcbiAgICAgICAgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScsIHBhdHRlcm5Db250ZW50VW5pdHM6ICdvYmplY3RCb3VuZGluZ0JveCdcclxuICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICAvLyBjcmVhdGluZyByZWN0XHJcbiAgICBjb25zdCBmYUljb24gPSBmYVtjdXJyZW50RGVmLm5hbWVdO1xyXG5cclxuICAgIC8vIGNyZWF0aW5nIGdcclxuICAgIGNvbnN0IGcgPSBhcHBseUF0dHJzKHBhdHRlcm4uYXBwZW5kKCdnJyksIHtcclxuICAgICAgdHJhbnNmb3JtOiBjYWxjSWNvbkdUcmFuc2Zvcm0oZmFJY29uLCBjdXJyZW50RGVmLnNjYWxlKSxcclxuICAgICAgZmlsbDogY3VycmVudERlZi5jb2xvclxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3Qgc2lkZVNpemUgPSBtYXgoWytmYUljb24uaWNvblswXSwgK2ZhSWNvbi5pY29uWzFdXSkgLyBjdXJyZW50RGVmLnNjYWxlO1xyXG4gICAgYXBwbHlBdHRycyhnLmFwcGVuZCgncmVjdCcpLCB7XHJcbiAgICAgIGZpbGw6IGN1cnJlbnREZWYuYmFja2dyb3VuZENvbG9yLFxyXG4gICAgICB4OiAtc2lkZVNpemUgLyAzLFxyXG4gICAgICB5OiAtc2lkZVNpemUgLyAzLFxyXG4gICAgICB3aWR0aDogKHNpZGVTaXplICogMyksXHJcbiAgICAgIGhlaWdodDogKHNpZGVTaXplICogMylcclxuICAgIH0pXHJcblxyXG4gICAgLy8gY3JlYXRpbmcgcGF0aFxyXG4gICAgYXBwbHlBdHRycyhnLmFwcGVuZCgncGF0aCcpLCB7XHJcbiAgICAgIGQ6IGZhSWNvbi5pY29uWzRdIGFzIHN0cmluZ1xyXG4gICAgfSlcclxuXHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBpbWFnZUxpbmsgPSAobm9kZUltYWdlOiBJSW1hZ2VEZWYpID0+IHtcclxuICBpZiAobm9kZUltYWdlICYmIG5vZGVJbWFnZS50eXBlID09ICdsaW5rJykgcmV0dXJuIG5vZGVJbWFnZS5kYXRhO1xyXG4gIGlmIChub2RlSW1hZ2UgJiYgbm9kZUltYWdlLnR5cGUgPT0gJ2Jhc2U2NCcpIHJldHVybiBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LCR7bm9kZUltYWdlLmRhdGF9YDtcclxuICByZXR1cm4gJyc7XHJcbn1cclxuXHJcbmNvbnN0IGZhSWNvbiA9IChkOiBJSWNvbkRlZikgPT4ge1xyXG4gIGlmICghZCB8fCAhKGQudHlwZSA9PSAnaWNvbicpKSByZXR1cm4gbnVsbDtcclxuICBjb25zdCBpY29uOiBJY29uRGVmaW5pdGlvbiA9IGZhW2QubmFtZV07XHJcbiAgcmV0dXJuIGljb247XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRQYXR0ZXJuID0gKHByUGF0dGVybjogZDMuU2VsZWN0aW9uPGFueSwgYW55LCBhbnksIGFueT4sIHByTm9kZURhdGE6IFBhcnRpYWw8SUQzTm9kZT4sIHByTm9kZVBhcnNlcjogRDNOb2RlQmFzaWNQYXJzZXIpID0+IHtcclxuICAvLyBjb25maWd1cmluIHBhdHRlcm5cclxuICBjb25zdCBsaW5rID0gaW1hZ2VMaW5rKHByTm9kZURhdGEubm9kZUltYWdlIGFzIElJbWFnZURlZik7XHJcbiAgaWYgKGxpbmsgIT0gJycpIHtcclxuICAgIHByUGF0dGVyblxyXG4gICAgICAuYXR0cignaWQnLCBgaW1nLSR7cHJOb2RlRGF0YS5ub2RlSWR9YClcclxuICAgICAgLmF0dHIoJ3dpZHRoJywgMSlcclxuICAgICAgLmF0dHIoJ2hlaWdodCcsIDEpXHJcbiAgICAgIC5hcHBlbmQoJ2ltYWdlJylcclxuICAgICAgLmF0dHIoJ3hsaW5rOmhyZWYnLCBsaW5rKVxyXG4gICAgICAuYXR0cignd2lkdGgnLCBwck5vZGVQYXJzZXIuaW1hZ2VEZWZzLncpXHJcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCBwck5vZGVQYXJzZXIuaW1hZ2VEZWZzLmgpXHJcbiAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaWRZTWluIHNsaWNlJyk7XHJcbiAgICByZXR1cm47IC8vIGV4aXQgYmVjYXVzZSBpbWFnZSBpcyBwcmlvcml0eVxyXG4gIH1cclxuXHJcbiAgY29uc3QgaWNvbiA9IGZhSWNvbihwck5vZGVEYXRhLm5vZGVJbWFnZSBhcyBJSWNvbkRlZik7XHJcbiAgaWYgKGljb24pIHtcclxuICAgIGNvbnN0IGljb25EZWY6IElJY29uRGVmID0gcHJOb2RlRGF0YS5ub2RlSW1hZ2UgYXMgSUljb25EZWY7XHJcbiAgICBhcHBseUF0dHJzKHByUGF0dGVybiwge1xyXG4gICAgICBpZDogYGltZy0ke3ByTm9kZURhdGEubm9kZUlkfWAsXHJcbiAgICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAgICBwYXR0ZXJuQ29udGVudFVuaXRzOiAnb2JqZWN0Qm91bmRpbmdCb3gnXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBjcmVhdGluZyBnXHJcbiAgICBjb25zdCBnID0gYXBwbHlBdHRycyhwclBhdHRlcm4uYXBwZW5kKCdnJyksIHtcclxuICAgICAgdHJhbnNmb3JtOiBjYWxjSWNvbkdUcmFuc2Zvcm0oaWNvbiwgaWNvbkRlZi5zY2FsZSB8fCAwLjgpLFxyXG4gICAgICBmaWxsOiBpY29uRGVmLmNvbG9yIHx8ICd3aGl0ZSdcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIGNyZWF0aW5nIHJlY3RcclxuICAgIGNvbnN0IHNpZGVTaXplID0gbWF4KFsraWNvbi5pY29uWzBdLCAraWNvbi5pY29uWzFdXSk7XHJcbiAgICBhcHBseUF0dHJzKGcuYXBwZW5kKCdyZWN0JyksIHtcclxuICAgICAgZmlsbDogaWNvbkRlZi5iYWNrZ3JvdW5kQ29sb3IgfHwgJyMwNzRFRjMnLFxyXG4gICAgICB4OiAtc2lkZVNpemUgLyAyLFxyXG4gICAgICB5OiAtc2lkZVNpemUgLyAyLFxyXG4gICAgICB3aWR0aDogKHNpZGVTaXplICogMiksXHJcbiAgICAgIGhlaWdodDogKHNpZGVTaXplICogMilcclxuICAgIH0pXHJcblxyXG4gICAgLy8gY3JlYXRpbmcgcGF0aFxyXG4gICAgYXBwbHlBdHRycyhnLmFwcGVuZCgncGF0aCcpLCB7XHJcbiAgICAgIGQ6IGljb24uaWNvbls0XSBhcyBzdHJpbmdcclxuICAgIH0pXHJcblxyXG4gICAgcmV0dXJuOyAvLyBleGl0IGJlY2F1c2UgaWNvbiBpcyBzZWNvbmQgcHJpb3JpdHlcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBvc2l0aW9uIHtcclxuICB4OiBudW1iZXI7XHJcbiAgeTogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElTaXplIHtcclxuICB3OiBudW1iZXI7XHJcbiAgaDogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElNYXhNaW5YIHtcclxuICBtaW54OiBudW1iZXI7XHJcbiAgbWF4eDogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElSb290Tm9kZTxUPiBleHRlbmRzIGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxUPiB7XHJcbiAgY2hpbGRyZW5XaWR0aD86IG51bWJlcjtcclxuICBtaW54PzogbnVtYmVyO1xyXG4gIG1heHg/OiBudW1iZXI7XHJcbiAgbGlua0RpcmVjdGlvbj86ICd0b3AnIHwgJ2xlZnQnIHwgJ3JpZ2h0JztcclxufSBcclxuXHJcblxyXG5leHBvcnQgY29uc3QgbGFzdENoaWRyZW5MZXZlbCA9IChwclJvb3Q6IElSb290Tm9kZTxJRDNOb2RlPik6IGJvb2xlYW4gPT4ge1xyXG4gIGZvciAoY29uc3QgY3VycmVudCBvZiBwclJvb3QuY2hpbGRyZW4pIHtcclxuICAgIGlmKGN1cnJlbnQuY2hpbGRyZW4pIHJldHVybiBmYWxzZTtcclxuICB9XHJcbiAgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgY29uc3QgYnVpbGRUcmVlID0gKHByUm9vdDogSVJvb3ROb2RlPElEM05vZGU+LCBub2RlU2l6ZTogSVNpemUpID0+IHtcclxuICBpZighcHJSb290LmNoaWxkcmVuIHx8ICFwclJvb3QuY2hpbGRyZW4ubGVuZ3RoKSByZXR1cm47XHJcblxyXG4gIC8vI3JlZ2lvbiBsb2NhbCBGdW5jdGlvbnNcclxuICBjb25zdCBzZXRDaGlsZHJlblBvcyA9IChwck5vZGU6IElSb290Tm9kZTxJRDNOb2RlPiwgbm9kZVNpemU6IElTaXplKSA9PiB7XHJcbiAgICBwck5vZGUubWlueCA9IHByTm9kZS54O1xyXG4gICAgcHJOb2RlLm1heHggPSBwck5vZGUueDtcclxuXHJcbiAgICBpZighcHJOb2RlLmNoaWxkcmVuKSByZXR1cm47XHJcbiAgICBcclxuICAgIGxldCBzdGFydGluZ1ggPSBwck5vZGUueCAtICgocHJOb2RlLmNoaWxkcmVuLmxlbmd0aCAtIDEpIC8gMikgKiBub2RlU2l6ZS53O1xyXG4gICAgcHJOb2RlLm1pbng9IHN0YXJ0aW5nWDtcclxuXHJcbiAgICBjb25zdCBsYXN0TGV2ZWwgPSBsYXN0Q2hpZHJlbkxldmVsKHByTm9kZSk7XHJcbiAgICBcclxuICAgIGxldCBkaXN0cmlidXRpb24gPSBwck5vZGUuZGF0YS5jaGlsZHJlbkRpc3Q7XHJcbiAgICBpZighbGFzdExldmVsKSBkaXN0cmlidXRpb24gPSBcImhvcml6b250YWxcIjtcclxuICAgIFxyXG4gICAgc3dpdGNoKGRpc3RyaWJ1dGlvbikge1xyXG4gICAgICBjYXNlIFwidmVydGljYWxcIjpcclxuICAgICAgICBzdGFydGluZ1ggPSBwck5vZGUueCAtIG5vZGVTaXplLncgLyAyO1xyXG4gICAgICAgIHByTm9kZS5taW54PSBzdGFydGluZ1g7XHJcbiAgICAgICAgcHJOb2RlLm1heHggPSBzdGFydGluZ1ggKyBub2RlU2l6ZS53O1xyXG4gICAgICAgIGxldCBsZXZlbCA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHByTm9kZS5jaGlsZHJlbi5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgIGNvbnN0IGN1cnJlbnRDaGlsZCA9IHByTm9kZS5jaGlsZHJlbltpbmRleF07XHJcbiAgICAgICAgICBjdXJyZW50Q2hpbGQueCA9IHN0YXJ0aW5nWDtcclxuICAgICAgICAgIHN0YXJ0aW5nWCArPSBub2RlU2l6ZS53O1xyXG4gICAgICAgICAgY3VycmVudENoaWxkLmxpbmtEaXJlY3Rpb24gPSAncmlnaHQnO1xyXG4gICAgICAgICAgY3VycmVudENoaWxkLnkgPSAoY3VycmVudENoaWxkLmRlcHRoICsgbGV2ZWwpICogbm9kZVNpemUuaCA7XHJcbiAgICAgICAgICBpZihpbmRleCAlIDIgPT0gMSkgeyBcclxuICAgICAgICAgICAgY3VycmVudENoaWxkLmxpbmtEaXJlY3Rpb24gPSAnbGVmdCc7XHJcbiAgICAgICAgICAgIHN0YXJ0aW5nWCA9IHByTm9kZS54IC0gbm9kZVNpemUudyAvIDI7XHJcbiAgICAgICAgICAgIGxldmVsKys7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSAgICAgICAgICAgXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgXCJob3Jpem9udGFsXCI6XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgZm9yIChjb25zdCBjdXJyZW50Q2hpbGQgb2YgcHJOb2RlLmNoaWxkcmVuIHx8IFtdKSB7XHJcbiAgICAgICAgICBjdXJyZW50Q2hpbGQueCA9IHN0YXJ0aW5nWDtcclxuICAgICAgICAgIHByTm9kZS5tYXh4ID0gc3RhcnRpbmdYO1xyXG4gICAgICAgICAgc3RhcnRpbmdYICs9IG5vZGVTaXplLnc7XHJcbiAgICAgICAgICBjdXJyZW50Q2hpbGQubGlua0RpcmVjdGlvbiA9ICd0b3AnO1xyXG4gICAgICAgICAgY3VycmVudENoaWxkLnkgPSBjdXJyZW50Q2hpbGQuZGVwdGggKiBub2RlU2l6ZS5oO1xyXG4gICAgICAgICAgc2V0Q2hpbGRyZW5Qb3MoY3VycmVudENoaWxkLCBub2RlU2l6ZSk7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcblxyXG5cclxuICB9XHJcblxyXG4gIGNvbnN0IG1vdmVOb2RlID0gKHByTm9kZTogSVJvb3ROb2RlPElEM05vZGU+LCBtb3ZleDogbnVtYmVyLCBwb3NpdGlvbk9uUGFyZW50OiBudW1iZXIsIG1vdmVCcm90aGVyczogYm9vbGVhbikgPT4ge1xyXG4gICAgaWYobW92ZXggPT0gMCkgcmV0dXJuO1xyXG5cclxuICAgIHByTm9kZS5taW54ICs9IG1vdmV4O1xyXG4gICAgcHJOb2RlLm1heHggKz0gbW92ZXg7XHJcbiAgICBwck5vZGUueCArPSBtb3ZleDtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdNb3Zpbmc6ICcsIHByTm9kZS5kYXRhLm5vZGVJZCwgbW92ZXgpXHJcbiAgICAvLyBpZighcHJOb2RlLmNoaWxkcmVuKSByZXR1cm47XHJcblxyXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IChwck5vZGUuY2hpbGRyZW4gfHwgW10pLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICBjb25zdCBjdXJyZW50Q2hpbGQgPSBwck5vZGUuY2hpbGRyZW5baW5kZXhdXHJcbiAgICAgIC8vIGN1cnJlbnRDaGlsZC54ICs9IG1vdmV4O1xyXG4gICAgICBtb3ZlTm9kZShjdXJyZW50Q2hpbGQsIG1vdmV4LCBpbmRleCwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIG1vdmluZyBicm90aGVyc1xyXG4gICAgaWYoIW1vdmVCcm90aGVycykgcmV0dXJuO1xyXG4gICAgaWYoIXByTm9kZS5wYXJlbnQpIHJldHVybjtcclxuICAgIGNvbnN0IG5leHRUb01vdmUgPSBwck5vZGUucGFyZW50LmNoaWxkcmVuW3Bvc2l0aW9uT25QYXJlbnQgKyAxXTtcclxuICAgIGlmKG5leHRUb01vdmUpIG1vdmVOb2RlKG5leHRUb01vdmUsIG1vdmV4LCBwb3NpdGlvbk9uUGFyZW50ICsgMSwgdHJ1ZSk7XHJcbiAgfVxyXG4gIC8vI2VuZHJlZ2lvbiBsb2NhbCBGdW5jdGlvbnNcclxuXHJcbiAgLy8gc2V0dGluZyB0aGUgZmlyc3QgeCAvIHkgcG9zaXRpb25cclxuICBzZXRDaGlsZHJlblBvcyhwclJvb3QsIG5vZGVTaXplKTtcclxuXHJcbiAgY29uc3QgZ2V0cmVsYXRpdmVQb3NpdGlvbiA9IChjdXJyZW50OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKSA6IG51bWJlciA9PiB7XHJcbiAgICBjb25zdCBpbmNyZW1lbnQgPSAxIC8gbGVuZ3RoO1xyXG4gICAgY29uc3QgcG9zID0gaW5jcmVtZW50ICogY3VycmVudDtcclxuXHJcbiAgICBpZihpbmNyZW1lbnQgPT0gMSkgcmV0dXJuIDA7IC8vIG1pZGRsZVxyXG4gICAgaWYocG9zID09IDEpIHJldHVybiAxOyAvLyBtaWRkbGVcclxuICAgIGlmKHBvcyA8PSAwLjUpIHJldHVybiAtMTsgLy8gbGVmdFxyXG4gICAgY29uc3QgcHJldlBvcyA9IGluY3JlbWVudCAtIChjdXJyZW50IC0xKTsgLy8gbGVmdFxyXG4gICAgaWYocG9zID49IDAuNSAmJiBwcmV2UG9zIDw9IDAuNSApIHJldHVybiAwOyAvLyBtaWRkbGVcclxuXHJcbiAgICByZXR1cm4gMTsgLy8gcmlnaHQgICAgXHJcbiAgfVxyXG5cclxuICBjb25zdCBnZXROZXh0Tm9kZVdpdGhDaGlsZHJlbiA9IChwck5vZGU6IElSb290Tm9kZTxJRDNOb2RlPiwgcG9zaXRpb25PblBhcmVudDogbnVtYmVyICkgPT4ge1xyXG4gICAgZm9yIChsZXQgaW5kZXggPSBwb3NpdGlvbk9uUGFyZW50OyBpbmRleCA8IHByTm9kZS5wYXJlbnQuY2hpbGRyZW4ubGVuZ3RoOyBpbmRleCArKykge1xyXG4gICAgICBjb25zdCBjaGlsZCA9IHByTm9kZS5wYXJlbnQuY2hpbGRyZW5baW5kZXhdO1xyXG4gICAgICBpZihjaGlsZC5jaGlsZHJlbikgcmV0dXJuIHtcclxuICAgICAgICBpbmRleDogaW5kZXgsIFxyXG4gICAgICAgIG5vZGU6IGNoaWxkXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGluZGV4OiAtMSxcclxuICAgICAgbm9kZTogbnVsbFxyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIC8vYW5hbGl6YW1vcyBsYXMgcG9zaWNpb25lcyB5IGNvcnJlbW9zIGRlIHNlciBuZWNlc2FyaW9cclxuICBsZXQgbGFzdFg6IHsgZGVmaW5lZDogYm9vbGVhbiwgeDogbnVtYmVyIH0gPSB7IGRlZmluZWQ6IGZhbHNlLCB4OiAwIH07XHJcbiAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHByUm9vdC5jaGlsZHJlbi5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgIGNvbnN0IGN1cnJlbnRDaGlsZCA9IHByUm9vdC5jaGlsZHJlbltpbmRleF07XHJcbiAgIFxyXG4gICAgaWYoY3VycmVudENoaWxkLmNoaWxkcmVuKSB7XHJcbiAgICAgIC8vIGJlZm9yZSBhbnl0aGluZ1xyXG4gICAgICBidWlsZFRyZWUoY3VycmVudENoaWxkLCBub2RlU2l6ZSlcclxuXHJcbiAgICAgIGlmKCFsYXN0WC5kZWZpbmVkIHx8IGN1cnJlbnRDaGlsZC5tYXh4ID4gbGFzdFgueCkge1xyXG4gICAgICAgIGxhc3RYLmRlZmluZWQgPSB0cnVlO1xyXG4gICAgICAgIGxhc3RYLnggPSBjdXJyZW50Q2hpbGQubWF4eDsgICAgICBcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgcG9zaXRpb24gPSBnZXRyZWxhdGl2ZVBvc2l0aW9uKGluZGV4ICsgMSwgcHJSb290LmNoaWxkcmVuLmxlbmd0aClcclxuICAgICAgLy8gdG8gdGhlIGxlZnRcclxuICAgICAgY29uc3QgbmV4dENoaWxkOiB7IGluZGV4OiBudW1iZXIsIG5vZGU6IElSb290Tm9kZTxJRDNOb2RlPiB9ID0gIGdldE5leHROb2RlV2l0aENoaWxkcmVuKGN1cnJlbnRDaGlsZCwgaW5kZXggKyAxKTsgLy9wclJvb3QuY2hpbGRyZW5baW5kZXgrMV07XHJcbiAgICAgIGlmKCFuZXh0Q2hpbGQubm9kZSkgY29udGludWU7XHJcbiAgICAgIGxldCBtb3ZlOiBudW1iZXI7XHJcbiAgICAgIGlmKG5leHRDaGlsZC5ub2RlLm1pbnggPCAobGFzdFgueCArIG5vZGVTaXplLncpKSB7ICBcclxuICAgICAgICBtb3ZlID0gKGxhc3RYLnggKyBub2RlU2l6ZS53KSAtIG5leHRDaGlsZC5ub2RlLm1pbng7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coYE5PREU6ICR7Y3VycmVudENoaWxkLmRhdGEubm9kZUlkfSAtPiAke21vdmV9YClcclxuICAgICAgICBtb3ZlTm9kZShuZXh0Q2hpbGQubm9kZSwgbW92ZSwgbmV4dENoaWxkLmluZGV4LCB0cnVlKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyAvLyBsZXQgcHJldkNoaWxkOiBJUm9vdE5vZGU8SUQzTm9kZT4sIG5leHRDaGlsZDogSVJvb3ROb2RlPElEM05vZGU+O1xyXG4gICAgICAvLyBzd2l0Y2gocG9zaXRpb24pIHtcclxuICAgICAgLy8gICBjYXNlIC0xOiAvLyBsZWZ0XHJcbiAgICAgIC8vICAgICBwcmV2Q2hpbGQgPSBwclJvb3QuY2hpbGRyZW5baW5kZXgtMV07XHJcbiAgICAgIC8vICAgICBpZighcHJldkNoaWxkIHx8ICFwcmV2Q2hpbGQuY2hpbGRyZW4pIGNvbnRpbnVlO1xyXG4gICAgICAvLyAgICAgbW92ZSA9IChNYXRoLmFicyhjdXJyZW50Q2hpbGQubWlueCAtIHByZXZDaGlsZC5tYXh4KSArIG5vZGVTaXplLncpICogLTE7IFxyXG4gICAgICAvLyAgICAgbW92ZU5vZGUocHJldkNoaWxkLCBtb3ZlLCBpbmRleC0xLCB0cnVlKSAgIFxyXG4gICAgICAvLyAgICAgYnJlYWs7XHJcbiAgICAgIC8vICAgY2FzZSAwOiAvLyBjZW50ZXJcclxuICAgICAgLy8gICAgIHByZXZDaGlsZCA9IHByUm9vdC5jaGlsZHJlbltpbmRleC0xXTtcclxuICAgICAgLy8gICAgIGlmKHByZXZDaGlsZCAmJiBwcmV2Q2hpbGQuY2hpbGRyZW4pIHtcclxuICAgICAgLy8gICAgICAgbW92ZSA9IChNYXRoLmFicyhjdXJyZW50Q2hpbGQubWlueCAtIHByZXZDaGlsZC5tYXh4KSArIG5vZGVTaXplLncpICogLTE7IFxyXG4gICAgICAvLyAgICAgICBtb3ZlTm9kZShwcmV2Q2hpbGQsIG1vdmUsIGluZGV4LTEsIHRydWUpICAgXHJcbiAgICAgIC8vICAgICB9XHJcblxyXG4gICAgICAvLyAgICAgbmV4dENoaWxkID0gcHJSb290LmNoaWxkcmVuW2luZGV4KzFdO1xyXG4gICAgICAvLyAgICAgaWYoIW5leHRDaGlsZCB8fCAhbmV4dENoaWxkLmNoaWxkcmVuKSBjb250aW51ZTtcclxuICAgICAgLy8gICAgIG1vdmUgPSAoTWF0aC5hYnMobmV4dENoaWxkLm1pbnggLSBjdXJyZW50Q2hpbGQubWF4eCkgKyBub2RlU2l6ZS53KTsgXHJcbiAgICAgIC8vICAgICBtb3ZlTm9kZShuZXh0Q2hpbGQsIG1vdmUsIGluZGV4KzEsIHRydWUpXHJcbiAgICAgIC8vICAgICBicmVhaztcclxuICAgICAgLy8gICBjYXNlIDE6IC8vIHJpZ3RoXHJcbiAgICAgIC8vICAgICBuZXh0Q2hpbGQgPSAgZ2V0QnJvdGhlcldpdGhDaGlsZHJlbihjdXJyZW50Q2hpbGQsIGluZGV4LCAxKTsgLy9wclJvb3QuY2hpbGRyZW5baW5kZXgrMV07XHJcbiAgICAgIC8vICAgICBpZighbmV4dENoaWxkIHx8ICFuZXh0Q2hpbGQuY2hpbGRyZW4pIGNvbnRpbnVlO1xyXG4gICAgICAvLyAgICAgbW92ZSA9IChNYXRoLmFicyhuZXh0Q2hpbGQubWlueCAtIGN1cnJlbnRDaGlsZC5tYXh4KSArIG5vZGVTaXplLncpOyBcclxuICAgICAgLy8gICAgIG1vdmVOb2RlKG5leHRDaGlsZCwgbW92ZSwgaW5kZXgrMSwgdHJ1ZSlcclxuICAgICAgLy8gICAgIGJyZWFrO1xyXG4gICAgICAvLyB9XHJcblxyXG4gICAgICAvLyBidWlsZFRyZWUoY3VycmVudENoaWxkLCBub2RlU2l6ZSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGlmIHJvb3QgdGhlbiBwdXQgcm9vdCBpbiB0aGUgbWlkZGxlXHJcbiAgaWYoIXByUm9vdC5wYXJlbnQpIHtcclxuICAgIGNvbnN0IG5vZGVzOiBJUm9vdE5vZGU8SUQzTm9kZT5bXSA9IFtdO1xyXG4gICAgY29uc3QgZ2V0Tm9kZXMgPSAocHJOb2RlOiBJUm9vdE5vZGU8SUQzTm9kZT4pID0+IHtcclxuICAgICAgbm9kZXMucHVzaChwck5vZGUpO1xyXG4gICAgICBmb3IgKGNvbnN0IGN1cnJlbnROb2RlIG9mIHByTm9kZS5jaGlsZHJlbiB8fCBbXSkge1xyXG4gICAgICAgIGdldE5vZGVzKGN1cnJlbnROb2RlKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Tm9kZXMocHJSb290KTtcclxuXHJcbiAgICBjb25zdCBtaW5YID0gbWluKG5vZGVzLm1hcCggY3VycmVudCA9PiBjdXJyZW50LngpKTtcclxuICAgIGNvbnN0IG1heFggPSBtYXgobm9kZXMubWFwKCBjdXJyZW50ID0+IGN1cnJlbnQueCkpO1xyXG4gICAgY29uc3QgbW92ZVggPSAoTWF0aC5hYnMobWluWCkgLSBNYXRoLmFicyhtYXhYKSkgLyAyO1xyXG5cclxuICAgIC8vY29uc29sZS5sb2coJ0NlbnRyYW5kaW5nLi4uOiAnLCBtb3ZlWCk7XHJcbiAgICBtb3ZlTm9kZShwclJvb3QuY2hpbGRyZW5bMF0sIG1vdmVYLCAwLCB0cnVlKTtcclxuICB9XHJcblxyXG59Il19