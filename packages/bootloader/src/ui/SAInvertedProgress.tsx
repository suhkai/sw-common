'use strict';
import 'react';


export function SAInvertedProgress({ textStr = '', progress = 0 }) {
	return (
		<div data-progress-container>
			<div data-inverted-progress data-content={textStr} className={'progress'} style={{ width: `${progress}%;` }}>
				{textStr}
			</div>
		</div>
	);
}

/*
[data-progress-container] {
	position: absolute;
	top: 0;
	transform: translate(0, -100%);
	width: 100%;
	-webkit-transform: translate(0, -100%);
	-moz-transform: translate(0, -100%);
	-ms-transform: translate(0, -100%);
	-o-transform: translate(0, -100%);
}

[data-inverted-progress] {
	position: relative;
	user-select: none;
	border:2px solid transparent;
}

[data-inverted-progress]:before,
[data-inverted-progress]:after {
	content: attr(data-content);
	overflow: hidden;
	position: absolute;
	white-space: nowrap;
	left:-2px;
	top: -2px;
}
/* inverted text
[data-inverted-progress]:after {
	width: 20%;
	background:#ccc;
	color: #14191e;
	border-left: 2px solid #ccc;
	border-bottom: 2px solid #ccc;
	border-top: 2px solid #ccc;
}
/* before is ontop of after z-index wise
[data-inverted-progress]:before {
	width: 100%;
	background:#14191e;
	color: #ccc;
	border: 2px solid #ccc;
}

.progress {
	font-family: 'Roboto Condensed';
	font-weight: 800;
	font-size: 14px;
}
*/