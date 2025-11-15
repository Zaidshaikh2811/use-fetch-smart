const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

const ACCESS_SECRET = "my-access-secret-key";
const REFRESH_SECRET = "my-refresh-secret-key";

let refreshTokens = []; // store refresh tokens in memory

let users = [
    { id: 1, name: "Zaid", email: "zaid@gmail.com" },
    { id: 2, name: "Sara", email: "sara@gmail.com" }
];

function generateAccessToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email },
        ACCESS_SECRET,
        { expiresIn: "1m" }
    );
}

function generateRefreshToken(user) {
    const token = jwt.sign(
        { id: user.id, email: user.email },
        REFRESH_SECRET,
        { expiresIn: "7d" }
    );
    refreshTokens.push(token);
    return token;
}

// ---------------------------
//         LOGIN
// ---------------------------

app.get("/users", (req, res) => {
    console.log("User Get API");

    res.json(users);
});


app.post("/login", (req, res) => {
    const { email } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ message: "Invalid email" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
        message: "Login successful",
        accessToken,
        refreshToken
    });
});


app.post("/auth/refresh", (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken)
        return res.status(401).json({ message: "Refresh token required" });

    if (!refreshTokens.includes(refreshToken))
        return res.status(403).json({ message: "Invalid refresh token" });

    jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Token expired" });
        console.log("Success");

        const newAccessToken = generateAccessToken(user);

        res.json({ accessToken: newAccessToken });
    });
});

// ---------------------------
//     AUTH MIDDLEWARE
// ---------------------------
function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];


    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];



    jwt.verify(token, ACCESS_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token" });

        req.user = decoded;
        console.log("User:", req.user);

        next();
    });
}

// ---------------------------
//         PROTECTED
// ---------------------------
app.get("/protected", authMiddleware, (req, res) => {
    res.json({
        message: "Protected route accessed",
        user: req.user
    });
});



app.post("/users", (req, res) => {
    const { name, email } = req.body;
    const newUser = { id: Date.now(), name, email };
    users.push(newUser);
    res.status(201).json(newUser);
});

app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const userIndex = users.findIndex(u => u.id === parseInt(id));
    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    }
    users[userIndex] = { ...users[userIndex], name, email };
    res.json(users[userIndex]);
});

app.delete("/users/:id", (req, res) => {
    const { id } = req.params;
    const userIndex = users.findIndex(u => u.id === parseInt(id));
    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    }
    users.splice(userIndex, 1);
    res.status(204).end();
});

app.get("/statuserror", (req, res) => {
    res.status(403).json({ message: "Internal Server Error" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
