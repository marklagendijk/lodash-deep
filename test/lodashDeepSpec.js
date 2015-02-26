/* globals: require, beforeEach, describe, it, module, inject, expect, spyOn */
describe('lodash-deep mixins', function(){
    'use strict';
    var isNode, _, object, array, objectWithFunc, thisArg;
    isNode = (typeof module !== 'undefined' && module.exports);
    if(isNode){
        _ = require('lodash');
        _.mixin(require('../lodash-deep.min.js'));
    }
    else{
        _ = window._;
    }

    beforeEach(function(){
        // set up an inherited property
        object = {
            inheritedLevel1: {
                value: 'inherited value 1',
                level2: {
                    value: 'inherited value 2'
                }
            }
        };

        object = Object.create(object);

        object.level1 = {
            value: 'value 1',
            level2: {}
        };

        // set up an enumerable and a non-enumerable own property
        Object.defineProperties(object.level1.level2, {
            ownEnumLevel3: {
                configurable: true,
                enumerable: true,
                writable: true,
                value: [
                    {
                        value: 'own enumerable value 3'
                    }
                ]
            },
            ownNonEnumLevel3: {
                configurable: true,
                enumerable: false,
                writable: true,
                value: [
                    {
                        value: 'own non-enumerable value 3'
                    }
                ]
            }
        });

        object.level1.level2.value = 'value 2';

        array = [
            {
                level1: {
                    value: 'value 1_1',
                    level2: {
                        value: 'value 2_1',
                        level3: [
                            {
                                value: 'value 3_1'
                            }
                        ]
                    }
                }
            },
            {
                level1: {
                    value: 'value 1_2',
                    level2: {
                        value: 'value 2_2',
                        level3: [
                            {
                                value: 'value 3_2'
                            }
                        ]
                    }
                }
            },
            {
                level1: {
                    value: 'value 1_3',
                    level2: {
                        value: 'value 2_3',
                        level3: [
                            {
                                value: 'value 3_3'
                            }
                        ]
                    }
                }
            },
            {
                level1: {
                    level2: {
                        level3: [
                            {}
                        ]
                    }
                }
            },
            {}
        ];

        objectWithFunc = {
            level1: {
                func: function(arg1, arg2, arg3){
                    return {
                        thisArg: this,
                        arg1: arg1,
                        arg2: arg2,
                        arg3: arg3
                    };
                }
            }
        };

        thisArg = {};
    });


    describe('deepIn(collection, propertyPath)', function(){
        it('should return whether a value exist in an object tree, for the specified property path', function(){
            expect(_.deepIn(object, 'level1')).toBe(true);
            expect(_.deepIn(object, 'level1.value')).toBe(true);
            expect(_.deepIn(object, 'level1.level2')).toBe(true);
            expect(_.deepIn(object, 'level1.level2.value')).toBe(true);

            expect(_.deepIn(object, 'level1.level2.ownEnumLevel3.0')).toBe(true);
            expect(_.deepIn(object, 'level1.level2.ownEnumLevel3.0.value')).toBe(true);

            expect(_.deepIn(object, 'level1.level2.ownNonEnumLevel3.0')).toBe(true);
            expect(_.deepIn(object, 'level1.level2.ownNonEnumLevel3.0.value')).toBe(true);

            expect(_.deepIn(object, ['level1', 'level2', 'ownEnumLevel3', 0, 'value'])).toBe(true);
            expect(_.deepIn(object, ['level1', 'level2', 'ownNonEnumLevel3', 0, 'value'])).toBe(true);

            expect(_.deepIn(object, 'blah')).toBe(false);
            expect(_.deepIn(object, 'level1.blah')).toBe(false);

            expect(_.deepIn(object, 'level1.level2.ownEnumLevel3.0.blah')).toBe(false);
            expect(_.deepIn(object, 'level1.level2.ownEnumLevel3.0.blah')).toBe(false);
            expect(_.deepIn(object, ['level1', 'level2', 'ownEnumLevel3', 0, 'blah'])).toBe(false);

            expect(_.deepIn(object, 'level1.level2.ownNonEnumLevel3.0.blah')).toBe(false);
            expect(_.deepIn(object, 'level1.level2.ownNonEnumLevel3.0.blah')).toBe(false);
            expect(_.deepIn(object, ['level1', 'level2', 'ownNonEnumLevel3', 0, 'blah'])).toBe(false);
        });
    });

    describe('deepHas(collection, propertyPath)', function(){
        it('should return whether a value exists in an object tree, as own value, for the specified property path.', function(){
            expect(_.deepHas(object, 'level1')).toBe(true);
            expect(_.deepHas(object, 'level1.value')).toBe(true);
            expect(_.deepHas(object, 'level1.level2')).toBe(true);
            expect(_.deepHas(object, 'level1.level2.value')).toBe(true);

            expect(_.deepHas(object, 'level1.value.length')).toBe(true);
            expect(_.deepHas(object, 'level1.level2.value.length')).toBe(true);

            expect(_.deepHas(object, 'level1.level2.ownEnumLevel3.0')).toBe(true);
            expect(_.deepHas(object, 'level1.level2.ownEnumLevel3.0.value')).toBe(true);
            expect(_.deepHas(object, ['level1', 'level2', 'ownEnumLevel3', 0, 'value'])).toBe(true);

            expect(_.deepHas(object, 'level1.level2.ownNonEnumLevel3.0')).toBe(true);
            expect(_.deepHas(object, 'level1.level2.ownNonEnumLevel3.0.value')).toBe(true);
            expect(_.deepHas(object, ['level1', 'level2', 'ownNonEnumLevel3', 0, 'value'])).toBe(true);

            expect(_.deepHas(object, 'inheritedLevel1.level2')).toBe(false);
            expect(_.deepHas(object, 'inheritedLevel1.level2.value')).toBe(false);
            expect(_.deepHas(object, ['inheritedLevel1', 'level2', 'value'])).toBe(false);

            expect(_.deepHas(object, 'blah')).toBe(false);
            expect(_.deepHas(object, 'level1.blah')).toBe(false);

            expect(_.deepHas(object, 'level1.level2.ownEnumLevel3.0.blah')).toBe(false);
            expect(_.deepHas(object, ['level1', 'level2', 'ownEnumLevel3', 0, 'blah'])).toBe(false);

            expect(_.deepHas(object, 'level1.level2.ownNonEnumLevel3.0.blah')).toBe(false);
            expect(_.deepHas(object, ['level1', 'level2', 'ownNonEnumLevel3', 0, 'blah'])).toBe(false);
        });
    });

    describe('deepOwn(collection, propertyPath)', function(){
        it('should retrieve the own value in an object tree, using the specified property path', function(){
            expect(_.isObject(_.deepOwn(object, 'level1'))).toBe(true);
            expect(_.deepOwn(object, 'level1.value')).toBe('value 1');
            expect(_.isObject(_.deepOwn(object, 'level1.level2'))).toBe(true);
            expect(_.deepOwn(object, 'level1.level2.value')).toBe('value 2');

            expect(_.deepOwn(object, 'level1.level2.ownEnumLevel3')).toEqual([{value: 'own enumerable value 3'}]);
            expect(_.deepOwn(object, 'level1.level2.ownEnumLevel3.0.value')).toBe('own enumerable value 3');
            expect(_.deepOwn(object, ['level1', 'level2', 'ownEnumLevel3', 0, 'value'])).toBe('own enumerable value 3');

            expect(_.deepOwn(object, 'level1.level2.ownNonEnumLevel3')).toEqual([{value: 'own non-enumerable value 3'}]);
            expect(_.deepOwn(object, 'level1.level2.ownNonEnumLevel3.0.value')).toBe('own non-enumerable value 3');
            expect(_.deepOwn(object, ['level1', 'level2', 'ownNonEnumLevel3', 0, 'value'])).toBe('own non-enumerable value 3');

            expect(_.deepOwn(object, 'inheritedLevel1.level2')).toBeUndefined();
            expect(_.deepOwn(object, 'inheritedLevel1.level2.value')).toBeUndefined();
            expect(_.deepOwn(object, ['inheritedLevel1', 'level2', 'value'])).toBeUndefined();

            expect(_.deepOwn(object, 'blah')).toBeUndefined();
            expect(_.deepOwn(object, 'level1.blah')).toBeUndefined();
            expect(_.deepOwn(object, 'level1.level2.level3.blah')).toBeUndefined();
        });
    });

    describe('deepGet(collection, propertyPath)', function(){
        it('should retrieve the value in an object tree, using the specified property path', function(){
            expect(_.isObject(_.deepGet(object, 'level1'))).toBe(true);
            expect(_.deepGet(object, 'level1.value')).toBe('value 1');
            expect(_.isObject(_.deepGet(object, 'level1.level2'))).toBe(true);
            expect(_.deepGet(object, 'level1.level2.value')).toBe('value 2');

            expect(_.isObject(_.deepGet(object, 'level1.level2.ownEnumLevel3.0'))).toBe(true);
            expect(_.isObject(_.deepGet(object, 'level1.level2.ownNonEnumLevel3.0'))).toBe(true);

            expect(_.deepGet(object, 'level1.level2.ownEnumLevel3.0.value')).toBe('own enumerable value 3');
            expect(_.deepGet(object, ['level1', 'level2', 'ownEnumLevel3', 0, 'value'])).toBe('own enumerable value 3');

            expect(_.deepGet(object, 'level1.level2.ownNonEnumLevel3.0.value')).toBe('own non-enumerable value 3');
            expect(_.deepGet(object, ['level1', 'level2', 'ownNonEnumLevel3', 0, 'value'])).toBe('own non-enumerable value 3');

            expect(_.deepGet(object, 'inheritedLevel1.level2.value')).toBe('inherited value 2');
            expect(_.deepGet(object, ['inheritedLevel1', 'level2', 'value'])).toBe('inherited value 2');

            expect(_.deepGet(object, 'blah')).toBeUndefined();
            expect(_.deepGet(object, 'level1.blah')).toBeUndefined();
            expect(_.deepGet(object, 'level1.level2.level3.0.blah')).toBeUndefined();
            expect(_.deepGet(object, ['level1', 'level2', 'level3', 0, 'blah'])).toBeUndefined();
        });
    });

    describe('deepSet(collection, propertyPath, value)', function(){
        it('should set the value in the object tree, using the specified property path', function(){
            _.deepSet(object, 'level1.foo', 'bar');
            expect(object.level1.foo).toBe('bar');
            _.deepSet(object, 'level1.level2.foo', 'bar');
            expect(object.level1.level2.foo).toBe('bar');
            _.deepSet(object, ['level1', 'level2', 'ownEnumLevel3', 0, 'foo'], 'bar');
            expect(object.level1.level2.ownEnumLevel3[0].foo).toBe('bar');
            _.deepSet(object, ['level1', 'level2', 'ownNonEnumLevel3', 0, 'foo'], 'bar');
            expect(object.level1.level2.ownNonEnumLevel3[0].foo).toBe('bar');
        });

        it('should create any missing objects or arrays', function(){
            _.deepSet(object, 'level1.level2.ownEnumLevel3.level4.level5.5.level6.foo', 'bar');
            expect(_.isArray(object.level1.level2.ownEnumLevel3.level4.level5)).toBe(true);
            expect(object.level1.level2.ownEnumLevel3.level4.level5[5].level6.foo).toBe('bar');

            _.deepSet(object, 'level1.level2.ownNonEnumLevel3.level4.level5.5.level6.foo', 'bar');
            expect(_.isArray(object.level1.level2.ownNonEnumLevel3.level4.level5)).toBe(true);
            expect(object.level1.level2.ownNonEnumLevel3.level4.level5[5].level6.foo).toBe('bar');
        });
    });

    describe('deepDefault(collection, propertyPath, defaultValue)', function(){
        it('should set the defaultValue, if the property does not exist', function(){
            _.deepDefault(object, 'some.non.existent.property.path', 'default');
            expect(object.some.non.existent.property.path).toBe('default');
        });

        it('should set the defaultValue, if the property is undefined', function(){
            _.deepSet(object, 'some.non.existent.property.path', undefined);
            _.deepDefault(object, 'some.non.existent.property.path', 'default');
            expect(object.some.non.existent.property.path).toBe('default');
        });

        it('should not change the existing value, if there is one', function(){
            _.deepDefault(object, 'level1.level2.value', 'default');
            expect(object.level1.level2.value).toBe('value 2');
        });

        it('should return the defaultValue, if it has been set', function(){
            expect(_.deepDefault(object, 'some.non.existent.property.path', 'default')).toBe('default');
        });

        it('should return the existing value, if there is one', function(){
            expect(_.deepDefault(object, 'level1.level2.value', 'default')).toBe('value 2');
        });
    });

    describe('deepPluck(collection, propertyPath)', function(){
        it('should do a deep pluck', function(){
            expect(_.deepPluck(array, 'level1.value')).toEqual(['value 1_1', 'value 1_2', 'value 1_3', undefined, undefined]);
            expect(_.deepPluck(array, 'level1.level2.value')).toEqual(['value 2_1', 'value 2_2', 'value 2_3', undefined, undefined]);
            expect(_.deepPluck(array, 'level1.level2.level3.0.value')).toEqual(['value 3_1', 'value 3_2', 'value 3_3', undefined, undefined]);
            expect(_.deepPluck(array, ['level1', 'level2', 'level3', 0, 'value'])).toEqual(['value 3_1', 'value 3_2', 'value 3_3', undefined, undefined]);
        });

        it('should do a deep pluck on non-object properties', function(){
            expect(_.deepPluck(array, 'level1.value.length')).toEqual([9, 9, 9, undefined, undefined]);
            expect(_.deepPluck(array, 'level1.level2.value.length')).toEqual([9, 9, 9, undefined, undefined]);
            expect(_.deepPluck(array, 'level1.level2.level3.0.value.length')).toEqual([9, 9, 9, undefined, undefined]);
            expect(_.deepPluck(array, ['level1', 'level2', 'level3', 0, 'value', 'length'])).toEqual([9, 9, 9, undefined, undefined]);
        });
    });

    describe('deepCall(collection, propertyPath, thisArg, *arg)', function(){
        it('should execute the function', function(){
            spyOn(objectWithFunc.level1, 'func');
            _.deepCall(objectWithFunc, 'level1.func');
            expect(objectWithFunc.level1.func).toHaveBeenCalled();
        });

        it('should execute the function with the correct arguments and thisArg, and return the result', function(){
            expect(_.deepCall(objectWithFunc, 'level1.func', thisArg, 1, 2, 3)).toEqual({
                thisArg: thisArg,
                arg1: 1,
                arg2: 2,
                arg3: 3
            });
        });

        it('should return undefined if the function does not exist', function(){
            expect(_.deepCall(objectWithFunc, 'blah.blah')).toBeUndefined();
        });
    });

    describe('deepApply(collection, propertyPath, thisArg, args)', function(){
        it('should execute the function', function(){
            spyOn(objectWithFunc.level1, 'func');
            _.deepApply(objectWithFunc, 'level1.func');
            expect(objectWithFunc.level1.func).toHaveBeenCalled();
        });

        it('should execute the function with the correct arguments and thisArg, and return the result', function(){
            expect(_.deepApply(objectWithFunc, 'level1.func', thisArg, [1, 2, 3])).toEqual({
                thisArg: thisArg,
                arg1: 1,
                arg2: 2,
                arg3: 3
            });
        });

        it('should throw an error if the function does not exist', function(){
            expect(_.deepCall(objectWithFunc, 'blah.blah')).toBeUndefined();
        });
    });

    describe('deepEscapePropertyName(propertyName)', function(){
        it('should escape dots and backslashes', function(){
            expect(_.deepEscapePropertyName('my.weird.property\\name')).toEqual('my\\.weird\\.property\\\\name');
        });

        it('should escape left and right brackets', function(){
            expect(_.deepEscapePropertyName('my[weird]propertyName')).toEqual('my\\[weird\\]propertyName');
        });
    });

    describe('deepMapValues(object, callback)', function(){
        it('should not modify the original object', function(){
            var settings = {
                a: '{{key}}',
                b: {
                    c: {
                        d: [ '{{key}}' ]
                    }
                }
            };

            _.deepMapValues(settings, function(v){
                if(_.isString(v) && v.indexOf('{{') > -1){
                    return v.replace(/\{\{(.*?)\}\}/g, function(str, key){
                        return key;
                    });
                }

                return v;
            });

            expect(settings.b.c.d).toEqual(['{{key}}']);
        });

        it('should map all values in an object', function(){
            var mappedObject = _.deepMapValues(object, function(value){
                return 'foo ' + value + ' bar';
            });
            expect(_.deepGet(mappedObject, 'level1.value')).toEqual('foo value 1 bar');
            expect(_.deepGet(mappedObject, 'level1.level2.value')).toEqual('foo value 2 bar');
        });

        it('should copy, not map, prototype values', function(){
            var mappedObject = _.deepMapValues(object, function(value){
                return 'foo ' + value + ' bar';
            });

            expect(_.deepGet(mappedObject, ['level1', 'level2', 'ownNonEnumLevel3', 0, 'value'])).toBeUndefined();
            expect(_.deepGet(mappedObject, ['level1', 'level2', 'ownEnumLevel3', 0, 'value'])).toEqual('foo own enumerable value 3 bar');
        });

        it('should provide the current property path (as array) to the callback function', function(){
            var mappedObject = _.deepMapValues(object, function(value, path){
                return (path.join('.') + ' is ' + value);
            });
            expect(_.deepGet(mappedObject, 'level1.value')).toEqual('level1.value is value 1');
            expect(_.deepGet(mappedObject, 'level1.level2.value')).toEqual('level1.level2.value is value 2');
        });

        it('should work with collections', function (){
            var deepArrayTest = {
                a: {
                    b: [
                        {
                            c: {
                                d: '{{key}}'
                            }
                        },
                        {
                            d: '{{key}}'
                        }
                    ]
                }
            };

            var mappedObject = _.deepMapValues(deepArrayTest, function(value) {
                return value + 'test';
            });

            expect(mappedObject.a.b instanceof Array).toBe(true);
            expect(mappedObject.a.b[ 1 ].d).toEqual(deepArrayTest.a.b[ 1 ].d + 'test');
            expect(mappedObject.a.b[ 0 ].c.d).toEqual(deepArrayTest.a.b[ 0 ].c.d + 'test');
        });
    });

    describe('getProperties(), via deepGet(object, stringPath)', function(){
        it('ignores periods that are escaped', function(){
            var obj = {a: {b: {'name.prop': 3}}};
            expect(_.deepGet(obj, 'a.b.name\\.prop')).toEqual(3);
        });

        it('ignores back-slashes that are escaped', function(){
            var obj = {a: {b: {'name\\\\\\prop': 3}}};
            expect(_.deepGet(obj, 'a.b.name\\\\\\\\\\\\prop')).toEqual(3);
        });

        it('ignores brackets that are escaped', function(){
            var obj = {a: {b: {'name[p]rop': 3}}};
            expect(_.deepGet(obj, 'a.b.name\\[p\\]rop')).toEqual(3);
        });

        it('uses brackets similar to array/variable property notation', function(){
            var obj = {a: {b: {'name.prop': [1, 2, 3]}}};
            expect(_.deepGet(obj, 'a.b.name\\.prop[2]')).toEqual(3);
        });

        it('allows multiple braces on after the other', function(){
            var obj = {a: {b: {'name.prop': [[1, 2, 3]]}}};
            expect(_.deepGet(obj, 'a.b.name\\.prop[0][2]')).toEqual(3);
        });

        describe('syntax errors', function(){
            it('should throw when there are periods inside the brackets', function(){
                try{
                    _.deepGet({}, 'a[2.0]');
                    expect(false).toEqual(true);
                }
                catch(e){
                    expect(e instanceof SyntaxError).toEqual(true);
                    expect(/unexpected "\."/.test(e.message)).toEqual(true);
                }
            });

            it('should throw when there are left brackets inside the brackets', function(){
                try{
                    _.deepGet({}, 'a.b.c[00[2]');
                    expect(false).toEqual(true);
                }
                catch(e){
                    expect(e instanceof SyntaxError).toEqual(true);
                    expect(/unexpected "\["/.test(e.message)).toEqual(true);
                }
            });
        });
    });
});
