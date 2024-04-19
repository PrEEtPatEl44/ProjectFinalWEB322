require("dotenv").config();
const Sequelize = require("sequelize");
const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let themeSchema = new mongoose.Schema({
  _id: Number,
  name: String,
});

const Theme = mongoose.model("Theme", themeSchema, "Themes");

let setSchema = new mongoose.Schema({
  set_num: { type: String, unique: true },
  name: String,
  year: Number,
  num_parts: Number,
  theme: { type: Number, ref: "Theme" },
  img_url: String,
});

const Set = mongoose.model("Set", setSchema, "Sets");

function initialize() {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.DB_CONNECTION_STRING)
      .then(() => {
            // console.log(data);
            resolve("Connection Successfull");

      })
      .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
        reject("Connection unsuccessfull");
      });
  });
}

function getAllSets() {
  return new Promise((resolve, reject) => {
    Set.find()
      .populate("theme")
      .then((data) => {
        resolve(data);
      });
  });
}

function getSetByNum(setNum) {
  return new Promise((resolve, reject) => {
    Set.findOne({ set_num: setNum })
      .populate("theme")
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err.errors[0].message);
      });;
  });
}

function getSetsByTheme(theme) {
  return new Promise((resolve, reject) => {
    Set.find()
      .populate("theme")
      .then((data) => {
        let finalData = data.filter((set) => set.theme.name === theme);
        // console.log(finalData);
        resolve(finalData);
      })
      .catch((err) => {
        reject(err.errors[0].message);
      });
  });
}

function getAllThemes() {
  return new Promise((resolve, reject) => {
    Theme.find()
    .then((data) => {
      resolve(data);
    })
    .catch((err) => {
      reject(err.errors[0].message);
    });
  });
}

function addSet(setData) {
  return new Promise((resolve, reject) => {
    let newSet = new Set({
      name: setData.name,
      year: setData.year,
      num_parts: setData.num_parts,
      img_url: setData.img_url,
      theme: setData.theme,
      set_num: setData.set_num,
    });
    newSet
      .save()
      .then((newSet) => {
        resolve();
        // console.log(newSet);
      })
      .catch((err) => {
        reject(err.errors[0].message);
      });
  });
}

function editSet(set_num, setData) {
  return new Promise((resolve, reject) => {
    // console.log(setData);
    // console.log(set_num);
     Set.updateOne(
      {
        set_num: set_num,
      },
      {
        $set: {
          name: setData.name,
          year: setData.year,
          num_parts: setData.num_parts,
          img_url: setData.img_url,
          theme: setData.theme,
        },
      }
     )
      .then((data) => {
        // updatedSet.save();
        // console.log(data);
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function deleteSet(set_num) {
  return new Promise((resolve, reject) => {
    Set.deleteOne({
      set_num: set_num,
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = {
  initialize,
  getAllSets,
  getSetByNum,
  getSetsByTheme,
  getAllThemes,
  addSet,
  editSet,
  deleteSet,
};
