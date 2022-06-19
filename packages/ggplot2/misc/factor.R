factor3 = function (
    x = character(),
    levels,
    labels = levels,
    exclude = NA, 
    ordered = is.ordered(x), # was created by ordered(x, levels=c(...))
    nmax = NA) 
{
    if (is.null(x)) 
        x <- character()  # create empty arrays of string texts
    nx <- names(x) # column names if x is a data frame, etc
    if (missing(levels)) {  # levels is not specified as argument
        y <- unique(x, nmax = nmax) # ok, so make x unique, nmax = maximum number of unique items
        # example how to use order
        # > data[order(data, decreasing=TRUE)]
        # > [1] "z" "v" "r" "l" "a"
        # > data
        # [1] "z" "a" "v" "r" "l"
        # > 
        ind <- order(y)
        levels <- unique(as.character(y)[ind]) # levels are unique level names?
    }
    force(ordered) # the xample in ?force help are clear, but not sure what it does here
    if (!is.character(x)) #if they are not text strings
        x <- as.character(x)  # make the text strings
    print(exclude)
    print(levels)
    print(match(levels, exclude))
    print(is.na(match(levels, exclude)))
    print(levels[is.na(match(levels, exclude))])
    levels <- levels[is.na(match(levels, exclude))]
    print("----")
    print(levels)
    print("--f=") 
    f <- match(x, levels)
    print(f)
    if (!is.null(nx))  #object x has names
        names(f) <- nx # copy names from source objects
    
    # when there are no labels defined    
    if (missing(labels)) {
        levels(f) <- as.character(levels)  #
    }
    else {
        nlab <- length(labels)
        if (nlab == length(levels)) {  #number of labels equal to number of levels?
            nlevs <- unique(xlevs <- as.character(labels))
            at <- attributes(f)
            at$levels <- nlevs
            f <- match(xlevs, nlevs)[f]
            attributes(f) <- at
        }
        else if (nlab == 1L) { # number of labels is 1 (not equal to number of levels)
            levels(f) <- paste0(labels, seq_along(levels))  #synthetic levels, concat single label with numbers
        }
        else {
            stop(gettextf("invalid 'labels'; length %d should be 1 or %d",  nlab, length(levels)), domain = NA)
        }
    }
    # set the class of the object
    class(f) <- c(if (ordered) "ordered", "factor")
    f # return newly created object
}

