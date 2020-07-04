import { __values } from "tslib";
var D3OrgChartItem = /** @class */ (function () {
    function D3OrgChartItem(svgCanvas) {
        this.svgCanvas = svgCanvas;
        this.components = [
            {
                tag: 'circle',
                attrs: {
                    r: '50'
                }
            }
        ];
    }
    D3OrgChartItem.prototype.draw = function () {
        var me = this;
        me.g = me.svgCanvas.append('g')
            .attr('x', me.x0)
            .attr('y', me.y0);
        me.addComponents();
    };
    D3OrgChartItem.prototype.addComponents = function () {
        var e_1, _a;
        var me = this;
        try {
            // adding components
            for (var _b = __values(me.components || []), _c = _b.next(); !_c.done; _c = _b.next()) {
                var currentCompDefs = _c.value;
                var comp = me.g.append(currentCompDefs.tag);
                // adding tags
                for (var key in currentCompDefs.attrs) {
                    var attr = currentCompDefs.attrs[key];
                    comp.attr(key, attr);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return D3OrgChartItem;
}());
export { D3OrgChartItem };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZDNvYy1pdGVtLmJhc2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9iZS1kMy1vcmdjaGFydC8iLCJzb3VyY2VzIjpbImxpYi9jbGFzZXNzL2Qzb2MtaXRlbS5iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFTQTtJQWtCRSx3QkFDWSxTQUFtRDtRQUFuRCxjQUFTLEdBQVQsU0FBUyxDQUEwQztRQVYvRCxlQUFVLEdBQXFCO1lBQzdCO2dCQUNFLEdBQUcsRUFBRSxRQUFRO2dCQUNiLEtBQUssRUFBRTtvQkFDTCxDQUFDLEVBQUUsSUFBSTtpQkFDUjthQUNGO1NBQ0YsQ0FBQztJQUlDLENBQUM7SUFFSiw2QkFBSSxHQUFKO1FBQ0UsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO2FBQzlCLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQzthQUNoQixJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNsQixFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVTLHNDQUFhLEdBQXZCOztRQUNFLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQzs7WUFDaEIsb0JBQW9CO1lBQ3BCLEtBQThCLElBQUEsS0FBQSxTQUFBLEVBQUUsQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFBLGdCQUFBLDRCQUFFO2dCQUE5QyxJQUFNLGVBQWUsV0FBQTtnQkFDeEIsSUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM5QyxjQUFjO2dCQUNkLEtBQUssSUFBTSxHQUFHLElBQUksZUFBZSxDQUFDLEtBQUssRUFBRTtvQkFDdkMsSUFBTSxJQUFJLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUE7aUJBQ3JCO2FBQ0Y7Ozs7Ozs7OztJQUNILENBQUM7SUFDSCxxQkFBQztBQUFELENBQUMsQUExQ0QsSUEwQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBkMyBmcm9tICdkMyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElJdGVtQ29tcG9uZW50IHtcclxuICB0YWc6IHN0cmluZztcclxuICBhdHRyczoge1xyXG4gICAgW2luZGV4OiBzdHJpbmddOiBzdHJpbmc7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRDNPcmdDaGFydEl0ZW0ge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgcGFyZW50SWQ6IHN0cmluZztcclxuXHJcbiAgZzogZDMuU2VsZWN0aW9uPFNWR0dFbGVtZW50LCBhbnksIGFueSwgYW55PjtcclxuXHJcbiAgeDA6IG51bWJlcjtcclxuICB5MDogbnVtYmVyO1xyXG5cclxuICBjb21wb25lbnRzOiBJSXRlbUNvbXBvbmVudFtdID0gW1xyXG4gICAge1xyXG4gICAgICB0YWc6ICdjaXJjbGUnLFxyXG4gICAgICBhdHRyczoge1xyXG4gICAgICAgIHI6ICc1MCdcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIF07XHJcbiAgICBcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByb3RlY3RlZCBzdmdDYW52YXM6IGQzLlNlbGVjdGlvbjxTVkdHRWxlbWVudCwgYW55LCBhbnksIGFueT5cclxuICApIHt9XHJcblxyXG4gIGRyYXcoKSB7XHJcbiAgICBjb25zdCBtZSA9IHRoaXM7XHJcbiAgICBtZS5nID0gbWUuc3ZnQ2FudmFzLmFwcGVuZCgnZycpXHJcbiAgICAuYXR0cigneCcsIG1lLngwKVxyXG4gICAgLmF0dHIoJ3knLCBtZS55MCk7XHJcbiAgICBtZS5hZGRDb21wb25lbnRzKCk7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgYWRkQ29tcG9uZW50cygpIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuICAgIC8vIGFkZGluZyBjb21wb25lbnRzXHJcbiAgICBmb3IgKGNvbnN0IGN1cnJlbnRDb21wRGVmcyBvZiBtZS5jb21wb25lbnRzIHx8IFtdKSB7XHJcbiAgICAgIGNvbnN0IGNvbXAgPSBtZS5nLmFwcGVuZChjdXJyZW50Q29tcERlZnMudGFnKTtcclxuICAgICAgLy8gYWRkaW5nIHRhZ3NcclxuICAgICAgZm9yIChjb25zdCBrZXkgaW4gY3VycmVudENvbXBEZWZzLmF0dHJzKSB7XHJcbiAgICAgICAgY29uc3QgYXR0ciA9IGN1cnJlbnRDb21wRGVmcy5hdHRyc1trZXldO1xyXG4gICAgICAgIGNvbXAuYXR0cihrZXksIGF0dHIpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19