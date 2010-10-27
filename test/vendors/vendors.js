
$(document).ready(function() {

/********************************************/
    module("Vendor sanity check");

    test("properties", function() {
        expect(11);
        var vendor = new Vendor({
            name: "Bob's HVAC",
            solutions: ["hvac", "green"],
            propertyType: ["commercial", "residential"]
        });
        ok(vendor, "created");
        equals(vendor.get('name'), "Bob's HVAC", "name works");
        ok(_.include(vendor.get('solutions'), 'hvac'), "hvac solution is included");
        ok(!_.include(vendor.get('solutions'), 'red'), "red solution is not included");
        ok(vendor.serves("commercial"), "should serve commercial");
        ok(vendor.serves("residential"), "should serve residential");
        ok(!vendor.serves("asdf"), "should not serve asdf");
        ok("Residential and commercial".match(Vendor.servesRegExp), "should match residential & commercial");
        ok("Residential".match(Vendor.servesRegExp), "should match residential");
        ok("Commercial".match(Vendor.servesRegExp), "should match commercial");
        ok(!"asdf".match(Vendor.servesRegExp), "should not match asdf");
    });




/********************************************/
    module("VendorList sanity check", {
        setup: function() {
            this.list = new VendorList;
            this.list.add(new Vendor({ name: "Vendor 2" }));
            this.list.add(new Vendor({ name: "Vendor 1" }));
            this.list.add(new Vendor({ name: "A Vendor" }));
            this.list.add(new Vendor({ name: "Some Vendor" }));
        },
        teardown: function() {
            window.errors = null;
        }
    });

    test("check ordering", function() {
        expect(1);
        var expected = ["A Vendor", "Some Vendor", "Vendor 1", "Vendor 2"];
        var actual = this.list.pluck("name");
        same(actual, expected, "is maintained by comparator");
    });

    test("check unique solutions", function() {
        expect(1);
        this.list.at(0).solutions = new SolutionList([
            new Solution({name: "foo"}),
            new Solution({name: "bar"}),
            new Solution({name: "baz"})
        ]);
        this.list.at(2).solutions = new SolutionList([
            new Solution({name: "foo"}),
            new Solution({name: "apple"}),
            new Solution({name: "orange"})
        ]);
        this.list.at(3).solutions = new SolutionList([
            new Solution({name: "baz"})
        ]);
        var expected = ["apple", "bar", "baz", "foo", "orange"];
        same(this.list.getUnique('solutions'), expected, "should be unique & sorted");
    });

    test("check unique credentials", function() {
        expect(1);
        this.list.at(0).credentials = new CredentialList([
            new Credential({name: "foo"}),
            new Credential({name: "bar"}),
            new Credential({name: "baz"}),
            new Credential({name: "apple"})
        ]);
        this.list.at(2).credentials = new CredentialList([
            new Credential({name: "foo"}),
            new Credential({name: "apple"}),
            new Credential({name: "orange"})
        ]);
        this.list.at(3).credentials = new CredentialList([
            new Credential({name: "baz"})
        ]);
        var expected = ["apple", "bar", "baz", "foo", "orange"];
        same(this.list.getUnique('credentials'), expected, "should be unique & sorted");
    });

    test("check an error is thrown on bad getUnique arg", function() {
        expect(1);
        this.list.getUnique('asdf');
        equal(window.errors.length, 1, "only get one error");
    });




/********************************************/
    module("Solution sanity check");

    test("properties", function() {
        expect(2);
        var solution = new Solution({ name: "some solution" });
        ok(solution, "created");
        equals(solution.get('name'), "some solution", "name works");
    });




/********************************************/
    module("CheckboxRow view", {
        setup: function() {
            this.solution = new Solution({name: "foo", count: 10});
        }
    });

    test("render", function() {
        expect(4);
        this.solution.view = new CheckboxRow({model: this.solution});
        var html = this.solution.view.render().el.innerHTML;
        var count = $('.count', html);
        var cb = $(':checkbox', html);
        equal(this.solution.view.el.textContent.trim(), "foo (10)", "label value should be correct");
        equal(count.text(), "(10)", "count should be correct");

        this.solution.set({"count": 20});
        equal(this.solution.view.el.textContent.trim(), "foo (20)", "label value should be correct");

        this.solution.set({"name": "bar"});
        equal(this.solution.view.el.textContent.trim(), "bar (20)", "label value should be correct");
    });




/********************************************/
    module("SolutionList sanity check");

    test("check ordering", function() {
        expect(1);
        var list = new SolutionList;
        list.add(new Solution({ name: "Solution 2" }));
        list.add(new Solution({ name: "Solution 1" }));
        list.add(new Solution({ name: "A Solution" }));
        list.add(new Solution({ name: "Some Solution" }));

        var expected = ["A Solution", "Solution 1", "Solution 2", "Some Solution"];
        var actual = list.pluck('name');
        same(actual, expected, "is maintained by comparator");
    });




/********************************************/
    module("Credential sanity check");

    test("properties", function() {
        expect(2);
        var cert = new Credential({ name: "some cert" });
        ok(cert, "created");
        equals(cert.get('name'), "some cert", "name works");
    });




/********************************************/
    module("CredentialList sanity check");

    test("check ordering", function() {
        expect(1);
        var list = new CredentialList;
        list.add(new Credential({ name: "Credential 2" }));
        list.add(new Credential({ name: "Credential 1" }));
        list.add(new Credential({ name: "A Credential" }));
        list.add(new Credential({ name: "Some Credential" }));

        var expected = ["A Credential", "Credential 1", "Credential 2", "Some Credential"];
        var actual = list.map(function(s) { return s.get("name"); });
        same(actual, expected, "is maintained by comparator");
    });




/********************************************/
    module("Vendor Collection", {
        setup: function() {
            var that = this;
            window.Vendors = new VendorList;

            $("#vendors li").each(function() {
                var v = $(this);
                var solutions = $('.solutions', v).html();
                var solutionList = new SolutionList;
                if (solutions) {
                    solutionList.add(_(solutions.split(',')).chain()
                                    .map(function(solution) {
                                        return new Solution({name: $.trim(solution)});
                                    })
                                    .sortBy(function(solution) {
                                        return solution.get("name");
                                    })
                                    .value()
                                );
                }
                var credentials = $('.credentials', v).html();
                var credentialList = new CredentialList;
                if (credentials) {
                    credentialList.add(_(credentials.split(',')).chain()
                                    .map(function(credential) {
                                        return new Credential({name: $.trim(credential)});
                                    })
                                    .sortBy(function(credential) {
                                        return credential.get("name");
                                    })
                                    .value()
                                );
                }
                var propertyTypeString = $('.serves', v).html();
                var propertyTypeMatches = propertyTypeString.match(Vendor.servesRegExp);
                var propertyTypes = [];
                if (propertyTypeMatches) {
                    propertyTypes = _(propertyTypeMatches).invoke("toLowerCase");
                }
                Vendors.add(
                    new Vendor({
                        name:           $('.name', v).text(),
                        solutions:      solutionList,
                        credentials:    credentialList,
                        propertyType:   propertyTypes
                    })
                );
            });
        }
    });

    test("insert checkboxes", function() {
        //expect(1);
        var solutions = Vendors.getUnique("solutions");
        console.log(Vendors);
        console.log(Vendors.getUnique("solutions"));
        _(Vendors.getUnique("solutions")).each(function(s){ console.log(s); });
    });

    test("length", function() {
        expect(1);
        equals(78, Vendors.length, "should be the known count of 78");
    });

    test("solutions", function() {
        expect(3);
        var first = Vendors.at(0);
        var firstSolutions = first.get("solutions").pluck('name');
        var expectedSolutions = ["Energy Audit", "Solar Electric"];
        same(firstSolutions, expectedSolutions, "first vendor's solutions");
        equals(first.get('name'), "A Bright Idea Electrical", "check name of first model in collection");
    });

    test("credentials", function() {
        expect(2);
        var first = Vendors.detect(function(v){ return v.get("credentials").length > 0; });
        var firstCredentials = first.get("credentials").pluck('name');
        var expectedCredentials = ["BPI Certified Building Analyst Professional"];
        same(firstCredentials, expectedCredentials, "first vendor's credentials");
        equals(first.get('name'), "Advanced Home Energy", "check name of first model in collection");
    });

    test("serves", function() {
        expect(3);

        // test "residential"
        var actualResidentials = _(Vendors.map(function(v) {
                                    if(v.serves("residential"))
                                        return v.get("name");
                                })).chain().compact();
        var expectedResidential = Vendors.detect(function(v){ return v.get("name") === "BECCA Costruction"; }).get("name");

        // test "commercial"
        var actualCommercials = _(Vendors.map(function(v) {
                                    if(v.serves("commercial"))
                                        return v.get("name");
                                })).chain().compact();
        var expectedCommercial = Vendors.detect(function(v){ return v.get("name") === "EMCo Systems Solutions, Inc."; }).get("name");

        // test both
        var actualBoth = _(Vendors.map(function(v) {
                                    if(v.serves("commercial") && v.serves("residential"))
                                        return v.get("name");
                                })).chain().compact();
        var expectedBoth = Vendors.detect(function(v){ return v.get("name") === "Voelker Plumbing"; }).get("name");

        ok(actualResidentials.include(expectedResidential), "serves pulls correct residential");
        ok(actualCommercials.include(expectedCommercial), "serves pulls correct commercial");
        ok(actualBoth.include(expectedBoth), "serves pulls both correctly");
    });
});
