const { basename } = require('path');

class INode {
    constructor(type, name, version, ctx = {}){
        this.type = type; // regular file, dir, whatever
        this.size = 0;
        this.name = basename(name); // basename
        this.version = version || '001';
        this.data;
        this.ctx = ctx; // url object!!
    }
    createInode(type, name, version = this.version, ctx){
        if (this.children && this.children[ basename(name) + version ]){
            const base = this.getpathToRoot();
            throw new Error(`${child.name} already exist on ${base}`);
        }
        this.children = this.children || {};
        const child = new INode(type, name, version, ctx);
        this.children[child._getPk()] = child;
        child._setParent(this);
        return child;
    }

    _setParent(parent){
        this.parent = parent;
    }

    _getPk(){
        return this.name + '_' + this.version;
    }
}

module.exports = INode;
module.exports.root = new INode('device', '');