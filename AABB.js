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