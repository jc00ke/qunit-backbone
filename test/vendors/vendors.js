
$(document).ready(function() {

    module("Vendor sanity check");

    test("properties", function() {
        expect(4);
        var vendor = new Vendor({
            name: "Bob's HVAC",
            certs: ["hvac", "green"]
        });
        ok(vendor, "created");
        equals("Bob's HVAC", vendor.get('name'), "name works");
        ok(_.include(vendor.get('certs'), 'hvac'), "hvac cert is included");
        ok(!_.include(vendor.get('certs'), 'red'), "red cert is not included");
    });

    module("Vendor Collection sanity check");

    test("basic collection", function() {
        expect(1);
        var list = new VendorList;
        list.comparator = function(vendor) {
            return vendor.get('name');
        }

        list.add(new Vendor({name: "Cooke's", certs: ["auction", "real_estate"]}));
        list.add(new Vendor({name: "Hoffman's", certs: ["perl", "real_estate"]}));
        equals(2, list.length, "length");
    });

    test("collection from page", function() {
        var list = new VendorList;
        list.comparator = function(vendor) {
            return vendor.get('name');
        }
        $("#vendors li").each(function() {
            var v = $(this);
            list.add(
                new Vendor({
                    name:   $('.name', v).text(),
                    certs:  _.map($('.solutions', v), function(solution) {
                            return $(solution).html().replace(/\s|&\;\-/,'_').split(',');
                    })
                })
            );
        });
        equals(78, list.length);
    });

});
