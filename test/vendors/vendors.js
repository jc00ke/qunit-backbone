
$(document).ready(function() {

    module("Vendor");

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

});
