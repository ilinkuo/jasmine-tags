// Nodejs check
if (typeof process == "undefined") {
	throw "Sorry, jasmine-tags only runs inside Nodejs for now, but maybe soon things will change"
}

const chalk = require("chalk");
const _ = require("underscore");
const NOOP_IT = {
	pend: () => undefined
};

function wrapDescribe(func){
	if (typeof func !== 'function'){
		console.log('expected func argument to be a function but was ', typeof func);
		throw "COULD NOT WRAP NON-FUNCTION";
	}
	var wrapper = function(){
		var args = conform(arguments, applyDTemplate);
		pushTags(args.self);
		var result = func.call(args.self, args.should, args.func);
		popTags();
		return result;
	}
	return wrapper;
}

function wrapIt(func, callThrough){
	if (typeof func !== 'function'){
		console.error('expected func argument to be a function but was ', typeof func);
		throw "COULD NOT WRAP NON-FUNCTION";
	}
	var wrapper = function(){
		var args = conform(arguments, applyITemplate);
		if (hasTags(WRAP_OPTIONS.extractTags(args.self), WRAP_STATE.describeTags)) {
			return func.call(args.self, args.should, args.func);
		} else {
			return NOOP_IT;
		}
	}
	return wrapper;
}

/**
	Conform actual arguments to accepted signatures
	classic: string(should), function, [self]
	tags: 
		- string, object, function
		- object, function

*/
function conform(args, apply){
	if (args.length === 2){
		if (typeof args[0] == "string"){
			// SIGNATURE (classic): string, function
			return {should: args[0], func: args[1], self: {} };
		} else {
			// SIGNATURE: object, function
			return {should: apply(args[0]), func: args[1], self: args[0]};
		}
	} else {
		// SIGNATURE: string, object, function
		args[1].name = args[0];
		return {should: apply(args[1]), func: args[2], self: args[1]};
	}
}

// Just sample option listing the possible configs
var WRAP_OPTIONS = {
	dTemplate: null,
	iTemplate: null,
	compiledDTemplate: null,
	compiledITemplate: null,
	tagsAny: null,
	tagsAll: null
};

const WRAP_STATE = {tagStack: []};

// protractor configs http://stackoverflow.com/questions/29406962/can-i-access-parameters-in-my-protractor-configuration-file
function wrapAll(){
	if(typeof describe == "undefined"){
		console.error("Either Jasmine or Protractor must be defined before jasmine extension tags");
		return;
	}
	describe = wrapDescribe(describe);
	
	if (typeof ddescribe !== "undefined") {ddescribe = wrapDescribe(ddescribe);} 
	if (typeof fdescribe !== "undefined") {fdescribe = wrapDescribe(fdescribe);} 
	xdescribe = wrapDescribe(xdescribe);
	
	it = wrapIt(it);
	// TODO: allow fit to call through
	if (typeof fit !== "undefined") {fit = wrapIt(fit);}
	xit = wrapIt(xit);
	describe.config = function(configs){
		if (!configs) return WRAP_OPTIONS;

		// TODO: should I worry about this being invoked multiple times
		WRAP_OPTIONS = Object.create(configs);

		// Default options
		WRAP_OPTIONS.dTemplate = WRAP_OPTIONS.dTemplate || "<%- name %>"
		WRAP_OPTIONS.iTemplate = WRAP_OPTIONS.iTemplate || "<%- name %>"

		if (WRAP_OPTIONS.dTemplate && !WRAP_OPTIONS.compiledDTemplate){
			WRAP_OPTIONS.compiledDTemplate = _.template(WRAP_OPTIONS.dTemplate);
		}
		if (WRAP_OPTIONS.iTemplate && !WRAP_OPTIONS.compiledITemplate){
			WRAP_OPTIONS.compiledITemplate = _.template(WRAP_OPTIONS.iTemplate);
		} 
		WRAP_OPTIONS.extractTags = WRAP_OPTIONS.extractTags || (obj => obj.tags);
	}
};



// TODO: allow this to be overridden
function applyDTemplate(obj){
	return (WRAP_OPTIONS.compiledDTemplate)? WRAP_OPTIONS.compiledDTemplate(obj): obj.name;
}
function applyITemplate(obj){
	return (WRAP_OPTIONS.compiledITemplate)? WRAP_OPTIONS.compiledITemplate(obj): obj.name;
}
function hasAnyTags(itTags){
	if (!WRAP_OPTIONS.tagsAny) return true;
	if (!itTags) return WRAP_STATE.hasDescribeTags; // return precomputed result based on describe tags only
	return WRAP_STATE.hasDescribeTags || WRAP_OPTIONS.tagsAny.some(tag => _.contains(itTags, tag));
}
function hasAllTags(itTags, describeTags){
	if (!WRAP_OPTIONS.tagsAll) return true;
	if (!itTags) return WRAP_STATE.hasDescribeTags; // return precomputed result based on describe tags only
	return WRAP_OPTIONS.tagsAll.every(tag => _.contains(itTags, tag) || _.contains(describeTags, tag));
}
function hasTags(itTags, describeTags){
	return (WRAP_OPTIONS.tagsAny)? hasAnyTags(itTags): hasAllTags(itTags, describeTags);
}
function pushTags(obj){
	WRAP_STATE.tagStack.push(obj.tags || []);
	updateTags();
}
function popTags(){
	WRAP_STATE.tagStack.pop();
	updateTags();
}
/**
	Update tags and pre-compute hasDescribeTags (optimization)
*/
function updateTags(){
	WRAP_STATE.describeTags = WRAP_STATE.tagStack.reduce(function(a, b){
		return a.concat(b);
	}, []);
	WRAP_STATE.hasDescribeTags = (WRAP_OPTIONS.tagsAny)? 
		hasAnyTags(WRAP_STATE.describeTags): 
		hasAllTags(WRAP_STATE.describeTags);
}

wrapAll();