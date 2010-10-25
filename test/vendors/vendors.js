
$(document).ready(function() {

    module("Vendor sanity check");

    test("properties", function() {
        expect(4);
        var vendor = new Vendor({
            name: "Bob's HVAC",
            certs: ["hvac", "green"]
        });
        ok(vendor, "created");
        equals(vendor.get('name'), "Bob's HVAC", "name works");
        ok(_.include(vendor.get('certs'), 'hvac'), "hvac cert is included");
        ok(!_.include(vendor.get('certs'), 'red'), "red cert is not included");
    });

    module("Vendor Collection sanity check");

    test("basic collection", function() {
        expect(3);
        var list = new VendorList;
        list.comparator = function(vendor) {
            return vendor.get('name');
        }

        list.add(new Vendor({name: "Cooke's", certs: ["auction", "real_estate"]}));
        list.add(new Vendor({name: "Hoffman's", certs: ["perl", "real_estate"]}));
        equals(list.length, 2, "length");
        equals(list.at(0).get("name"), "Cooke's", "order should be set");
        list.add(new Vendor({name: "Dave's", certs: ["ruby", "auction"]}));
        equals(list.at(1).get("name"), "Dave's", "order should be set on added items");
    });

    test("collection from page", function() {
        var vendorList = new VendorList;

        $("#vendors li").each(function() {
            var v = $(this);
            var certList =  _($('.solutions', v).html().split(',')).chain()
                            .map(function(solution) {
                                var name = $.trim(solution);
                                return new Cert({name: name});
                            })
                            .sortBy(function(solution) {
                                return solution.get("name");
                            })
                            .value();

            vendorList.add(
                new Vendor({
                    name:   $('.name', v).text(),
                    certs:  certList
                })
            );
        });

        equals(78, vendorList.length, "should be the known count of 78");
        var first = vendorList.at(0);
        var firstCerts = first.get("certs").map(function(c){return c.get("name")});

        var expectedCerts = ["Energy Audit", "Solar Electric"];
        same(firstCerts, expectedCerts, "first vendor's certs");
        equals(first.get('name'), "A Bright Idea Electrical", "check name of first model in collection");
    });

});
