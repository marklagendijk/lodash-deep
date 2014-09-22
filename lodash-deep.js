/**
 * Lodash mixins for (deep) object accessing / manipulation.
 * @author Mark Lagendijk <mark@lagendijk.info>
 * @license MIT
 */
(function(undefined){
    'use strict';

    // Node.js support
    var isNode = (typeof module !== 'undefined' && module.exports);
    var _ = isNode ? require('lodash').runInContext() : window._;

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
                if(_.isObject(collection) && property in collection){
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
                if(_.isObject(collection) && collection.hasOwnProperty(property)){
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
                .replace(/\./g, '\\.');
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
            var properties = getProperties(propertyPath)
            if(_.isObject(object) && !_.isDate(object) && !_.isRegExp(object)){
                return _.extend(object, _.mapValues(object, function(value, key){
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

    if(isNode){
        module.exports = mixins;
    }

    /**
     * The RegEx used by getPropertyPathParts
     * We want to split on any non-escaped dot. Because the escape character can be escaped itself we have to check that
     * the dot is not preceded by an uneven amount of backslashes.
     * Normally we would use the following RegEx to split the path into the appropriate parts:
     * /(?<!\\)(?:\\\\)*\./
     * 1. (?<!\\)    Sequence not starting with \. This is called a 'lookbehind'.
     * 2. (\\\\)    Any number of \\
     * 3. \.        A dot
     * Unfortunately Javascript does not support 'lookbehind', so we have to use a workaround.
     * Since Javascript does support 'lookahead' we can reverse both the path, and the RegEx (so it can use 'lookahead'
     * instead of 'lookbehind')
     * The reverse RegEx is:
     * /\.(\\\\)*(?!(\\))/
     * 1. \.        A dot
     * 2. (\\\\)*    Any number of \\
     * 3. (?!(\\))    Sequence not ending with \. This is called a 'lookahead'.
     * @type {RegExp}
     */
    var reversePathSplitRegex = /\.(\\\\)*(?!(\\))/;

    /**
     * Returns the property path as array.
     * @param {string|Array} propertyPath
     * @returns {Array}
     */
    function getProperties(propertyPath){
        if(_.isArray(propertyPath)){
            return propertyPath;
        }
        else if(!_.isString(propertyPath)){
            return [];
        }

        // Reverse the path, so it can be used with the reverse RegEx
        return _(reverseString(propertyPath)
            // Split using the RegEx.
            .split(reversePathSplitRegex)
            // Reverse the parts of the array, to get them in original order
            .reverse())
            // The array returned by the splitting RegEx contains 3 items per path part:
            // 1. The main part
            // 2. undefined
            // 3. Backslashes located at the end of the part
            // Add these together to appropriate path parts
            .forEach(function(part, index, parts){
                if(index % 3 === 2 && part !== undefined){
                    parts[index - 2] += part;
                    parts[index] = undefined;
                }
            })
            // Remove undefined items
            .pull(undefined)
            // Unescape the parts, and reverse their contents back to original order
            .map(function(part){
                return reverseString(part)
                    .replace(/\\\\/g, '\\')
                    .replace(/\\\./g, '.');
            })
            .value();
    }

    function reverseString(string){
        return string.split('').reverse().join('');
    }
})();
