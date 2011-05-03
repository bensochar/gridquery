// Live cross-browser viewport detection
// Think media queries, but done in javascript!
// A better solution than separate @media css files or isolated @media brackets
// Special thanks to Paul Irish for the debounce function

(function (win, documentElement) {
		// Event function
	var addEvent = (win.addEventListener) ? function (type, node, fn) {
			node.addEventListener(type, fn, false);
		} : function (type, node, fn) {
			node.attachEvent(
				'on'+type,
				function (e) {
					fn.apply(node, [e]);
				}
			);
		},

		// Debounce function
		debounce = function (func, threshold) {
			var timeout;
			return function () {
				var obj = this,
					args = arguments,
					delayed = function () {
						func.apply(obj, args);
						timeout = null;
					};
				if (timeout) clearTimeout(timeout);
				timeout = setTimeout(delayed, 50); 
			};
		},

		// Sizes array
		viewportColumns = {
			12: 960,
			9: 720,
			6: 480,
			4: 320
		},

		// Minimum viewport width
		viewportMinColumns = 4,

		// Viewport Change event
		viewportChange = function() {
			var oldClassNames,
				classNames = oldClassNames = documentElement.className.replace(/(\s|\b)+grid-(lt|gt)*\d+(\b|\s)+/g, ''),
				viewportWidth = documentElement.clientWidth,
				bucket = [],
				viewportMaxColumns = viewportMinColumns,
				col;

			for (col in viewportColumns) viewportMaxColumns = Math.max(viewportMaxColumns, viewportWidth >= viewportColumns[col] ? col : 0);

			bucket.push('grid-'+viewportMaxColumns);

			for (col in viewportColumns) {
				bucket.push('grid-'+(viewportWidth >= viewportColumns[col] ? 'gt' : 'lt')+col);
			}

			classNames += ' '+bucket.join(' ');

			if (oldClassNames != classNames) documentElement.className = classNames;
		};

	// Attach function to events
	addEvent('resize', win, debounce(viewportChange));
	addEvent('orientationchange', win, viewportChange);

	viewportChange();
})(this, document.documentElement);