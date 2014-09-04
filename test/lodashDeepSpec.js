/* globals: beforeEach, describe, it, module, inject, expect */
describe('lodash-deep mixins', function(){
	'use strict';
	var object, array;
	beforeEach(function(){
		object = {
			level1: {
				value: 'value 1',
				level2: Object.create({
					level3: [
						{
							value: 'value 3'
						}
					]
				})
			}
		};
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
							{ }
						]
					}
				}
			},
			{}
		];
	});


	describe('deepIn(collection, propertyPath)', function(){
		it('should return whether a value exist in an object tree, for the specified property path', function(){
			expect(_.deepIn(object, 'level1')).toBe(true);
			expect(_.deepIn(object, 'level1.value')).toBe(true);
			expect(_.deepIn(object, 'level1.level2')).toBe(true);
			expect(_.deepIn(object, 'level1.level2.value')).toBe(true);
			expect(_.deepIn(object, 'level1.level2.level3.0')).toBe(true);
			expect(_.deepIn(object, 'level1.level2.level3.0.value')).toBe(true);
			expect(_.deepIn(object, ['level1', 'level2', 'level3', 0, 'value'])).toBe(true);

			expect(_.deepIn(object, 'blah')).toBe(false);
			expect(_.deepIn(object, 'level1.blah')).toBe(false);
			expect(_.deepIn(object, 'level1.level2.level3.0.blah')).toBe(false);
			expect(_.deepIn(object, 'level1.level2.level3.0.blah')).toBe(false);
			expect(_.deepIn(object, ['level1', 'level2', 'level3', 0, 'blah'])).toBe(false);
		});
	});

	describe('deepHas(collection, propertyPath)', function(){
		it('should return whether a value exist in an object tree, as own value, for the specified property path.', function(){
			expect(_.deepHas(object, 'level1')).toBe(true);
			expect(_.deepHas(object, 'level1.value')).toBe(true);
			expect(_.deepHas(object, 'level1.level2')).toBe(true);
			expect(_.deepHas(object, 'level1.level2.value')).toBe(true);

			expect(_.deepHas(object, 'level1.level2.level3.0')).toBe(false);
			expect(_.deepHas(object, 'level1.level2.level3.0.value')).toBe(false);
			expect(_.deepHas(object, ['level1', 'level2', 'level3', 0, 'value'])).toBe(false);

			expect(_.deepHas(object, 'blah')).toBe(false);
			expect(_.deepHas(object, 'level1.blah')).toBe(false);
			expect(_.deepHas(object, 'level1.level2.level3.0.blah')).toBe(false);
			expect(_.deepHas(object, ['level1', 'level2', 'level3', 0, 'blah'])).toBe(false);
		});
	});

	describe('deepGet(collection, propertyPath)', function(){
		it('should retrieve the value in an object tree, using the specified property path', function(){
			expect(_.isObject(_.deepGet(object, 'level1'))).toBe(true);
			expect(_.deepGet(object, 'level1.value')).toBe('value 1');
			expect(_.isObject(_.deepGet(object, 'level1.level2'))).toBe(true);
			expect(_.deepGet(object, 'level1.level2.value')).toBe('value 2');
			expect(_.isObject(_.deepGet(object, 'level1.level2.level3.0'))).toBe(true);
			expect(_.deepGet(object, 'level1.level2.level3.0.value')).toBe('value 3');
			expect(_.deepGet(object, ['level1', 'level2', 'level3', 0, 'value'])).toBe('value 3');

			expect(_.deepGet(object, 'blah')).toBeUndefined();
			expect(_.deepGet(object, 'level1.blah')).toBeUndefined();
			expect(_.deepGet(object, 'level1.level2.level3.0.blah')).toBeUndefined();
			expect(_.deepGet(object, ['level1', 'level2', 'level3', 0, 'blah'])).toBeUndefined();
		});
	});

	describe('deepOwn(collection, propertyPath)', function(){
		it('should retrieve the own value in an object tree, using the specified property path', function(){
			expect(_.isObject(_.deepOwn(object, 'level1'))).toBe(true);
			expect(_.deepOwn(object, 'level1.value')).toBe('value 1');
			expect(_.isObject(_.deepOwn(object, 'level1.level2'))).toBe(true);
			expect(_.deepOwn(object, 'level1.level2.value')).toBe('value 2');

			expect(_.deepOwn(object, 'level1.level2.level3')).toBeUndefined();
			expect(_.deepOwn(object, 'level1.level2.level3.0.value')).toBeUndefined();
			expect(_.deepOwn(object, ['level1', 'level2', 'level3', 0, 'value'])).toBeUndefined();

			expect(_.deepOwn(object, 'blah')).toBeUndefined();
			expect(_.deepOwn(object, 'level1.blah')).toBeUndefined();
			expect(_.deepOwn(object, 'level1.level2.level3.blah')).toBeUndefined();
		});
	});

	describe('deepSet(collection, propertyPath, value)', function(){
		it('should set the value in the object tree, using the specified property path', function(){
			_.deepSet(object, 'level1.foo', 'bar');
			expect(object.level1.foo).toBe('bar');
			_.deepSet(object, 'level1.level2.foo', 'bar');
			expect(object.level1.level2.foo).toBe('bar');
			_.deepSet(object, ['level1', 'level2', 'level3', 0, 'foo'], 'bar');
			expect(object.level1.level2.level3[0].foo).toBe('bar');
		});

		it('should create any missing objects or arrays', function(){
			_.deepSet(object, 'level1.level2.level3.level4.level5.5.level6.foo', 'bar');
			expect(_.isArray(object.level1.level2.level3.level4.level5)).toBe(true);
			expect(object.level1.level2.level3.level4.level5[5].level6.foo).toBe('bar');
		});
	});

	describe('deepPluck(collection, propertyPath)', function(){
		it('should do a deep pluck', function(){
			expect(_.deepPluck(array, 'level1.value')).toEqual(['value 1_1', 'value 1_2', 'value 1_3', undefined, undefined]);
			expect(_.deepPluck(array, 'level1.level2.value')).toEqual(['value 2_1', 'value 2_2', 'value 2_3', undefined, undefined]);
			expect(_.deepPluck(array, 'level1.level2.level3.0.value')).toEqual(['value 3_1', 'value 3_2', 'value 3_3', undefined, undefined]);
			expect(_.deepPluck(array, ['level1', 'level2', 'level3', 0, 'value'])).toEqual(['value 3_1', 'value 3_2', 'value 3_3', undefined, undefined]);
		});
	});

	describe('deepEscapePropertyName(propertyName)', function(){
		it('should escape dots and backslashes', function(){
			expect(_.deepEscapePropertyName('my.weird.property\\name')).toEqual('my\\.weird\\.property\\\\name');
		});
	});
});