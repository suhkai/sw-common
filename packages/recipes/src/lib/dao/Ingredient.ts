export class Ingredient {
    id: number;
    name: string;
    constructor(id: number, name: string){
        this.id = id;
        this.name = name;
    }

    toJSON(): unknown {
        return { pk: this.id, state: 1, name: this.name };
    }
}