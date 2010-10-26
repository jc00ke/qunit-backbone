
var Vendor = Backbone.Model.extend({
});

var VendorList = Backbone.Collection.extend({
    model: Vendor,
    comparator: function(vendor) { return vendor.get('name') },

    getUnique: function(list) {
        try {
            if (list != "credentials" && list != "solutions") {
                throw new Error("Must pass in either 'credentials' or 'solutions'");
            } else {
                var names = this.map(function(v){
                    var x = v[list];
                    if (x) { return x.pluck("name"); }
                });
                return _(names).chain()
                        .flatten()
                        .compact()
                        .sortBy(function(n){ return n; })
                        .uniq(true)
                        .value();
                    }
        } catch(exception) {
            if (_.isUndefined(window.errors)) {
                window.errors = [];
            }
            window.errors.push(exception);
            alert(exception);
        }
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

var CheckboxRow = Backbone.View.extend({
    render: function() {
        $(this.el).html(Mustache.to_html(this.template, this.model.toJSON()));
        return this;
    },
    template: '<div><label><input type="checkbox" />{{name}} <span class="count">({{count}})</span></label></div>'
});
