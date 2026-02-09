const express = require("express")
const router = new express.Router()
const hbs = require("hbs");

const functions = require("../src/functions")

router.get("/calendar", (req, res) => {
  res.render("cal.hbs", {})
})

router.get("/addevent", (req, res) => {
  res.render("addevent.hbs", {})
})


router.post("/newevent", async (req, res) => {
  const event = new Event(req.body)
  const theEvent = req.body

  event.title = theEvent.eventTitle
  event.beginDate = theEvent.eventStartYear + "-" + addDigit(parseInt(theEvent.eventStartMonth) + 1) + "-" + addDigit(theEvent.eventStartDay) + "T" + addDigit(theEvent.eventStartHour) + ":" + addDigit(theEvent.eventStartMinute) + ":00.000Z"
  event.endDate = theEvent.eventEndYear + "-" + addDigit(parseInt(theEvent.eventEndMonth) + 1) + "-" + addDigit(theEvent.eventEndDay) + "T" + addDigit(theEvent.eventEndHour) + ":" + addDigit(theEvent.eventEndMinute) + ":00.000Z"
  event.description = theEvent.eventDesc

  try {
    await event.save()
    res.status(200).send(event)
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})

function addDigit(number) {
  console.log("num: " + number)
  if (parseInt(number) < 10) {
    return "0" + parseInt(number)
  } else {
    return parseInt(number).toString() //Doit peut-être enlever le parseInt (ajouté à cause erreur!)
  }
}

router.post("/newevent", async (req, res) => {
  const event = new Event(req.body)
  const theEvent = req.body

  event.title = theEvent.eventTitle
  event.beginDate = theEvent.eventStartYear + "-" + addDigit(parseInt(theEvent.eventStartMonth) + 1) + "-" + addDigit(theEvent.eventStartDay) + "T" + addDigit(theEvent.eventStartHour) + ":" + addDigit(theEvent.eventStartMinute) + ":00.000Z"
  event.endDate = theEvent.eventEndYear + "-" + addDigit(parseInt(theEvent.eventEndMonth) + 1) + "-" + addDigit(theEvent.eventEndDay) + "T" + addDigit(theEvent.eventEndHour) + ":" + addDigit(theEvent.eventEndMinute) + ":00.000Z"
  event.description = theEvent.eventDesc

  try {
    await event.save()
    res.status(200).send(event)
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})

router.post("/getevent", async (req, res) => {
  console.log(req.body.eventDate)
  var theDate = req.body.eventDate
  var year = theDate.substr(0, 4)
  var month = theDate.substr(4, 2)
  var day = theDate.substr(6, 2) //2019-05-16T00:00:00.000Z

  var dateFrom = year + "-" + month + "-" + day + "T00:00:00.000Z"
  var dateTo = year + "-" + month + "-" + day + "T23:59:59.000Z"

  try {
    await Event.find({ beginDate: { '$gte': dateFrom }, endDate: { '$lte': dateTo } }).exec((err, result) => {
      console.log(result)
      res.status(200).send(result)
    })
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})

router.get("/listevents", (req, res) => {
  res.render("listevents.hbs", {})
})

hbs.registerHelper("eventSelector", jsonlist => {
  var theList = ""
  var zzz = jsonlist
  for (index = 0; index < zzz.length; ++index) {
    theList += "<tr><td>" + zzz[index].title + "</td><td>&nbsp;</td>"
    theList += "<td><input type=button name='d[" + index + "]' value='d' onclick='javascript:delEvent(`" + zzz[index]._id + "`)'></td><td>&nbsp;</td>"
    theList += "<td><input type=button name='e[" + index + "]' value='e' onclick='javascript:editEvent(`" + zzz[index]._id + "`)'></td></tr>"
  }

  return theList;
});

router.post("/eventlist", async (req, res) => {
  console.log("Start: " + req.body.startDate)
  console.log("End: " + req.body.endDate)

  const theEvent = req.body
  console.log("body: " + theEvent)
  var dateFrom = theEvent.eventStartYear + "-" + addDigit(parseInt(theEvent.eventStartMonth) + 1) + "-" + addDigit(theEvent.eventStartDay) + "T00:00:00.000Z"
  var dateTo = theEvent.eventEndYear + "-" + addDigit(parseInt(theEvent.eventEndMonth) + 1) + "-" + addDigit(theEvent.eventEndDay) + "T23:59:59.000Z"

  try {
    await Event.find({ beginDate: { '$gte': dateFrom }, endDate: { '$lte': dateTo } }).exec((err, result) => {
      res.render("eventlist.hbs", {
        eventsList: result
      })
    })
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})

router.post("/eventdates", async (req, res) => {
  console.log("Start: " + req.body.startDate)
  console.log("End: " + req.body.endDate)
  var theDate1 = req.body.startDate
  var year1 = theDate1.substr(0, 4)
  var month1 = theDate1.substr(4, 2)
  var day1 = theDate1.substr(6, 2)
  var theDate2 = req.body.endDate
  var year2 = theDate2.substr(0, 4)
  var month2 = theDate2.substr(4, 2)
  var day2 = theDate2.substr(6, 2)

  var dateFrom = year1 + "-" + month1 + "-" + day1 + "T00:00:00.000Z"
  var dateTo = year2 + "-" + month2 + "-" + day2 + "T23:59:59.000Z"

  try {
    await Event.find({ beginDate: { '$gte': dateFrom }, endDate: { '$lte': dateTo } }).exec((err, result) => {
      res.status(200).send(result)
    })
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})

router.get("/", (req, res) => {
  res.render("home.hbs", {})
})

router.get("/robots", (req, res) => {
  res.render("robotstudio.hbs", {})
})

router.get("/solidw", (req, res) => {
  res.render("solidworks.hbs", {})
})

router.get("/cad", (req, res) => {
  res.render("autocad.hbs", {})
})

router.get("/robog", (req, res) => {
  res.render("roboguide.hbs", {})
})

router.get("/hmi", (req, res) => {
  res.render("hmi.hbs", {})
})

router.get("/about", (req, res) => {
  res.render("about.hbs", {})
})

router.get("/contact", (req, res) => {
  res.render("contact.hbs", {})
})

router.get("/accounting", (req, res) => {
  res.render("accounting.hbs", {
    siteaddr: process.env.HTTPADDRESS
  })
})

router.get("/testwidget", (req, res) => {
  res.render("testwidget.hbs", {})
})

module.exports = router
