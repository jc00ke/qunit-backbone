
var Vendor = Backbone.Model.extend({
});

var VendorList = Backbone.Collection.extend({
    model: Vendor,
    comparator: function(vendor) { return vendor.get('name') }
});

var Cert = Backbone.Model.extend({
});

var CertList = Backbone.Collection.extend({
    model: Cert,
    comparator: function(cert) { return cert.get('name'); },
});
