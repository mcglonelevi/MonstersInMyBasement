class Rectangle {
    constructor(point1, point2) {
        this.width = Math.abs(point1[0] - point2[0]);
        this.height = Math.abs(point1[1] - point2[1]);
        this.lowerLeft = [Math.min(point1[0], point2[0]), Math.min(point1[1], point2[1])];
        this.lowerRight = [Math.max(point1[0], point2[0]), Math.min(point1[1], point2[1])];
        this.topLeft = [Math.min(point1[0], point2[0]), Math.max(point1[1], point2[1])];
        this.topRight = [Math.max(point1[0], point2[0]), Math.max(point1[1], point2[1])];
    }
}