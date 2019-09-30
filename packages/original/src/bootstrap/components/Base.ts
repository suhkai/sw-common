
import bindMethods from '../../utils/bindMethods';

export default class Base<T extends Element> {
    protected $self?: T;
    protected dataAttr: string;
    constructor({ dataAttr }:{ dataAttr: string}) {
        this.dataAttr = dataAttr;
        bindMethods(this);
    }

    createFragment(){
        const div = this.$self = <any>(document.createElement('div'));
        if (this.dataAttr) {
            const attr = document.createAttribute(`data-${this.dataAttr}`);
            div.setAttributeNode(attr);
        }
    }

    append(child: any){
        if (!this.$self || !child){
            return;
        }
        if (child instanceof Base){
            this.$self.appendChild(child.$self);
            return;
        }
        if (child instanceof Element){
            this.$self.appendChild(child);
            return;
        }
        throw new TypeError(`child not a "Base<T>" class or an "Element" interface ${String(child)}`);
    }

    mount($mp: Element) {
        if (!this.$self){
            return;
        }
        $mp.appendChild(this.$self);
    }

    unmount() {
        if (this.$self) {
            this.$self.parentNode && this.$self.parentNode.removeChild(this.$self);
            // TODO: potentially detach any event Listeners
        }
    }

}