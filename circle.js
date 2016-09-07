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
        this._AABB = [];
        options = options || {};
        this.set(options);
    }

    /**
     * @param {object} options
     * @param {boolean=true} options.static - this object does not need to be updated
     * @param {object=this.article} options.positionObject - use this to update position (and rotation unless rotationObject is defined)
     * @param {object=this.article} options.rotationObject - use this to update rotation
     * @param {number=} options.radius - otherwise article.width / 2 is used as radius
     */
    set(options)
    {
        if (typeof options.radius !== 'undefined')
        {
            this.radius = options.radius;
        }
        else
        {
            this.radius = this.article.width / 2;
        }
        this.radiusSquared = this.radius * this.radius;
        if (typeof options.static !== 'undefined')
        {
            this.static = options.static;
        }

        this.center = options.positionObject ? options.positionObject : this.article;
        this.rotation = options.rotationObject ? options.rotationObject : (options.positionObject ? options.positionObject : this.article);
        this.update(true);
    }

    get AABB()
    {
        this.update();
        return this._AABB;
    }

    update(dirty)
    {
        if (dirty || !this.static)
        {
            const AABB = this._AABB;
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

        // public static bool IntersectLineCircle(Vector2 location, float radius, Vector2 lineFrom, Vector2 lineTo)

        const ac = [center.x - p1.x, center.y - p1.y]; // location - lineFrom;
        const ab = [p2.x - p1.x, p2.y - p1.y]; // lineTo - lineFrom;
        const ab2 = dot(ab, ab);
        const acab = dot(ac, ab);
        let t = acab / ab2;
        t = (t < 0) ? 0 : t;
        t = (t > 1) ? 1 : t;
        let h = [(ab[0] * t + p1.x) - center.x, (ab[1] * t + p1.y) - center.y]; // ((ab * t) + lineFrom) - location;
        const h2 = dot(h, h);
        return h2 <= this.radiusSquared;

        // // Project point on a line
        // var ap = [center.x - p1.x, center.y - p1.y];
        // var ab = [p2.x - p1.x, p2.y - p1.y];
        // var coef = dotProduct2(ap, ab) / dotProduct2(ab, ab);
        // var check = [p1.x + (coef * ab[0]), p2.y + (coef * ab[1])];

        // // checks if the projected point is on the specified segment
        // return (p1.x < check[0] && check[0] < p2.x) || (p1.x > check[0] && check[0] > p2.x) ||
        //     (p1.y < check[1] && check[1] < p2.y) || (p1.y > check[1] && check[1] > p2.y);
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