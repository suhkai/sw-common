'use strict';

module.exports = function createDeferSequence (delay = 0) {
	if (delay === 0) {
		const exec = function defer (fns) {
			if (fns.length === 0) {
				return;
			}
			Promise.resolve().then(() => {
				const { fn, args } = fns.shift();
				try {
					fn(...args);
				}
				catch (err) {
					console.error(err);
				}
				finally {
					exec(fns);
				}
			});
		};
		return exec;
	}
	const exec1 = function defer (fns) {
		if (fns.length === 0) {
			return;
		}
		setTimeout(() => {
			const { fn, args } = fns.shift();
			try {
				fn(...args);
			}
			catch (err) {
				console.error(err);
			}
			finally {
				exec1(fns);
			}
		}, delay);
	};
	return exec1;
};
