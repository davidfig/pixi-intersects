/**
 * @license
 * intersects <https://github.com/davidfig/intersects>
 * Released under MIT license <https://github.com/davidfig/intersects/license>
 * Author David Figatner
 * Copyright (c) 2016 YOPEY YOPEY LLC
 */

/* global window */
const Intersects = window.Intersects || {};

Intersects.Shape = require('./shape.js');
Intersects.Rectangle = require('./rectangle.js');
Intersects.Polygon = require('./polygon.js');
Intersects.Circle = require('./circle.js');

window.Intersects = Intersects;