/**
 * Lodash mixins for (deep) object accessing / manipulation.
 * @author Mark Lagendijk <mark@lagendijk.info>
 * @license MIT
 */
(function(root, factory){
    if(typeof define === 'function' && define.amd){
        // AMD. Register as an anonymous module.
        define(['lodash'], factory);
    }
    else if(typeof exports === 'object'){
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('lodash').runInContext());
    }
    else{
        // Browser globals (root is window)
        root._.mixin(factory(root._));
    }
}(this, function(_, undefined){
    'use strict';

    var mixins = /** @lends _ */ {
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
                    currentObject[property] = isArrayKey(properties[index + 1]) ? [] : {};
                }
                currentObject = currentObject[property];
            });

            return collection;
        },
        /**
         * Checks if the value at the propertyPath resolves to undefined, and sets it to defaultValue if this is the
         * case.
         * @param {Object|Array} collection - The collection of object trees.
         * @param {string|Array} propertyPath - The propertyPath of the function.
         * @param {*} defaultValue - The default value.
         * @returns {*} Either the existing, unchanged value, or the new (default) value.
         */
        deepDefault: function(collection, propertyPath, defaultValue){
            var value = _.deepGet(collection, propertyPath);
            if(_.isUndefined(value)){
                _.deepSet(collection, propertyPath, defaultValue);
                return defaultValue;
            }
            else{
                return value;
            }
        },
        /**
         * Calls a function located at the specified property path, if it exists.
         * @param {Object|Array} collection - The collection of object trees.
         * @param {string|Array} propertyPath - The propertyPath of the function.
         * @param {Object} [thisArg] - The 'this' argument the function should be executed with.
         * @param {...*} [arg] - One of the arguments the function should be executed with. Can occur 0..n times.
         * @returns {*} The result of executing the function, or undefined if it doesn't exist.
         */
        deepCall: function(collection, propertyPath, thisArg, arg){
            var args = Array.prototype.slice.call(arguments, 3);
            return _.deepApply(collection, propertyPath, thisArg, args);
        },
        /**
         * Applies a function located at the specified property path, if it exists.
         * @param {Object|Array} collection - The collection of object trees.
         * @param {string|Array} propertyPath - The propertyPath of the function.
         * @param {Object} [thisArg] - The 'this' argument the function should be executed with.
         * @param {Array} [args] - An array of the arguments the function should be executed with.
         * @returns {*} The result of executing the function, or undefined if it doesn't exist.
         */
        deepApply: function(collection, propertyPath, thisArg, args){
            var func = _.deepGet(collection, propertyPath);
            if(_.isFunction(func)){
                return func.apply(thisArg, args);
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
            if(_.isArray(object)){
                return _.map(object, deepMapValuesIteratee);
            }
            else if(_.isObject(object) && !_.isDate(object) && !_.isRegExp(object)){
                return _.extend({}, object, _.mapValues(object, deepMapValuesIteratee));
            }
            else{
                return callback(object, properties);
            }

            function deepMapValuesIteratee(value, key){
                return _.deepMapValues(value, callback, _.flatten([properties, key]));
            }
        },
        /**
         * @function
         * Executes a deep pluck on an collection of object trees.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {Array}
         */
        deepPluck: createDeepPluckStyleCallback(_.map),
        /**
         * @function
         * Executes {@link https://lodash.com/docs#findIndex _.findIndex} with a "_.deepPluck" style callback.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {int}
         */
        deepFindIndex: createDeepPluckStyleCallback(_.findIndex),
        /**
         * @function
         * Executes {@link https://lodash.com/docs#findLastIndex _.findLastIndex} with a "_.deepPluck" style callback.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {int}
         */
        deepFindLastIndex: createDeepPluckStyleCallback(_.findLastIndex),
        /**
         * @function
         * Executes {@link https://lodash.com/docs#first _.first} with a "_.deepPluck" style callback.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {*}
         */
        deepFirst: createDeepPluckStyleCallback(_.first),
        /**
         * @function
         * Executes {@link https://lodash.com/docs#flatten _.flatten} with a "_.deepPluck" style callback.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {Array}
         */
        deepFlatten: createDeepPluckStyleCallback(_.flatten),
        /**
         * @function
         * Executes {@link https://lodash.com/docs#initial _.initial} with a "_.deepPluck" style callback.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {Array}
         */
        deepInitial: createDeepPluckStyleCallback(_.initial),
        /**
         * @function
         * Executes {@link https://lodash.com/docs#last _.last} with a "_.deepPluck" style callback.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {*}
         */
        deepLast: createDeepPluckStyleCallback(_.last),
        /**
         * @function
         * Executes {@link https://lodash.com/docs#lastIndexOf _.lastIndexOf} with a "_.deepPluck" style callback.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {int}
         */
        deepLastIndexOf: createDeepPluckStyleCallback(_.lastIndexOf),
        /**
         * @function
         * Executes {@link https://lodash.com/docs#remove _.remove} with a "_.deepPluck" style callback.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {Array}
         */
        deepRemove: createDeepPluckStyleCallback(_.remove),
        /**
         * @function
         * Executes {@link https://lodash.com/docs#rest _.rest} with a "_.deepPluck" style callback.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {Array}
         */
        deepRest: createDeepPluckStyleCallback(_.rest),
        /**
         * @function
         * Executes {@link https://lodash.com/docs#sortedIndex _.sortedIndex} with a "_.deepPluck" style callback.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {int}
         */
        deepSortedIndex: createDeepPluckStyleCallback(_.sortedIndex),
        /**
         * @function
         * Executes {@link https://lodash.com/docs#uniq _.uniq} with a "_.deepPluck" style callback.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {Array}
         */
        deepUniq: createDeepPluckStyleCallback(_.uniq),
        /**
         * @function
         * Executes {@link https://lodash.com/docs#countBy _.countBy} with a "_.deepPluck" style callback.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {Object}
         */
        deepCountBy: createDeepPluckStyleCallback(_.countBy),
        /**
         * @function
         * Executes{@link https://lodash.com/docs#every _.every} with a "_.deepPluck" style callback.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {boolean}
         */
        deepEvery: createDeepPluckStyleCallback(_.every),
        /**
         * @function
         * Executes {@link https://lodash.com/docs#filter _.filter} with a "_.deepPluck" style callback.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {Array}
         */
        deepFilter: createDeepPluckStyleCallback(_.filter),
        /**
         * @function
         * Executes {@link https://lodash.com/docs#find _.find} with a "_.deepPluck" style callback.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {*}
         */
        deepFind: createDeepPluckStyleCallback(_.find),
        /**
         * @function
         * Executes{@link https://lodash.com/docs#groupBy _.groupBy} with a "_.deepPluck" style callback.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {Object}
         */
        deepGroupBy: createDeepPluckStyleCallback(_.groupBy),
        /**
         * @function
         * Executes {@link https://lodash.com/docs#indexBy _.indexBy} with a "_.deepPluck" style callback.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {Object}
         */
        deepIndexBy: createDeepPluckStyleCallback(_.indexBy),
        /**
         * @function
         * Executes {@link https://lodash.com/docs#max _.max} with a "_.deepPluck" style callback.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {*}
         */
        deepMax: createDeepPluckStyleCallback(_.max),
        /**
         * @function
         * Executes {@link https://lodash.com/docs#min _.min} with a "_.deepPluck" style callback.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {*}
         */
        deepMin: createDeepPluckStyleCallback(_.min),
        /**
         * @function
         * Executes {@link https://lodash.com/docs#reject _.reject} with a "_.deepPluck" style callback.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {Array}
         */
        deepReject: createDeepPluckStyleCallback(_.reject),
        /**
         * @function
         * Executes {@link https://lodash.com/docs#some _.some} with a "_.deepPluck" style callback.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {boolean}
         */
        deepSome: createDeepPluckStyleCallback(_.some),
        /**
         * @function
         * Executes {@link https://lodash.com/docs#sortBy _.sortBy} with a "_.deepPluck" style callback.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {Array}
         */
        deepSortBy: createDeepPluckStyleCallback(_.sortBy),
        /**
         * @function
         * Executes {@link https://lodash.com/docs#findKey _.findKey} with a "_.deepPluck" style callback.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {string|undefined}
         */
        deepFindKey: createDeepPluckStyleCallback(_.findKey),
        /**
         * @function
         * Executes {@link https://lodash.com/docs#findLastKey _.findLastKey} with a "_.deepPluck" style callback.
         * @param {Object|Array} collection - The root object/array of the tree.
         * @param {string|Array} propertyPath - The propertyPath.
         * @returns {string|undefined}
         */
        deepFindLastKey: createDeepPluckStyleCallback(_.findLastKey)
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

        return parseStringPropertyPath(propertyPath);
    }

    /**
     * Parses a string based propertyPath
     * @param {string} propertyPath
     * @returns {Array}
     */
    function parseStringPropertyPath(propertyPath){
        var character = '';
        var parsedPropertyPath = [];
        var parsedPropertyPathPart = '';
        var escapeNextCharacter = false;
        var isSpecialCharacter = false;
        var insideBrackets = false;

        // Walk through the path and find backslashes that escape periods or other backslashes, and split on unescaped
        // periods and brackets.
        for(var i = 0; i < propertyPath.length; i++){
            character = propertyPath[i];
            isSpecialCharacter = (character === '\\' || character === '[' || character === ']' || character === '.');

            if(isSpecialCharacter && !escapeNextCharacter){
                if(insideBrackets && character !== ']'){
                    throw new SyntaxError('unexpected "' + character + '" within brackets at character ' + i + ' in property path ' + propertyPath);
                }

                switch(character){
                case '\\':
                    escapeNextCharacter = true;
                    break;
                case ']':
                    insideBrackets = false;
                    break;
                case '[':
                    insideBrackets = true;
                    /* falls through */
                case '.':
                    parsedPropertyPath.push(parsedPropertyPathPart);
                    parsedPropertyPathPart = '';
                    break;
                }
            }
            else{
                parsedPropertyPathPart += character;
                escapeNextCharacter = false;
            }
        }

        if(parsedPropertyPath[0] === ''){
            //allow '[0]', or '.0'
            parsedPropertyPath.splice(0, 1);
        }

        // capture the final part
        parsedPropertyPath.push(parsedPropertyPathPart);
        return parsedPropertyPath;
    }

    /**
     * Creates a function which executes the originalFunction with a "_.deepPluck" style callback.
     * @param {Function} originalFunction - The orignal (Lodash) function.
     * @returns {Function}
     */
    function createDeepPluckStyleCallback(originalFunction){
        return function(collection, propertyPath){
            return originalFunction(collection, function(item){
                return _.deepGet(item, propertyPath);
            });
        };
    }

    /**
     * Checks whether key is a valid array key
     * @param key
     * @returns {boolean}
     */
    function isArrayKey(key){
        var array = [];
        array[key] = null;
        return array.length > 0;
    }

    return mixins;
}));
