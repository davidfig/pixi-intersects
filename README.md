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

## Live Example
https://davidfig.github.io/intersects/

## Installation
include intersects.js in your project or add to your workflow

    <script src="intersects.js"></script>

## API Reference

#### Intersects.pointContainer(x, y, container, buffer)
detects whether a point is inside a container
* buffer is an optional amount to enlarge the hit area
* container is a PIXI.DisplayObject
* alternatively accepts PIXI.Point instead of x, y

#### Intersects.rectangleRectangleCorners(box1, box2)
detects collision of two axis-aligned rectangles based on center point and width/height
* box is defined as {x1: left, y1: top, x2: right, y2: bottom}
* note: axis-aligned means that scale and translate changes are okay, but rotation may result in an incorrect result

#### Intersects.rectangleRectangleSize(x1, y1, w1, h1, x2, y2, w2, h2)
detects collision of two axis-aligned rectangles based on top-left coordinate and width/height

#### Intersects.lineLine(p1, p2, p3, p4)
detects collision of two lines
* alternatively accepts (x0, y0, x1, y1, x2, y2, x3, y3)

#### Intersects.lineContainer(x0, y0, x1, y1, c)
detects collision of a line and a PIXI.DisplayObject that is axis-aligned

#### Intersects.lineContainerRotated(point1, point2, c)
detects collision of a line and a PIXI.DisplayObject (non-axis aligned)

#### Intersects.containerContainerRotated(c1, c2)
detects collision of two PIXI.DisplayObjects using their world transforms

## License
MIT License (MIT)