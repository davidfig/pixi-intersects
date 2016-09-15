/**
 * @license
 * intersects <https://github.com/davidfig/intersects>
 * Released under MIT license <https://github.com/davidfig/intersects/license>
 * Author David Figatner
 * Copyright (c) 2016 YOPEY YOPEY LLC
 */

const Shape = require('./shape.js');

class Rectangle extends Shape
{
    /**
     * @param {object} article that uses this shape
     * @param {object} options - see set()
     */
    constructor(article, options)
    {
        super(article);
        this.SHAPE = 'Rectangle';
        options = options || {};
        this._vertices = [];
        this.AABB = [0, 0, 0, 0];   // [x1, y1, x2, y2]
        this.set(options);
    }

    /**
     * @param {object} options
     * @param {number=} options.width - width of object when aligned
     * @param {number=} options.height - height of object when aligned
     * @param {number=} options.square - side size of a square
     * @param {object=} options.center - object to use for position (and rotation, unless separately defined)
     * @param {object=} options.rotation - object to use for rotation instead of options.center or article
     * @param {boolean} options.noRotate - object does not rotate (simplifies math)
     */
    set(options)
    {
        this.center = options.center || this.article;
        this.rotation = options.rotation ? options.rotation : (options.center ? options.center : this.article);
        if (typeof options.square !== 'undefined')
        {
            this._width = this._height = options.square;
        }
        else
        {
            this._width = options.width || this.article.width;
            this._height = options.height || this.article.height;
        }
        this.noRotate = options.noRotate;
        this.hw = this._width / 2;
        this.hh = this._height / 2;
        this.update();
    }

    get width()
    {
        return this._width;
    }
    set width(value)
    {
        this._width = value;
        this.hw = value / 2;
    }

    get height()
    {
        return this._height;
    }
    set height(value)
    {
        this._height = value;
        this.hh = value / 2;
    }

    /**
     * based on http://www.willperone.net/Code/coderr.php
     */
    update()
    {
        const AABB = this.AABB;
        const center = this.center;

        if (this.noRotate)
        {
            const hw = this.hw;
            const hh = this.hh;
            AABB[0] = center.x - hw;
            AABB[1] = center.y - hh;
            AABB[2] = center.x + hw;
            AABB[3] = center.y + hh;
        }
        else
        {
            // use PIXI's transform for cos and sin, if available
            const transform = this.rotation.transform;
            let s, c;
            if (transform)
            {
                s = Math.abs(transform._sr / 2);
                c = Math.abs(transform._cr / 2);
            }
            else
            {
                s = Math.abs(Math.sin(this.rotation.rotation) / 2);
                c = Math.abs(Math.cos(this.rotation.rotation) / 2);
            }

            const width = this._width;
            const height = this._height;
            const ex = height * s + width * c;  // x extent of AABB
            const ey = height * c + width * s;  // y extent of AABB

            AABB[0] = center.x - ex;
            AABB[1] = center.y - ey;
            AABB[2] = center.x + ex;
            AABB[3] = center.y + ey;
        }
        this.verticesDirty = true;
    }

    updateVertices()
    {
        const vertices = this._vertices;
        const center = this.center;
        const hw = this.hw;
        const hh = this.hh;
        if (this.noRotate)
        {
            const AABB = this.AABB;
            vertices[0] = AABB[0];
            vertices[1] = AABB[1];
            vertices[2] = AABB[2];
            vertices[3] = AABB[1];
            vertices[4] = AABB[2];
            vertices[5] = AABB[3];
            vertices[6] = AABB[0];
            vertices[7] = AABB[3];
        }
        else
        {
            function xCalc(x, y)
            {
                return center.x + x * cos - y * sin;
            }

            function yCalc(x, y)
            {
                return center.y + x * sin + y * cos;
            }

            const transform = this.rotation.transform;
            const sin = transform._sr;
            const cos = transform._cr;

            vertices[0] = xCalc(-hw, -hh);
            vertices[1] = yCalc(-hw, -hh);
            vertices[2] = xCalc(+hw, -hh);
            vertices[3] = yCalc(+hw, -hh);
            vertices[4] = xCalc(+hw, +hh);
            vertices[5] = yCalc(+hw, +hh);
            vertices[6] = xCalc(-hw, +hh);
            vertices[7] = yCalc(-hw, +hh);
        }
        this.verticesDirty = false;
    }

    get vertices()
    {
        if (this.verticesDirty)
        {
            this.updateVertices();
        }
        return this._vertices;
    }

    collidesRectangle(rectangle)
    {
        if (this.noRotate && rectangle.noRotate)
        {
            return this.AABBs(rectangle.AABB);
        }
        else
        {
            return this.collidesPolygon(rectangle);
        }
    }

    collidesCircle(circle)
    {
        return circle.collidesRectangle(this);
    }
}

module.exports = Rectangle;