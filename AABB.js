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