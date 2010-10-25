
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

var Credential = Backbone.Model.extend({
});

var CredentialList = Backbone.Collection.extend({
    model: Credential,
    comparator: function(credential) { return credential.get('name'); },
});
