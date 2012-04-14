
/**
 * jQuery wrapper to allow use $.jagmortSlider and $.fn.jagmortSlider
 */
$.jagmortSlider = {
	init: function (object, options) {
		/*
			* For each object in list create Slider instance
			* and save it to object.data() as "jagmortSliderInstance"
			*/
		return object.each(function () {
			var opts = $.extend(true, {}, options),
				SliderInstance = new JagmortSliderClass(this, opts);

			$.data(this, "jagmortSliderInstance", SliderInstance);
		});
	}
};

/**
 * This is wrapper for $.jagmortSlider
 */
$.fn.jagmortSlider = function (method) {
	var args = arguments, plugin;

	if ("undefined" !== typeof $.jagmortSlider[method]) {
		// set argument object to undefined
		args = Array.prototype.concat.call([args[0]], [this], Array.prototype.slice.call(args, 1));
		return $.jagmortSlider[method].apply($.jagmortSlider, Array.prototype.slice.call(args, 1));
	} else if ("object" === typeof method || !method) {
		Array.prototype.unshift.call(args, this);
		return $.jagmortSlider.init.apply($.jagmortSlider, args);
	} else {
		console.error("Method '" +  method + "' does not exist on jQuery.jagmortSlider.\n" +
			"Try to include some extra controls or plugins");
	}
};
