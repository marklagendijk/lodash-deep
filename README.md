# lodash-deep [![Bower version][bower-image]][bower-url] [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]
Lodash mixins for (deep) object accessing / manipulation.

## Compatibility
lodash-deep is currently compatible with:
- Node.js
- All ES5 compatible browsers (IE9+, Chrome, Firefox, Safari etc)

## Installation
### Bower
1. `bower install lodash-deep`
2. Reference `lodash-deep.min.js` after `lodash.min.js`

### Node.js
1. `npm install lodash`
2. `npm install lodash-deep`
3. 
    ``` javascript

    var _ = require("lodash");
    _.mixin(require("lodash-deep"));
    ```

## Docs
The following mixins are included in `lodash-deep`:
- [_.deepSet](#_deepsetcollection-propertypath-value)
- [_.deepGet](#_deepgetcollection-propertypath)
- [_.deepOwn](#_deepowncollection-propertypath)
- [_.deepPluck](#_deeppluckcollection-propertypath)
- [_.deepIn](#_deepincollection-propertypath)
- [_.deepHas](#_deephascollection-propertypath)
- [_.deepCall](#_deepcallcollection-propertypath-thisarg-arg)
- [_.deepApply](#_deepapplycollection-propertypath-thisarg-args)
- [_.deepMapValues](#_deepmapvaluesobject-propertypath)

### propertyPath
Nearly all methods of this library have the `propertyPath` parameter. This parameter defines the location of the nested value(s). Array indices can also be used as property name.
The propertyPath can be specified as either `string` or `Array`. When it is specified as string the `.` is used as separator between the different levels. Because of this all `.` and `\` characters of property names in a string based propertyPath have to be escaped by a `\`. The helper method `_.deepEscapePropertyName` is available for this purpose.

``` javascript
	// Simple property path
	// { level1: { level2: { level3: [ 'value' ] }}}
	var pathString = 'level1.level2.level3.0'; // as string
	var pathArray = ['level1', 'level2', 'level3', 0]; // as array

	// Property path with '.' and '\'
	// { 'lev.el1': { 'lev\\el2': { level3: [ 'value' ] }}}
	var path2String = 'lev\\.el1.lev\\\\el2.level3.0'; // as manually escaped string
	var path2StringAlt = _.deepEscapePropertyName('lev.el1') + '.' + _.deepEscapePropertyName('lev\\el2') + '.level3.0'; // as programmatically escaped string
	var path2Array = ['lev.el1', 'lev\\el2', 'level3', 0]; // as array (just the plain names, you never have to escape anything when using the array syntax.
```


### _.deepSet(collection, propertyPath, value)
Sets a value of a property in an object tree. Any missing objects/arrays will be created.

#### collection
Type: `Object|Array`

The root object/array of the object tree.

#### propertyPath
Type: `string|Array`

The [propertyPath](#propertypath).

#### value
Type: `*`

The value to set.

#### returns
Type: `Object`

``` javascript
var object = {};
_.deepSet(object, 'level1.level2.level3.value', 'value 3');
// -> { level1: { level2: { level3: { value: 'value 3' }}}}
_.deepSet(object, 'level1.level2.level3.value', 'foo');
// -> { level1: { level2: { level3: { value: 'foo' }}}}
```

### _.deepGet(collection, propertyPath)
Retrieves the value of a property in an object tree.

#### collection
Type: `Object|Array`

The root object/array of the object tree.

#### propertyPath
Type: `string|Array`

The [propertyPath](#propertypath).

#### returns
Type: `*|undefined`

The value, or undefined if it doesn't exists.

``` javascript
var object = {
	level1: {
		value: 'value 1',
		level2: Object.create({
			level3: {
				value: 'value 3'
			}
		})
	}
};
_.deepGet(object, 'level1.value');
// -> 'value 1'
_.deepGet(object, 'level1.level2.level3.value');
// -> 'value 3'
_.deepGet(object, 'foo.bar.baz');
// -> undefined
```

### _.deepOwn(collection, propertyPath)
Retrieves the value of a *own* property in an object tree.

#### collection
Type: `Object|Array`

The root object/array of the object tree.

#### propertyPath
Type: `string|Array`

The [propertyPath](#propertypath).

#### returns
Type: `*|undefined`

The value, or undefined if it doesn't exists.

``` javascript
var object = {
	level1: {
		value: 'value 1',
		level2: Object.create({
			level3: {
				value: 'value 3'
			}
		})
	}
};
_.deepOwn(object, 'level1.value');
// -> 'value 1'
_.deepOwn(object, 'level1.level2.level3.value');
// -> undefined
_.deepOwn(object, 'foo.bar.baz');
// -> undefined
```

### _.deepPluck(collection, propertyPath)
Executes a deep pluck on an collection of object trees.

#### collection
Type: `Object|Array`

The collection of object trees.

#### propertyPath
Type: `string|Array`

The [propertyPath](#propertypath).

#### returns
Type: `Array`

``` javascript
var collection = [
	{ level1: { level2: { level3: { value: 1 }}}},
	{ level1: { level2: { level3: { value: 2 }}}},
	{ level1: { level2: { level3: { value: 3 }}}},
	{ level1: { level2: { level3: { value: 4 }}}},
	{ level1: { level2: {} }},
	{}
];
_.deepPluck(collection, 'level1.level2.level3.value');
// -> [ 1, 2, 3, 4, undefined, undefined ]
```

### _.deepIn(collection, propertyPath)
Executes a deep check for the existence of a property in an object tree.

#### collection
Type: `Object|Array`

The root object/array of the object tree.

#### propertyPath
Type: `string|Array`

The [propertyPath](#propertypath).

#### returns
Type: `boolean`

``` javascript
var object = {
	level1: {
		level2: Object.create({
			level3: {
				value: 'value 3'
			}
		})
	}
};
_.deepIn(object, 'level1');
// -> true
_.deepIn(object, 'level1.level2');
// -> true
_.deepIn(object, 'level1.level2.level3');
// -> true
_.deepIn(object, 'level1.level2.level3.value');
// -> true
```

### _.deepHas(collection, propertyPath)
Executes a deep check for the existence of a *own* property in an object tree.

#### collection
Type: `Object|Array`

The root object/array of the object tree.

#### propertyPath
Type: `string|Array`

The [propertyPath](#propertypath).

#### returns
Type: `boolean`

``` javascript
var object = {
	level1: {
		level2: Object.create({
			level3: {
				value: 'value 3'
			}
		})
	}
};
_.deepHas(object, 'level1');
// -> true
_.deepHas(object, 'level1.level2');
// -> true
_.deepHas(object, 'level1.level2.level3');
// -> false
_.deepHas(object, 'level1.level2.level3.value');
// -> false
```

### _.deepCall(collection, propertyPath, thisArg, arg)
Calls a function located at the specified property path, if it exists.

#### collection
Type: `Object|Array`

The root object/array of the object tree.

#### propertyPath
Type: `string|Array`

The [propertyPath](#propertypath).

#### thisArg
Type: `Object`

The 'this' argument the function should be executed with.

#### arg1 ... argN
Type: `*`

One of the arguments the function should be executed with. Can occur 0..n times.

#### returns
Type: `*`

The result of executing the function if it exists, or undefined if the function doesn't exist.

``` javascript
_.deepCall(myObject, 'level1.level2.myFunc', myObject, 'arg1', 'arg2');
// if it exists -> result of myObject.level1.level2.myFunc('arg1', 'arg2')
// if it does not exist -> undefined
```

### _.deepApply(collection, propertyPath, thisArg, args)
Calls a function located at the specified property path, if it exists.

#### collection
Type: `Object|Array`

The root object/array of the object tree.

#### propertyPath
Type: `string|Array`

The [propertyPath](#propertypath).

#### thisArg
Type: `Object`

The 'this' argument the function should be executed with.

#### args
Type: `Array`

The arguments the function should be executed with.

#### returns
Type: `*`

The result of executing the function if it exists, or undefined if the function doesn't exist.

``` javascript
var args = ['arg1', 'arg2'];
_.deepApply(myObject, 'level1.level2.myFunc', myObject, args);
// if it exists -> result of myObject.level1.level2.myFunc('arg1', 'arg2')
// if it does not exist -> undefined
```

### _.deepMapValues(object, propertyPath)
Maps all values in an object tree and returns a new object with the same structure as the original.

#### object
Type: `Object`

The root object of the object tree.

#### callback
Type: `Function`

The function to be called per iteration on any non-object value in the tree.

Callback is invoked with 2 arguments: `(value, propertyPath)`.

`value` the value of the current property.

`propertyPath` the [propertyPath](#propertypath) of the current property, in array format.

#### returns
Type: `Object`

``` javascript
var object = {
	level1: {
		value: 'value 1'
		level2: {
			value: 'value 2'
			level3: {
				value: 'value 3'
			}
		}
	}
};

_.deepMapValues(object, function(value, propertyPath){
	return (propertyPath.join('.') + ' is ' + value)
});

/** ->
 *	{
 *		level1: {
 *			value: 'level1.value is value 1'
 *			level2: {
 *				value: 'level1.level2.value is value 2'
 *				level3: {
 *					value: 'level1.level2.level3.value is value 3'
 *				}
 *			}
 *		}
 *	};
 */
```

### Function name change
In version 1.2.0 function names were simplified. Backward compatibility with the old names remains in place.

## Contributing
Please use the `canary` branch when creating a pull request.

## Contributors
- [Mark Lagendijk](https://github.com/marklagendijk)
- [Andrew Luetgers](https://github.com/andrewluetgers)
- [Nelson Pecora](https://github.com/yoshokatana)
- [Mark Battersby](https://github.com/markalfred)

[bower-url]: https://github.com/marklagendijk/lodash-deep/releases/latest
[bower-image]: https://badge.fury.io/bo/lodash-deep.png

[npm-url]: https://www.npmjs.org/package/lodash-deep
[npm-image]: https://badge.fury.io/js/lodash-deep.png

[travis-url]: http://travis-ci.org/marklagendijk/lodash-deep
[travis-image]: https://secure.travis-ci.org/marklagendijk/lodash-deep.png?branch=master

[depstat-url]: https://david-dm.org/marklagendijk/lodash-deep
[depstat-image]: https://david-dm.org/marklagendijk/lodash-deep.png
