(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @license
 * intersects <https://github.com/davidfig/intersects>
 * Released under MIT license <https://github.com/davidfig/intersects/license>
 * Author David Figatner
 * Copyright (c) 2016 YOPEY YOPEY LLC
 */

const Shape = require('./shape.js');

/** use this for non-rotating rectangular shapes (e.g., walls) */
class AABB extends Shape
{
    /**
     * @param {object=} article that uses this shape
     * @param {object=} options - see set()
     */
    constructor(article, options)
    {
        super(article);
        options = options || {};
        this.vertices = [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}];
        this.set(options);
    }

    /**
     * @param {object} options
     * @param {number=} options.x - top-left unless options.center = true
     * @param {number=} options.y - top-left unless options.center = true
     * @param {object=} options.point - top-left unless options.center = true
     * @param {boolean=false} options.center - indicates that x,y or point is center, not top-left
     * @param {number=} options.width
     * @param {number=} options.height
     * @param {number=} options.square - same width and height
     */
    set(options)
    {
        let width, height;
        if (typeof options.square !== 'undefined')
        {
            width = height = options.square / (options.center ? 2 : 1);
        }
        else
        {
            width = options.width / (options.center ? 2 : 1);
            height = options.height / (options.center ? 2 : 1);
        }

        let AABB = this.AABB;
        if (options.point)
        {
            if (options.center)
            {
                AABB[0] = options.point.x - (options.center ? width : 0);
                AABB[1] = options.point.y - (options.center ? height: 0);
                AABB[2] = options.point.x + width;
                AABB[3] = options.point.y + height;
            }
        }
        else
        {
            if (options.center)
            {
                AABB[0] = options.x - (options.center ? width : 0);
                AABB[1] = options.y - (options.center ? height : 0);
                AABB[2] = options.x + width;
                AABB[3] = options.y + height;
            }
        }

        this.updateVertices();
    }

    updateVertices()
    {
        function vertex(x, y, v)
        {
            v.x = x;
            v.y = y;
        }

        const AABB = this.AABB;
        const vertices = this.vertices;
        vertex(AABB[0], AABB[1], vertices[0]);
        vertex(AABB[2], AABB[1], vertices[1]);
        vertex(AABB[2], AABB[3], vertices[2]);
        vertex(AABB[0], AABB[3], vertices[3]);
    }

    collidesRectangle(rectangle)
    {
        return this.collidesPolygon(rectangle);
    }

    collidesPolygon(polygon)
    {
        return this.collidesPolygon(polygon);
    }

    collidesAABB(AABB)
    {
        return this.AABBCollidesAABB(AABB);
    }

    collidesPoint(point)
    {
        var AABB = this.AABB;
        return point.x >= AABB[0] && point.x <= AABB[2] && point.y >= AABB[1] && point.y <= AABB[3];
    }
}

module.exports = AABB;
},{"./shape.js":6}],2:[function(require,module,exports){
/**
 * @license
 * intersects <https://github.com/davidfig/intersects>
 * Released under MIT license <https://github.com/davidfig/intersects/license>
 * Author David Figatner
 * Copyright (c) 2016 YOPEY YOPEY LLC
 */

const Shape = require('./shape.js');

class Circle extends Shape
{
    /**
     * @param {Article} article that uses this shape
     * @param {object=} options - see set()
     */
    constructor(article, options)
    {
        super(article);
        options = options || {};
        this.set(options);
    }

    /**
     * @param {object} options
     * @param {boolean=true} options.static - this object does not need to be updated
     * @param {object=this.article} options.positionObject - use this to update position (and rotation unless rotationObject is defined)
     * @param {object=this.article} options.rotationObject - use this to update rotation
     * @param {number=} options.radius
     */
    set(options)
    {
        if (typeof options.radius !== 'undefined')
        {
            this.radius = options.radius;
            this.diameter = this.radius * 2;
            this.radiusSquared = this.radius * this.radius;
        }
        if (typeof options.static !== 'undefined')
        {
            this.static = options.static;
        }

        this.center = options.positionObject ? options.positionObject : this.article;
        this.rotation = options.rotationObject ? options.rotationObject : (options.positionObject ? options.positionObject : this.article);
        this.update();
    }

    /** update AABB */
    update()
    {
        if (!this.static)
        {
            const AABB = this.AABB;
            const radius = this.radius;
            const center = this.center;
            AABB.x = center.x - radius;
            AABB.y = center.y - radius;
            AABB.width = AABB.height = this.diameter;
        }
    }

    collidesCircle(circle)
    {
        const x = circle.x - this.center.x;
        const y = circle.y - this.center.y;
        return x * x + y * y <= circle.radius * this.radius;
    }

    collidesPoint(point)
    {
        const x = point.x - this.center.x;
        const y = point.y - this.center.y;
        return x * x + y * y <= this.radiusSquared;
    }

    // collidesRectangle(rectangle)
    // {

    // }

    // collidesAABB(AABB)
    // {

    // }
}

module.exports = Circle;
},{"./shape.js":6}],3:[function(require,module,exports){
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
Intersects.AABB = require('./AABB.js');
Intersects.Rectangle = require('./rectangle.js');
Intersects.Polygon = require('./polygon.js');
Intersects.Circle = require('./circle.js');

window.Intersects = Intersects;
},{"./AABB.js":1,"./circle.js":2,"./polygon.js":4,"./rectangle.js":5,"./shape.js":6}],4:[function(require,module,exports){
/**
 * @license
 * intersects <https://github.com/davidfig/intersects>
 * Released under MIT license <https://github.com/davidfig/intersects/license>
 * Author David Figatner
 * Copyright (c) 2016 YOPEY YOPEY LLC
 */

const Shape = require('./shape.js');

class Polygon extends Shape
{
    /**
     * @param {Article} article that uses this shape
     * @param {object} options - see set()
     */
    constructor(article, options)
    {
        super(article);
        options = options || {};
        this.set(options);
    }

    /**
     * @param {object} options
     * @param {boolean=false} options.static - this object does not need to be updated
     * @param {PIXI.Point[]} options.points
     * @param {PIXI.DisplayObject=} options.center - object to use for position (and rotation, unless separately defined)
     * @param {PIXI.DisplayObject=} options.rotation - object to use for rotation instead of options.center or article
     */
    set(options)
    {
        if (options.point)
        {
            this.points = options.points;
        }
        this.center = options.center || this.article;
        this.rotation = options.rotation ? options.rotation : (options.center ? options.center : this.article);
    }

    /**
     * based on http://www.willperone.net/Code/coderr.php
     */
    update()
    {
// TODO
        const s = Math.abs(this.transform._sr / 2);
        const c = Math.abs(this.transform._cr / 2);
    }
}

module.exports = Polygon;
},{"./shape.js":6}],5:[function(require,module,exports){
/**
 * @license
 * intersects <https://github.com/davidfig/intersects>
 * Released under MIT license <https://github.com/davidfig/intersects/license>
 * Author David Figatner
 * Copyright (c) 2016 YOPEY YOPEY LLC
 */

const Shape = require('./shape.js');

/* global debug */
class Rectangle extends Shape
{
    /**
     * @param {object} article that uses this shape
     * @param {object} options - see set()
     */
    constructor(article, options)
    {
        super(article);
        options = options || {};
        this.last = {};
        this._vertices = [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}];
        this.set(options);
    }

    /**
     * @param {object} options
     * @param {boolean=false} options.static - this object does not need to be updated
     * @param {number=} options.width - width of object when aligned
     * @param {number=} options.height - height of object when aligned
     * @param {object=} options.center - object to use for position (and rotation, unless separately defined)
     * @param {object=} options.rotation - object to use for rotation instead of options.center or article
     */
    set(options)
    {
        this.center = options.center || this.article;
        this.rotation = options.rotation ? options.rotation : (options.center ? options.center : this.article);
        this.width = options.width || this.article.width;
        this.height = options.height || this.article.height;
        this.hw = this.width / 2;
        this.hh = this.height / 2;
        this.update(true);
    }

    /**
     * based on http://www.willperone.net/Code/coderr.php
     */
    update(dirty)
    {
        if (dirty || (!this.static && this.checkLast()))
        {
            // use PIXI's transform for cos and sin (this can be replaced with a simple Math.cos/sin call--don't forget to cache the values)
            const transform = this.rotation.transform;
            const s = Math.abs(transform._sr / 2);
            const c = Math.abs(transform._cr / 2);

if (transform._sr !== Math.sin(this.rotation.rotation))
{
    debug('PIXI transform not updated in Rectangle', 'error');
}

            var width = this.width, height = this.height;
            const ex = height * s + width * c;  // x extent of AABB
            const ey = height * c + width * s;  // y extent of AABB

            const AABB = this.AABB;
            const center = this.center;
            AABB.x1 = center.x - ex;
            AABB.y1 = center.y - ey;
            AABB.x2 = center.x + ex;
            AABB.y2 = center.y + ey;

            this.verticesDirty = true;
            this.updateLast();
        }
    }

    checkLast()
    {
        const last = this.last;
        const center = this.center;
        return center.x !== last.centerX || center.y !== last.centerY || last.rotation !== this.rotation.rotation;
    }

    updateLast()
    {
        const last = this.last;
        const center = this.center;
        last.centerX = center.x;
        last.centerY = center.y;
        last.rotation = this.rotation.rotation;
    }

    updateVertices()
    {
        function vertex(x, y, v)
        {
            v.x = center.x + x * cos - y * sin;
            v.y = center.y + x * sin + y * cos;
        }
        const vertices = this._vertices;
        const center = this.center;
debugOne(Math.random())
        const transform = this.rotation.transform;
        const sin = transform._sr;
        const cos = transform._cr;
        const hw = this.hw;
        const hh = this.hh;

        vertex(-hw, -hh, vertices[0]);
        vertex(+hw, -hh, vertices[1]);
        vertex(+hw, +hh, vertices[2]);
        vertex(-hw, +hh, vertices[3]);

        this.verticesDirty = false;
    }

    get vertices()
    {
        if (this.verticesDirty || this.checkLast())
        {
            this.updateVertices();
        }
        return this._vertices;
    }

    collidesRectangle(rectangle)
    {
        return this.collidesPolygon(rectangle);
    }

    collidesAABB(AABB)
    {
        return this.collidesPolygon(AABB);
    }
}

module.exports = Rectangle;
},{"./shape.js":6}],6:[function(require,module,exports){
/**
 * @license
 * intersects <https://github.com/davidfig/intersects>
 * Released under MIT license <https://github.com/davidfig/intersects/license>
 * Author David Figatner
 * Copyright (c) 2016 YOPEY YOPEY LLC
 */

/* global debug */
class Shape
{
    /**
     * @param {object=} article that uses this shape
     */
    constructor(article)
    {
        this.article = article;
        this.AABB = [0, 0, 0, 0];   // [x1, y1, x2, y2]
        this.static = true;
    }

    update() {}

    /**
     * collides with this shape's AABB box
     * @param {object} AABB
     */
    AABBcollideAABB(AABB)
    {
        var AABB2 = this.AABB;
        return !(AABB[2] < AABB2[0] || AABB2[2] < AABB[0] || AABB[3] < AABB2[1] || AABB2[3] < AABB[1]);
    }

    /**
     * point-polygon collision test based on this.vertices
     * based on http://stackoverflow.com/questions/217578/how-can-i-determine-whether-a-2d-point-is-within-a-polygon/2922778#2922778
     */
    collidesPoint(point)
    {
        const vertices = this.vertices;
        const length = vertices.length;
        let c = false;
        for (let i = 0, j = length - 1; i < length; j = i++)
        {
            const vI = vertices[i];
            const vJ = vertices[j];
            if (((vI.y > point.y) !== (vJ.y > point.y)) && (point.x < (vJ.x - vI.x) * (point.y - vI.y) / (vJ.y - vI.y) + vI.x))
            {
                c = !c;
            }
        }
        return c;
    }

    collidesCircle()
    {
        debug('TODO: ' + this.typeof + ' collides Circle.');
    }

    collidesRectangle()
    {
        debug('TODO: ' + this.typeof + ' collides Rectangle.');
    }

    collidesAABB()
    {
        debug('TODO: ' + this.typeof + ' collides AABB.');
    }

    /**
     * based on http://stackoverflow.com/questions/10962379/how-to-check-intersection-between-2-rotated-rectangles
     */
    collidesPolygon(polygon)
    {
        const a = this.vertices;
        const b = polygon.vertices;
        const polygons = [a, b];
        let minA, maxA, projected, minB, maxB;
        for (let i = 0; i < polygons.length; i++)
        {
            const polygon = polygons[i];
            for (let i1 = 0; i1 < polygon.length; i1++)
            {
                var i2 = (i1 + 1) % polygon.length;
                var p1 = polygon[i1];
                var p2 = polygon[i2];
                var normal = { x: p2.y - p1.y, y: p1.x - p2.x };
                minA = maxA = null;
                for (let j = 0; j < a.length; j++)
                {
                    projected = normal.x * a[j].x + normal.y * a[j].y;
                    if (minA === null || projected < minA)
                    {
                        minA = projected;
                    }
                    if (maxA === null || projected > maxA)
                    {
                        maxA = projected;
                    }
                }
                minB = maxB = null;
                for (let j = 0; j < b.length; j++)
                {
                    projected = normal.x * b[j].x + normal.y * b[j].y;
                    if (minB === null || projected < minB)
                    {
                        minB = projected;
                    }
                    if (maxB === null || projected > maxB)
                    {
                        maxB = projected;
                    }
                }
                if (maxA < minB || maxB < minA)
                {
                    return false;
                }
            }
        }
        return true;
    }

    collidesLine(p1, p2)
    {
        const vertices = this.vertices;
        const length = vertices.length;

        // check if first point is inside the shape (this covers if the line is completely enclosed by the shape)
        if (this.collidesPoint(p1))
        {
            return true;
        }

        // check for intersections for all of the sides
        for (let i = 0; i < length - 1; i++)
        {
            if (Shape.lineLine(p1, p2, vertices[i], vertices[i + 1]))
            {
                return true;
            }
        }

        // finally check if the first vertex -> last vertex line intersects
        return Shape.lineLine(p1, p2, vertices[length - 1], vertices[0]);
    }

    static collides(shape)
    {
        return this['collides' + (typeof shape)](shape);
    }

    /**
     * from http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
     */
    static lineLine(p1, p2, p3, p4)
    {
        const p0_x = p1.x;
        const p0_y = p1.y;
        const p1_x = p2.x;
        const p1_y = p2.y;
        const p2_x = p3.x;
        const p2_y = p3.y;
        const p3_x = p4.x;
        const p3_y = p4.y;
        const s1_x = p1_x - p0_x;
        const s1_y = p1_y - p0_y;
        const s2_x = p3_x - p2_x;
        const s2_y = p3_y - p2_y;
        const s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
        const t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);
        return s >= 0 && s <= 1 && t >= 0 && t <= 1;
    }
}

module.exports = Shape;
},{}]},{},[2,3,4,5,6]);
