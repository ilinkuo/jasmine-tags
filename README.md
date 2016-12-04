# jasmine-tags
Extend Jasmine and Protractor with tags

This node module extends Jasmine and Protractor by adding tagging functionality. Tagging enables the selective running and reporting of tests. Tags placed on describe()'s elements are inherited by descendant it()'s. By default, the string argument of describe() is tokenized into tags.

Example:
--------
```javascript
describe("Search", function(){ // All child tests will be tagged with "Search"
	it("should find employees by name", 
		{tags: ["employee","name"]}, // effective tags are "Search","employee","name"
		function(){ 
		/*...*/ 
	});
	// All child tests will be tagged with "Search" and "type"
	describe("typeSelector", {tags: ["type"]}, function(){ 
		it()
	});
});
```

Running Jasmine-Tags
====================
Jasmine must be loaded before jasmine-tags. After loading, `describe.configure()` may be optionally called to configure jasmine-tags and pass in tag arguments. If command line arguments are provided, they will override those passed in via configure().

Because the require call to jasmine-tags is idempotent and the describe.configure() completely resets the internal state each time it is called, it is possible (but not recommended) to run jasmine-tags by requiring jasmine-tags and calling configure() in each spec which uses jasmine-tags.

Protractor
----------
The best way to run jasmine-tags in Protractor is to require jasmine-tags in the project's conf.js and then  call describe.configure() to pass in the tags to search for as well as any customizations.

Protractor Example:
-------------------
TODO

The above example is in ... and can be run via "npm run ..."

Jasmine
-------
The best way to run jasmine-tags in jasmine-node is to add a helper to spec/support/jasmine.json to require jasmine-tags and call describe.configure(). An example is below

Jasmine Example:
----------------
TODO

The above example is in ... and can be run via "npm run ..."


Backwards Compatibility
=======================
Any plain Jasmine/Protractor tests will run as is without any modifications. Describe() blocks with the standard Jasmine signature will be treated as if the describe() string parameter were tokenized into tags.

Example:
--------
TODO




Test Metadata Object
====================

Configuration and Customization
=============

Samples
=======


Limitations
===========
Currently, jasmine-tags only runs inside of nodejs because it uses ES6 and require. It might be possible to run jasmine-tags inside a browser via Browserify, but I haven't tested that yet.
