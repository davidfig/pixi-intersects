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