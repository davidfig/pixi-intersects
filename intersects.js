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

function localPointBox()
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

/**
 * checks for intersection between point and circle
 * @param {PIXI.Point} point coordinates
 * @param {PIXI.Point} center of circle
 * @param {number} radius of circle
 */
function pointCircle(point, circle, radius)
{
    var dx = Math.abs(point.x - circle.x);
    var dy = Math.abs(point.y - circle.y);
    if (dx > radius || dy > radius)
    {
        return false;
    }
    if (dx + dy < radius)
    {
        return true;
    }
    return (dx * dx + dy * dy <= radius * radius);
}

/**
 * checks if a point is in a box (where x, y is the center of the box)
 * @param {PIXI.Point} point (or use x, y as first two arguments)
 * @param {object} rectangle {centerX, centerY, width, height}
 * @param {number} buffer - default = 0, used to enlarge hit area
 * @return {boolean} true if point is in box
 */
function pointBox()
{
    var point, rect, buffer;
    if (!isNaN(arguments[0]))
    {
        point = new PIXI.Point(arguments[0], arguments[1]);
        rect = arguments[2];
        buffer = arguments[3] || 0;
    }
    else
    {
        point = arguments[0];
        rect = arguments[1];
        buffer = arguments[2] || 0;
    }
    var hw = rect.width / 2 + buffer;
    var hh = rect.height / 2 + buffer;
    return (point.x >= rect.x - hw && point.x <= rect.x + hw && point.y >= rect.y - hh && point.y <= rect.y + hh);
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

/**
 * detects collision of two axis-aligned rectangles
 * @param {object} AABB1
 * @param {object} AABB1.x
 * @param {object} AABB1.y
 * @param {object} AABB1.width
 * @param {object} AABB1.height
 * @param {object} AABB2
 * @param {object} AABB2.x
 * @param {object} AABB2.y
 * @param {object} AABB2.width
 * @param {object} AABB2.height
 * @return {boolean} is there a collision
 */
function AABB(AABB1, AABB2)
{
    return !(AABB1.x + AABB1.width < AABB2.x || AABB2.x + AABB2.width < AABB1.x ||
           AABB1.y + AABB1.height < AABB2.y || AABB2.y + AABB2.height < AABB1.y);
}

// detects collision of two axis-aligned rectangles based on top-left coordinate and width/height
// x1, y1, w1, h1, x2, y2, w2, h2
// or
// rect1, rect2
function rectangleRectangleSize()
{
    var x1, y1, w1, h1, x2, y2, w2, h2;
    if (arguments.length === 2)
    {
        var rect1 = arguments[0];
        var rect2 = arguments[1];
        x1 = rect1.x;
        y1 = rect1.y;
        w1 = rect1.width;
        h1 = rect1.height;
        x2 = rect2.x;
        y2 = rect2.y;
        w2 = rect2.width;
        h2 = rect2.height;
    }
    else
    {
        x1 = arguments[0];
        y1 = arguments[1];
        w1 = arguments[2];
        h1 = arguments[3];
        x2 = arguments[4];
        y2 = arguments[5];
        w2 = arguments[6];
        h2 = arguments[7];
    }
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
    if (arguments.length === 3)
    {
        var p1 = x0;
        var p2 = y0;
        c = x1;
        x0 = p1.x;
        y0 = p1.y;
        x1 = p2.x;
        y1 = p2.y;
    }
    var hw = c.width / 2;
    var hh = c.height / 2;
    return Intersects.lineLine(x0, y0, x1, y1, c.x - hw, c.y - hh, c.x + hw, c.y - hh) ||
           Intersects.lineLine(x0, y0, x1, y1, c.x + hw, c.y - hh, c.x + hw, c.y + hh) ||
           Intersects.lineLine(x0, y0, x1, y1, c.x + hw, c.y + hh, c.x - hw, c.y + hh) ||
           Intersects.lineLine(x0, y0, x1, y1, c.x - hw, c.y + hh, c.x - hw, c.y - hh);
}

function lineAABB(p1, p2, AABB)
{
    return Intersects.lineLine(p1.x, p1.y, p2.x, p2.y, AABB.x, AABB.y, AABB.x + AABB.width, AABB.y) ||
           Intersects.lineLine(p1.x, p1.y, p2.x, p2.y, AABB.x + AABB.width, AABB.y, AABB.x + AABB.width, AABB.y + AABB.height) ||
           Intersects.lineLine(p1.x, p1.y, p2.x, p2.y, AABB.x + AABB.width, AABB.y + AABB.height, AABB.x, AABB.y + AABB.height) ||
           Intersects.lineLine(p1.x, p1.y, p2.x, p2.y, AABB.x, AABB.y + AABB.height, AABB.x, AABB.y);
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

function getAABBBox(AABB, stage)
{
    var width = (AABB.width / stage.scale.x);
    var height = (AABB.height / stage.scale.y);
    var vertices = [];
    vertices.push(stage.toGlobal(new PIXI.Point(AABB.x, AABB.y)));
    vertices.push(stage.toGlobal(new PIXI.Point(AABB.x + width, AABB.y)));
    vertices.push(stage.toGlobal(new PIXI.Point(AABB.x + width, AABB.y + height)));
    vertices.push(stage.toGlobal(new PIXI.Point(AABB.x, AABB.y + height)));
    return vertices;
}

/**
 * detects collision betweeen a PIXI object and AABB using PIXI's world transforms and SAT
 * based on http://stackoverflow.com/questions/10962379/how-to-check-intersection-between-2-rotated-rectangles
 * @param {PIXI.DisplayObject} object
 * @param {object} AABB (x, y, width, height) based off top-left corner
 * @param {PIXI.Container} stage - parent coordinates for AABB
 * @return {boolean} collision
 */
function displayObjectAABB(object, AABB, stage)
{
    var a = getRotatedBoundingBox(object);
    var b = getAABBBox(AABB, stage);
    var polygons = [a, b];
    var minA, maxA, projected, i, i1, j, minB, maxB;
    for (i = 0; i < polygons.length; i++) {
        var polygon = polygons[i];
        for (i1 = 0; i1 < polygon.length; i1++) {
            var i2 = (i1 + 1) % polygon.length;
            var p1 = polygon[i1];
            var p2 = polygon[i2];
            var normal = { x: p2.y - p1.y, y: p1.x - p2.x };
            minA = maxA = null;
            for (j = 0; j < a.length; j++) {
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
            for (j = 0; j < b.length; j++) {
                projected = normal.x * b[j].x + normal.y * b[j].y;
                if (minB === null || projected < minB) {
                    minB = projected;
                }
                if (maxB === null || projected > maxB) {
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

/**
 * detects collision using PIXI's world transforms and SAT
 * based on http://stackoverflow.com/questions/10962379/how-to-check-intersection-between-2-rotated-rectangles
 * @param {PIXI.DisplayObject} c1
 * @param {PIXI.DisplayObject} c2
 * @return {boolean} collision
 */
function displayObjects(c1, c2)
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
            minA = maxA = null;
            for (j = 0; j < a.length; j++) {
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
            for (j = 0; j < b.length; j++) {
                projected = normal.x * b[j].x + normal.y * b[j].y;
                if (minB === null || projected < minB) {
                    minB = projected;
                }
                if (maxB === null || projected > maxB) {
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

// two circles with radius c1.width / 2 and c2.width / 2
function circleCircle(c1, c2)
{
    var r1 = c1.width / 2;
    var r2 = c2.width / 2;
    return Math.pow(c2.x - c1.x, 2) + Math.pow(c2.y - c1.y, 2) <= Math.pow(r2 + r1, 2);
}

// exports
var Intersects = {
    pointContainer: pointContainer,
    pointBox: pointBox,
    lineLine: lineLine,

    AABB: AABB,
    lineAABB: lineAABB,
    displayObjects: displayObjects,
    displayObjectAABB: displayObjectAABB,

    rectangleRectangleCorners: rectangleRectangleCorners,
    lineContainer: lineContainer,
    lineContainerRotated: lineContainerRotated,
    rectangleRectangleSize: rectangleRectangleSize,
    circleCircle: circleCircle,
    pointCircle: pointCircle
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