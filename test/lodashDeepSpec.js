/* globals: beforeEach, describe, it, module, inject, expect, _ */
describe('lodash-deep mixins', function(){
    'use strict';
    var object, array, objectWithArray;
    beforeEach(function(){
        object = {
            level1: {
                value: 'value 1',
                level2: Object.create({
                    level3: {
                        value: 'value 3'
                    }
                })
            },
            'level1.1': {
            	value: 'value 1.1'
            }
        };
        object.level1.level2.value = 'value 2';

        objectWithArray = {
            level1: [
                {
                    level2: 'value 1'
                }
            ]
        };

        array = [
            {
                level1: {
                    value: 'value 1_1',
                    level2: {
                        value: 'value 2_1',
                        level3: {
                            value: 'value 3_1'
                        }
                    }
                }
            },
            {
                level1: {
                    value: 'value 1_2',
                    level2: {
                        value: 'value 2_2',
                        level3: {
                            value: 'value 3_2'
                        }
                    }
                }
            },
            {
                level1: {
                    value: 'value 1_3',
                    level2: {
                        value: 'value 2_3',
                        level3: {
                            value: 'value 3_3'
                        }
                    }
                }
            },
            {
                level1: {
                    level2: {
                        level3: { }
                    }
                }
            },
            {}
        ];
    });


    describe('deepIn(object, propertyPath)', function(){
        it('should return whether a value exists in an object tree, for the specified property path', function(){
            expect(_.deepIn(object, 'level1')).toBe(true);
            expect(_.deepIn(object, 'level1.value')).toBe(true);
            expect(_.deepIn(object, 'level1.level2')).toBe(true);
            expect(_.deepIn(object, 'level1.level2.value')).toBe(true);
            expect(_.deepIn(object, 'level1.level2.level3')).toBe(true);
            expect(_.deepIn(object, 'level1.level2.level3.value')).toBe(true);
            expect(_.deepIn(objectWithArray, 'level1.0.level2')).toBe(true);

            expect(_.deepIn(object, 'blah')).toBe(false);
            expect(_.deepIn(object, 'level1.blah')).toBe(false);
            expect(_.deepIn(object, 'level1.level2.level3.blah')).toBe(false);
            expect(_.deepIn(objectWithArray, 'level1.0.blah')).toBe(false);
        });
    });

    describe('deepHas(object, propertyPath)', function(){
        it('should return whether a value exists in an object tree, as own value, for the specified property path.', function(){
            expect(_.deepHas(object, 'level1')).toBe(true);
            expect(_.deepHas(object, 'level1.value')).toBe(true);
            expect(_.deepHas(object, 'level1.level2')).toBe(true);
            expect(_.deepHas(object, 'level1.level2.value')).toBe(true);

            expect(_.deepHas(object, 'level1.level2.level3')).toBe(false);
            expect(_.deepHas(object, 'level1.level2.level3.value')).toBe(false);

            expect(_.deepHas(object, 'blah')).toBe(false);
            expect(_.deepHas(object, 'level1.blah')).toBe(false);
            expect(_.deepHas(object, 'level1.level2.level3.blah')).toBe(false);
        });
    });

    describe('deepGet(object, propertyPath)', function(){
        it('should retrieve the value in an object tree, using the specified property path', function(){
            expect(_.isObject(_.deepGet(object, 'level1'))).toBe(true);
            expect(_.deepGet(object, 'level1.value')).toBe('value 1');
            expect(_.isObject(_.deepGet(object, 'level1.level2'))).toBe(true);
            expect(_.deepGet(object, 'level1.level2.value')).toBe('value 2');
            expect(_.isObject(_.deepGet(object, 'level1.level2.level3'))).toBe(true);
            expect(_.deepGet(object, 'level1.level2.level3.value')).toBe('value 3');
            expect(_.deepGet(objectWithArray, 'level1.0.level2')).toBe('value 1');

            expect(_.deepGet(object, 'blah')).toBeUndefined();
            expect(_.deepGet(object, 'level1.blah')).toBeUndefined();
            expect(_.deepGet(object, 'level1.level2.level3.blah')).toBeUndefined();
            expect(_.deepGet(objectWithArray, 'level1.0.blah.blah2')).toBeUndefined();
        });
    });

    describe('deepGetOwnValue(object, propertyPath)', function(){
        it('should retrieve the own value in an object tree, using the specified property path', function(){
            expect(_.isObject(_.deepOwn(object, 'level1'))).toBe(true);
            expect(_.deepOwn(object, 'level1.value')).toBe('value 1');
            expect(_.isObject(_.deepOwn(object, 'level1.level2'))).toBe(true);
            expect(_.deepOwn(object, 'level1.level2.value')).toBe('value 2');

            expect(_.deepOwn(object, 'level1.level2.level3')).toBeUndefined();
            expect(_.deepOwn(object, 'level1.level2.level3.value')).toBeUndefined();

            expect(_.deepOwn(object, 'blah')).toBeUndefined();
            expect(_.deepOwn(object, 'level1.blah')).toBeUndefined();
            expect(_.deepOwn(object, 'level1.level2.level3.blah')).toBeUndefined();
        });
    });

    describe('deepSet(object, propertyPath, value)', function(){
        it('should set the value in the object tree, using the specified property path', function(){
            _.deepSet(object, 'level1.foo', 'bar');
            expect(object.level1.foo).toBe('bar');
            _.deepSet(object, 'level1.level2.foo', 'bar');
            expect(object.level1.level2.foo).toBe('bar');
            _.deepSet(object, 'level1.level2.level3.foo', 'bar');
            expect(object.level1.level2.level3.foo).toBe('bar');
        });

        it('should create any missing objects', function(){
            _.deepSet(object, 'level1.level2.level3.level4.level5.level6.foo', 'bar');
            expect(object.level1.level2.level3.level4.level5.level6.foo).toBe('bar');
        });
    });

    describe('deepPluck(collection, propertyPath)', function(){
        it('should do a deep pluck', function(){
            expect(_.deepPluck(array, 'level1.value')).toEqual(['value 1_1', 'value 1_2', 'value 1_3', undefined, undefined]);
            expect(_.deepPluck(array, 'level1.level2.value')).toEqual(['value 2_1', 'value 2_2', 'value 2_3', undefined, undefined]);
            expect(_.deepPluck(array, 'level1.level2.level3.value')).toEqual(['value 3_1', 'value 3_2', 'value 3_3', undefined, undefined]);
        });
    });

    describe('syntax', function() {
        it('allows for dot notation', function() {
            expect(_.deepHas(object, 'level1')).toBe(true);
        });

        // array support
        it('allows for numerical (array) notation', function() {
            expect(_.deepHas(objectWithArray, 'level1.0')).toBe(true);
            expect(_.deepHas(objectWithArray, 'level1.1')).toBe(false);
        });

        // dynamic key support
        it('allows for dynamic keys', function() {
            var dynamicKey = 'value';

            expect(_.deepHas(object, 'level1.' + dynamicKey)).toBe(true);
        });

        // allow escaped dots in property names
        it('allows for escaped dots in property names', function() {
            expect(_.deepHas(object, 'level1\\.1')).toBe(true);
            expect(_.deepGet(object, 'level1\\.1.value')).toBe('value 1.1');

            expect(_.deepHas(object, 'level1.1')).toBe(false);
            expect(_.deepHas(object, 'level1\.1')).toBe(false);
            expect(_.deepHas(object, 'level1\\.1.level2')).toBe(false);
        });
    });
});
