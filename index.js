const PIXI = require('pixi.js');
const Easing = require('penner');
const Debug = require('yy-debug');
const Renderer = require('yy-renderer');
const Animate = require('yy-animate');
const Update = require('yy-update');
const Intersects = require('../intersects/intersects.js');

// initialize
Debug.init();
Debug.log('===KEY===<br>Blue: AABB collision<br>Red: collision<br>Green: none');

// set up renderer
Update.init({debug: Debug, FPS: true, percent: true});
const renderer = new Renderer({update: Update, debug: Debug, transparent: true, autoresize: true, alwaysRender: true, style: {pointerEvents: 'none'}});
// renderer.canvas.style.pointerEvents = 'none';
var aabbG = renderer.add(new PIXI.Graphics());

// initialize animation
Animate.init({update: Update, debug: Debug});

// create examples
pointInAABB(100, 100);
pointInRectangle(600, 100);
lineLine(100, 350);
lineRectangle(800, 100);
rectangleRectangle(950, 350);
circleCircle(300, 300);
lineCircle(300, 500);
circleRectangle(650, 590);
lineAABB(600, 300);
AABBRectangle(100, 590);
polygonRectangle(1100, 100);

Update.update();

// point and AABB
function pointInAABB(x, y)
{
    var s = square(80, 0x00ff00, x, y);
    s.shape = new Intersects.Rectangle(null, {center: new PIXI.Point(x, y), square: 80, noRotate: true});
    var c = circle(5, 0, x + 75, y);
    text('Point-Rectangle', x, y + 68);
    new Animate.to(c, {x: x - 100, y: y - 20}, 4000, {reverse: true, repeat: true, onEach:
        function()
        {
            s.tint = s.shape.collidesPoint(c) ? 0xff0000 : 0x00ff00;
        }, ease: Easing.easeInOutSine});
}

// point and rectangle
function pointInRectangle(x, y)
{
    var s = square(60, 0x00ff00, x, y);
    s.rotation = 0.4;
    s.shape = new Intersects.Rectangle(s);
    var c = circle(5, 0, x, y);
    text('Point-Rectangle', x, y + 68);
    new Animate.to(c, {x: x + 100, y: y + 25}, 2000, {reverse: true, repeat: true, onEach:
        function()
        {
            s.tint = s.shape.AABBs([c.x, c.y, c.x, c.y]) ? 0x0000ff : 0x00ff00;
            s.tint = s.shape.collidesPoint(c) ? 0xff0000 : s.tint;
        }, ease: Easing.easeInOutSine});
}

// line and line
function lineLine(x, y)
{
    var g = renderer.add(new PIXI.Graphics());
    text('line-line', x, y + 118);
    var l1 = {x: x, y: y};
    var l2 = {x: x, y: y + 100};
    var p1 = {x: x + 100, y: y};
    var p2 = {x: x + 50, y: y + 100};
    new Animate.to(p1, {x: x - 75}, 2750, {reverse: true, repeat: true, onEach:
        function()
        {
            g.clear();
            line(g, l1, l2, 0);
            var intersect = Intersects.Shape.lineLine(l1, l2, p1, p2);
            line(g, p1, p2, intersect ? 0xff0000 : 0x00ff00);
        }, ease: Easing.easeInOutSine});
}

// line and Rectangle
// note: it's not worth doing an AABB check because it cost the same as a Rectangle check
function lineRectangle(x, y)
{
    var g = renderer.addChild(new PIXI.Graphics());
    g.alpha = 0.5;
    text('line-Rectangle', x, y + 118);
    var p1 = new PIXI.Point(x, y);
    var p2 = new PIXI.Point(x, y + 100);
    line(g, p1, p2, 0);
    var s = square(50, 0x00ff00, x + 100, y + 50);
    s.shape = new Intersects.Rectangle(s);
    s.alpha = 0.5;
    new Animate.to(s, {x: x - 100, y: y - 75, rotation: 2 * Math.PI}, 3000, {onEach:
        function()
        {
            s.shape.update();
            s.tint = s.shape.collidesLine(p1, p2) ? 0xff0000 : 0x00ff00;
        }, reverse: true, repeat: true, ease: Easing.easeInOutSine});
}

// two Rectangles
function rectangleRectangle(x, y)
{
    // test a container
    var s1 = renderer.addChild(new PIXI.Container());
    s1.position.set(x - 200, y - 50);
    var insideSquare = square(100, 0x00ff00, 0, 0);
    s1.addChild(insideSquare);
    s1.shape = new Intersects.Rectangle(s1, {rotation: insideSquare});

    // test a sprite
    var s2 = square(75, 0x00ff00, x, y);
    s2.shape = new Intersects.Rectangle(s2);
    s1.alpha = s2.alpha = 0.5;
    text('Rectangle-Rectangle', x - 100, y + 110);
    new Animate.to(insideSquare, {rotation: Math.PI * 2}, 4000, { repeat: true, reverse: true});
    new Animate.to(s1, {x: x + 100, y: y + 75}, 4000, {onEach:
        function()
        {
            s1.shape.update();
            s2.shape.update();
            s1.children[0].tint = s2.tint = s1.shape.AABBs(s2.shape.AABB) ? 0x0000ff : 0x00ff00;
            s1.children[0].tint = s2.tint = s1.shape.collidesRectangle(s2.shape) ? 0xff0000 : s2.tint;
        }, reverse: true, repeat: true, ease: Easing.easeInOutSine});
    new Animate.to(s2, {x: x - 200, y: y - 25, rotation: Math.PI}, 3000, {repeat: true, reverse: true, ease: Easing.easeInOutSine});
}

// AABB-circle testing is as expensive as circle-circle testing, so it's ommitted
function circleCircle(x, y)
{
    var c1 = circle(50, 0x00ff00, x - 100, y);
    c1.shape = new Intersects.Circle(c1, {radius: 25});
    var c2 = circle(74, 0x00ff00, x + 100, y + 50);
    c2.shape = new Intersects.Circle(c2);
    text('Circle-Circle', x, y + 100);
    c1.alpha = c2.alpha = 0.5;
    new Animate.to(c1, {x: x + 100, y: y + 25}, 4000, {repeat: true, reverse: true, onEach:
        function()
        {
            c1.tint = c2.tint = c1.shape.collidesCircle(c2.shape) ? 0xff0000 : 0x00ff00;
        }, ease: Easing.easeInOutSine});
    new Animate.to(c2, {x: x - 100, y: y - 25}, 2000, {repeat: true, reverse: true, ease: Easing.easeInOutSine});
}

function lineCircle(x, y)
{
    var g = renderer.add(new PIXI.Graphics());
    var p1 = {x: x + 100, y: y};
    var p2 = {x: x + 120, y: y + 100};
    line(g, p1, p2);
    var c = circle(50, 0x00ff00, x, y);
    c.shape = new Intersects.Circle(c);
    text('line-Circle', x + 100, y + 120);
    c.alpha = 0.5;
    new Animate.to(c, {x: x + 200, y: y + 75}, 4000, {repeat: true, reverse: true, onEach:
        function()
        {
            c.tint = c.shape.collidesLine(p1, p2) ? 0xff0000 : 0x00ff00;
        }, ease: Easing.easeInOutSine});
}

function circleRectangle(x, y)
{
    var c = circle(100, 0x00ff00, x - 30, y - 30);
    c.shape = new Intersects.Circle(c);
    var rectangle = square(50, 0x00ff00, x + 150, y);
    rectangle.shape = new Intersects.Rectangle(rectangle);
    c.alpha = rectangle.alpha = 0.5;
    text('Circle-Rectangle', x + 75, y + 50);
    new Animate.to(rectangle, {rotation: Math.PI * 2}, 13000, {repeat: true});
    new Animate.to(rectangle, {x: x + 50}, 2000, {repeat: true, reverse: true, ease: Easing.easeInOutSine});
    new Animate.to(c, {x: x + 100, y: y - 10}, 3000, {repeat: true, reverse: true, onEach:
        function()
        {
            c.shape.update();
            rectangle.shape.update();
            c.tint = rectangle.tint = c.shape.AABBs(rectangle.shape.AABB) ? 0x0000ff : 0x00ff00;
            c.tint = rectangle.tint = c.shape.collidesRectangle(rectangle.shape) ? 0xff0000 : 0x00ff00;
        }, ease: Easing.easeInOutSine});

    var t = text('Circle-Container', x, y + 120);
    t.x += t.width / 2;
}

function lineAABB(x, y)
{
    var s = square(80, 0x00ff00, x, y);
    s.alpha = 0.5;
    s.shape = Intersects.Rectangle.fromRectangle(x - 40, y - 40, 80, 80);//(null, {center: new PIXI.Point(x, y), square: 80, noRotate: true});
    var p1 = {x: x, y: y};
    var p2 = {x: x, y: y + 100};
    var g = renderer.add(new PIXI.Graphics());
    g.alpha = 0.5;
    text('line-Rectangle', x, y + 120);
    new Animate.to(p1, {x: x - 150}, 4000, {repeat: true, reverse: true, onEach:
        function()
        {
            g.clear();
            line(g, p1, p2);
            s.tint = s.shape.collidesLine(p1, p2) ? 0xff0000 : 0x00ff00;
        }, ease: Easing.easeInOutSine});
}

function AABBRectangle(x, y)
{
    var s = square(50, 0x00ff00, x + 150, y);
    s.shape = new Intersects.Rectangle(s);
    var s2 = square(65, 0x00ff00, x, y);
    s.alpha = s2.alpha = 0.5;
    s2.shape = new Intersects.Rectangle(s2, {center: new PIXI.Point(x, y), square: 50, noRotate: true});
    new Animate.to(s, {x: x - 25, y: y - 25, rotation: Math.PI}, 3000, { reverse: true, repeat: true, onEach:
        function()
        {
            s.shape.update();
            s.tint = s2.tint = s2.shape.collides(s.shape) ? 0xff0000 : 0x00ff00;
        }, ease: Easing.easeInOutQuad});
    text('Rectangle-Rectangle', x, y + 50);
}

function polygonRectangle(x, y)
{
    var s = square(60, 0x00ff00, x + 100, y);
    s.alpha = 0.25;
    s.shape = new Intersects.Rectangle(s);
    var g = renderer.add(new PIXI.Graphics());
    g.alpha = 0.25;
    g.position.set(x, y);
    const points = [0, 0, 100, 50, 150, 150, 25, 125];
    const p = polygon(g, points, 0x00ff00);
    p.shape = new Intersects.Polygon(p, points);
    new Animate.to(g, {x: x - 25, y: y - 25, rotation: -Math.PI}, 3000, {reverse: true, repeat: true, onEach:
        function()
        {
            p.shape.update();
            s.tint = p.shape.AABBs(s.shape.AABB) ? 0x0000ff : 0x00ff00;
            s.tint = p.shape.collides(s.shape) ? 0xff0000 : s.tint;
            g.clear();
            polygon(g, points, s.tint);
        }, ease: Easing.easeInOutSine});
    text('Polygon-Rectangle', x, y + 150);
}

// draw a square
function square(size, color, x, y)
{
    var sprite = PIXI.Sprite.fromImage('box.png');
    renderer.addChild(sprite);
    sprite.anchor.set(0.5);
    sprite.width = sprite.height = size;
    sprite.position.set(x, y);
    sprite.tint = color;
    return sprite;
}

// draw a circle
function circle(size, color, x, y)
{
    var circle = PIXI.Sprite.fromImage('circle.png');
    circle.anchor.set(0.5);
    circle.width = circle.height = size;
    renderer.addChild(circle);
    circle.tint = color;
    circle.position.set(x, y);
    return circle;
}

function polygon(g, points, color)
{
    g.beginFill(color);
    g.drawPolygon(points);
    g.endFill();
    return g;
}

// draw a line
function line(g, p1, p2, color)
{
    g.lineStyle(10, color);
    g.moveTo(p1.x, p1.y);
    g.lineTo(p2.x, p2.y);
}

// draw text
function text(text, x, y)
{
    var c = renderer.addChild(new PIXI.Container());
    var back = c.addChild(PIXI.Sprite.fromImage('box.png'));
    back.anchor.set(0.5);
    back.tint = 0;
    back.alpha = 0.1;
    var words = c.addChild(new PIXI.Text(text, {fontSize: '14px', align: 'center'}));
    words.anchor.set(0.5);
    c.position.set(x, y);
    back.width = words.width * 1.25;
    back.height = words.height * 1.25;
    return c;
}

// draw vertices for testing
var vg = renderer.add(new PIXI.Graphics());
function vertices(shape, clear) // eslint-disable-line no-unused-vars
{
    if (clear)
    {
        vg.clear();
    }
    var v = shape.vertices;
    for (var i = 0; i < shape.vertices.length; i += 2)
    {
        vg.beginFill(0xff00ff, 0.5);
        vg.drawCircle(v[i], v[i + 1], 10);
        vg.endFill();
    }
}

// draw AABB vertices for testings
function AABB(shape, clear) // eslint-disable-line no-unused-vars
{
    if (clear)
    {
        aabbG.clear();
    }
    var a = shape.AABB;
    aabbG.beginFill(0xff00ff);
    aabbG.moveTo(a[0], a[1]);
    aabbG.lineTo(a[2], a[1]);
    aabbG.lineTo(a[2], a[3]);
    aabbG.lineTo(a[0], a[3]);
    aabbG.lineTo(a[0], a[1]);
    aabbG.endFill();
}