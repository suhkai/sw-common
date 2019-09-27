import vendorPrefixer from 'jss-plugin-vendor-prefixer';

// https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model#Reference

const css = new CSSStyleDeclaration();


CSSGroupingRule
CSSStyleRule
CSSImportRule 
CSSMediaRule
CSSFontFaceRule 
CSSKeyframeRule 
CSSKeyframesRule 
CSSNamespaceRule
//events
AnimationEvent
CaretPosition

// i StylePropertyMap

el.attributeStyleMap.set('padding', CSS.px(42));
const padding = el.attributeStyleMap.get('padding');
console.log(padding.value, padding.unit); // 42, 'px'

CSS.escape
CSS.supports
CSS.vendorP 

