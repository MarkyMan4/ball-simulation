import { Bodies } from 'matter-js';

class Rectangle {
    constructor(x, y, w, h, options={}) {
        this.width = w;
        this.height = h;
        this.rect = Bodies.rectangle(x, y, w, h, options);
    }
}

export default Rectangle;
