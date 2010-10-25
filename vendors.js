
var Vendor = Backbone.Model.extend({
});

var VendorList = Backbone.Collection.extend({
    model: Vendor,
    comparator: function(vendor) { return vendor.get('name') },

    uniqueSolutions: function() {
        var names = this.map(function(v){
            var s = v.solutions;
            if (s) { return s.pluck("name"); }
        });
        return _(names).chain()
                .flatten()
                .compact()
                .sortBy(function(n){ return n; })
                .uniq(true)
                .value();
    },
    uniqueCredentials: function() {
        var names = this.map(function(v){
            var c = v.credentials;
            if (c) { return c.pluck("name"); }
        });
        return _(names).chain()
                .flatten()
                .compact()
                .sortBy(function(n){ return n; })
                .uniq(true)
                .value();
    }
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
