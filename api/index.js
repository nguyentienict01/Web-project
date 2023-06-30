const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User.js");
const Place = require("./models/Place.js");
const Booking = require("./models/Booking.js");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const fs = require("fs-extra");
const pathModule = require("path");
const mime = require("mime-types");

require("dotenv").config();
const app = express();

mongoose.set("strictQuery", true);

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "fasefraw4r5r3wq45wdfgw34twdfg";
const bucket = "dawid-booking-app";

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

async function moveToUploads(path, originalFilename) {
  let newFileName = originalFilename;
  const ext = pathModule.extname(originalFilename);
  const baseName = pathModule.basename(originalFilename, ext);
  const uploadPath = pathModule.join(__dirname, "uploads", newFileName);
  if (await fs.pathExists(uploadPath)) {
    newFileName = `${baseName}-${Date.now()}${ext}`;
  }
  const newPath = pathModule.join(__dirname, "uploads", newFileName);
  await fs.move(path, newPath);
  return `${newFileName}`;
}

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

app.get("/test", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json("test ok");
});

app.post("/register", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
      favorites: [],
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post("/login", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        {
          email: userDoc.email,
          id: userDoc._id,
        },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("pass not ok");
    }
  } else {
    res.status(404).json("not found");
  }
});

app.get("/profile", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

console.log("dirname : " + __dirname);
app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });
  // const url = await uploadToS3('/tmp/' +newName, newName, mime.lookup('/tmp/' +newName));
  res.json(newName);
});

const photosMiddleware = multer({ dest: "/tmp" });
app.post("/upload", photosMiddleware.array("photos", 100), async (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname, mimetype } = req.files[i];
    const url = await moveToUploads(path, originalname);
    uploadedFiles.push(url);
  }
  res.json(uploadedFiles);
});

app.post("/places", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    price,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      price,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
    });
    res.json(placeDoc);
  });
});

app.get("/user-places", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

app.get("/user-favorites", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData;
    const user = await User.findById(id);
    if (user && user.favorites) {
      const favoritePlaces = await Place.find({ _id: { $in: user.favorites } });
      res.json(favoritePlaces);
    } else {
      res.json([]);
    }
  });
});

app.post("/user/favorites/:id", async (req, res) => {
  try {
    mongoose.connect(process.env.MONGO_URL);
    const { token } = req.cookies;
    const { id } = req.params;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        res.status(401).json({ error: "Unauthorized" });
      } else {
        const userId = userData.id;
        const user = await User.findById(userId);
        const place = await Place.findById(id);
        if (!user || !place) {
          res.status(404).json({ error: "User or place not found" });
        } else {
          if (user.favorites.includes(id)) {
            res.status(409).json({ error: "Place already in favorites" });
          } else {
            user.favorites.push(id);
            await user.save();
            res.json({ message: "Place added to favorites successfully" });
          }
        }
      }
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
});

app.delete("/user/favorites/remove/:id", (req, res) => {
  const { token } = req.cookies;
  const { id } = req.params;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      res.status(401).send("Unauthorized");
      return;
    }
    mongoose.connect(process.env.MONGO_URL);
    const userId = userData.id;
    try {
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).send("User not found");
        return;
      }
      const index = user.favorites.indexOf(id);
      if (index !== -1) {
        user.favorites.splice(index, 1);
      }
      await user.save();
      res.json({ success: true, message: "Place removed from favorites" });
    } catch (error) {
      res.status(500).send("Server error");
    }
  });
});

app.get("/places/id/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  res.json(await Place.findById(id));
});

app.put("/places", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await placeDoc.save();
      res.json("ok");
    }
  });
});

app.get("/places", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json(await Place.find());
});

app.get("/places/villa", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const placesWithVilla = await Place.find({
    perks: { $in: ["villa"] },
  });
  res.json(placesWithVilla);
});

app.get("/places/resort", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const placesWithResort = await Place.find({
    perks: { $in: ["resort"] },
  });
  res.json(placesWithResort);
});

app.get("/places/beach", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const placesWithBeach = await Place.find({
    perks: { $in: ["beach"] },
  });
  res.json(placesWithBeach);
});

app.get("/places/search", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { title } = req.query;
  console.log(title);
  const places = await Place.find({ title: new RegExp(title, "i") });
  res.json(places);
});

app.delete("/places/delete/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  const userData = await getUserDataFromReq(req);
  const place = await Place.findById(id);
  if (!place) {
    res.status(404).json({ error: "Place not found" });
    return;
  }
  if (String(place.owner) !== String(userData.id)) {
    res.status(403).json({ error: "User not authorized to delete this place" });
    return;
  }
  Place.findByIdAndRemove(id, (err) => {
    if (err) {
      res
        .status(500)
        .json({ error: "An error occurred while trying to delete place" });
    } else {
      res.json({ message: "Place deleted successfully" });
    }
  });
});

app.post("/bookings", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  const { place, checkIn, checkOut, numberOfGuests, name, phone, price } =
    req.body;
  const existingBookings = await Booking.find({
    place: place,
    checkIn: { $lt: new Date(checkOut) },
    checkOut: { $gt: new Date(checkIn) },
  });
  if (existingBookings.length > 0) {
    res.status(400).json({ message: "No available room" });
    return;
  }
  Booking.create({
    place,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    phone,
    price,
    user: userData.id,
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      throw err;
    });
});

app.delete("/bookings/delete/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  const userData = await getUserDataFromReq(req);
  const booking = await Booking.findById(id);
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  if (String(booking.user) !== String(userData.id)) {
    res
      .status(403)
      .json({ error: "User not authorized to delete this booking" });
    return;
  }
  Booking.findByIdAndRemove(id, (err) => {
    if (err) {
      res
        .status(500)
        .json({ error: "An error occurred while trying to delete booking" });
    } else {
      res.json({ message: "Booking deleted successfully" });
    }
  });
});

app.get("/bookings", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate("place"));
});

app.listen(4000);
