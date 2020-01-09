
const data = {
    child: {
        name: 'hier1',
        child2: {
            name: 'hier2',
            child3: {
                name: 'hier3'
            }
        }
    }
};

function createParent(object, prevParent) {
    return (n = 0) => {
        if (n === 0) return { d: object, p: prevParent };
        if (prevParent === undefined) return { d: object, p: prevParent }; // clamp this object as it is root
        return prevParent(n - 1);
    }
}

function init(){
   
    const p1 = createParent(data);
    const p2 = createParent(data.child, p1);
    const p3 = createParent(data.child.child2, p2);
    const p4 = createParent(data.child.child2.child3, p3);

    console.log(p4());
    console.log(p4(1));
    console.log(p4(2));
    console.log(p4(3));
    console.log(p4(4));
}

init();

