
if (!$.jagmort) {
	$.jagmort = {};
	$.fn.jagmort = {};
}

/**
 * Prevent some nasty errors.
 */
var console = window.console ? window.console : {
	log: $.noop,
	error: function (msg) {
		$.error(msg);
	}
};
