function pluck(o, propertyNames) {
    return propertyNames.map((n) => o[n]);
}
let taxi = {
    manufacturer: "Toyota",
    model: "Camry",
    year: 2014,
};
