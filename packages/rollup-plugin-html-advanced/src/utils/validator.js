// create validator

// simple validation,

// string

// - string, value needs to be a string
// - string[] value needs to be an array of strings
// - string{10,15} value needs to be a string minWidth=10, maxWidth=15
// - string{10,} or string{10, Infinity} value needs to be a string minWidth=10
// - string{,15} value needs to be a string maxWidth=15
// - string{4,3} // error
// - string{,} // means the same as no {}
// - string{...,...}[] array of strings with said width constraints

// number

// - number, needs to be a float
// - integer, needs to be an integer
// - (integer|number){x,y} , needs to be an integer between x and y (inclusive)
// - integer{x,} // integer minimum x (can be negative)
// - integer{,y} // integer maximum y (can be negative)
// - integer|number{...,...}[] // array of number

// boolean

// boolean, false or true
// boolean[], array of booleans
// boolean[n,m] the usuual

// regexp

// any ()

// all ()

// xpath like (use-context-stuff)

// the rest should be plugins
// url
// date (ISO-8601)
// YYYY-MM-DDThh:mm:ssTZD
// TZD= +hh:mm or -hh:mm

// https://www.w3.org/TR/NOTE-datetime
// toNumber
