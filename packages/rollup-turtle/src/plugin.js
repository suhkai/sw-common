function toString(arr){
    const newArr = Array.from(arr);
    for (const line of newArr){
        console.log('--line:', line)
    }
}

module.exports = function(){
    return {
        name:'my-example',
        async moduleParsed(info){
            console.log(`my-example, module-parsed`, info.id)
        },
        async resolveId(source){
            console.log(`my-example,resolveId`, source);
            //toString(Array.from(arguments))
           /* if (source === 'lodash/get'){
                return 'some-other-transform.js';
            }*/
            return null;
        },
        async load ( id, id2 ) {
            console.log(`my-example,load`, id, id2)
            if (id === 'some-other-transform.js') {
              return 'export default function() { return "This is virtual!"; }'; // the source code for "virtual-module"
            }
            return null; // other ids should be handled as usually
          }
    }
}