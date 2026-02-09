const express = require("express")
const hbs = require("hbs");
//const bodyParser = require('body-parser')

require("./db/mongoose")

const app = express()
//const port = 8081

app.use('/images', express.static(__dirname + '/images'));
app.use('/src', express.static(__dirname + '/src'));
//app.use('/invoices', express.static(__dirname + '/invoices'));

hbs.registerPartials(__dirname + "/views/partials");

//app.use(bodyParser.json())
const mainRouter = require("./routers/main")
const billingRouter = require("./routers/billing.js")
const fiscRouter = require("./routers/fisc.js")

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(mainRouter)
app.use(billingRouter)
app.use(fiscRouter)

let port = process.env.PORT
let ipbind = process.env.IPBIND
if (port == null || port == "") {
  port = 8000;
  app.listen(port, () => {
    console.log("Server is up on port " + port)
  })
} else {
  app.listen(port, ipbind, () => {
    console.log("Server is up on port " + port + " and host " + ipbind)
  })
}
