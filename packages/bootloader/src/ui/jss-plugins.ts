'use strict';
// css value-funtion, like so
// example
//const styles = {
//    button: {
//        color: data => data.color
//    }
//};
// ->
//
//.button-0 {
//    color: red;
//  }
// 
//https://cssinjs.org/jss-plugin-rule-value-function


// there is a bug in the stock plugins type decleration, so we need to explicit typcast to JSSPlugin

import functions from 'jss-plugin-rule-value-function';

//Top level global declarations block
//doesnt use suffix like .button-0
//https://cssinjs.org/jss-plugin-global

import global from 'jss-plugin-global';

//
// https://cssinjs.org/jss-plugin-nested
//
// supports '&' and many others

import nested from 'jss-plugin-nested';

//
//  fontSize: '12px' ->  font-size: 12px
// 
import camelCase from 'jss-plugin-camel-case';

// https://cssinjs.org/jss-plugin-default-unit
//
// height: 200 -> height: 200px
//
import defaultUnit from 'jss-plugin-default-unit';

// https://cssinjs.org/jss-plugin-vendor-prefixer
//
// transform: 'translateX(100px)' -> transform: -webkit-translateX(100px);
//
import vendorPrefixer from 'jss-plugin-vendor-prefixer';

// sort props on specificity
// https://cssinjs.org/jss-plugin-props-sort
import propsSort from 'jss-plugin-props-sort';

function createPlugins() {
    return [
        functions,
        defaultUnit,
        camelCase,
        nested,
        global,
        propsSort,
        vendorPrefixer
    ];
}

export default createPlugins;