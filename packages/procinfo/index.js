const fs = require('fs')

const procId = process.env.id

const path =  `/proc/${procId}/fd`
console.log(`examining fd's ${path}`)

const entries = fs.readdirSync(path, { withFileTypes: true}).sort((a,b)=>{
    if (a.name < b.name) return -1
    if (a.name > b.nale) return 1
    return 0
});
for (const e of entries){
   /* if (e.name !== '20') {
        console.log(e.name)
        continue
    }*/
    /*console.log(`
      name:"${e.name}", typeof ${typeof e.name}
      isSocket:${e.isSocket()}
      isFile:${e.isFile()}
      isFIFO:${e.isFIFO()}
      isDirectory:${e.isDirectory()}
      isCharacterDevice:${e.isCharacterDevice()}
      isBlockDevice:${e.isBlockDevice()}
      isSymbolicLink:${e.isSymbolicLink()}
    `);*/ 
    // lstat
    // 296367 from /proc/net/tcp https://www.kernel.org/doc/Documentation/networking/proc_net_tcp.txt
    // 
    const stat = fs.lstatSync(`${path}/${e.name}`,{ bigint:true });
    //console.log(`isSocket: ${stat.isSocket()}, ino:${stat.ino}`)
    console.log(e.name, 'realPath', fs.readlinkSync(`${path}/${e.name}`))
    //console.log(e.name, stat)
}



