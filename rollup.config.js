import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
console.log(pkg.main,pkg.module)
export default {
    input: 'src/sw.ts',
    output: [
      {
       
        format: 'umd',
        name:'sw-test'
      },
      /*
      {
        file: pkg.module,
        format: 'es',
      },
      */
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],plugins: [
      typescript({
        typescript: require('typescript'),
      }),
    ],
  }