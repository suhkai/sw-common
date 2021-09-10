export class Ingredient {
    id: number;
    name: string;
    rowNum: number;
    ctx = { focus: false };
    constructor(id: number, name: string){
        this.id = id;
        this.name = name;
    }
}