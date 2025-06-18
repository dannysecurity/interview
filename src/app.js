class App {
    constructor() {
        this.speedInput = document.getElementById('speedInput');
        this.angleInput = document.getElementById('angleInput');
        this.playBtn = document.getElementById('playBtn');
        this.replayBtn = document.getElementById('replayBtn');
        this.spinInput = document.getElementById('spinInput');
        this.canvas = document.getElementById('simCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.lastShot = null;

        this.playBtn.addEventListener('click', () => this.play());
        this.replayBtn.addEventListener('click', () => this.replay());
    }

    getInputs() {
        return {
            speed: parseFloat(this.speedInput.value),
            angle: parseFloat(this.angleInput.value) * Math.PI / 180,
            spin: parseFloat(this.spinInput.value)
        };
    }

    computeTrajectory(speed, angle, spin) {
        const g = 9.81;
        const dt = 0.02;
        const magnusCoeff = 0.0004;
        const spinRps = spin / 60;

        let vx = speed * Math.cos(angle);
        let vy = speed * Math.sin(angle);

        let x = 0;
        let y = 0;
        let t = 0;
        const points = [];

        while (true) {
            points.push({ x, y });
            if (y < 0 && t > 0) break;

            const aMagnusX = -magnusCoeff * spinRps * vy;
            const aMagnusY = magnusCoeff * spinRps * vx;

            vx += aMagnusX * dt;
            vy += (aMagnusY - g) * dt;

            x += vx * dt;
            y += vy * dt;
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
        const {speed, angle, spin} = this.getInputs();
        this.lastShot = {speed, angle, spin};
        const points = this.computeTrajectory(speed, angle, spin);
        this.drawTrajectory(points);
        this.replayBtn.disabled = false;
    }

    replay() {
        if (!this.lastShot) return;
        const points = this.computeTrajectory(this.lastShot.speed, this.lastShot.angle, this.lastShot.spin);
        this.drawTrajectory(points);
    }
}

document.addEventListener('DOMContentLoaded', () => new App());
