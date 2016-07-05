## intersects
shape collision / intersects library for pixi.js

## rationale
this is a simple libary that i designed for use with my game engine. most of the better collision libraries were too large or too heavily invested in physics. i wanted something simple that worked well with pixi.js.

## Code Example

        // point-container intersection

        var sprite = new PIXI.Sprite(texture);
        sprite.position.set(5, 5);
        if (Intersects.pointContainer(new PIXI.Point(10, 10), container))
        {
            console.log('intersected');
        }

## Installation
include intersects.js in your project or add to your workflow

    <script src="intersects.js"></script>

## Example
https://davidfig.github.io/intersects/

see also

* https://davidfig.github.io/update/
* https://davidfig.github.io/animate/
* https://davidfig.github.io/renderer/
* https://davidfig.github.io/viewport/
* https://davidfig.github.io/debug/

## API Reference
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

function lineContainer(x0, y0, x1, y1, c)
{
    var hw = c.width / 2;
    var hh = c.height / 2;
    return Intersects.lineLine(x0, y0, x1, y1, c.x - hw, c.y - hh, c.x + hw, c.y - hh) ||
           Intersects.lineLine(x0, y0, x1, y1, c.x + hw, c.y - hh, c.x + hw, c.y + hh) ||
           Intersects.lineLine(x0, y0, x1, y1, c.x + hw, c.y + hh, c.x - hw, c.y + hh) ||
           Intersects.lineLine(x0, y0, x1, y1, c.x - hw, c.y + hh, c.x - hw, c.y - hh);
}

function lineContainerRotated(originalP1, originalP2, c)
{
    var p1 = c.worldTransform.applyInverse(originalP1);
    var p2 = c.worldTransform.applyInverse(originalP2);
    var hw = c._texture.orig.width / 2;
    var hh = c._texture.orig.height / 2;
    return Intersects.lineLine(p1.x, p1.y, p2.x, p2.y, -hw, -hh, hw, -hh) ||
           Intersects.lineLine(p1.x, p1.y, p2.x, p2.y, hw, -hh, hw, hh) ||
           Intersects.lineLine(p1.x, p1.y, p2.x, p2.y, hw, hh, -hw, hh) ||
           Intersects.lineLine(p1.x, p1.y, p2.x, p2.y, -hw, hh, -hw, -hh);
}

function getRotatedBoundingBox(c, world)
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

#### Intersects.containerContainerRotated(c1, c2, world)
detects collision of two PIXI.Containers

## License
MIT License (MIT)