
var Vendor = Backbone.Model.extend({
    serves: function(t) {
        return _(this.get("propertyType")).include(t);
    }
});

Vendor.servesRegExp = /(residential|commercial)/i;

var VendorList = Backbone.Collection.extend({
    model: Vendor,
    comparator: function(vendor) { return vendor.get('name') },

    getUnique: function(list) {
        try {
            if (list === "credentials" || list === "solutions") {
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
            } else {
                throw new Error("Must pass in either 'credentials' or 'solutions'");
            }
        } catch(exception) {
            window.errors = (window.errors || [])
            window.errors.push(exception);
            //alert(exception);
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
    tagName: 'div',
    initialize: function() {
        _.bindAll(this, 'render');
        this.model.bind('change', this.render);
        this.model.view = this;
    },
    render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
    template: _.template($('#checkboxrow_template').html())
});

var CheckboxContainer = Backbone.View.extend({
    el: $("#solution_checkboxes"),

    addOne: function(solution) {
        var view = new CheckboxRow({model: solution});
        this.el.append(view.render().el);
    },
    addAll: function() {
        SolutionList.each(this.addOne);
    }
});
