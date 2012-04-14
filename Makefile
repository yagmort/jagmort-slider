SRC_DIR = src
TEST_DIR = test
BUILD_DIR = build

PREFIX = .
DIST_DIR = ${PREFIX}/dist

JS_ENGINE ?= `which node nodejs 2>/dev/null`
COMPILER = ${JS_ENGINE} ${BUILD_DIR}/uglify.js --unsafe
POST_COMPILER = ${JS_ENGINE} ${BUILD_DIR}/post-compile.js

BASE_FILES = ${SRC_DIR}/slider.js\
	${SRC_DIR}/jquery-layer.js

MODULES = ${SRC_DIR}/intro.js\
	${SRC_DIR}/prevent-errors.js\
	${BASE_FILES}\
	${SRC_DIR}/outro.js

JAGMORT_SLIDER = ${DIST_DIR}/jagmort-slider.js
JAGMORT_SLIDER_MIN = ${DIST_DIR}/jagmort-slider.min.js

JAGMORT_SLIDER_VER = $(shell cat ${SRC_DIR}/version)
VER = sed "s/@VERSION/${JAGMORT_SLIDER_VER}/"

DATE=$(shell git log -1 --pretty=format:%ad)

all: core

core: slider min hint size
	@@echo "jagmort-slider build complete."

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

slider: ${JAGMORT_SLIDER}

${JAGMORT_SLIDER}: ${MODULES} | ${DIST_DIR}
	@@echo "Building" ${JAGMORT_SLIDER}

	@@cat ${MODULES} | \
		sed 's/.function..jQuery...{//' | \
		sed 's/}...jQuery..;//' | \
		sed 's/@DATE/'"${DATE}"'/' | \
		${VER} > ${JAGMORT_SLIDER};

hint: slider
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Checking jagmort-slider against JSHint..."; \
		${JS_ENGINE} build/jshint-check.js; \
	else \
		echo "You must have NodeJS installed in order to test jagmort-slider against JSHint."; \
	fi

size: slider min
	@@if test ! -z ${JS_ENGINE}; then \
		gzip -c ${JAGMORT_SLIDER_MIN} > ${JAGMORT_SLIDER_MIN}.gz; \
		wc -c ${JAGMORT_SLIDER} ${JAGMORT_SLIDER_MIN} ${JAGMORT_SLIDER_MIN}.gz | ${JS_ENGINE} ${BUILD_DIR}/sizer.js; \
		rm ${JAGMORT_SLIDER_MIN}.gz; \
	else \
		echo "You must have NodeJS installed in order to size jagmort-slider."; \
	fi

freq: slider min
	@@if test ! -z ${JS_ENGINE}; then \
		${JS_ENGINE} ${BUILD_DIR}/freq.js; \
	else \
		echo "You must have NodeJS installed to report the character frequency of minified jagmort-slider."; \
	fi

min: slider ${JAGMORT_SLIDER_MIN}

${JAGMORT_SLIDER_MIN}: ${JAGMORT_SLIDER}
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Minifying jagmort-slider" ${JAGMORT_SLIDER_MIN}; \
		${COMPILER} ${JAGMORT_SLIDER} > ${JAGMORT_SLIDER_MIN}.tmp; \
		${POST_COMPILER} ${JAGMORT_SLIDER_MIN}.tmp; \
		rm -f ${JAGMORT_SLIDER_MIN}.tmp; \
	else \
		echo "You must have NodeJS installed in order to minify jagmort-slider."; \
	fi

clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}

.PHONY: all slider hint min clean core
