/**
 * @license
 * intersects <https://github.com/davidfig/intersects>
 * Released under MIT license <https://github.com/davidfig/intersects/license>
 * Author David Figatner
 * Copyright (c) 2016 YOPEY YOPEY LLC
 */

/**
 * this is only necessary for the standalone intersects.js build (i.e., if you don't use modules)
 *
 * Usage:
 *
 * <script src="intersects.js"></script>
 *
 * <script>
 *      var shape = new Intersects.Rectangle(container);
 * */

/* global window */
const Intersects = window.Intersects || {};

Intersects.Shape = require('./shape.js');
Intersects.AABB = require('./AABB.js');
Intersects.Rectangle = require('./rectangle.js');
Intersects.Polygon = require('./polygon.js');
Intersects.Circle = require('./circle.js');

window.Intersects = Intersects;