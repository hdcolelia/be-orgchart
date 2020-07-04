import { __read, __spread } from "tslib";
import { Component, Input } from '@angular/core';
import { D3OrgChart } from '../../clasess/d3-org-chart.class';
import * as i0 from "@angular/core";
function BED3OrgchartComponent_ng_template_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵnamespaceSVG();
    i0.ɵɵelementStart(0, "svg", 4);
    i0.ɵɵelement(1, "path", 5);
    i0.ɵɵelement(2, "path", 6);
    i0.ɵɵelement(3, "path", 7);
    i0.ɵɵelement(4, "path", 8);
    i0.ɵɵelementStart(5, "g", 9);
    i0.ɵɵelement(6, "circle", 10);
    i0.ɵɵelement(7, "circle", 11);
    i0.ɵɵelement(8, "circle", 12);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "g", 13);
    i0.ɵɵelementStart(10, "text", 14);
    i0.ɵɵtext(11, "A");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "text", 15);
    i0.ɵɵtext(13, "B");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "text", 16);
    i0.ɵɵtext(15, "C");
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} }
function BED3OrgchartComponent_ng_template_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div");
    i0.ɵɵelementStart(1, "p");
    i0.ɵɵtext(2, "$$title");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4, "$$id");
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
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
    BED3OrgchartComponent.ɵfac = function BED3OrgchartComponent_Factory(t) { return new (t || BED3OrgchartComponent)(i0.ɵɵdirectiveInject(i0.ElementRef)); };
    BED3OrgchartComponent.ɵcmp = i0.ɵɵdefineComponent({ type: BED3OrgchartComponent, selectors: [["be-d3-orgchart"]], inputs: { nodes: "nodes", nodeParser: "nodeParser" }, features: [i0.ɵɵNgOnChangesFeature], decls: 6, vars: 0, consts: [[1, "container"], ["orgchart", ""], ["defaultTemplate", ""], ["nodeTemplate", ""], ["height", "400", "width", "450"], ["id", "lineAB", "d", "M 100 350 l 150 -300", "stroke", "red", "stroke-width", "3", "fill", "none"], ["id", "lineBC", "d", "M 250 50 l 150 300", "stroke", "red", "stroke-width", "3", "fill", "none"], ["d", "M 175 200 l 150 0", "stroke", "green", "stroke-width", "3", "fill", "none"], ["d", "M 100 350 q 150 -300 300 0", "stroke", "blue", "stroke-width", "5", "fill", "none"], ["stroke", "black", "stroke-width", "3", "fill", "black"], ["id", "pointA", "cx", "100", "cy", "350", "r", "3"], ["id", "pointB", "cx", "250", "cy", "50", "r", "3"], ["id", "pointC", "cx", "400", "cy", "350", "r", "3"], ["font-size", "30", "font-family", "sans-serif", "fill", "black", "stroke", "none", "text-anchor", "middle"], ["x", "100", "y", "350", "dx", "-30"], ["x", "250", "y", "50", "dy", "-10"], ["x", "400", "y", "350", "dx", "30"]], template: function BED3OrgchartComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelement(0, "div", 0, 1);
            i0.ɵɵtemplate(2, BED3OrgchartComponent_ng_template_2_Template, 16, 0, "ng-template", null, 2, i0.ɵɵtemplateRefExtractor);
            i0.ɵɵtemplate(4, BED3OrgchartComponent_ng_template_4_Template, 5, 0, "ng-template", null, 3, i0.ɵɵtemplateRefExtractor);
        } }, styles: ["[_nghost-%COMP%]{display:flex;flex-direction:column;overflow:hidden}image.rounded[_ngcontent-%COMP%]{border-radius:50%;border-color:#00f;border-width:2px}"] });
    return BED3OrgchartComponent;
}());
export { BED3OrgchartComponent };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(BED3OrgchartComponent, [{
        type: Component,
        args: [{
                selector: 'be-d3-orgchart',
                templateUrl: './be-d3-orgchart.component.html',
                styleUrls: ['./be-d3-orgchart.component.scss']
            }]
    }], function () { return [{ type: i0.ElementRef }]; }, { nodes: [{
            type: Input
        }], nodeParser: [{
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmUtZDMtb3JnY2hhcnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGJlL29yZ2NoYXJ0LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvb3JnY2hhcnQvYmUtZDMtb3JnY2hhcnQuY29tcG9uZW50LnRzIiwibGliL2NvbXBvbmVudHMvb3JnY2hhcnQvYmUtZDMtb3JnY2hhcnQuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQTJFLEtBQUssRUFBNEIsTUFBTSxlQUFlLENBQUM7QUFDcEosT0FBTyxFQUFFLFVBQVUsRUFBc0IsTUFBTSxrQ0FBa0MsQ0FBQzs7O0lDRWhGLG1CQUNFO0lBREYsOEJBQ0U7SUFBQSwwQkFDRTtJQUFBLDBCQUNBO0lBQUEsMEJBQ0E7SUFBQSwwQkFDQTtJQUNBLDRCQUNFO0lBQUEsNkJBQ0E7SUFBQSw2QkFDQTtJQUFBLDZCQUNGO0lBQUEsaUJBQUk7SUFFSiw2QkFDRTtJQUFBLGlDQUErQjtJQUFBLGtCQUFDO0lBQUEsaUJBQU87SUFDdkMsaUNBQThCO0lBQUEsa0JBQUM7SUFBQSxpQkFBTztJQUN0QyxpQ0FBOEI7SUFBQSxrQkFBQztJQUFBLGlCQUFPO0lBQ3hDLGlCQUFJO0lBQ04saUJBQU07OztJQUlSLDJCQUNFO0lBQUEseUJBQUc7SUFBQSx1QkFBTztJQUFBLGlCQUFJO0lBQ2QseUJBQUc7SUFBQSxvQkFBSTtJQUFBLGlCQUFJO0lBQ2IsaUJBQU07O0FEdEJSO0lBd0JJLFlBQVk7SUFFWiwrQkFBc0IsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtJQUFJLENBQUM7SUFmM0Msc0JBQUksd0NBQUs7YUFBVDtZQUNJLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQztZQUNoQixJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRTtnQkFDWixJQUFNLE9BQU8sR0FBdUIsRUFBRSxDQUFDO2dCQUN2QywwQkFBMEI7Z0JBQzFCLElBQUksRUFB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QXFCO2NBTGpDLFNBQVM7ZUFBQztnQkFDUCxRQUFRLEVBQUUsZ0JBQWdCO2dCQUMxQixXQUFXLEVBQUUsaUNBQWlDO2dCQUM5QyxTQUFTLEVBQUUsQ0FBQyxpQ0FBaUMsQ0FBQzthQUNqRDs7a0JBRUksS0FBSzs7a0JBQ0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgT25Jbml0LCBWaWV3Q2hpbGRyZW4sIFRlbXBsYXRlUmVmLCBRdWVyeUxpc3QsIEFmdGVyVmlld0luaXQsIElucHV0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgRDNPcmdDaGFydCwgSUQzT3JnQ2hhcnRPcHRpb25zIH0gZnJvbSAnLi4vLi4vY2xhc2Vzcy9kMy1vcmctY2hhcnQuY2xhc3MnO1xyXG5pbXBvcnQgeyBJRDNOb2RlIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcyc7XHJcbmltcG9ydCB7IEQzTm9kZUJhc2ljUGFyc2VyIH0gZnJvbSAnLi8uLi8uLi9jbGFzZXNzL0BpdGVtcyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnYmUtZDMtb3JnY2hhcnQnLFxyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2JlLWQzLW9yZ2NoYXJ0LmNvbXBvbmVudC5odG1sJyxcclxuICAgIHN0eWxlVXJsczogWycuL2JlLWQzLW9yZ2NoYXJ0LmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIEJFRDNPcmdjaGFydENvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uQ2hhbmdlcyB7XHJcbiAgICBASW5wdXQoKSBub2RlczogSUQzTm9kZVtdO1xyXG4gICAgQElucHV0KCkgbm9kZVBhcnNlcjogRDNOb2RlQmFzaWNQYXJzZXI7XHJcblxyXG4gICAgLy8jcmVnaW9uIENoYXJ0XHJcbiAgICBwcm90ZWN0ZWQgX2NoYXJ0OiBEM09yZ0NoYXJ0O1xyXG4gICAgZ2V0IGNoYXJ0KCk6IEQzT3JnQ2hhcnQge1xyXG4gICAgICAgIGNvbnN0IG1lID0gdGhpcztcclxuICAgICAgICBpZiAoIW1lLl9jaGFydCkge1xyXG4gICAgICAgICAgICBjb25zdCBvcHRpb25zOiBJRDNPcmdDaGFydE9wdGlvbnMgPSB7fTtcclxuICAgICAgICAgICAgLy8gYWRkaW5nIG5vZGVzIGlmIGRlZmluZWRcclxuICAgICAgICAgICAgaWYgKG1lLm5vZGVzKSBvcHRpb25zLmRhdGEgPSBtZS5ub2RlcztcclxuICAgICAgICAgICAgLy8gYWRkaW5nIG5vZGUgcGFyc2VyIGlmIGRlZmluZWRcclxuICAgICAgICAgICAgaWYgKG1lLm5vZGVQYXJzZXIpIG9wdGlvbnMubm9kZVBhcnNlciA9IG1lLm5vZGVQYXJzZXI7XHJcblxyXG4gICAgICAgICAgICBtZS5fY2hhcnQgPSBuZXcgRDNPcmdDaGFydCh0aGlzLnByRWwubmF0aXZlRWxlbWVudCwgb3B0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gbWUuX2NoYXJ0O1xyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHByRWw6IEVsZW1lbnRSZWYpIHsgfVxyXG5cclxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgICAgICB0aGlzLmluaXQoKVxyXG4gICAgfVxyXG5cclxuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcclxuICAgICAgICBjb25zdCBtZSA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vIGRldGVjdGluZyBjaGFuZ2VzIG9mIGlucHV0XHJcbiAgICAgICAgaWYgKGNoYW5nZXMubm9kZVBhcnNlciAmJiBjaGFuZ2VzLm5vZGVQYXJzZXIuY3VycmVudFZhbHVlKSB7XHJcbiAgICAgICAgICAgIG1lLmFzc2lnbk5vZGVQYXJzZXIoY2hhbmdlcy5ub2RlUGFyc2VyLmN1cnJlbnRWYWx1ZSk7XHJcbiAgICAgICAgICAgIG1lLmNoYXJ0LnJlbmRlcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNoYW5nZXMubm9kZXMgJiYgY2hhbmdlcy5ub2Rlcy5jdXJyZW50VmFsdWUpIHtcclxuICAgICAgICAgICAgbWUuYXNzaWduRGF0YShjaGFuZ2VzLm5vZGVzLmN1cnJlbnRWYWx1ZSBhcyBJRDNOb2RlW10pO1xyXG4gICAgICAgICAgICBtZS5jaGFydC5yZW5kZXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgY29uc3QgbWUgPSB0aGlzO1xyXG4gICAgICAgIC8vIGluaXQgdGhlIGNhbnZhc1xyXG4gICAgICAgIGNvbnN0IGNoYXJ0ID0gbWUuY2hhcnQ7IC8vIE11c3QgYmUgbGlrZSB0aGlzIHRvIGVuc3VyZSBjaGFydCBpbml0XHJcbiAgICAgICAgbWUuY2hhcnQucmVuZGVyKCk7XHJcbiAgICAgICAgLy8gc2V0dGluZyBkYXRhXHJcbiAgICAgICAgbWUuY2hhcnQub25Ob2RlQ2xpY2suc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICAoZGF0YTogeyBpZDogc3RyaW5nLCBub2RlOiBJRDNOb2RlIH0pID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDbGlja2VkOiAnLCBkYXRhKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGFzc2lnbkRhdGEoZGF0YTogSUQzTm9kZVtdIHwgSUQzTm9kZSwgY2xlYXI6IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgbWUgPSB0aGlzO1xyXG4gICAgICAgIGNvbnN0IGNoYXJ0ID0gbWUuY2hhcnQ7IC8vIE11c3QgYmUgbGlrZSB0aGlzIHRvIGVuc3VyZSBjaGFydCBpbml0XHJcbiAgICAgICAgLy8gaWYgaXNuwrR0IGFycmF5IHdlIGNvbnZlcnQgaXQgaW4gYXJyYXlcclxuICAgICAgICBpZiAoIShkYXRhIGluc3RhbmNlb2YgQXJyYXkpKSBkYXRhID0gW2RhdGFdO1xyXG4gICAgICAgIGlmIChjbGVhcikge1xyXG4gICAgICAgICAgICBjaGFydC5kYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBwdXNoaW5nIGRhdGFcclxuICAgICAgICBjaGFydC5kYXRhID0gWy4uLmNoYXJ0LmRhdGEsIC4uLmRhdGFdO1xyXG4gICAgICAgIGNoYXJ0LnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzc2lnbk5vZGVQYXJzZXIocHJQYXJzZXI6IEQzTm9kZUJhc2ljUGFyc2VyKSB7XHJcbiAgICAgICAgY29uc3QgbWUgPSB0aGlzO1xyXG4gICAgICAgIGNvbnN0IGNoYXJ0ID0gbWUuY2hhcnQ7IC8vIE11c3QgYmUgbGlrZSB0aGlzIHRvIGVuc3VyZSBjaGFydCBpbml0XHJcbiAgICAgICAgY2hhcnQubm9kZVBhcnNlciA9IHByUGFyc2VyO1xyXG4gICAgICAgIGNoYXJ0LnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLyNyZWdpb24gUGFyYSBFbGltaW5hclxyXG4gICAgLy8geHh4aW5pdCgpIHtcclxuICAgIC8vICAgICBjb25zdCBtZSA9IHRoaXM7XHJcbiAgICAvLyAgICAgLy8gT2J0ZW5lbW9zIGxhIGluZm9cclxuICAgIC8vICAgICBkM1xyXG4gICAgLy8gICAgICAgICAuanNvbignaHR0cHM6Ly9naXN0LmdpdGh1YnVzZXJjb250ZW50LmNvbS9idW1iZWlzaHZpbGkvZGMwZDQ3YmM5NWVmMzU5ZmRjNzViNjNjZDY1ZWRhZjIvcmF3L2MzM2EzYTFlZjRiYTkyN2UzZTkyYjgxNjAwYzhjNmFkYTM0NWM2NGIvb3JnQ2hhcnQuanNvbicpXHJcbiAgICAvLyAgICAgICAgIC50aGVuKChkYXRhOiBJRDNOb2RlW10pID0+IHtcclxuXHJcbiAgICAvLyAgICAgICAgICAgICAvLyBkYXRhLmZvckVhY2goY3VycmVudCA9PiB7IGN1cnJlbnQuZXhwYW5kZWQgPSB0cnVlOyB9KVxyXG4gICAgLy8gICAgICAgICAgICAgY29uc29sZS5sb2coJ0FkZGluZyBkYXRhOiAnKVxyXG4gICAgLy8gICAgICAgICAgICAgbWUuY2hhcnQgPSBuZXcgRDNPcmdDaGFydCh0aGlzLnByRWwubmF0aXZlRWxlbWVudCwgZGF0YSk7XHJcbiAgICAvLyAgICAgICAgICAgICBtZS5jaGFydC5yZW5kZXIoKTtcclxuXHJcbiAgICAvLyAgICAgICAgICAgICBtZS5jaGFydC5vbk5vZGVDbGljay5zdWJzY3JpYmUoXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgKGRhdGE6IHsgaWQ6IHN0cmluZywgbm9kZTogSUQzTm9kZSB9KSA9PiB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDbGlja2VkOiAnLCBkYXRhKVxyXG4gICAgLy8gICAgICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgICAgIClcclxuICAgIC8vICAgICAgICAgfSk7XHJcblxyXG4gICAgLy8gICAgIC8vIG1lLmNoYXJ0ID0gbmV3IEQzT3JnQ2hhcnQodGhpcy5wckVsLm5hdGl2ZUVsZW1lbnQpO1xyXG4gICAgLy8gICAgIC8vIG1lLmNoYXJ0LnJlbmRlcigpO1xyXG5cclxuICAgIC8vICAgICAvLyBtZS5jaGFydC5vbk5vZGVDbGljay5zdWJzY3JpYmUoXHJcbiAgICAvLyAgICAgLy8gICAgIChkYXRhOiB7IGlkOiBzdHJpbmcsIG5vZGU6IElEM05vZGUgfSkgPT4ge1xyXG4gICAgLy8gICAgIC8vICAgICAgICAgY29uc29sZS5sb2coJ0NsaWNrZWQ6ICcsIGRhdGEpXHJcbiAgICAvLyAgICAgLy8gICAgIH1cclxuICAgIC8vICAgICAvLyApXHJcbiAgICAvLyB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcblxyXG5cclxufVxyXG5cclxuIiwiPGRpdiAjb3JnY2hhcnQgY2xhc3M9XCJjb250YWluZXJcIj48L2Rpdj5cclxuXHJcbjxuZy10ZW1wbGF0ZSAjZGVmYXVsdFRlbXBsYXRlPlxyXG4gIDxzdmcgaGVpZ2h0PVwiNDAwXCIgd2lkdGg9XCI0NTBcIj5cclxuICAgIDxwYXRoIGlkPVwibGluZUFCXCIgZD1cIk0gMTAwIDM1MCBsIDE1MCAtMzAwXCIgc3Ryb2tlPVwicmVkXCIgc3Ryb2tlLXdpZHRoPVwiM1wiIGZpbGw9XCJub25lXCIgLz5cclxuICAgICAgPHBhdGggaWQ9XCJsaW5lQkNcIiBkPVwiTSAyNTAgNTAgbCAxNTAgMzAwXCIgc3Ryb2tlPVwicmVkXCIgc3Ryb2tlLXdpZHRoPVwiM1wiIGZpbGw9XCJub25lXCIgLz5cclxuICAgICAgPHBhdGggZD1cIk0gMTc1IDIwMCBsIDE1MCAwXCIgc3Ryb2tlPVwiZ3JlZW5cIiBzdHJva2Utd2lkdGg9XCIzXCIgZmlsbD1cIm5vbmVcIiAvPlxyXG4gICAgICA8cGF0aCBkPVwiTSAxMDAgMzUwIHEgMTUwIC0zMDAgMzAwIDBcIiBzdHJva2U9XCJibHVlXCIgc3Ryb2tlLXdpZHRoPVwiNVwiIGZpbGw9XCJub25lXCIgLz5cclxuICAgICAgPCEtLSBNYXJrIHJlbGV2YW50IHBvaW50cyAtLT5cclxuICAgICAgPGcgc3Ryb2tlPVwiYmxhY2tcIiBzdHJva2Utd2lkdGg9XCIzXCIgZmlsbD1cImJsYWNrXCI+IFxyXG4gICAgICAgIDxjaXJjbGUgaWQ9XCJwb2ludEFcIiBjeD1cIjEwMFwiIGN5PVwiMzUwXCIgcj1cIjNcIiAvPlxyXG4gICAgICAgIDxjaXJjbGUgaWQ9XCJwb2ludEJcIiBjeD1cIjI1MFwiIGN5PVwiNTBcIiByPVwiM1wiIC8+XHJcbiAgICAgICAgPGNpcmNsZSBpZD1cInBvaW50Q1wiIGN4PVwiNDAwXCIgY3k9XCIzNTBcIiByPVwiM1wiIC8+XHJcbiAgICAgIDwvZz5cclxuICAgICAgPCEtLSBMYWJlbCB0aGUgcG9pbnRzIC0tPlxyXG4gICAgICA8ZyBmb250LXNpemU9XCIzMFwiIGZvbnQtZmFtaWx5PVwic2Fucy1zZXJpZlwiIGZpbGw9XCJibGFja1wiIHN0cm9rZT1cIm5vbmVcIiB0ZXh0LWFuY2hvcj1cIm1pZGRsZVwiPlxyXG4gICAgICAgIDx0ZXh0IHg9XCIxMDBcIiB5PVwiMzUwXCIgZHg9XCItMzBcIj5BPC90ZXh0PlxyXG4gICAgICAgIDx0ZXh0IHg9XCIyNTBcIiB5PVwiNTBcIiBkeT1cIi0xMFwiPkI8L3RleHQ+XHJcbiAgICAgICAgPHRleHQgeD1cIjQwMFwiIHk9XCIzNTBcIiBkeD1cIjMwXCI+QzwvdGV4dD5cclxuICAgICAgPC9nPlxyXG4gICAgPC9zdmc+XHJcbjwvbmctdGVtcGxhdGU+XHJcblxyXG48bmctdGVtcGxhdGUgI25vZGVUZW1wbGF0ZT5cclxuICA8ZGl2PlxyXG4gICAgPHA+JCR0aXRsZTwvcD5cclxuICAgIDxwPiQkaWQ8L3A+XHJcbiAgPC9kaXY+XHJcbjwvbmctdGVtcGxhdGU+ICJdfQ==