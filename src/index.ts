import express from "express"
import cluster from "cluster"
import os from "os"

const cpus = os.cpus().length;
const port = 3000;

if (cluster.isPrimary) { // this is the primary process responsible for starting our server on all CPUS
    console.log(`Starting process on ${cpus} CPU cores`);

    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        console.log("Spawning another worker");
        cluster.fork()
    })
} else {
    const app = express();
    console.log(`Worker ${process.pid} started`);

    app.get("/", (req, res) => {
        res.send('Hello world')
    })

    app.get("/api/:n", function (req, res) {
        let n = parseInt(req.params.n);
        let count = 0;

        if (n > 5000000000) n = 5000000000;

        for (let i = 0; i <= n; i++) {
            count += i;
        }

        res.send(`Final count is ${count} ${process.pid}`);
    });

    app.listen(port, () => {
        console.log(`Application listening on port ${port}`);
    })
}