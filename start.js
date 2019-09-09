require("@babel/core").transform("let test = 'let should converted to var';", {
    //plugins: ["@babel/plugin-transform-arrow-functions"]
});