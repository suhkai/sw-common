module.exports = class INode {
    constructor(type, name, version, url){
        this.children = {}; 
        this.type = type; // regular file, dir, whatever
        this.size = 0;
        this.name = name;
        this.version = version || '001';
        this.data;
        this.url = url; // url object!!
    }
    a
    createInode(type, name, version = this.version, url){
        if (this.chidlren[ name + version ]){
            const base = this.getpathToRoot();
            throw new Error(`${child.name} already exist on ${base}`);
        }
        const child = new INode(type, name, version, url);
        children[child.getPk()] = child;
        child.setParent(this);
    }

    _setParent(parent){
        child.parent = parent;
    }

    _getPk(){
        return this.name + '_' + this.version;
    }
}

module.exports.root = new INode('dir', '/', 0, url);