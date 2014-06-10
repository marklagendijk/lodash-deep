# lodash-deep
Lodash mixins for (deep) object accessing / manipulation.

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
- [_.deepIn](#_deepinobject-propertypath)
- [_.deepHas](#_deephasobject-propertypath)
- [_.deepGet](#_deepgetobject-propertypath)
- [_.deepGetOwn](#_deepgetownobject-propertypath)
- [_.deepSet](#_deepsetobject-propertypath-value)
- [_.deepPluck](#_deeppluckcollection-propertypath)

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

### _.deepGet(object, propertyPath)
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
_.deepGet(object, 'level1.value');
// -> 'value 1'
_.deepGet(object, 'level1.level2.level3.value');
// -> 'value 3'
_.deepGet(object, 'foo.bar.baz');
// -> undefined
```

### _.deepGetOwn(object, propertyPath)
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
_.deepGetOwn(object, 'level1.value');
// -> 'value 1'
_.deepGetOwn(object, 'level1.level2.level3.value');
// -> undefined
_.deepGetOwn(object, 'foo.bar.baz');
// -> undefined
```

### _.deepSet(object, propertyPath, value)
Sets a value of a property in an object tree. Any missing objects will be created.

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
_.deepSet(object, 'level1.level2.level3.value', 'value 3');
// -> { level1: { level2: { level3: { value: 'value 3' }}}}
_.deepSet(object, 'level1.level2.level3.value', 'foo');
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

### Function name change
from version 1.1.0 to 1.2.0 the function names setValue, getValue, and getOwnValue were simplified to omit the "Value" suffix. Backward compatibility with the old names remains in place so as not to break existing code.
