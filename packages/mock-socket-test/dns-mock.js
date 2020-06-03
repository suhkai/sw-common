class DNS {
    constructor(){
        this.aRecords = new Map();
        this.pRecords= new Map();
    }
    register(name, ip){
        if (typeof name !== 'string'){
            throw new Error('"name" not a string');
        }
        if (typeof ip !== 'string'){
            throw new Error('"ip" not a string');
        }
        const ips = this.aRecords.get(name.toLocaleLowerCase()) || new Set();
        ips.add(ip.toLocaleLowerCase());
        const hosts = this.pRecords.get(ip.toLocaleLowerCase()) || new Set();
        hosts.add(name);
    }
    nsLookupBy(nameOrIp){
        const ips = this.aRecords.get(nameOrIp.toLocaleLowerCase());
        if (ips){
            return Array.from(ips);
        }
        const names = this.pRecords.get(nameOrIp.toLocaleLowerCase());
        if (names){
            return Array.from(names)
        }
        return [];
    }
}
module.exports = DNS;
