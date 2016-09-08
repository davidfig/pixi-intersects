/**
 * @license
 * intersects <https://github.com/davidfig/intersects>
 * Released under MIT license <https://github.com/davidfig/intersects/license>
 * Author David Figatner
 * Copyright (c) 2016 YOPEY YOPEY LLC
 */

const Shape = require('./shape.js');

class Polygon extends Shape
{
    /**
     * @param {Article} article that uses this shape
     * @param {object} options - see set()
     */
    constructor(article, options)
    {
debug('TODO: Polygon:Shapes');
        super(article);
        this.SHAPE = 'Polygon';
        options = options || {};
        this.set(options);
    }

    /**
     * @param {object} options
     * @param {boolean=false} options.static - this object does not need to be updated
     * @param {PIXI.Point[]} options.points
     * @param {PIXI.DisplayObject=} options.center - object to use for position (and rotation, unless separately defined)
     * @param {PIXI.DisplayObject=} options.rotation - object to use for rotation instead of options.center or article
     */
    set(options)
    {
        if (options.point)
        {
            this.points = options.points;
        }
        this.center = options.center || this.article;
        this.rotation = options.rotation ? options.rotation : (options.center ? options.center : this.article);
        this.static = options.static;
    }

    /**
     * based on http://www.willperone.net/Code/coderr.php
     */
    update()
    {
// TODO
        const s = Math.abs(this.transform._sr / 2);
        const c = Math.abs(this.transform._cr / 2);
    }
}

module.exports = Polygon;