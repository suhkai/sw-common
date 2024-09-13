function GLInstance(canvasID){
	const canvas = document.getElementById(canvasID);
	const gl = canvas.getContext("webgl2");


	if(!gl){ console.error("WebGL context is not available."); return null; }

	//...................................................
	//Setup GL, Set all the default configurations we need.
	gl.clearColor(0,0,0,0.1);		//Set clear color (white?)


	//...................................................
	//Methods	
	gl.fClear = function(){ 
		// can  be directed to a framebuffer or dawing buffer (= screen/canvas)
		// prolly can use this to "clear a color buffer"
		this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT); // ok
		return this; 
	}


	//...................................................
	//Setters - Getters

	//Set the size of the canvas html element and the rendering view port
	gl.fSetSize = function(w,h){
		//set the size of the canvas, on chrome we need to set it 3 ways to make it work perfectly.
		this.canvas.style.width = w + "px";
		this.canvas.style.height = h + "px";
		this.canvas.width = w; // internal width coordinate system
		this.canvas.height = h; // internal height coordinate system

		//when updating the canvas size, must reset the viewport of the canvas 
		//else the resolution webgl renders at will not change
		this.viewport(0,0,w,h); // slice the viewport you need
		return this;
	}

	return gl;
}