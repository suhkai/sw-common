
function getGlobalCall(line){
	const regExp = /^\s+at (.*):([\d]+):([\d]+)$/;
	const matched = line.match(regExp);
	if (matched === null) { 
		return undefined;
	}
	// we have some success
	try {
	
	  const pathname = matched[1].startsWith('file') ? new URL(matched[1]).pathname : matched[1];
	  const line =  1 * matched[2]; // convert to number type
	  const column = 1 * matched[3]; // convert to number type
	  return {
		 fnName: null,
		 pathname,
		 line,
		 column
	  };
	}
	catch(err){
	   throw new Error(`internal error #001: (see ReadMe) please file an issue: [${err.message}]`);	
	}
}

function getInFunctionCall(line){
	const regExp = /^\s+at\s(.*)\s\((.*):([\d]+):([\d]+)\)$/
	const matched = line.match(regExp);
	console.log(matched);
	if (matched === null){
		return undefined;
	}
	try {
		const fnName = matched[1];
		const pathname = matched[2].startsWith('file') ? new URL(matched[2]).pathname : matched[2];
		const line =  1 * matched[3]; // convert to number type
		const column = 1 * matched[4]; // convert to number type
		return {
		   fnName,
		   pathname,
		   line,
		   column
		};
	  }
	  catch(err){
		throw new Error(`internal error #002: (see ReadMe) please file an issue: [${err.message}]`);	
	 }
}

function somefunction () {
		const err = new Error('hello world');
		//console.log(err.stack);
		//console.log(err.message);
		//console.log(Object.getOwnPropertyDescriptors(err));

		// chop the error into lines
		const lines = err.stack.split('\n');
		//console.log(lines);
		// called in a module global way?
		const globalUsage =  getGlobalCall(lines[2]);
		if (globalUsage){
			console.log('globalUsage:',globalUsage);
		}
		else {
			console.log('infncall:',getInFunctionCall(lines[2]));
		}
	//console.log("target", lines[2]);
}

somefunction();

function anotherfunction(){

	somefunction();
}

anotherfunction();

