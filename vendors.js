
var Vendor = Backbone.Model.extend({
});

var VendorList = Backbone.Collection.extend({
    model: Vendor,
    comparator: function(vendor) { return vendor.get('name') }
});

var Solution = Backbone.Model.extend({
});

var SolutionList = Backbone.Collection.extend({
    model: Solution,
    comparator: function(solution) { return solution.get('name'); },
});
