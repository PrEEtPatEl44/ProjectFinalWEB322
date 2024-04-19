/********************************************************************************

* WEB322 – Assignment 06

* 

* I declare that this assignment is my own work in accordance with Seneca's

* Academic Integrity Policy:

* 

* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html

* 

* Name: Preet Bhagyesh Patel Student ID: 132603226 Date: 19th April 2024

*

* Published URL: https://as5-web322.onrender.com

*

********************************************************************************/

const legoData = require("./modules/legoSets");
const express = require("express");
const path = require("path");
const app = express();
const HTTP_PORT = process.env.PORT || 3000;
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/lego/sets", (req, res) => {
  if (req.query.theme) {
    // console.log(req.query.theme);
    legoData
      .getSetsByTheme(req.query.theme)
      .then((data) => {
        if (data.length > 0) {
          res.render("sets", { sets: data });
        }
      })
      .catch((err) => {
        res.status(404).render("404", {
          message: "we're unable to render all the sets by theme",
        });
      });
  } else {
    legoData
      .getAllSets()
      .then((data) => {
        res.render("sets", { sets: data });
      })
      .catch((err) => {
        console.log(err);
        res
          .status(404)
          .render("404", { message: "we're unable to render all the " });
      });
  }
});

app.get("/lego/sets/:num", (req, res) => {
  legoData
    .getSetByNum(req.params.num)
    .then((data) => {
      res.render("set", { set: data });
    })
    .catch((err) => {
      res.status(404).render("404", {
        message: "we're unable to render all the sets by set number",
      });
    });
});

app.get("/lego/addSet", (req, res) => {
  legoData
    .getAllThemes()
    .then((data) => {
      res.render("addSet", { themes: data });
    })
    .catch((err) => {
      console.error("Error fetching themes:", err);
      res.status(500).send("Internal Server Error");
    });
});

app.post("/lego/addSet", async (req, res) => {
  try {
    await legoData.addSet(req.body);
    res.redirect("/lego/sets");
  } catch (err) {
    res.render("500", {
      message: `I'm sorry, but we have encountered the following error: ${err}`,
    });
  }
});

app.get("/lego/editSet/:num", (req, res) => {
  let setNum = req.params.num;
  legoData
    .getSetByNum(setNum)
    .then((setData) => {
      legoData
        .getAllThemes()
        .then((themeData) => {
          res.render("editSet", { themes: themeData, set: setData });
        })
        .catch((themeErr) => {
          res.status(404).render("404", { message: themeErr });
        });
    })
    .catch((setErr) => {
      res.status(404).render("404", { message: setErr });
    });
});

app.post("/lego/editSet", async (req, res) => {
  try {
    await legoData.editSet(req.body.set_num, req.body);
    res.redirect("/lego/sets");
  } catch (err) {
    res.render("500", {
      message: `I'm sorry, but we have encountered the following error: ${err}`,
    });
  }
});

app.get("/lego/deleteSet/:num", async (req, res) => {
  try {
    await legoData.deleteSet(req.params.num);
    res.redirect("/lego/sets");
  } catch (err) {
    res.render("500", {
      message: `I'm sorry, but we have encountered the following error: ${err}`,
    });
  }
});

app.listen(HTTP_PORT, () => {
  console.log(`server listening http://localhost:${HTTP_PORT}`);
  legoData
    .initialize()
    .then((msg) => {
      console.log(msg);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use((req, res) => {
  res
    .status(404)
    .render("404", { message: "The route you are looking for does not exist" });
});
