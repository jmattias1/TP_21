const db = require("../database/models");
const sequelize = db.sequelize;
const moment = require("moment");

//Otra forma de llamar a los modelos
const Movies = db.Movie;
const Genre = db.Genre;

const moviesController = {
  list: (req, res) => {
    db.Movie.findAll().then((movies) => {
      res.render("moviesList.ejs", { movies });
    });
  },
  detail: (req, res) => {
    db.Movie.findByPk(req.params.id).then((movie) => {
      res.render("moviesDetail.ejs", { movie });
    });
  },
  new: (req, res) => {
    db.Movie.findAll({
      order: [["release_date", "DESC"]],
      limit: 5,
    }).then((movies) => {
      res.render("newestMovies", { movies });
    });
  },
  recomended: (req, res) => {
    db.Movie.findAll({
      where: {
        rating: { [db.Sequelize.Op.gte]: 8 },
      },
      order: [["rating", "DESC"]],
    }).then((movies) => {
      res.render("recommendedMovies.ejs", { movies });
    });
  }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
  add: function (req, res) {
    Genre.findAll({
      order: ["name"],
    })
      .then((allGenres) => {
        return res.render("moviesAdd", { allGenres });
      })
      .catch((error) => console.log(error));
    // TODO
  },
  create: function (req, res) {
    const { title, rating, awards, length, release_date, genre_id } = req.body;
    Movies.create({
      title: title.trim(),
      rating,
      awards,
      length,
      release_date,
      genre_id,
    })
      .then((movie) => {
        console.log(movie);
        return res.redirect("/movies");
      })
      .catch((error) => console.log(error));
    // TODO
  },
  edit: function (req, res) {
    let Movie = Movies.findByPk(req.params.id);
    let allGenres = Genre.findAll({
      order: ["name"],
    });
    Promise.all([Movie, allGenres])
      .then(([Movie, allGenres]) => {
        return res.render("moviesEdit", {
          Movie,
          allGenres,
          moment: moment,
        });
      })
      .catch((error) => console.log(error));
    // TODO
  },
  update: function (req, res) {
    const { title, rating, awards, length, release_date, genre_id } = req.body;
    Movies.update(
      {
        title: title.trim(),
        rating,
        awards,
        length,
        release_date,
        genre_id,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )
      .then(() => res.redirect("/movies/detail/" + req.params.id))
      .catch((error) => console.log(error));
    // TODO
  },
  delete: function (req, res) {
    const Movie = req.query;
    return res.render("moviesDelete", { Movie });
    // TODO
  },
  destroy: function (req, res) {
    const { id } = req.params;
    Movies.destroy({
      where: {
        id,
      },
    })
      .then(() => {
        return res.redirect("/movies");
      })
      .catch((error) => console.log(error));
    // TODO
  },
};

module.exports = moviesController;
