

export type LOGFunction = (code: string, reason: string) => void;
export type ColorCodes = { [index :string]: string; };



export default function createLogger(domain: string, useTime = true, colorCodes: ColorCodes = { error:'color:red', info:'color: black', warning:'color:orange', ack: 'color:green'}): { [index: string]: LOGFunction; }{
 
    function compose(code: string, reason: string, level: string) {
        const date = useTime ? `[${new Date().toISOString().slice(0, -5)}]` : '';
        const msg = `${date}[${domain}][${code}][${level}][${reason}]`
        return msg;
    }

    function out(str: string, level: string){
        const cssCode = colorCodes[level];
        console.log(`%c${str}`, cssCode);
    }

    const final = {};
    
    for (const [ level, css ] of Object.entries(colorCodes)){
        Object.defineProperty(final, level, {
            value: (code: string, reason: string) => {
                const msg = compose(code, reason, level);
                out(msg, level);
            },
            writable: false,
            configurable: false
        });
    }
    return final;
};

