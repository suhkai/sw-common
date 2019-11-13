

/* usage:
/ v.object({
   .
   .
   name: v.ref('/newlyhired/persons/name').exists,
   tasks: v.ref('/tasks/taskNames').allIn,
   // other things you can think of   
   .
   .
})
*/