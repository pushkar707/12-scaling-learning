"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
const cpus = os_1.default.cpus().length;
const port = 3000;
if (cluster_1.default.isPrimary) { // this is the primary process responsible for starting our server on all CPUS
    console.log(`Starting process on ${cpus} CPU cores`);
    for (let i = 0; i < cpus; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        console.log("Spawning another worker");
        cluster_1.default.fork();
    });
}
else {
    const app = (0, express_1.default)();
    console.log(`Worker ${process.pid} started`);
    app.get("/", (req, res) => {
        res.send('Hello world');
    });
    app.get("/api/:n", function (req, res) {
        let n = parseInt(req.params.n);
        let count = 0;
        if (n > 50000000000)
            n = 50000000000;
        for (let i = 0; i <= n; i++) {
            count += i;
        }
        res.send(`Final count is ${count} ${process.pid}`);
    });
    app.listen(port, () => {
        console.log(`Application listening on port ${port}`);
    });
}
