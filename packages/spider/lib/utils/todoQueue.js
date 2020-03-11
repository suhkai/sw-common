module.exports = function createQueue(redWhiteFn) {

    const data = d || [];
    let splitIdx = 0;

    return {
        // all
        offer, // preferable
        peek,  // preferable
        poll,  // preferable
        next, // compatible with iteration protocol
        remove,
        size,
        contains,
        //white
        white: {
            offer, // preferable
            peek,  // preferable
            poll,  // preferable
            next, // compatible with iteration protocol
            remove,
            size,
            contains,
        },
        // red
        red: {
            offer, // preferable
            peek,  // preferable
            poll,  // preferable
            next, // compatible with iteration protocol
            remove,
            size,
            contains,
        }
    };
}