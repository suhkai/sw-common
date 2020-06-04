class DNS {
    constructor(){
        this.aRecords = new Map();
        this.pRecords= new Map();
        // register default i guess
        this.register('localhost','127.0.0.1');
    }
    register(name, ip){
        if (typeof name !== 'string'){
            throw new Error('"name" not a string');
        }
        if (typeof ip !== 'string'){
            throw new Error('"ip" not a string');
        }
        const ntc = name.toLocaleLowerCase();
        const ipn = ip.toLocaleLowerCase();
        const ips = this.aRecords.get(ntc) || new Set();
        this.aRecords.set(ntc, ips)
        ips.add(ipn);
        const hosts = this.pRecords.get(ipn) || new Set();
        this.pRecords.set(ipn, hosts);
        hosts.add(ntc);
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
