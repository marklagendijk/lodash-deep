/**
 * Lodash mixins for (deep) object accessing / manipulation.
 * @author Mark Lagendijk <mark@lagendijk.info>
 * @license MIT
 */
(function(root, factory){
    if(typeof define === 'function' && define.amd){
        // AMD. Register as an anonymous module.
        define([], function () { return factory; });
    }
    else if(typeof exports === 'object'){
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory;
    }
    else{
        // Browser globals (root is window)
        factory(root._);
    }
}(this, function (_){
    'use strict';

/*@factory@*/

}));
