/**
 * @file src/circle.js
 * @author David Figatner
 * @license MIT
 * Copyright (c) 2016 YOPEY YOPEY LLC
 * {@link https://github.com/davidfig/intersects}
 */

const Shape = require('./shape.js');

/** circle shape */
class Circle extends Shape
{
    /**
     * @param {Article} article that uses this shape
     * @param {object} [options] - @see {@link Circle.set}
     */
    constructor(article, options)
    {
        super(article);
        this.SHAPE = 'Circle';
        this.AABB = [];
        options = options || {};
        this.set(options);
    }

    /**
     * @param {object} options
     * @param {object} [options.positionObject=this.article] use this to update position (and rotation unless rotationObject is defined)
     * @param {object} [options.rotationObject=this.article] use this to update rotation
     * @param {number} [options.radius] otherwise article.width / 2 is used as radius
     */
    set(options)
    {
        this.radius = options.radius || this.article.width / 2;
        this.radiusSquared = this.radius * this.radius;
        this.center = options.positionObject ? options.positionObject : this.article;
        this.rotation = options.rotationObject ? options.rotationObject : (options.positionObject ? options.positionObject : this.article);
        this.update();
    }

    /** update AABB */
    update()
    {
        const AABB = this.AABB;
        const radius = this.radius;
        const center = this.center;
        AABB[0] = center.x - radius;
        AABB[1] = center.y - radius;
        AABB[2] = center.x + radius;
        AABB[3] = center.y + radius;
    }

    /**
     * Does Circle collide with Circle?
     * @param {Circle} circle
     * @return {boolean}
     */
    collidesCircle(circle)
    {
        const thisCenter = this.center;
        const center = circle.center;
        const x = center.x - thisCenter.x;
        const y = center.y - thisCenter.y;
        const radii = circle.radius + this.radius;
        return x * x + y * y <= radii * radii;
    }

    /**
     * Does Circle collide with point?
     * @param {Point} point
     * @return {boolean}
     */
    collidesPoint(point)
    {
        const x = point.x - this.center.x;
        const y = point.y - this.center.y;
        return x * x + y * y <= this.radiusSquared;
    }

    /**
     * Does Circle collide with a line?
     * from http://stackoverflow.com/a/10392860/1955997
     * @param {Point} p1
     * @param {Point} p2
     * @return {boolean}
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
     * Does circle collide with Rectangle?
     * @param {Rectangle} rectangle
     */
    collidesRectangle(rectangle)
    {
        // from http://stackoverflow.com/a/402010/1955997
        if (rectangle.noRotate)
        {
            const AABB = rectangle.AABB;
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

        // from http://stackoverflow.com/a/402019/1955997
        else
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
    }
}

module.exports = Circle;