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
        this.last = {};
        this._vertices = [];
        this._AABB = [0, 0, 0, 0];   // [x1, y1, x2, y2]
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

if (transform._sr !== Math.sin(this.rotation.rotation))
{
    debug('PIXI transform not updated in Rectangle', 'error');
}

            var width = this.width, height = this.height;
            const ex = height * s + width * c;  // x extent of AABB
            const ey = height * c + width * s;  // y extent of AABB

            const AABB = this._AABB;
            const center = this.center;
            AABB[0] = center.x - ex;
            AABB[1] = center.y - ey;
            AABB[2] = center.x + ex;
            AABB[3] = center.y + ey;

            this.updateLast();
            this.verticesDirty = true;
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
    }

    get AABB()
    {
        if (!this.static && this.checkLast())
        {
            this.update();
        }
        return this._AABB;
    }

    get vertices()
    {
        if (!this.static && (this.verticesDirty || this.checkLast()))
        {
            this.updateVertices();
            if (!this.verticesDirty)
            {
                this.update(true);
                this.verticesDirty = false;
            }
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