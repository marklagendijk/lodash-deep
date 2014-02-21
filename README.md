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

### _.deepPluck(collection, propertyPath)
Executes a deep pluck on an collection of object trees.

#### collection
Type: `Object|Array`

The collection of object trees.

#### propertyPath
Type: `string`

The dot separated propertyPath.

#### returns
Type: `Object|Array`