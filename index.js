
const five = require("johnny-five"),
  board = new five.Board(),
  express = require("express"),
  app = express(),
  hbars = require("handlebars"),
  fs = require("fs"),
  {
    promisify
  } = require('util'),
  path = require("path"),
  http = require("http"),
  readFileAsync = promisify(fs.readFile);

var ctrl = null;

board.on("ready", function () {
  console.log("ready")
  const servos = {
    waist: new five.Servo({
      pin: 7,
      startAt: 0,
      type: "continuous"
    }),
    shoulder: new five.Servo({
      pin: 8,
      startAt: 90,
      type: "continuous"
    }),
    elbow: new five.Servo({
      pin: 6,
      startAt: 180
    }),
    wrist: {
      roll: new five.Servo({
        pin: 10,
        startAt: 25
      }),
      grip: new five.Servo({
        pin: 11,
        startAt: 155
      })
    }
  };
  ctrl = servos;
});


app.get("/", function (req, res) {
  var files = 0;

  fs.readFile(
    path.resolve(__dirname, "public/index.html"),
    "utf-8",
    async function (error, source) {
      var data = {
        servo: await readFileAsync(path.resolve(__dirname, "views/servo.html"), {
            encoding: 'utf8'
          })
          .then((text) => {
            return text;
          }),
        scripts: await readFileAsync(path.resolve(__dirname, "views/scripts.html"), {
            encoding: 'utf8'
          })
          .then((text) => {
            return text;
          }),
        head: await readFileAsync(path.resolve(__dirname, "views/head.html"), {
            encoding: 'utf8'
          })
          .then((text) => {
            return text;
          })
      };

      var template = hbars.compile(source);
      var html = template(data);
      res.send(html);
    }
  );
});

app.use(express.static(path.resolve(__dirname, "public")))

var server = http.createServer(app);

var io = require('socket.io').listen(server);
const PORT = process.env.PORT || 8080;


io.on('connection', function (socket) {
  socket.on("update", function (data) {
    switch (data.ctrl.replace("-ctrl", "")) {
      case "gripper":
        console.log(data.val[0]);
        ctrl.wrist.grip.to(parseFloat(data.val[0]));
        break;
      case "roll":
        console.log(data.val[0]);
        ctrl.wrist.roll.to(parseFloat(data.val[0]));
        break;
      case "elbow":
        console.log(data.val[0]);
        ctrl.elbow.to(parseFloat(data.val[0]), 5000);
        break;
      case "shoulder":
        console.log(data.val[0]);
        ctrl.shoulder.to(parseFloat(data.val[0]), 2000);
        break;

      case "waist":
        console.log(data.val[0]);
        ctrl.waist.to(parseFloat(data.val[0]), 2000);
        break;
      default:
        console.log(data.ctrl.replace("-ctrl", ""));
        break;

    }
  })
});

server.listen(PORT);
