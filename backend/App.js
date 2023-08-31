const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// app.use(cors());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use("/image", express.static("uploads"));

let userData = new Map();
let imageLibrary = [];
let deletedImages = new Map();
let likedImages = new Map();
let imageTitles = new Map();
let imageSources = new Map();
let imageLocations = new Map();

const path = require("path");
const fs = require("fs");
const directoryPath = path.join("./", "uploads");
fs.readdir(directoryPath, function (err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  files.forEach(function (file) {
    imageLibrary.push(file);
    likedImages[file] = new Set();
  });
});

const authorization = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(token, "SDF#@#DDFS#%%%!22312312");

    if (
      userData.has(data.username) &&
      userData.get(data.username) === data.password
    ) {
      req.body.username = data.username;
      req.body.password = data.password;
      return next();
    }
    return res.sendStatus(403);
  } catch {
    return res.sendStatus(403);
  }
};

app.get("/", (req, res) => {
  return res.json({ message: "Hello World 🇵🇹 🤘" });
});

app.post("/register", (req, res) => {
  if (userData.has(req.body.username))
    return res.status(400).json({ message: "User already exists" });
  userData.set(req.body.username, req.body.password);
  deletedImages[req.body.username] = new Set();
  return res.status(200).json({ message: "Registerd Succesfully" });
});

app.post("/login", (req, res) => {
  const token = jwt.sign(
    { username: req.body.username, password: req.body.password },
    "SDF#@#DDFS#%%%!22312312"
  );
  return res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      useCredentials: true,
    })
    .status(200)
    .json({ message: "Logged in successfully 😊 👌" });
});

app.post("/protected", authorization, (req, res) => {
  return res.json({ user: { id: req.body.username, role: req.body.password } });
});

app.post("/dashboard", authorization, (req, res) => {
  return res.json({ user: { id: req.body.username, role: req.body.password } });
});

app.get("/library", authorization, (req, res) => {
  let resImages = [];
  for (let i = 0; i < imageLibrary.length; i++) {
    if (deletedImages[req.body.username].has(imageLibrary[i]) === false) {
      resImages.push({
        url: imageLibrary[i],
        liked: likedImages[imageLibrary[i]].has(req.body.username),
        title:
          imageTitles.has(imageLibrary[i]) &&
          imageTitles.get(imageLibrary[i]).has(req.body.username)
            ? imageTitles.get(imageLibrary[i]).get(req.body.username)
            : "Title",
        source:
          imageSources.has(imageLibrary[i]) &&
          imageSources.get(imageLibrary[i]).has(req.body.username)
            ? imageSources.get(imageLibrary[i]).get(req.body.username)
            : "Unknown",
        location:
          imageLocations.has(imageLibrary[i]) &&
          imageLocations.get(imageLibrary[i]).has(req.body.username)
            ? imageLocations.get(imageLibrary[i]).get(req.body.username)
            : "Unknown",
        likes: likedImages[imageLibrary[i]].size,
      });
    }
  }
  return res.json({ images: resImages });
});

app.get("/favourites", authorization, (req, res) => {
  let resImages = [];
  for (let i = 0; i < imageLibrary.length; i++) {
    if (
      deletedImages[req.body.username].has(imageLibrary[i]) === false &&
      likedImages[imageLibrary[i]].has(req.body.username)
    )
      resImages.push({
        url: imageLibrary[i],
        liked: likedImages[imageLibrary[i]].has(req.body.username),
        title:
          imageTitles.has(imageLibrary[i]) &&
          imageTitles.get(imageLibrary[i]).has(req.body.username)
            ? imageTitles.get(imageLibrary[i]).get(req.body.username)
            : "Title",
        source:
          imageSources.has(imageLibrary[i]) &&
          imageSources.get(imageLibrary[i]).has(req.body.username)
            ? imageSources.get(imageLibrary[i]).get(req.body.username)
            : "Unknown",
        location:
          imageLocations.has(imageLibrary[i]) &&
          imageLocations.get(imageLibrary[i]).has(req.body.username)
            ? imageLocations.get(imageLibrary[i]).get(req.body.username)
            : "Unknown",
      });
  }
  return res.json({ images: resImages });
});

app.post("/delete", authorization, (req, res) => {
  if (!req.body.username || !req.body.image) return res.sendStatus(400);
  deletedImages[req.body.username].add(req.body.image);
  return res.sendStatus(200);
});

app.post("/like", authorization, (req, res) => {
  if (!req.body.username || !req.body.image) return res.sendStatus(401);
  likedImages[req.body.image].add(req.body.username);
  return res.sendStatus(200);
});

app.post("/unlike", authorization, (req, res) => {
  if (!req.body.username || !req.body.image) return res.sendStatus(400);
  likedImages[req.body.image].delete(req.body.username);
  return res.sendStatus(200);
});

app.post("/changeTitle", authorization, (req, res) => {
  if (!req.body.username || !req.body.image || !req.body.title)
    return res.sendStatus(400);
  if (!imageTitles.has(req.body.image))
    imageTitles.set(req.body.image, new Map());
  imageTitles.get(req.body.image).set(req.body.username, req.body.title);
  return res.sendStatus(200);
});

app.post("/changeSource", authorization, (req, res) => {
  if (!req.body.username || !req.body.image || !req.body.source)
    return res.sendStatus(400);
  if (!imageSources.has(req.body.image))
    imageSources.set(req.body.image, new Map());
  imageSources.get(req.body.image).set(req.body.username, req.body.source);
  return res.sendStatus(200);
});

app.post("/changeLocation", authorization, (req, res) => {
  if (!req.body.username || !req.body.image || !req.body.location)
    return res.sendStatus(400);
  if (!imageLocations.has(req.body.image))
    imageLocations.set(req.body.image, new Map());
  imageLocations.get(req.body.image).set(req.body.username, req.body.location);
  return res.sendStatus(200);
});

app.get("/logout", authorization, (req, res) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Successfully logged out 😏 🍀" });
});

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    let name = Date.now() + "-" + file.originalname;
    cb(null, name);
    imageLibrary.push(name);
    likedImages[name] = new Set();
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");
  return res.status(200).send("Image uploaded and saved successfully.");
});
const start = (port) => {
  try {
    app.listen(port, () => {
      console.log(`Api up and running at: http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit();
  }
};
start(3333);
