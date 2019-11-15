

/* usage:
/ v.object({
   .
   .
   name: v.ref('/newlyhired/persons/name').exists,
   tasks: v.ref('/tasks/taskNames').allIn,
   // other things you can think of   
   .
   .
})
*/
// parition data, ctx
const { tokenize, getTokens, resolve } = require('../tokenizer');
const { features } = require('./dictionary');
const objectSlice = require('../objectSlice');

function createRef(path) {
   //  lex the path and validate (needs to be somehting usefull),
   const to = getTokens(path); // could throw 

   // preducate
   // - exists // the singular value (any type, object, array, scalar) should match something in the nodelist  (use deepequal in this case)
   // - absent // the negation of exists
   // - later to be extended
   return function (predicate) {
      if (predicate !== 'exist' && predicate !== 'absent') {
         throw new TypeError(`the "ref" feature should be finalized with "exist" or "absent"`);
      }
      return function sliceAndValidate(partition, ctx) {
         const selector = resolve(ctx.location, to);
         const nodelist = objectSlice(ctx.data, selector);
         // see if parition is in the nodelist (use deepequals)
         // fetch the node list
         return [... nodelist, selector , undefined, undefined];
      }
   }
}


features.set('ref', {
   factory: 2,
   name: 'ref',
   fn: createRef
});




