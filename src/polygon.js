/**
 * @file src/polygon.js
 * @author David Figatner
 * @license MIT
 * Copyright (c) 2016 YOPEY YOPEY LLC
 * {@link https://github.com/davidfig/intersects}
 */

const Shape = require('./shape.js');

/** Polygon */
class Polygon extends Shape
{
    /**
     * @param {Article} article that uses this shape
     * @param {array} points in the form of [x, y, x2, y2, x3, y3, . . .]
     * @param {object} [options] @see {@link Polygon.set}
     */
    constructor(article, points, options)
    {
        super(article);
        this.SHAPE = 'Polygon';
        options = options || {};
        this.points = points;
        this.vertices = [];
        this.AABB = [];
        this.set(options);
    }

    /**
     * @param {object} options
     * @param {PIXI.Point[]} options.points
     * @param {PIXI.DisplayObject} [options.center] - object to use for position (and rotation, unless separately defined)
     * @param {PIXI.DisplayObject} [options.rotation] - object to use for rotation instead of options.center or article
     */
    set(options)
    {
        if (options.point)
        {
            this.points = options.points;
        }
        this.center = options.center || this.article;
        this.rotation = options.rotation ? options.rotation : (options.center ? options.center : this.article);
        this.update();
    }

    /**
     * based on http://www.willperone.net/Code/coderr.php
     */
    update()
    {
        const rotation = this.rotation.rotation;
        const sin = Math.sin(rotation);
        const cos = Math.cos(rotation);

        let minX = Infinity, maxX = 0, minY = Infinity, maxY = 0;
        const points = this.points;
        const count = points.length;
        const vertices = this.vertices;
        const center = this.center;
        for (let i = 0; i < count; i += 2)
        {
            const pointX = points[i];
            const pointY = points[i + 1];
            const x = vertices[i] = center.x + pointX * cos - pointY * sin;
            const y = vertices[i + 1] = center.y + pointX * sin + pointY * cos;
            minX = (x < minX) ? x : minX;
            maxX = (x > maxX) ? x : maxX;
            minY = (y < minY) ? y : minY;
            maxY = (y > maxY) ? y : maxY;
        }
        this.AABB[0] = minX;
        this.AABB[1] = minY;
        this.AABB[2] = maxX;
        this.AABB[3] = maxY;
        this.width = maxX - minX;
        this.height = maxY - minY;
        this.hw = (maxX - minX) / 2;
        this.hh = (maxY - minY) / 2;
    }

    /**
     * Does Rectangle collide Rectangle?
     * @param {Rectangle} rectangle
     * @return {boolean}
     */
    collidesRectangle(rectangle)
    {
        return this.collidesPolygon(rectangle);
    }

    /**
     * Does Rectangle collide Circle?
     * @param {Circle} circle
     * @return {boolean}
     */
    collidesCircle(circle)
    {
        return circle.collidesPolygon(this);
    }
}

module.exports = Polygon;