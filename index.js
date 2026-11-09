// Express.js Intro - write your server here.
// Run it with: node index.js   (stop it with Ctrl + C)

// Part 1: create an express app, a GET /greet endpoint and app.listen(3000)
const express = require("express")
const app = express()

app.get("/greet", (req, res) => {
    res.json({
        msg: `hi from get endpoint ${new Date().toISOString()}`
    })
})

// Part 2: GET /greet/:name  and  GET /test (calls /greet/:name with fetch)
app.get("/greet/:name", (req, res) => {
    const name = req.params.name;

    console.log(`i got name: ${name}`);

    res.json({
        msg: `got name: ${name}`
    });
});

app.get("/test", (req, res) => {
    fetch("http://localhost:3000/greet/Alice")
        .then(response => response.json())
        .then(data => {
            res.json({ result: "ok" });
        })
        .catch(err => {
            res.status(500).json({ error: "Request failed" });
        });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

// Part 3: POST /action  ("joke" / "cat fact", otherwise 400 "body is malformed")
app.use(express.json());

app.post("/action", async (req, res) => {

    if (!req.body || typeof req.body.action !== "string") {
        return res.status(400).json({
            msg: "body is malformed"
        });
    }

    const { action } = req.body;

    if (action === "joke") {

        const response = await fetch(
            "https://v2.jokeapi.dev/joke/Any?type=single"
        );

        const data = await response.json();

        return res.json({
            joke: data.joke.toUpperCase()
        });
    }

    else if (action === "cat fact") {

        const response = await fetch(
            "https://api.thecatapi.com/v1/images/search?limit=11",
            {
                headers: {
                    "x-api-key": "YOUR_API_KEY"
                }
            }
        );

        const data = await response.json();
        return res.json(data);
    }

    else {
        return res.status(400).json({
            msg: "body is malformed"
        });
    }
});
