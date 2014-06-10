/**
 * Lodash mixins for (deep) object accessing / manipulation.
 * @author Mark Lagendijk <mark@lagendijk.info>
 * @license MIT
 */
(function(undefined){
	'use strict';

	// Node.js support
	var _;
	var mixins = {};
	if(typeof require === 'function'){
		_ = require('lodash');
		module.exports = mixins;
	} else{
		_ = window._;
	}

	_.extend(mixins, {
		/**
		 * Executes a deep check for the existence of a property in an object tree.
		 * @param {Object} object - The root object of the object tree.
		 * @param {string} propertyPath - The dot separated propertyPath.
		 * @returns {boolean}
		 */
		deepIn: function(object, propertyPath){
			var properties = propertyPath.split('.');
			while(properties.length){
				var property = properties.shift();
				if(_.isObject(object) && property in object){
					object = object[property];
				}
				else{
					return false;
				}
			}

			return true;
		},
		/**
		 * Executes a deep check for the existence of a own property in an object tree.
		 * @param {Object} object - The root object of the object tree.
		 * @param {string} propertyPath - The dot separated propertyPath.
		 * @returns {boolean}
		 */
		deepHas: function(object, propertyPath){
			var properties = propertyPath.split('.');
			while(properties.length){
				var property = properties.shift();
				if(_.isObject(object) && object.hasOwnProperty(property)){
					object = object[property];
				}
				else{
					return false;
				}
			}

			return true;
		},
		/**
		 * Retreives the value of a property in an object tree.
		 * @param {Object} object - The root object of the object tree.
		 * @param {string} propertyPath - The dot separated propertyPath.
		 * @returns {*} - The value, or undefined if it doesn't exists.
		 */
		deepGet: function(object, propertyPath){
			if(_.deepIn(object, propertyPath)){
				return _.reduce(propertyPath.split('.'), function(object, property){
					return object[property];
				}, object);
			}
			else{
				return undefined;
			}
		},
		/**
		 * Retreives the own value of a property in an object tree.
		 * @param {Object} object - The root object of the object tree.
		 * @param {string} propertyPath - The dot separated propertyPath.
		 * @returns {*} - The value, or undefined if it doesn't exists.
		 */
		deepGetOwn: function(object, propertyPath){
			if(_.deepHas(object, propertyPath)){
				return _.reduce(propertyPath.split('.'), function(object, property){
					return object[property];
				}, object);
			}
			else{
				return undefined;
			}
		},
		/**
		 * Sets a value of a property in an object tree. Any missing objects will be created.
		 * @param {Object} object - The root object of the object tree.
		 * @param {string} propertyPath - The dot separated propertyPath.
		 * @param {*} value - The value to set.
		 * @returns {Object} The object.
		 */
		deepSet: function(object, propertyPath, value){
			var properties, property, currentObject;

			properties = propertyPath.split('.');
			currentObject = object;
			while(properties.length){
				property = properties.shift();
				if(!_.isObject(currentObject[property])){
					currentObject[property] = {};
				}
				if(!properties.length){
					currentObject[property] = value;
				}
				currentObject = currentObject[property];
			}

			return object;
		},
		/**
		 * Executes a deep pluck on an collection of object trees.
		 * @param {Object|Array} collection - The collection of object trees.
		 * @param {string} propertyPath - The dot separated propertyPath.
		 * @returns {Array}
		 */
		deepPluck: function(collection, propertyPath){
			return _.map(collection, function(item){
				return _.deepGet(item, propertyPath);
			});
		}
	});
	
	// support pre 1.2.0 function names
	mixins.deepGetValue = mixins.deepGet;
	mixins.deepGetOwnValue = mixins.deepGetOwn;
	mixins.deepSetValue = mixins.deepSet;
	
	_.mixin(mixins);
})();
