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
        this.AABB = [0, 0, 0, 0];   // [x1, y1, x2, y2]
        this.static = true;
    }

    update() {}

    /**
     * collides with this shape's AABB box
     * @param {object} AABB
     */
    AABBcollideAABB(AABB)
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
        for (let i = 0, j = length - 1; i < length; j = i++)
        {
            const vI = vertices[i];
            const vJ = vertices[j];
            if (((vI.y > point.y) !== (vJ.y > point.y)) && (point.x < (vJ.x - vI.x) * (point.y - vI.y) / (vJ.y - vI.y) + vI.x))
            {
                c = !c;
            }
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
    collidesPolygon(polygon)
    {
        const a = this.vertices;
        const b = polygon.vertices;
        const polygons = [a, b];
        let minA, maxA, projected, minB, maxB;
        for (let i = 0; i < polygons.length; i++)
        {
            const polygon = polygons[i];
            for (let i1 = 0; i1 < polygon.length; i1++)
            {
                var i2 = (i1 + 1) % polygon.length;
                var p1 = polygon[i1];
                var p2 = polygon[i2];
                var normal = { x: p2.y - p1.y, y: p1.x - p2.x };
                minA = maxA = null;
                for (let j = 0; j < a.length; j++)
                {
                    projected = normal.x * a[j].x + normal.y * a[j].y;
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
                for (let j = 0; j < b.length; j++)
                {
                    projected = normal.x * b[j].x + normal.y * b[j].y;
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
        for (let i = 0; i < length - 1; i++)
        {
            if (Shape.lineLine(p1, p2, vertices[i], vertices[i + 1]))
            {
                return true;
            }
        }

        // finally check if the first vertex -> last vertex line intersects
        return Shape.lineLine(p1, p2, vertices[length - 1], vertices[0]);
    }

    static collides(shape)
    {
        return this['collides' + (typeof shape)](shape);
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