## intersects
shape collision / intersects library for pixi.js

## rationale
this is a simple libary that i designed for use with my game engine. most of the better collision libraries were too large or too heavily invested in physics. i wanted something simple that worked well with pixi.js.

## Code Example

        // point-Rectangle intersection

        var sprite = new PIXI.Sprite(texture);
        sprite.shape = new Intersects.Rectangle(sprite);
        sprite.position.set(5, 5);
        if (sprite.shape.collidesPoint(new PIXI.Point(10, 10)))
        {
            console.log('intersected');
        }

## Live Example
https://davidfig.github.io/intersects/

## Installation

use the shapes as a module:

    const Rectangle = require('rectangle.js');

    sprite.shape = new Rectangle(sprite);

or include intersects.js in your project

    <script src="intersects.js"></script>

## License
MIT License (MIT)