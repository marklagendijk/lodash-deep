/**
 * Lodash mixins for (deep) object accessing / manipulation.
 * @author Mark Lagendijk <mark@lagendijk.info>
 * @license MIT
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['lodash'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('lodash').runInContext());
    } else {
        // Browser globals (root is window)
        root._.mixin(factory(root._));
    }
}(this, function (_, undefined) {
    'use strict';

    var mixins = {
        /**
         * Executes a deep check for the existence of a property in an object tree.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {boolean}
         */
        deepIn: function(collection, propertyPath){
            var properties = getProperties(propertyPath);
            for(var i = 0; i < properties.length; i++){
                var property = properties[i];
                if(_.has(collection, property) ||
                   _.isObject(collection) && property in collection){
                    collection = collection[property];
                }
                else{
                    return false;
                }
            }

            return true;
        },
        /**
         * Executes a deep check for the existence of a own property in an object tree.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {boolean}
         */
        deepHas: function(collection, propertyPath){
            var properties = getProperties(propertyPath);
            for(var i = 0; i < properties.length; i++){
                var property = properties[i];
                if(_.has(collection, property)){
                    collection = collection[property];
                }
                else{
                    return false;
                }
            }

            return true;
        },
        /**
         * Retrieves the value of a property in an object tree.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {*} - The value, or undefined if it doesn't exists.
         */
        deepGet: function(collection, propertyPath){
            var properties = getProperties(propertyPath);
            if(_.deepIn(collection, properties)){
                return _.reduce(properties, function(object, property){
                    return object[property];
                }, collection);
            }
            else{
                return undefined;
            }
        },
        /**
         * Retrieves the own value of a property in an object tree.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {*} - The value, or undefined if it doesn't exists.
         */
        deepOwn: function(collection, propertyPath){
            var properties = getProperties(propertyPath);
            if(_.deepHas(collection, properties)){
                return _.reduce(properties, function(object, property){
                    return object[property];
                }, collection);
            }
            else{
                return undefined;
            }
        },
        /**
         * Sets a value of a property in an object tree. Any missing objects/arrays will be created.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @param {*} value - The value to set.
         * @returns {Object} The object.
         */
        deepSet: function(collection, propertyPath, value){
            var properties = getProperties(propertyPath);
            var currentObject = collection;
            _.forEach(properties, function(property, index){
                if(index + 1 === properties.length){
                    currentObject[property] = value;
                }
                else if(!_.isObject(currentObject[property])){
                    // Create the missing object or array
                    currentObject[property] = properties[index + 1] % 1 === 0 ? [] : {};
                }
                currentObject = currentObject[property];
            });

            return collection;
        },
        /**
         * Executes a deep pluck on an collection of object trees.
         * @param {Object|Array} collection - The collection of object trees.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {Array}
         */
        deepPluck: function(collection, propertyPath){
            return _.map(collection, function(item){
                return _.deepGetValue(item, propertyPath);
            });
        },
        /**
         * Calls a function located at the specified property path.
         * @param {Object|Array} collection - The collection of object trees.
         * @param {string|Array} propertyPath - The propertyPath of the function.
         * @param {Object} [thisArg] - The 'this' argument the function should be executed with.
         * @param {...*} [arg] - One of the arguments the function should be executed with. Can occur 0..n times.
         */
        deepCall: function(collection, propertyPath, thisArg, arg){
            var args = Array.prototype.slice.call(arguments, 3);
            return _.deepApply(collection, propertyPath, thisArg, args);
        },
        /**
         * Applies a function located at the specified property path.
         * @param {Object|Array} collection - The collection of object trees.
         * @param {string|Array} propertyPath - The propertyPath of the function.
         * @param {Object} [thisArg] - The 'this' argument the function should be executed with.
         * @param {Array} [args] - An array of the arguments the function should be executed with.
         */
        deepApply: function(collection, propertyPath, thisArg, args){
            var func = _.deepGet(collection, propertyPath);
            if(_.isFunction(func)){
                return func.apply(thisArg, args);
            }
            else{
                return undefined;
            }
        },
        /**
         * Escapes a property name for usage in a string based property path.
         * @param {string} propertyName - The name / key of the property.
         * @returns {string}
         */
        deepEscapePropertyName: function(propertyName){
            return propertyName
                .replace(/\\/g, '\\\\')
                .replace(/(\.|\[|\])/g, '\\$1');
        },
        /**
         * Maps all values in an object tree and returns a new object with the same structure as the original.
         * @param {Object} object - The object to map.
         * @param {Function} callback - The function to be called per iteration on any non-object value in the tree.
         *   Callback is invoked with 2 arguments: (value, propertyPath)
         *   propertyPath is the path of the current property, in array format.
         * @returns {Object}
         */
        deepMapValues: function(object, callback, propertyPath){
            var properties = getProperties(propertyPath);
            if(_.isObject(object) && !_.isDate(object) && !_.isRegExp(object)){
                return _.extend({}, object, _.mapValues(object, function(value, key){
                    return _.deepMapValues(value, callback, _.flatten([properties, key]));
                }));
            }
            else{
                return callback(object, properties);
            }
        }
    };

    // Support pre 1.2.0 function names
    mixins.deepSetValue = mixins.deepSet;
    mixins.deepGetValue = mixins.deepGet;
    mixins.deepGetOwnValue = mixins.deepOwn;

    _.mixin(mixins);

    /**
     * Returns the property path as array.
     * @param {string|Array} propertyPath
     * @returns {Array}
     */
    function getProperties(propertyPath){
        if(_.isArray(propertyPath)){
            return propertyPath;
        }

        if(!_.isString(propertyPath)){
            return [];
        }

        var i = 0;
        var ch = '';
        var len = propertyPath.length;
        var path = [];
        var step = '';
        var error = null;
        var escape = false;
        var control = false;
        var brackets = false;

        // walk through the path and find backslashes that escape
        // periods or other backslashes, and split on unescaped periods
        // and brackets
        for (; i < len; i++) {
            ch = propertyPath[i];
            control = (ch === '\\' || ch === '[' || ch === ']' || ch === '.');

            if (control && !escape) {
                if (brackets && ch !== ']') {
                    error = 'unexpected "' + ch + '" within brackets';
                    break;
                }

                switch (ch) {
                case '\\':
                    escape = true;
                    break;
                case ']':
                    brackets = false;
                    break;
                case '[':
                    brackets = true;
                    /* falls through */
                case '.':
                    path.push(step);
                    step = '';
                    break;
                }

                continue;
            }

            step += ch;
            escape = false;
        }

        if (error) {
            throw new SyntaxError(error + ' at character ' + i + ' in property path ' + propertyPath);
        }

        if (path[0] === '') {
            //allow '[0]', or '.0'
            path.splice(0, 1);
        }

        // capture the final step
        path.push(step);
        return path;
    }

    return mixins;
}));
