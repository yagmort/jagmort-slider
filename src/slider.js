
function JagmortSliderClass() {
	this.curElement = null;
	this.curIndex = null;
	/*
	 * loop still not used
	 */
	this.defaultOptions = {
		"duration": 4000,
		//"loop": true,
		"showSlideSelector": ".show",
		"showSlideClass": "show"
	};
	this.elements = null;
	this.options = null;

	this.init = function (node, options) {
		var current = null,
			self = this;

		this.options = $.extend(true, this.defaultOptions, options);
		this.elements = $(node).find("li");

		if (2 > this.elements.length) {
			return false;
		}

		current = this.isFirstSlideUnique();
		this.curIndex = current[1];
		this.curElement = current[0];

		this.curElement
			.addClass(this.options.showSlideClass)
			.css({"opacity": 1.0, "display": "list-item", "z-index": "1"});
		this.elements.not(this.curElement)
			.removeClass(this.options.showSlideClass)
			.css({"opacity": 0.0, "display": "none", "z-index": "0"});

		setInterval(function () { self.nextSlide(); }, this.options.duration);

		return true;
	};

	this.isFirstSlideUnique = function () {
		var selected = this.elements.filter(this.options.showSlideSelector);

		if (1 !== selected.length) {
			/*
			 * Return first element in list.
			 */
			return [$(this.elements.get(0)), 0];
		}

		return [selected, $.inArray(selected.get(0), this.elements)];
	};

	this.nextSlide = function () {
		var nextIndex;

		if (this.curIndex === this.elements.length - 1) {
			nextIndex = 0;
		} else {
			nextIndex = this.curIndex + 1;
		}

		this.slide(nextIndex);

		return true;
	};

	this.prevSlide = function () {
		var prevIndex;

		if (this.curIndex === 0) {
			prevIndex = this.elements.length - 1;
		} else {
			prevIndex = this.curIndex - 1;
		}

		this.slide(prevIndex);

		return true;
	};

	this.randomSlide = function () {
		var nextIndex = this.curIndex,
			i = 0,
			attempts = 5;

		// Give it 5 attempts to found nextIndex  
		while (i < attempts && nextIndex === this.curIndex) {
			i++;
			nextIndex = Math.floor(Math.random() * this.elements.length);
		}

		if (attempts === i) {
			this.nextSlide();

			return false;
		}

		this.slide(nextIndex);

		return true;
	};

	this.slide = function (nextIndex) {
		var nextElement = $(this.elements[nextIndex]);

		nextElement
			.addClass(this.options.showSlideClass)
			.css({"display": "list-item", "z-index": 2})
			.stop()
			.animate({opacity: 1.0}, 1000);
		this.curElement
			.stop()
			.animate({opacity: 0.0}, 600)
			.css({"opacity": 0.0, "display": "none", "z-index": "0"})
			.removeClass(this.options.showSlideClass);

		this.curElement = nextElement;
		this.curIndex = nextIndex;

		return true;
	};

	// Run init
	this.init.apply(this, arguments);
};
