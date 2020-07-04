import { __decorate, __read, __spread } from "tslib";
import { Component, ElementRef, OnInit, ViewChildren, TemplateRef, QueryList, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { D3OrgChart } from '../../clasess/d3-org-chart.class';
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
    BED3OrgchartComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    __decorate([
        Input()
    ], BED3OrgchartComponent.prototype, "nodes", void 0);
    __decorate([
        Input()
    ], BED3OrgchartComponent.prototype, "nodeParser", void 0);
    BED3OrgchartComponent = __decorate([
        Component({
            selector: 'be-d3-orgchart',
            template: "<div #orgchart class=\"container\"></div>\r\n\r\n<ng-template #defaultTemplate>\r\n  <svg height=\"400\" width=\"450\">\r\n    <path id=\"lineAB\" d=\"M 100 350 l 150 -300\" stroke=\"red\" stroke-width=\"3\" fill=\"none\" />\r\n      <path id=\"lineBC\" d=\"M 250 50 l 150 300\" stroke=\"red\" stroke-width=\"3\" fill=\"none\" />\r\n      <path d=\"M 175 200 l 150 0\" stroke=\"green\" stroke-width=\"3\" fill=\"none\" />\r\n      <path d=\"M 100 350 q 150 -300 300 0\" stroke=\"blue\" stroke-width=\"5\" fill=\"none\" />\r\n      <!-- Mark relevant points -->\r\n      <g stroke=\"black\" stroke-width=\"3\" fill=\"black\"> \r\n        <circle id=\"pointA\" cx=\"100\" cy=\"350\" r=\"3\" />\r\n        <circle id=\"pointB\" cx=\"250\" cy=\"50\" r=\"3\" />\r\n        <circle id=\"pointC\" cx=\"400\" cy=\"350\" r=\"3\" />\r\n      </g>\r\n      <!-- Label the points -->\r\n      <g font-size=\"30\" font-family=\"sans-serif\" fill=\"black\" stroke=\"none\" text-anchor=\"middle\">\r\n        <text x=\"100\" y=\"350\" dx=\"-30\">A</text>\r\n        <text x=\"250\" y=\"50\" dy=\"-10\">B</text>\r\n        <text x=\"400\" y=\"350\" dx=\"30\">C</text>\r\n      </g>\r\n    </svg>\r\n</ng-template>\r\n\r\n<ng-template #nodeTemplate>\r\n  <div>\r\n    <p>$$title</p>\r\n    <p>$$id</p>\r\n  </div>\r\n</ng-template> ",
            styles: [":host{display:flex;flex-direction:column;overflow:hidden}image.rounded{border-radius:50%;border-color:#00f;border-width:2px}"]
        })
    ], BED3OrgchartComponent);
    return BED3OrgchartComponent;
}());
export { BED3OrgchartComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmUtZDMtb3JnY2hhcnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYmUtZDMtb3JnY2hhcnQvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9vcmdjaGFydC9iZS1kMy1vcmdjaGFydC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDcEosT0FBTyxFQUFFLFVBQVUsRUFBc0IsTUFBTSxrQ0FBa0MsQ0FBQztBQVNsRjtJQW1CSSxZQUFZO0lBRVosK0JBQXNCLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7SUFBSSxDQUFDO0lBZjNDLHNCQUFJLHdDQUFLO2FBQVQ7WUFDSSxJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7WUFDaEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUU7Z0JBQ1osSUFBTSxPQUFPLEdBQXVCLEVBQUUsQ0FBQztnQkFDdkMsMEJBQTBCO2dCQUMxQixJQUFJLEVBQUUsQ0FBQyxLQUFLO29CQUFFLE9BQU8sQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQztnQkFDdEMsZ0NBQWdDO2dCQUNoQyxJQUFJLEVBQUUsQ0FBQyxVQUFVO29CQUFFLE9BQU8sQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQztnQkFFdEQsRUFBRSxDQUFDLE1BQU0sR0FBRyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUNoRTtZQUFBLENBQUM7WUFDRixPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFDckIsQ0FBQzs7O09BQUE7SUFLRCwrQ0FBZSxHQUFmO1FBQ0ksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO0lBQ2YsQ0FBQztJQUVELDJDQUFXLEdBQVgsVUFBWSxPQUFzQjtRQUM5QixJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFFaEIsNkJBQTZCO1FBQzdCLElBQUksT0FBTyxDQUFDLFVBQVUsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRTtZQUN2RCxFQUFFLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNyRCxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ3JCO1FBRUQsSUFBSSxPQUFPLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFO1lBQzdDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUF5QixDQUFDLENBQUM7WUFDdkQsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNyQjtJQUVMLENBQUM7SUFFRCxvQ0FBSSxHQUFKO1FBQ0ksSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLGtCQUFrQjtRQUNsQixJQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMseUNBQXlDO1FBQ2pFLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDbEIsZUFBZTtRQUNmLEVBQUUsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FDMUIsVUFBQyxJQUFtQztZQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUNsQyxDQUFDLENBQ0osQ0FBQTtJQUNMLENBQUM7SUFFRCwwQ0FBVSxHQUFWLFVBQVcsSUFBeUIsRUFBRSxLQUFxQjtRQUFyQixzQkFBQSxFQUFBLFlBQXFCO1FBQ3ZELElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMseUNBQXlDO1FBQ2pFLHdDQUF3QztRQUN4QyxJQUFJLENBQUMsQ0FBQyxJQUFJLFlBQVksS0FBSyxDQUFDO1lBQUUsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUMsSUFBSSxLQUFLLEVBQUU7WUFDUCxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNsQixPQUFPO1NBQ1Y7UUFDRCxlQUFlO1FBQ2YsS0FBSyxDQUFDLElBQUksWUFBTyxLQUFLLENBQUMsSUFBSSxFQUFLLElBQUksQ0FBQyxDQUFDO1FBQ3RDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBRUQsZ0RBQWdCLEdBQWhCLFVBQWlCLFFBQTJCO1FBQ3hDLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMseUNBQXlDO1FBQ2pFLEtBQUssQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO1FBQzVCLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNuQixDQUFDOztnQkF0RDJCLFVBQVU7O0lBcEI3QjtRQUFSLEtBQUssRUFBRTt3REFBa0I7SUFDakI7UUFBUixLQUFLLEVBQUU7NkRBQStCO0lBRjlCLHFCQUFxQjtRQUxqQyxTQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsZ0JBQWdCO1lBQzFCLCt5Q0FBOEM7O1NBRWpELENBQUM7T0FDVyxxQkFBcUIsQ0ErR2pDO0lBQUQsNEJBQUM7Q0FBQSxBQS9HRCxJQStHQztTQS9HWSxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIE9uSW5pdCwgVmlld0NoaWxkcmVuLCBUZW1wbGF0ZVJlZiwgUXVlcnlMaXN0LCBBZnRlclZpZXdJbml0LCBJbnB1dCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEQzT3JnQ2hhcnQsIElEM09yZ0NoYXJ0T3B0aW9ucyB9IGZyb20gJy4uLy4uL2NsYXNlc3MvZDMtb3JnLWNoYXJ0LmNsYXNzJztcclxuaW1wb3J0IHsgSUQzTm9kZSB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMnO1xyXG5pbXBvcnQgeyBEM05vZGVCYXNpY1BhcnNlciB9IGZyb20gJy4vLi4vLi4vY2xhc2Vzcy9AaXRlbXMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ2JlLWQzLW9yZ2NoYXJ0JyxcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9iZS1kMy1vcmdjaGFydC5jb21wb25lbnQuaHRtbCcsXHJcbiAgICBzdHlsZVVybHM6IFsnLi9iZS1kMy1vcmdjaGFydC5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBCRUQzT3JnY2hhcnRDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMge1xyXG4gICAgQElucHV0KCkgbm9kZXM6IElEM05vZGVbXTtcclxuICAgIEBJbnB1dCgpIG5vZGVQYXJzZXI6IEQzTm9kZUJhc2ljUGFyc2VyO1xyXG5cclxuICAgIC8vI3JlZ2lvbiBDaGFydFxyXG4gICAgcHJvdGVjdGVkIF9jaGFydDogRDNPcmdDaGFydDtcclxuICAgIGdldCBjaGFydCgpOiBEM09yZ0NoYXJ0IHtcclxuICAgICAgICBjb25zdCBtZSA9IHRoaXM7XHJcbiAgICAgICAgaWYgKCFtZS5fY2hhcnQpIHtcclxuICAgICAgICAgICAgY29uc3Qgb3B0aW9uczogSUQzT3JnQ2hhcnRPcHRpb25zID0ge307XHJcbiAgICAgICAgICAgIC8vIGFkZGluZyBub2RlcyBpZiBkZWZpbmVkXHJcbiAgICAgICAgICAgIGlmIChtZS5ub2Rlcykgb3B0aW9ucy5kYXRhID0gbWUubm9kZXM7XHJcbiAgICAgICAgICAgIC8vIGFkZGluZyBub2RlIHBhcnNlciBpZiBkZWZpbmVkXHJcbiAgICAgICAgICAgIGlmIChtZS5ub2RlUGFyc2VyKSBvcHRpb25zLm5vZGVQYXJzZXIgPSBtZS5ub2RlUGFyc2VyO1xyXG5cclxuICAgICAgICAgICAgbWUuX2NoYXJ0ID0gbmV3IEQzT3JnQ2hhcnQodGhpcy5wckVsLm5hdGl2ZUVsZW1lbnQsIG9wdGlvbnMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIG1lLl9jaGFydDtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBwckVsOiBFbGVtZW50UmVmKSB7IH1cclxuXHJcbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KClcclxuICAgIH1cclxuXHJcbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XHJcbiAgICAgICAgY29uc3QgbWUgPSB0aGlzO1xyXG5cclxuICAgICAgICAvLyBkZXRlY3RpbmcgY2hhbmdlcyBvZiBpbnB1dFxyXG4gICAgICAgIGlmIChjaGFuZ2VzLm5vZGVQYXJzZXIgJiYgY2hhbmdlcy5ub2RlUGFyc2VyLmN1cnJlbnRWYWx1ZSkge1xyXG4gICAgICAgICAgICBtZS5hc3NpZ25Ob2RlUGFyc2VyKGNoYW5nZXMubm9kZVBhcnNlci5jdXJyZW50VmFsdWUpO1xyXG4gICAgICAgICAgICBtZS5jaGFydC5yZW5kZXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjaGFuZ2VzLm5vZGVzICYmIGNoYW5nZXMubm9kZXMuY3VycmVudFZhbHVlKSB7XHJcbiAgICAgICAgICAgIG1lLmFzc2lnbkRhdGEoY2hhbmdlcy5ub2Rlcy5jdXJyZW50VmFsdWUgYXMgSUQzTm9kZVtdKTtcclxuICAgICAgICAgICAgbWUuY2hhcnQucmVuZGVyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIGNvbnN0IG1lID0gdGhpcztcclxuICAgICAgICAvLyBpbml0IHRoZSBjYW52YXNcclxuICAgICAgICBjb25zdCBjaGFydCA9IG1lLmNoYXJ0OyAvLyBNdXN0IGJlIGxpa2UgdGhpcyB0byBlbnN1cmUgY2hhcnQgaW5pdFxyXG4gICAgICAgIG1lLmNoYXJ0LnJlbmRlcigpO1xyXG4gICAgICAgIC8vIHNldHRpbmcgZGF0YVxyXG4gICAgICAgIG1lLmNoYXJ0Lm9uTm9kZUNsaWNrLnN1YnNjcmliZShcclxuICAgICAgICAgICAgKGRhdGE6IHsgaWQ6IHN0cmluZywgbm9kZTogSUQzTm9kZSB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQ2xpY2tlZDogJywgZGF0YSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBhc3NpZ25EYXRhKGRhdGE6IElEM05vZGVbXSB8IElEM05vZGUsIGNsZWFyOiBib29sZWFuID0gdHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IG1lID0gdGhpcztcclxuICAgICAgICBjb25zdCBjaGFydCA9IG1lLmNoYXJ0OyAvLyBNdXN0IGJlIGxpa2UgdGhpcyB0byBlbnN1cmUgY2hhcnQgaW5pdFxyXG4gICAgICAgIC8vIGlmIGlzbsK0dCBhcnJheSB3ZSBjb252ZXJ0IGl0IGluIGFycmF5XHJcbiAgICAgICAgaWYgKCEoZGF0YSBpbnN0YW5jZW9mIEFycmF5KSkgZGF0YSA9IFtkYXRhXTtcclxuICAgICAgICBpZiAoY2xlYXIpIHtcclxuICAgICAgICAgICAgY2hhcnQuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gcHVzaGluZyBkYXRhXHJcbiAgICAgICAgY2hhcnQuZGF0YSA9IFsuLi5jaGFydC5kYXRhLCAuLi5kYXRhXTtcclxuICAgICAgICBjaGFydC5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3NpZ25Ob2RlUGFyc2VyKHByUGFyc2VyOiBEM05vZGVCYXNpY1BhcnNlcikge1xyXG4gICAgICAgIGNvbnN0IG1lID0gdGhpcztcclxuICAgICAgICBjb25zdCBjaGFydCA9IG1lLmNoYXJ0OyAvLyBNdXN0IGJlIGxpa2UgdGhpcyB0byBlbnN1cmUgY2hhcnQgaW5pdFxyXG4gICAgICAgIGNoYXJ0Lm5vZGVQYXJzZXIgPSBwclBhcnNlcjtcclxuICAgICAgICBjaGFydC5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8jcmVnaW9uIFBhcmEgRWxpbWluYXJcclxuICAgIC8vIHh4eGluaXQoKSB7XHJcbiAgICAvLyAgICAgY29uc3QgbWUgPSB0aGlzO1xyXG4gICAgLy8gICAgIC8vIE9idGVuZW1vcyBsYSBpbmZvXHJcbiAgICAvLyAgICAgZDNcclxuICAgIC8vICAgICAgICAgLmpzb24oJ2h0dHBzOi8vZ2lzdC5naXRodWJ1c2VyY29udGVudC5jb20vYnVtYmVpc2h2aWxpL2RjMGQ0N2JjOTVlZjM1OWZkYzc1YjYzY2Q2NWVkYWYyL3Jhdy9jMzNhM2ExZWY0YmE5MjdlM2U5MmI4MTYwMGM4YzZhZGEzNDVjNjRiL29yZ0NoYXJ0Lmpzb24nKVxyXG4gICAgLy8gICAgICAgICAudGhlbigoZGF0YTogSUQzTm9kZVtdKSA9PiB7XHJcblxyXG4gICAgLy8gICAgICAgICAgICAgLy8gZGF0YS5mb3JFYWNoKGN1cnJlbnQgPT4geyBjdXJyZW50LmV4cGFuZGVkID0gdHJ1ZTsgfSlcclxuICAgIC8vICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBZGRpbmcgZGF0YTogJylcclxuICAgIC8vICAgICAgICAgICAgIG1lLmNoYXJ0ID0gbmV3IEQzT3JnQ2hhcnQodGhpcy5wckVsLm5hdGl2ZUVsZW1lbnQsIGRhdGEpO1xyXG4gICAgLy8gICAgICAgICAgICAgbWUuY2hhcnQucmVuZGVyKCk7XHJcblxyXG4gICAgLy8gICAgICAgICAgICAgbWUuY2hhcnQub25Ob2RlQ2xpY2suc3Vic2NyaWJlKFxyXG4gICAgLy8gICAgICAgICAgICAgICAgIChkYXRhOiB7IGlkOiBzdHJpbmcsIG5vZGU6IElEM05vZGUgfSkgPT4ge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQ2xpY2tlZDogJywgZGF0YSlcclxuICAgIC8vICAgICAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgICAgICApXHJcbiAgICAvLyAgICAgICAgIH0pO1xyXG5cclxuICAgIC8vICAgICAvLyBtZS5jaGFydCA9IG5ldyBEM09yZ0NoYXJ0KHRoaXMucHJFbC5uYXRpdmVFbGVtZW50KTtcclxuICAgIC8vICAgICAvLyBtZS5jaGFydC5yZW5kZXIoKTtcclxuXHJcbiAgICAvLyAgICAgLy8gbWUuY2hhcnQub25Ob2RlQ2xpY2suc3Vic2NyaWJlKFxyXG4gICAgLy8gICAgIC8vICAgICAoZGF0YTogeyBpZDogc3RyaW5nLCBub2RlOiBJRDNOb2RlIH0pID0+IHtcclxuICAgIC8vICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKCdDbGlja2VkOiAnLCBkYXRhKVxyXG4gICAgLy8gICAgIC8vICAgICB9XHJcbiAgICAvLyAgICAgLy8gKVxyXG4gICAgLy8gfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG5cclxuXHJcbn1cclxuXHJcbiJdfQ==