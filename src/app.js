class App {
    constructor() {
        this.speedInput = document.getElementById('speedInput');
        this.angleInput = document.getElementById('angleInput');
        this.playBtn = document.getElementById('playBtn');
        this.replayBtn = document.getElementById('replayBtn');
        this.canvas = document.getElementById('simCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.lastShot = null;

        this.playBtn.addEventListener('click', () => this.play());
        this.replayBtn.addEventListener('click', () => this.replay());
    }

    getInputs() {
        return {
            speed: parseFloat(this.speedInput.value),
            angle: parseFloat(this.angleInput.value) * Math.PI / 180
        };
    }

    computeTrajectory(speed, angle) {
        const g = 9.81;
        const dt = 0.02;
        const points = [];
        let t = 0;
        while (true) {
            const x = speed * Math.cos(angle) * t;
            const y = speed * Math.sin(angle) * t - 0.5 * g * t * t;
            if (y < 0) break;
            points.push({x, y});
            t += dt;
        }
        return points;
    }

    drawTrajectory(points) {
        const maxX = points[points.length - 1].x;
        const maxY = Math.max(...points.map(p => p.y));
        const w = this.canvas.width;
        const h = this.canvas.height;
        const scaleX = w / maxX;
        const scaleY = h / (maxY * 1.1);

        this.ctx.clearRect(0, 0, w, h);
        this.ctx.beginPath();
        this.ctx.moveTo(0, h);
        points.forEach(p => {
            const x = p.x * scaleX;
            const y = h - p.y * scaleY;
            this.ctx.lineTo(x, y);
        });
        this.ctx.strokeStyle = 'blue';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    play() {
        const {speed, angle} = this.getInputs();
        this.lastShot = {speed, angle};
        const points = this.computeTrajectory(speed, angle);
        this.drawTrajectory(points);
        this.replayBtn.disabled = false;
    }

    replay() {
        if (!this.lastShot) return;
        const points = this.computeTrajectory(this.lastShot.speed, this.lastShot.angle);
        this.drawTrajectory(points);
    }
}

document.addEventListener('DOMContentLoaded', () => new App());
