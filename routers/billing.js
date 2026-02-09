const express = require("express")
const router = new express.Router()
const path = require("path");
const fs = require("fs")
const hbs = require("hbs");
//const mongoose = require("mongoose");

const { getActiveAppConfig } = require("../services/appConfigService");
const { createInvoice } = require("../src/genInvoice");
const Invoice = require("../models/invoiceModel")
const Client = require("../models/clientModel")
const WorkDone = require("../models/workDoneModel")

const functions = require("../src/functions")

const pdfInvoice = require("../src/genInvoice.js")
const uuid = require("uuid-random")

function addDigit(number) {
  console.log("num: " + number)
  if (parseInt(number) < 10) {
    return "0" + parseInt(number)
  } else {
    return parseInt(number).toString() //Doit peut-être enlever le parseInt (ajouté à cause erreur!)
  }
}

router.post("/billing", async (req, res) => {
  const client = new Client(req.body)

  try {
    res.render("billing.hbs")
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})


router.post("/addclient", async (req, res) => {
  const client = new Client(req.body)

  try {
    await client.save()
    res.status(200).send(client)
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})

router.get("/genid", (req, res) => {
  const generatedID = uuid()

  try {
    res.status(200).send(generatedID)
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})


// Cette route génère et affiche la facture en PDF.
// Le document est diffusé directement pour un rendu immédiat
// tout en étant sauvegardé sur disque pour archivage.
router.get("/viewinvoice", async (req, res) => {
  try {
    const appConfig = await getActiveAppConfig()

    const invoiceID = req.query.id || req.query.ID
    if (!invoiceID) return res.status(400).send("Missing invoice id (use ?id=... or ?ID=...)")

    const invoice = await Invoice.findOne({ invoiceID }).lean()
    if (!invoice) return res.status(404).send("Invoice not found")

    const clientNumberRaw = req.query.CN ?? req.query.clientNumber ?? invoice.clientNumber
    const clientNumber = Number(clientNumberRaw)

    if (!Number.isFinite(clientNumber)) {
      return res.status(400).send("Missing or invalid client number (use ?CN=107 or invoice must contain clientNumber)")
    }

    const client = await Client.findOne({ clientNumber }).lean()
    if (!client) return res.status(404).send("Client not found")

    const workDone = await WorkDone.find({ clientNumber }).lean()

    const fileName = `F${invoice.invoiceNumber}.pdf`
    const invoicesDir = path.join(__dirname, "..", "invoices")
    const pdfPath = path.join(invoicesDir, fileName)

    fs.mkdirSync(invoicesDir, { recursive: true })

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `inline; filename="${fileName}"`)

    const fileStream = fs.createWriteStream(pdfPath)
    fileStream.on("error", (e) => console.error("PDF file write error:", e))

    // Le rendu PDF est streamé vers le navigateur ET écrit sur disque
    // pour éviter une double génération du document
    pdfInvoice.createInvoice(appConfig, client, invoice, workDone, fileName, {
      responseStream: res,
      fileStream,
    })
  } catch (err) {
    console.error(err)
    if (!res.headersSent) return res.status(500).send(err.message || "Server error")
    res.end()
  }
})


router.post("/geninvoice", (req, res) => {
  createInvoice()
  res.render("viewinvoice.hbs", {})
})


router.post("/clientslist", async (req, res) => {
  //console.log("Start: " + req.body.startDate)
  //console.log("End: " + req.body.endDate)

  //const theEvent = req.body
  //console.log("body: " + theEvent)
  //var dateFrom = theEvent.eventStartYear + "-" + addDigit(parseInt(theEvent.eventStartMonth) + 1) + "-" + addDigit(theEvent.eventStartDay) + "T00:00:00.000Z"
  //var dateTo = theEvent.eventEndYear + "-" + addDigit(parseInt(theEvent.eventEndMonth) + 1) + "-" + addDigit(theEvent.eventEndDay) + "T23:59:59.000Z"

  //try {
  //  await Client.find().exec((err, result) => {
  //    res.render("eventlist.hbs", {
  //      eventsList: result
  //    })
  //  })
  //} catch (e) {
  //  console.log(e)
  //  res.status(400).send(e)
  //}
})

hbs.registerHelper("clientSelector", jsonlist => {
  var theList = ""
  var zzz = jsonlist

  console.log(zzz)
  //theList = "Client: <select name='cnumber' id='cnumber' onchange='javascript:newbill.clientNum.value=document.getElementById(\"cnumber\").value'>"
  theList = "Client: <select name='cNumber' id='cNumber'>"
  theList += "<option value='000'>Choisir</option>"
  for (index = 0; index < zzz.length; ++index) {
    theList += "<option value='" + zzz[index].clientNumber + "'>" + zzz[index].clientNumber + "- " + zzz[index].billingName + "</option>"
  }
  theList += "</select>"

  return theList;
});

router.get("/newinvoice", async (req, res) => {
  const generatedID = uuid()
  const curDate = new Date()
  const curDay = addDigit(curDate.getDate())
  const curMonth = addDigit(curDate.getMonth() + 1)
  const curYear = curDate.getFullYear()


  try {
    await Client.find().exec((err, clientresult) => {
      Invoice.find().sort({ "invoiceNumber": -1 }).exec((err, invoiceresult) => {
        console.log(parseInt(invoiceresult[0].invoiceNumber) + 1)
        res.render("newinvoice.hbs", {
          clientsList: clientresult,
          newInvoiceNumber: parseInt(invoiceresult[0].invoiceNumber) + 1,
          curDay: curDay,
          curMonth: curMonth,
          curYear: curYear,
          invoiceID: generatedID
        })
      })
    })
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})

hbs.registerHelper("workToBillList", jsonlist => {
  var theList = ""
  var zzz = jsonlist

  //theList = "Client: <select name='cnumber' id='cnumber' onchange='javascript:newbill.clientNum.value=document.getElementById(\"cnumber\").value'>"
  theList = "<table border='0' cellpadding='0' cellspacing='0'>"
  for (index = 0; index < zzz.length; ++index) {
    theList += "<tr><td>" + zzz[index].itemDesc + "</td><td> </td><td align='right'>" + zzz[index].itemCost + "</td><td> </td><td align='right'>&nbsp;&nbsp;" + zzz[index].itemQuantity + "</td><td> </td><td align='right'>&nbsp;&nbsp;" + (zzz[index].itemCost *  zzz[index].itemQuantity) + "</td><td> &nbsp;&nbsp;&nbsp;&nbsp;" + zzz[index].itemDate + "</td><td><input type='checkbox' name='workitemsList[]' value='" + zzz[index].workID + "'></td></tr>"
  }
  theList += "</table>"

  return theList;
})

router.post("/newinvoice", async (req, res) => {
  const theInvoice = new Invoice(req.body)

  //const theInvoice = req.body

  //theInvoice.clientNumber = 1234

  try {
    await Client.findOne({ "clientNumber": theInvoice.clientNumber }).exec((err, clientInfos) => {
      WorkDone.find({ "isBilled": false, "clientNumber": theInvoice.clientNumber }).sort({ "itemDate": 1 }).exec((err, workItems) => {
        theInvoice.save(theInvoice)
        res.render("addinvoiceitems.hbs", {
          invoiceInfos: theInvoice,
          clientInfos: clientInfos,
          workToBill: workItems
        })
      })
    })

    //res.status(200).send(theInvoice)
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})

router.get("/newwork", async (req, res) => {
  const workItem = new WorkDone(req.body)

  try {
    await Client.find({}).exec((err, clientList) => {
      res.render("newwork.hbs", {
        clientList: clientList,
        workID: uuid()
      })
    })
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})

hbs.registerHelper("listTasks", jsonlist => {
  var theList = ""
  var zzz = jsonlist

  for (index = 0; index < zzz.length; ++index) {
    theList += zzz[index].taskDesc + "<br />"
  }

  return theList;
})

router.post("/addwork", async (req, res) => {
  const workItem = new WorkDone(req.body)
  var object = req.body
  const keys = Object.keys(req.body)
  const array = keys.map(key => ({ key: key, value: object[key] }))

  for (taskIndex = 1; taskIndex < array.length; ++taskIndex) {
    if (array[taskIndex].key.substr(0, 4) == "task") {
      workItem.tasks.push({ "taskDesc": array[taskIndex].value })
    }
  }

  try {
    await workItem.save()
    res.render("workadded.hbs", {
      workItem: workItem
    })
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})

router.post("/addinvoiceitem", async (req, res) => {
  /*   console.log("Desc:" + req.body.itemDesc)
    console.log("Date: " + req.body.itemDate)
    console.log("Cost: " + req.body.itemCost)
    console.log("Quant: " + req.body.itemQuant)
    console.log("Invoice: " + req.body.invoiceID)
    console.log("tasks: " + req.body.tasks)
   */

  console.log(req.body.test)

  const workItems = new WorkDone(req.body)

  var pushObj = {}
  var itemsArray = req.body.workitemsList
  if (req.body.invoiceID != "") {
    //itemsArray.forEach(element => {
    pushObj['invoiceItemsList'] = itemsArray
    //})

    //console.log(itemsArray)
    //console.log(pushObj)
  }

  try {
    await Invoice.findOneAndUpdate({ invoiceID: req.body.invoiceID }, { $push: pushObj }, { new: true }).exec((err, result) => {
      //console.log(result)
      res.status(200).send(req.body)
      //})
    })
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})

module.exports = router
