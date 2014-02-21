# lodash.deep
Lodash mixins for (deep) object accessing / manipulation.

## Installation
1. `bower install lodash.deep`
2. Reference `lodash.deep.min.js` after `lodash.min.js`

## Docs

### _.deepIn(object, propertyPath)
Executes a deep check for the existence of a property in an object tree.

#### object
Type: `Object`

The root object of the object tree.

#### propertyPath
Type: `string`

The dot separated propertyPath.

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

### _.deepHas(object, propertyPath)
Executes a deep check for the existence of a *own* property in an object tree.

#### object
Type: `Object`

The root object of the object tree.

#### propertyPath
Type: `string`

The dot separated propertyPath.

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

### _.deepGetValue(object, propertyPath)
Retreives the value of a property in an object tree.

#### object
Type: `Object`

The root object of the object tree.

#### propertyPath
Type: `string`

The dot separated propertyPath.

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
_.deepGetValue(object, 'level1.value');
// -> 'value 1'
_.deepGetValue(object, 'level1.level2.level3.value');
// -> 'value 3'
_.deepGetValue(object, 'foo.bar.baz');
// -> undefined
```

### _.deepGetOwnValue(object, propertyPath)
Retreives the value of a *own* property in an object tree.

#### object
Type: `Object`

The root object of the object tree.

#### propertyPath
Type: `string`

The dot separated propertyPath.

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
_.deepGetOwnValue(object, 'level1.value');
// -> 'value 1'
_.deepGetOwnValue(object, 'level1.level2.level3.value');
// -> undefined
_.deepGetOwnValue(object, 'foo.bar.baz');
// -> undefined
```

### _.deepSetValue(object, propertyPath, value)
Executes a deep check for the existence of a own property in an object tree.

#### object
Type: `Object`

The root object of the object tree.

#### propertyPath
Type: `string`

The dot separated propertyPath.

#### value
Type: `*`

The value to set.

#### returns
Type: `Object`

``` javascript
var object = {};
_.deepSetValue(object, 'level1.level2.level3.value', 'value 3');
// -> { level1: { level2: { level3: { value: 'value 3' }}}}
_.deepSetValue(object, 'level1.level2.level3.value', 'foo');
// -> { level1: { level2: { level3: { value: 'foo' }}}}
```

### _.deepPluck(collection, propertyPath)
Executes a deep pluck on an collection of object trees.

#### collection
Type: `Object|Array`

The collection of object trees.

#### propertyPath
Type: `string`

The dot separated propertyPath.

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