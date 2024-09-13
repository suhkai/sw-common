class Shader{
	//done
	constructor(gl,vertShaderSrc,fragShaderSrc){

		this.program = ShaderUtil.createProgramFromText(gl, vertShaderSrc, fragShaderSrc, true);

		if(this.program != null){
			this.gl = gl;
			gl.useProgram(this.program);
			this.attribLoc = ShaderUtil.getStandardAttribLocations(gl,this.program);
			this.uniformLoc = {};	//TODO : Replace in later lessons with get standardUniformLocations.
		}

		//Note :: Extended shaders should deactivate shader when done calling super and setting up custom parts in the constructor.
	}

	//...................................................
	//Methods
	//done
	activate(){ this.gl.useProgram(this.program); return this; }
	// done
	deactivate(){ this.gl.useProgram(null); return this; }

	//function helps clean up resources when shader is no longer needed.
	//done
	dispose(){
		//unbind the program if its currently active
		if(this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.program) this.gl.useProgram(null);
		this.gl.deleteProgram(this.program);
	}

	//...................................................
	//RENDER RELATED METHODS

	//Setup custom properties
	//done
	preRender(){} //abstract method, extended object may need need to do some things before rendering.

	//Handle rendering a modal
	// done
	renderModal(modal){
		this.gl.bindVertexArray(modal.mesh.vao);	
		//Enable VAO, this will set all the predefined attributes for the shader
		//nice so the VOA has this
		
		if(modal.mesh.indexCount){
			 this.gl.drawElements(modal.mesh.drawMode, modal.mesh.indexCount, gl.UNSIGNED_SHORT, 0); // indexed (uses indirection)
		}
		else {
			this.gl.drawArrays(modal.mesh.drawMode, 0, modal.mesh.vertexCount); // direct
		}
		this.gl.bindVertexArray(null); // unset, wonderfull
		return this;
	}
}


class ShaderUtil{
	//-------------------------------------------------
	// Main utility functions
	//-------------------------------------------------

	//get the text of a script tag that are storing shader code.
	//done
	static domShaderSrc(elmID){
		var elm = document.getElementById(elmID);
		if(!elm || elm.text == ""){ console.log(elmID + " shader not found or no text."); return null; }
		
		return elm.text;
	}

	//Create a shader by passing in its code and what type
	//done
	static createShader(gl,src,type){
		var shader = gl.createShader(type);
		gl.shaderSource(shader,src);
		gl.compileShader(shader);

		//Get Error data if shader failed compiling
		if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
			console.error("Error compiling shader : " + src, gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}

		return shader;
	}

	//Link two compiled shaders to create a program for rendering.
	//done
	static createProgram(gl,vShader,fShader,doValidate){
		//Link shaders together
		var prog = gl.createProgram();
		gl.attachShader(prog,vShader);
		gl.attachShader(prog,fShader);

		//Force predefined locations for specific attributes. If the attibute isn't used in the shader its location will default to -1
		[ATTR_POSITION_NAME, ATTR_NORMAL_NAME, ATTR_UV_NAME].forEach(v => {
				console.log(v);
				const result = gl.getAttribLocation(prog,v); // error is "Invalid operation"
				const error = gl.getError(); // error is "Invalid operation"
				console.log(`result`, result, error, error === gl.INVALID_OPERATION);
		});
		gl.bindAttribLocation(prog,ATTR_POSITION_LOC, ATTR_POSITION_NAME); // need to do this before you link a program? interesting!!
		gl.bindAttribLocation(prog,ATTR_NORMAL_LOC,ATTR_NORMAL_NAME);
		gl.bindAttribLocation(prog,ATTR_UV_LOC,ATTR_UV_NAME);

		gl.linkProgram(prog);

		[ATTR_POSITION_NAME, ATTR_NORMAL_NAME, ATTR_UV_NAME].forEach(v => {
			
				console.log(v);
				const result = gl.getAttribLocation(prog,v); // error is "Invalid operation"
				const error = gl.getError(); // error is "Invalid operation" constant
				console.log(`result`, result, error, error === gl.INVALID_OPERATION);
			
		});

		//Check if successful
		if(!gl.getProgramParameter(prog, gl.LINK_STATUS)){
			console.error("Error creating shader program.",gl.getProgramInfoLog(prog));
			gl.deleteProgram(prog); 
			return null;
		}

		//Only do this for additional debugging.
		if(doValidate){
			gl.validateProgram(prog);
			if(!gl.getProgramParameter(prog,gl.VALIDATE_STATUS)){
				console.error("Error validating program", gl.getProgramInfoLog(prog));
				gl.deleteProgram(prog); 
				return null;
			}
		}
		
		//Can delete the shaders since the program has been made.
		//sure they delete the shaders but not the program
		gl.detachShader(prog,vShader); //TODO, detaching might cause issues on some browsers, Might only need to delete.
		gl.detachShader(prog,fShader);
		gl.deleteShader(fShader);
		gl.deleteShader(vShader);

		return prog;
	}

	//-------------------------------------------------
	// Helper functions
	//-------------------------------------------------
	
	//Pass in Script Tag IDs for our two shaders and create a program from it.
	//done
	static domShaderProgram(gl,vectID,fragID,doValidate){
		var vShaderTxt	= ShaderUtil.domShaderSrc(vectID);								if(!vShaderTxt)	return null;
		var fShaderTxt	= ShaderUtil.domShaderSrc(fragID);								if(!fShaderTxt)	return null;
		var vShader		= ShaderUtil.createShader(gl,vShaderTxt,gl.VERTEX_SHADER);		if(!vShader)	return null;
		var fShader		= ShaderUtil.createShader(gl,fShaderTxt,gl.FRAGMENT_SHADER);	if(!fShader){	gl.deleteShader(vShader); return null; }
		
		return ShaderUtil.createProgram(gl,vShader,fShader,true);
	}
	//done
	static createProgramFromText(gl,vShaderTxt,fShaderTxt,doValidate){
		var vShader		= ShaderUtil.createShader(gl,vShaderTxt,gl.VERTEX_SHADER);		if(!vShader)	return null;
		var fShader		= ShaderUtil.createShader(gl,fShaderTxt,gl.FRAGMENT_SHADER);	if(!fShader){	gl.deleteShader(vShader); return null; }
		
		return ShaderUtil.createProgram(gl,vShader,fShader,true);
	}

	//-------------------------------------------------
	// Setters / Getters
	//-------------------------------------------------

	//Get the locations of standard Attributes that we will mostly be using. Location will = -1 if attribute is not found.
	//done
	static getStandardAttribLocations(gl,program){
		return {
			position:	gl.getAttribLocation(program,ATTR_POSITION_NAME),
			norm:		gl.getAttribLocation(program,ATTR_NORMAL_NAME),
			uv:			gl.getAttribLocation(program,ATTR_UV_NAME)
		};
	}
}

/**
 * 
 * 0 -> x=0, y=0 -> (-1,-1) 
 * 1 -> x=1, y=(int)(1/2+1/3)=0 -> *2-> (2,0) -1 -> (1,0)
 * 2 -> x=0, y=(int)(1+1/3)=1 (-1,0)
 * 
 * 1     2
 * 
 * *     3        
 * 
 * 
 * 2     0 
 *  
 * 
 * 1     3
 * 
 *   
 * i:   0    1    2    3     4     5
 * x:  -1    1    1   -1   - 1     1               
 * y:   1    1   -1   -1     1    -1
 * 
 * 
  */


