/**
 * @file src/rectangle.js
 * @author David Figatner
 * @license MIT
 * Copyright (c) 2016 YOPEY YOPEY LLC
 * {@link https://github.com/davidfig/intersects}
 */

const Shape = require('./shape.js');

class Rectangle extends Shape
{
    /**
     * @param {object} article that uses this shape
     * @param {object} [options] @see {@link Rectangle.set}
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
     * @param {number} [options.width] width of object when aligned
     * @param {number} [options.height] height of object when aligned
     * @param {number} [options.square] side size of a square
     * @param {object} [options.center] object to use for position (and rotation, unless separately defined)
     * @param {object} [options.rotation] object to use for rotation instead of options.center or article
     * @param {boolean} [options.noRotate] object does not rotate (simplifies math)
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

    /** width of rectangle */
    get width()
    {
        return this._width;
    }
    set width(value)
    {
        this._width = value;
        this.hw = value / 2;
    }

    /** height of rectangle */
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
     * update AABB and sets vertices to dirty
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
            const s = Math.abs(Math.sin(this.rotation.rotation) / 2);
            const c = Math.abs(Math.cos(this.rotation.rotation) / 2);

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

    /** updates vertices automatically when dirty */
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
            const rotation = this.rotation.rotation;
            const sin = Math.sin(rotation);
            const cos = Math.cos(rotation);

            vertices[0] = center.x - hw * cos + hh * sin;
            vertices[1] = center.y - hw * sin - hh * cos;
            vertices[2] = center.x + hw * cos + hh * sin;
            vertices[3] = center.y + hw * sin - hh * cos;
            vertices[4] = center.x + hw * cos - hh * sin;
            vertices[5] = center.y + hw * sin + hh * cos;
            vertices[6] = center.x - hw * cos - hh * sin;
            vertices[7] = center.y - hw * sin + hh * cos;
        }
        this.verticesDirty = false;
    }

    /** sets vertices Array[8] */
    get vertices()
    {
        if (this.verticesDirty)
        {
            this.updateVertices();
        }
        return this._vertices;
    }

    /**
     * Does Rectangle collide Rectangle?
     * @param {Rectangle} rectangle
     * @return {boolean}
     */
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

    /**
     * Does Rectangle collide Circle?
     * @param {Circle} circle
     * @return {boolean}
     */
    collidesCircle(circle)
    {
        return circle.collidesRectangle(this);
    }

    static fromRectangle(x, y, width, height)
    {
        const center = {x: x + width / 2, y: y + height / 2};
        return new Rectangle(center, {width: width, height: height, noRotate: true});
    }
}

module.exports = Rectangle;