import { Agent } from "http";

function createOptions() {
    const agent = new Agent({
        keepAlive: true,
        keepAliveMsecs: 1000,
        maxSockets: 10
    });
    // maybe do other things
    return options => {
        options.agent =  options.agent || agent;
        return options;
    };
}

module.exports = createOptions();