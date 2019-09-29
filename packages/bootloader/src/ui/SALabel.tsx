import 'react';
/*

[data-bootstrap-inner] {
	position: absolute;
	left: 50%;
	top: 50%;
	width: fit-content;
	transform: translate(-50%, -50%);
	-webkit-transform: translate(-50%, -50%);
	-moz-transform: translate(-50%, -50%);
	-ms-transform: translate(-50%, -50%);
	-o-transform: translate(-50%, -50%);
}*/

/*
.saira-extra-condensed {
	text-align: right;
	font-family: 'Saira Extra Condensed';
}

.white {
	color: white;
}

.reddish {
	color: #e3493c;
}

*/


export function SALabel() {
    return (<div className={"saira-extra-condensed"}>
        <span className="white">SUPER</span><span className="reddish">ALGOS</span>
    </div>);
}