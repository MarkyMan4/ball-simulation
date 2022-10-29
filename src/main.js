import { Composite, Engine, Runner, Bodies, Mouse, MouseConstraint, Events, Composites } from 'matter-js';
import Rectangle from './rectangle';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.94;

let running = false;
let mouseIsDown = false;
let engine;
let runner;
let balls;
let mouse;
let mouseConstraint;

// walls
let ground = new Rectangle(canvas.width / 2, canvas.height + 100, canvas.width, 210, {isStatic: true});
let topWall = new Rectangle(canvas.width / 2, -100, canvas.width, 210, {isStatic: true});
let leftWall = new Rectangle(-100, canvas.height / 2, 210, canvas.height, {isStatic: true});
let rightWall = new Rectangle(canvas.width + 100, canvas.height / 2, 210, canvas.height, {isStatic: true});

export const stopRun = () => {
    running = false;

    Runner.stop(runner);
}

export const run = () => {
    if(running) {
        return;
    }

    running = true;

    // get user inputs
    let gravity = parseFloat(document.getElementById('grav-input').value);
    let radius = parseInt(document.getElementById('radius-input').value);
    let bounce = parseFloat(document.getElementById('bounce-input').value);
    let ballsAcross = parseInt(document.getElementById('balls-across-input').value);
    let ballsDown = parseInt(document.getElementById('balls-down-input').value);
    let mouseStrength = parseFloat(document.getElementById('mouse-strength-input').value);


    engine = Engine.create({gravity: {x: 0, y: gravity}});
    runner = Runner.create();

    balls = Composites.stack(50, 50, ballsAcross, ballsDown, 5, 5, (x, y) => {
        return Bodies.circle(x, y + (Math.random() * 50), radius, {restitution: bounce, density: 0.0001})
    });

    mouse = Mouse.create(canvas);
    mouseConstraint = MouseConstraint.create(engine, {mouse: mouse, constraint: {stiffness: mouseStrength}});

    Composite.add(engine.world, [balls, ground.rect, topWall.rect, leftWall.rect, rightWall.rect, mouseConstraint]);

    Runner.run(runner, engine);

    Events.on(mouseConstraint, 'mousedown', (event) => {
        mouseIsDown = true;
    });
    
    Events.on(mouseConstraint, 'mouseup', (event) => {
        mouseIsDown = false;
    });

    animate();
}

const drawCircle = (circle) => {
    ctx.beginPath();
    ctx.arc(circle.position.x, circle.position.y, circle.circleRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'DodgerBlue';
    ctx.stroke();
}

const drawRect = (rect, fill=true, color='DodgerBlue') => {
    let rectBody = rect.rect;

    ctx.save();
    ctx.beginPath();
    ctx.translate(rectBody.position.x, rectBody.position.y);
    ctx.rotate(rectBody.angle);
    ctx.rect(-rect.width / 2, -rect.height / 2, rect.width, rect.height); // draw around the center point

    if(fill) {
        ctx.fillStyle = color;
        ctx.fill();
    }
    else {
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    ctx.restore();
}

const drawMouseConstraint = () => {
    ctx.beginPath();
    ctx.moveTo(mouse.position.x, mouse.position.y);
    ctx.lineTo(mouseConstraint.body.position.x, mouseConstraint.body.position.y);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'white';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(mouseConstraint.body.position.x, mouseConstraint.body.position.y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
}

const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRect(ground, true, 'white');
    drawRect(topWall, true, 'white');
    drawRect(leftWall, true, 'white');
    drawRect(rightWall, true, 'white');

    balls.bodies.forEach(b => {
        drawCircle(b);
    });

    if(mouseIsDown && mouseConstraint.body) {
        drawMouseConstraint();
    }

    if(running) {
        animId = requestAnimationFrame(animate);
    }
    else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}


// add runner to global scope
window.run = run;
window.stopRun = stopRun;
