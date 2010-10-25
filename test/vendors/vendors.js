
$(document).ready(function() {

    module("Vendor sanity check");

    test("properties", function() {
        expect(4);
        var vendor = new Vendor({
            name: "Bob's HVAC",
            solutions: ["hvac", "green"]
        });
        ok(vendor, "created");
        equals(vendor.get('name'), "Bob's HVAC", "name works");
        ok(_.include(vendor.get('solutions'), 'hvac'), "hvac solution is included");
        ok(!_.include(vendor.get('solutions'), 'red'), "red solution is not included");
    });

    module("Vendor Collection sanity check");

    test("collection from page", function() {
        var vendorList = new VendorList;

        $("#vendors li").each(function() {
            var v = $(this);
            // TODO:  make solutionList an actual SolutionList
            var solutionList =  _($('.solutions', v).html().split(',')).chain()
                            .map(function(solution) {
                                var name = $.trim(solution);
                                return new Solution({name: name});
                            })
                            .sortBy(function(solution) {
                                return solution.get("name");
                            })
                            .value();

            vendorList.add(
                new Vendor({
                    name:   $('.name', v).text(),
                    solutions:  new SolutionList(solutionList)
                })
            );
        });

        equals(78, vendorList.length, "should be the known count of 78");
        var first = vendorList.at(0);
        var firstSolutions = first.get("solutions").map(function(c){return c.get("name")});

        var expectedSolutions = ["Energy Audit", "Solar Electric"];
        same(firstSolutions, expectedSolutions, "first vendor's solutions");
        equals(first.get('name'), "A Bright Idea Electrical", "check name of first model in collection");
    });

});
