import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { basename } from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      generateScopedName: (className, filePath, css) => {
        console.log('className', className);
        console.log('filePath', filePath);
        console.log('actual css', css);
        const classNameIndex = css.indexOf(`.${className}`);
        const lineNumber = css.substr(0, classNameIndex).split(/\r?\n/).length;
        const fileName = basename(filePath, '.module.css');
        const prefix = 'm_';
 
        const rc =  `${prefix}${fileName}_${className}_${lineNumber}`;
        console.log('final rc', rc);
        return rc;
      },
    }
  }
})
