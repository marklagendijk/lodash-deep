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
    if(typeof module !== 'undefined' && module.exports){
        _ = require('lodash');
        module.exports = mixins;
    }
    else{
        _ = window._;
    }
    var getProperties = function(path) {
        var finalProps = [];
        var rawProps = path.split(/[\.\[\]]/); // split on . or [ or ]
        rawProps = _.without(rawProps, ''); // get rid of empty properties

        for (var i=0, l=rawProps.length; i<l; i++) {
            var prop = rawProps[i];

            // check certain properties
            if (prop.match(/('|")(.*)('|")/)) {
                // ["foo"] or [\'foo\'], also matches quoted numbers ["0"] or [\'0\'] or ["foo"]
                finalProps.push(prop.replace(/('|")(.*)('|")/, '$2'));
            } else if (prop.match(/^\d+$/)) {
                // numerical index, e.g. [0] or [200]
                finalProps.push(parseInt(prop, 10));
            } else {
                // dot-notation (note, this ALSO matches dynamic bracket-notation prop names, which aren't supported)
                finalProps.push(prop);
            }
        }

        return finalProps;
    };

    _.extend(mixins, {
        /**
         * Executes a deep check for the existence of a property in an object tree.
         * @param {Object} object - The root object of the object tree.
         * @param {string} propertyPath - The dot separated propertyPath.
         * @returns {boolean}
         */
        deepIn: function(object, propertyPath){
            var properties = getProperties(propertyPath);
            while(properties.length){
                var property = properties.shift();
                if((_.isObject(object) && property in object || _.isArray(object) && object.indexOf(property) !== -1)){
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
            var properties = getProperties(propertyPath);
            while(properties.length){
                var property = properties.shift();
                if((_.isObject(object) && object.hasOwnProperty(property) || _.isArray(object) && object.indexOf(property) !== -1)){
                    object = object[property];
                }
                else{
                    return false;
                }
            }

            return true;
        },
        /**
         * Retrieves the value of a property in an object tree.
         * @param {Object} object - The root object of the object tree.
         * @param {string} propertyPath - The dot separated propertyPath.
         * @returns {*} - The value, or undefined if it doesn't exists.
         */
        deepGet: function(object, propertyPath){
            if(_.deepIn(object, propertyPath)){
                return _.reduce(getProperties(propertyPath), function(object, property){
                    return object[property];
                }, object);
            }
            else{
                return undefined;
            }
        },
        /**
         * Retrieves the own value of a property in an object tree.
         * @param {Object} object - The root object of the object tree.
         * @param {string} propertyPath - The dot separated propertyPath.
         * @returns {*} - The value, or undefined if it doesn't exists.
         */
        deepOwn: function(object, propertyPath){
            if(_.deepHas(object, propertyPath)){
                return _.reduce(getProperties(propertyPath), function(object, property){
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

            properties = getProperties(propertyPath);
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
                return _.deepGetValue(item, propertyPath);
            });
        }
    });

    // support pre 1.2.0 function names
    mixins.deepSetValue = mixins.deepSet;
    mixins.deepGetValue = mixins.deepGet;
    mixins.deepGetOwnValue = mixins.deepOwn;

    _.mixin(mixins);
})();