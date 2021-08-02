const messageFactory = (errorCode = 500,
    message = "Unknown",
    severity = "FATAL error") => {
    return Object.freeze({
        report: () => `${severity} ${errorCode}: ${message}`
    });
};

const warning = (factory) => {
    return (errorCode, message) => factory(errorCode, message, "WARNING");
}

const warningFactory = warning(messageFactory);

console.log( messageFactory(401, "Unauthorized").report());
console.log( warningFactory(455, "Disk low on space").report());
