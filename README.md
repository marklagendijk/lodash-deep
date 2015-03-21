# lodash-deep 
> Lodash mixins for (deep) object accessing / manipulation.

[![Bower version][bower-image]][bower-url] [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Sauce Test Status][sauce-image]][sauce-url] [![Dependency Status][depstat-image]][depstat-url]


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
- [_.deepDefault](#_deepdefaultcollection-propertypath-defaultvalue)
- [_.deepOwn](#_deepowncollection-propertypath)
- [_.deepPluck](#_deeppluckcollection-propertypath)
- [_.deepIn](#_deepincollection-propertypath)
- [_.deepHas](#_deephascollection-propertypath)
- [_.deepCall](#_deepcallcollection-propertypath-thisarg-arg)
- [_.deepApply](#_deepapplycollection-propertypath-thisarg-args)
- [_.deepMapValues](#_deepmapvaluesobject-propertypath)
- [_.deepFindIndex](#_deeppluckstylecollection-propertypath)
- [_.deepFindLastIndex](#_deeppluckstylecollection-propertypath)
- [_.deepFirst](#_deeppluckstylecollection-propertypath)
- [_.deepFlatten](#_deeppluckstylecollection-propertypath)
- [_.deepInitial](#_deeppluckstylecollection-propertypath)
- [_.deepLast](#_deeppluckstylecollection-propertypath)
- [_.deepLastIndexOf](#_deeppluckstylecollection-propertypath)
- [_.deepRemove](#_deeppluckstylecollection-propertypath)
- [_.deepRest](#_deeppluckstylecollection-propertypath)
- [_.deepSortedIndex](#_deeppluckstylecollection-propertypath)
- [_.deepUniq](#_deeppluckstylecollection-propertypath)
- [_.deepCountBy](#_deeppluckstylecollection-propertypath)
- [_.deepEvery](#_deeppluckstylecollection-propertypath)
- [_.deepFilter](#_deeppluckstylecollection-propertypath)
- [_.deepFind](#_deeppluckstylecollection-propertypath)
- [_.deepGroupBy](#_deeppluckstylecollection-propertypath)
- [_.deepIndexBy](#_deeppluckstylecollection-propertypath)
- [_.deepMax](#_deeppluckstylecollection-propertypath)
- [_.deepMin](#_deeppluckstylecollection-propertypath)
- [_.deepReject](#_deeppluckstylecollection-propertypath)
- [_.deepSome](#_deeppluckstylecollection-propertypath)
- [_.deepSortBy](#_deeppluckstylecollection-propertypath)
- [_.deepFindKey](#_deeppluckstylecollection-propertypath)
- [_.deepFindLastKey](#_deeppluckstylecollection-propertypath)

### propertyPath
Nearly all methods of this library have the `propertyPath` parameter. This parameter defines the location of the nested value(s) and can be either a single `string` or an `array`.

**When an array is specified**, each value should be a property name or array index and there is no need to escape special characters.

```javascript
var obj = { level1: { 'lev\\el2': { 'lev.el3': { 'level4]': [ 'value' ] }}}};
var path2Value = ['level1', 'lev\\el2', 'lev.el3', 'level4]', '0'];
```

**When a string is specified**, it is split on unescaped `.`, `[` and `]` characters to create an array of property names. If a property name contains one of these characters, it must be escaped with a `\` (which must be typed as `\\` in a string literal). The helper method `_.deepEscapePropertyName` is provided to assist with this.

```javascript
// basic property names
var obj = { level1: { level2: [ 'value' ] }};
var path2Value = 'level1.level2[0]';
```

```javascript
// complex property names
var obj = { 'lev.el1': { 'lev\\el2': { `lev[e]l3`: [ 'value' ] }}};

// using a manually escaped string
var path2Value = 'lev\\.el1.lev\\\\el2.lev\\[e\\]l3[0]';

// using a programatically escaped string
var path2Value =
    _.deepEscapePropertyName('lev.el1') + '.' +
    _.deepEscapePropertyName('lev\\el2') + '.' +
    _.deepEscapePropertyName('lev[e]l3') + '[' + 0 + ']';
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

### _.deepDefault(collection, propertyPath, defaultValue)
Checks if the value at the propertyPath resolves to undefined, and sets it to defaultValue if this is the case.
#### collection
Type: `Object|Array`

The root object/array of the object tree.

#### propertyPath
Type: `string|Array`

The [propertyPath](#propertypath).

#### defaultValue
Type: `*`

The default value.

#### returns
Type: `*`

Either the existing, unchanged value, or the new (default) value.

``` javascript
var object = {
    some: {
        property: 'someValue'
    }
};
_.deepDefault(object, 'some.property', 'defaultValue');
// -> 'someValue'
_.deepDefault(object, 'some.non.existent.property', 'defaultValue');
// -> 'defaultValue' (and object.some.non.existent.property === 'defaultValue')
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
 *    {
 *        level1: {
 *            value: 'level1.value is value 1'
 *            level2: {
 *                value: 'level1.level2.value is value 2'
 *                level3: {
 *                    value: 'level1.level2.level3.value is value 3'
 *                }
 *            }
 *        }
 *    };
 */
```

### _.deepPluckStyle(collection, propertyPath)
Collection of shorthand functions for executing a non-deep Lodash function with a "_.deepPluck" style callback:
- _.deepFindIndex
- _.deepFindLastIndex
- _.deepFirst
- _.deepFlatten
- _.deepInitial
- _.deepLast
- _.deepLastIndexOf
- _.deepRemove
- _.deepRest
- _.deepSortedIndex
- _.deepUniq
- _.deepCountBy
- _.deepEvery
- _.deepFilter
- _.deepFind
- _.deepGroupBy
- _.deepIndexBy
- _.deepMax
- _.deepMin
- _.deepReject
- _.deepSome
- _.deepSortBy
- _.deepFindKey
- _.deepFindLastKey

#### collection
Type: `Object|Array`

The collection of object trees.

#### propertyPath
Type: `string|Array`

The [propertyPath](#propertypath).

#### returns
Type: `*`

The result of calling the original Lodash function with a "_.deepPluck" style callback.

``` javascript
var collection = [
    { level1: { level2: { level3: { value: 1 }}}},
    { level1: { level2: { level3: { value: 2 }}}},
    { level1: { level2: { level3: { value: 3 }}}},
    { level1: { level2: { level3: { value: 4 }}}},
    { level1: { level2: {} }},
    {}
];
_.deepMax(collection, 'level1.level2.level3.value');
// -> { level1: { level2: { level3: { value: 4 }}}}
// === shorthand for
_.max(collection, function(item){
    return _.deepGet(item, 'level1.level2.level3.value');
});
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
- [Beau Gunderson](https://github.com/beaugunderson)
- [Spencer](https://github.com/spenceralger)
- [Paul](https://github.com/paulbalomiri)
- [TheHalcyonSavant](https://github.com/TheHalcyonSavant)


[bower-url]: https://github.com/marklagendijk/lodash-deep/releases/latest
[bower-image]: https://badge.fury.io/bo/lodash-deep.svg

[npm-url]: https://www.npmjs.org/package/lodash-deep
[npm-image]: https://badge.fury.io/js/lodash-deep.svg

[travis-url]: http://travis-ci.org/marklagendijk/lodash-deep
[travis-image]: https://secure.travis-ci.org/marklagendijk/lodash-deep.svg?branch=master

[sauce-url]: https://saucelabs.com/u/marklagendijk
[sauce-image]: https://saucelabs.com/buildstatus/marklagendijk

[depstat-url]: https://david-dm.org/marklagendijk/lodash-deep
[depstat-image]: https://david-dm.org/marklagendijk/lodash-deep.svg
