/*
    intersects.js <https://github.com/davidfig/intersects>
    License: MIT license <https://github.com/davidfig/intersects/license>
    Author: David Figatner
    Copyright (c) 2016 YOPEY YOPEY LLC
*/

// arguments: (x, y | PIXI.Point), PIXI.DisplayObject, [buffer to enlarge hit area]
function pointContainer()
{
    var point, c, buffer;
    if (!isNaN(arguments[0]))
    {
        point = new PIXI.Point(arguments[0], arguments[1]);
        c = arguments[2];
        buffer = arguments[3] || 0;
    }
    else
    {
        point = arguments[0];
        c = arguments[1];
        buffer = arguments[2] || 0;
    }
    c.toLocal(point, c, point);
    var hw = c.width / 2 + buffer;
    var hh = c.height / 2 + buffer;
    return (point.x >= c.x - hw && point.x <= c.x + hw && point.y >= c.y - hh && point.y <= c.y + hh);
}

function rectangleRectangleCorners(box1, box2)
{
    if (box1.x2 < box2.x1 || box2.x2 < box1.x1 || box1.y2 < box2.y1 || box2.y2 < box1.y1)
    {
        return false;
    }
    else
    {
        return true;
    }
}

// detects collision of two axis-aligned rectangles based on top-left coordinate and width/height
function rectangleRectangleSize(x1, y1, w1, h1, x2, y2, w2, h2)
{
    if (x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1)
    {
        return false;
    }
    else
    {
        return true;
    }
}

// detects collision of two lines
// PARAMS:
//      (p0, p1, p2, p3) or
//      (x0, y0, x1, y1, x2, y2, x3, y3)
// from http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
function lineLine()
{
    var p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y;
    if (arguments.length === 4)
    {
        p0_x = arguments[0].x;
        p0_y = arguments[0].y;
        p1_x = arguments[1].x;
        p1_y = arguments[1].y;
        p2_x = arguments[2].x;
        p2_y = arguments[2].y;
        p3_x = arguments[3].x;
        p3_y = arguments[3].y;
    }
    else
    {
        p0_x = arguments[0];
        p0_y = arguments[1];
        p1_x = arguments[2];
        p1_y = arguments[3];
        p2_x = arguments[4];
        p2_y = arguments[5];
        p3_x = arguments[6];
        p3_y = arguments[7];
    }
    var s1_x, s1_y, s2_x, s2_y;
    s1_x = p1_x - p0_x;
    s1_y = p1_y - p0_y;
    s2_x = p3_x - p2_x;
    s2_y = p3_y - p2_y;

    var s, t;
    s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

    return (s >= 0 && s <= 1 && t >= 0 && t <= 1);
}

// detects collision of a line and a PIXI.Container that is axis-aligned
// (i.e., scale and translate is okay, but rotation is not)
function lineContainer(x0, y0, x1, y1, c)
{
    var hw = c.width / 2;
    var hh = c.height / 2;
    return Intersects.lineLine(x0, y0, x1, y1, c.x - hw, c.y - hh, c.x + hw, c.y - hh) ||
           Intersects.lineLine(x0, y0, x1, y1, c.x + hw, c.y - hh, c.x + hw, c.y + hh) ||
           Intersects.lineLine(x0, y0, x1, y1, c.x + hw, c.y + hh, c.x - hw, c.y + hh) ||
           Intersects.lineLine(x0, y0, x1, y1, c.x - hw, c.y + hh, c.x - hw, c.y - hh);
}

// detects collision of a line and a PIXI.Container
function lineContainerRotated(point1, point2, c)
{
    var p1 = c.worldTransform.applyInverse(point1);
    var p2 = c.worldTransform.applyInverse(point2);
    var hw = c._texture.orig.width / 2;
    var hh = c._texture.orig.height / 2;
    return Intersects.lineLine(p1.x, p1.y, p2.x, p2.y, -hw, -hh, hw, -hh) ||
           Intersects.lineLine(p1.x, p1.y, p2.x, p2.y, hw, -hh, hw, hh) ||
           Intersects.lineLine(p1.x, p1.y, p2.x, p2.y, hw, hh, -hw, hh) ||
           Intersects.lineLine(p1.x, p1.y, p2.x, p2.y, -hw, hh, -hw, -hh);
}

function getRotatedBoundingBox(c)
{
    var halfWidth = (c.width / c.scale.x) / 2;
    var halfHeight = (c.height / c.scale.y) / 2;
    var vertices = [];
    vertices.push(c.toGlobal(new PIXI.Point(-halfWidth, -halfHeight)));
    vertices.push(c.toGlobal(new PIXI.Point(+halfWidth, -halfHeight)));
    vertices.push(c.toGlobal(new PIXI.Point(+halfWidth, +halfHeight)));
    vertices.push(c.toGlobal(new PIXI.Point(-halfWidth, +halfHeight)));
    return vertices;
}

// detects collision of two PIXI.Containers using their world transforms
// from http://stackoverflow.com/questions/10962379/how-to-check-intersection-between-2-rotated-rectangles
function containerContainerRotated(c1, c2)
{
    var a = getRotatedBoundingBox(c1);
    var b = getRotatedBoundingBox(c2);
    var polygons = [a, b];
    var minA, maxA, projected, i, i1, j, minB, maxB;
    for (i = 0; i < polygons.length; i++) {
        var polygon = polygons[i];
        for (i1 = 0; i1 < polygon.length; i1++) {
            var i2 = (i1 + 1) % polygon.length;
            var p1 = polygon[i1];
            var p2 = polygon[i2];
            var normal = { x: p2.y - p1.y, y: p1.x - p2.x };
            minA = maxA = undefined;
            for (j = 0; j < a.length; j++) {
                projected = normal.x * a[j].x + normal.y * a[j].y;
                if (minA === undefined || projected < minA) {
                    minA = projected;
                }
                if (maxA === undefined || projected > maxA) {
                    maxA = projected;
                }
            }
            minB = maxB = undefined;
            for (j = 0; j < b.length; j++) {
                projected = normal.x * b[j].x + normal.y * b[j].y;
                if (minB === undefined || projected < minB) {
                    minB = projected;
                }
                if (maxB === undefined || projected > maxB) {
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

// exports
var Intersects = {
    pointContainer: pointContainer,
    lineLine: lineLine,
    rectangleRectangleCorners: rectangleRectangleCorners,
    lineContainerRotated: lineContainerRotated,
    rectangleRectangleSize: rectangleRectangleSize,
    containerContainerRotated: containerContainerRotated
};

// add support for AMD (Asynchronous Module Definition) libraries such as require.js.
if (typeof define === 'function' && define.amd)
{
    define(function()
    {
        return {
            Intersects: Intersects
        };
    });
}

// add support for CommonJS libraries such as browserify.
if (typeof exports !== 'undefined')
{
    module.exports = Intersects;
}

// define globally in case AMD is not available or available but not used
if (typeof window !== 'undefined')
{
    window.Intersects = Intersects;
}