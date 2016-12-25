require("jasmine");
require("../jasmine-tags.js");

describe.config({
	trace: true,
	// tagsAny : ["yup", "wup"],
	// tagsAll : ["yup","Page"]//,
	tagsAny: ["HULK"]
	//extractTags: (obj => ["yup","Page"].concat(obj.tags))
});

describe.help();

// TODO: REMOVE, FOR TESTING
const TEST_RESULT = false;

describe("Test Harness [Page]", {tags: ["Page"]}, function(){
	it("outer runs [yup]", {tags: ["yup"]},function(){
		console.log("EMPTY TEST PASSED outer");
		expect(true).toBe(TEST_RESULT);
	});

	describe("nested [Search]", {tags: ["Search"]}, function(){
		it("should inner", function(){
			console.log("EMPTY TEST EXECUTED inner");
			expect(true).toBe(TEST_RESULT);
		});
		describe("RUMPLESTILTSKIN [submit]", {tags: ["submit"]}, function(){
			it("should inner inner runs #1 [yup]", {tags: ["yup"]}, function(){
				console.log("EMPTY TEST EXECUTED inner inner #1");
				expect(true).toBe(TEST_RESULT);
			});
			it({name: "NAME should inner inner runs #2 [wup]", tags: ["wup"]}, function(){
				console.log(chalk.magenta("EMPTY TEST EXECUTED inner inner #2"));
				expect(true).toBe(true);
				expect(true).toBe(TEST_RESULT);
			});
		});
	});

	describe("avengers [Catalog, yup]", {tags: ["Catalog", "yup"]}, function(){
		describe("HULK [index]", {tags: ["index"]}, function(){
			it("should not get angry", function(){
				console.log("TURNING GREEN");
				expect(true).toBe(TEST_RESULT);
			})
		})

		it("should avenge", function(){
			console.log("IRON MAN");
			expect(true).toBe(TEST_RESULT);
		});
	})
});


// preamble
// console.log(process.argv);
console.log("==== ========================");
// console.log(process.env);

		