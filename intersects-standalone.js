(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @license
 * intersects <https://github.com/davidfig/intersects>
 * Released under MIT license <https://github.com/davidfig/intersects/license>
 * Author David Figatner
 * Copyright (c) 2016 YOPEY YOPEY LLC
 */

const Shape = require('./shape.js');

/** use this for non-moving rectangular shapes (e.g., walls) */
class AABB extends Shape
{
    /**
     * @param {object=} article that uses this shape
     * @param {object=} options - see set()
     */
    constructor(article, options)
    {
        super(article);
        this.type = 'AABB';
        options = options || {};
        this.vertices = [];
        this.AABB = [0, 0, 0, 0];   // [x1, y1, x2, y2]
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
            this.hw = this.hh = options.square / 2;
        }
        else
        {
            width = options.width / (options.center ? 2 : 1);
            height = options.height / (options.center ? 2 : 1);
            this.hw = options.width / 2;
            this.hh = options.height / 2;
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
            else
            {
                AABB[0] = options.point.x;
                AABB[1] = options.point.y;
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
            else
            {
                AABB[0] = options.x;
                AABB[1] = options.y;
                AABB[2] = options.x + width;
                AABB[3] = options.y + height;
            }
        }

        this.updateVertices();
    }

    updateVertices()
    {
        const AABB = this.AABB;
        const vertices = this.vertices;
        vertices[0] = AABB[0];
        vertices[1] = AABB[1];
        vertices[2] = AABB[2];
        vertices[3] = AABB[1];
        vertices[4] = AABB[2];
        vertices[5] = AABB[3];
        vertices[6] = AABB[0];
        vertices[7] = AABB[3];
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

    collidesCircle(circle)
    {
        return circle.collidesAABB(this.AABB);
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
        this.type = 'Circle';
        this.AABB = [];
        options = options || {};
        this.set(options);
    }

    /**
     * @param {object} options
     * @param {boolean=false} options.static - this object does not need to be updated
     * @param {object=this.article} options.positionObject - use this to update position (and rotation unless rotationObject is defined)
     * @param {object=this.article} options.rotationObject - use this to update rotation
     * @param {number=} options.radius - otherwise article.width / 2 is used as radius
     */
    set(options)
    {
        this.radius = options.radius || this.article.width / 2;
        this.radiusSquared = this.radius * this.radius;
        this.static = options.static;
        this.center = options.positionObject ? options.positionObject : this.article;
        this.rotation = options.rotationObject ? options.rotationObject : (options.positionObject ? options.positionObject : this.article);
        this.update(true);
    }

    update(dirty)
    {
        if (dirty || !this.static)
        {
            const AABB = this.AABB;
            const radius = this.radius;
            const center = this.center;
            AABB[0] = center.x - radius;
            AABB[1] = center.y - radius;
            AABB[2] = center.x + radius;
            AABB[3] = center.y + radius;
        }
    }

    collidesCircle(circle)
    {
        const thisCenter = this.center;
        const center = circle.center;
        const x = center.x - thisCenter.x;
        const y = center.y - thisCenter.y;
        const radii = circle.radius + this.radius;
        return x * x + y * y <= radii * radii;
    }

    collidesPoint(point)
    {
        const x = point.x - this.center.x;
        const y = point.y - this.center.y;
        return x * x + y * y <= this.radiusSquared;
    }

    /**
     * from http://stackoverflow.com/a/10392860/1955997
     */
    collidesLine(p1, p2)
    {
        function dot(v1, v2)
        {
            return (v1[0] * v2[0]) + (v1[1] * v2[1]);
        }

        const center = this.center;
        const ac = [center.x - p1.x, center.y - p1.y];
        const ab = [p2.x - p1.x, p2.y - p1.y];
        const ab2 = dot(ab, ab);
        const acab = dot(ac, ab);
        let t = acab / ab2;
        t = (t < 0) ? 0 : t;
        t = (t > 1) ? 1 : t;
        let h = [(ab[0] * t + p1.x) - center.x, (ab[1] * t + p1.y) - center.y];
        const h2 = dot(h, h);
        return h2 <= this.radiusSquared;
    }

    /**
     * from http://stackoverflow.com/a/402019/1955997
     */
    collidesRectangle(rectangle)
    {
        const center = this.center;
        if (rectangle.collidesPoint(center))
        {
            return true;
        }

        const vertices = rectangle.vertices;
        return this.collidesLine({x: vertices[0], y: vertices[1]}, {x: vertices[2], y: vertices[3]}) ||
            this.collidesLine({x: vertices[2], y: vertices[3]}, {x: vertices[4], y: vertices[5]}) ||
            this.collidesLine({x: vertices[4], y: vertices[5]}, {x: vertices[6], y: vertices[7]}) ||
            this.collidesLine({x: vertices[6], y: vertices[7]}, {x: vertices[0], y: vertices[1]});
    }

    /**
     * from http://stackoverflow.com/a/402010/1955997
     */
    collidesAABB(AABB)
    {
        const hw = (AABB[2] - AABB[0]) / 2;
        const hh = (AABB[3] - AABB[1]) / 2;
        const center = this.center;
        const radius = this.radius;
        const distX = Math.abs(center.x - AABB[0]);
        const distY = Math.abs(center.y - AABB[1]);

        if (distX > hw + radius || distY > hh + radius)
        {
            return false;
        }

        if (distX <= hw || distY <= hh)
        {
            return true;
        }

        const x = distX - hw;
        const y = distY - hh;
        return x * x + y * y <= this.radiusSquared;
    }
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
debug('TODO: Polygon:Shapes');
        super(article);
        this.type = 'Polygon';
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
        this.static = options.static;
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
        this.type = 'Rectangle';
        options = options || {};
        this._vertices = [];
        this.AABB = [0, 0, 0, 0];   // [x1, y1, x2, y2]
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
        this.static = options.static;
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
        if (dirty || !this.static)
        {
            // use PIXI's transform for cos and sin (this can be replaced with a simple Math.cos/sin call--don't forget to cache the values)
            const transform = this.rotation.transform;
            const s = Math.abs(transform._sr / 2);
            const c = Math.abs(transform._cr / 2);

            const width = this.width;
            const height = this.height;
            const ex = height * s + width * c;  // x extent of AABB
            const ey = height * c + width * s;  // y extent of AABB

            const AABB = this.AABB;
            const center = this.center;
            AABB[0] = center.x - ex;
            AABB[1] = center.y - ey;
            AABB[2] = center.x + ex;
            AABB[3] = center.y + ey;

            this.verticesDirty = true;
        }
    }

    updateVertices()
    {
        function xCalc(x, y)
        {
            return center.x + x * cos - y * sin;
        }

        function yCalc(x, y)
        {
            return center.y + x * sin + y * cos;
        }

        const vertices = this._vertices;
        const center = this.center;
        const transform = this.rotation.transform;
        const sin = transform._sr;
        const cos = transform._cr;
        const hw = this.hw;
        const hh = this.hh;

        vertices[0] = xCalc(-hw, -hh);
        vertices[1] = yCalc(-hw, -hh);
        vertices[2] = xCalc(+hw, -hh);
        vertices[3] = yCalc(+hw, -hh);
        vertices[4] = xCalc(+hw, +hh);
        vertices[5] = yCalc(+hw, +hh);
        vertices[6] = xCalc(-hw, +hh);
        vertices[7] = yCalc(-hw, +hh);

        this.verticesDirty = false;
    }

    get vertices()
    {
        if (!this.static && this.verticesDirty)
        {
            this.updateVertices();
        }
        return this._vertices;
    }

    collidesRectangle(rectangle)
    {
        return this.collidesPolygon(rectangle);
    }

    collidesCircle(circle)
    {
        return circle.collidesRectangle(this);
    }

    collidesAABB(AABB)
    {
        return this.collidesPolygon(AABB, true);
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
        this.static = true;
    }

    update() {}

    /**
     * collides with this shape's AABB box
     * @param {object} AABB
     */
    AABBs(AABB)
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
        for (let i = 0, j = length - 2; i < length; i += 2)
        {
            if (((vertices[i + 1] > point.y) !== (vertices[j + 1] > point.y)) && (point.x < (vertices[j] - vertices[i]) * (point.y - vertices[i + 1]) / (vertices[j + 1] - vertices[i + 1]) + vertices[i]))
            {
                c = !c;
            }
            j = i;
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
    collidesPolygon(polygon, isAABB)
    {
        const a = this.vertices;
        const b = isAABB ? polygon : polygon.vertices;
        const polygons = [a, b];
        let minA, maxA, projected, minB, maxB;
        for (let i = 0; i < polygons.length; i++)
        {
            const polygon = polygons[i];
            for (let i1 = 0; i1 < polygon.length; i1 += 2)
            {
                var i2 = (i1 + 2) % polygon.length;
                var normal = { x: polygon[i2 + 1] - polygon[i1 + 1], y: polygon[i1] - polygon[i2] };
                minA = maxA = null;
                for (let j = 0; j < a.length; j += 2)
                {
                    projected = normal.x * a[j] + normal.y * a[j + 1];
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
                for (let j = 0; j < b.length; j += 2)
                {
                    projected = normal.x * b[j] + normal.y * b[j + 1];
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
        for (let i = 0; i < length; i += 2)
        {
            const j = (i + 2) % length;
            if (Shape.lineLine(p1, p2, {x: vertices[i], y: vertices[i + 1]}, {x: vertices[j], y: vertices[j + 1]}))
            {
                return true;
            }
        }
        return false;
    }

    checkLast()
    {
        return false;
    }

    collides(shape)
    {
        return ['collides' + shape.type](shape);
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
