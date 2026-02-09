const express = require("express")
const router = new express.Router()
const hbs = require("hbs");
require('dotenv').config();

const Invoice = require("../models/invoiceModel")
const Client = require("../models/clientModel")
const Expense = require("../models/expenseModel")
const WorkDone = require("../models/workDoneModel")

const functions = require("../src/functions")

const uuid = require("uuid-random")

function addDigit(number) {
  console.log("num: " + number)
  if (parseInt(number) < 10) {
    return "0" + parseInt(number)
  } else {
    return parseInt(number).toString() //Doit peut-être enlever le parseInt (ajouté à cause erreur!)
  }
}

// hbs.registerHelper("clientSelector", jsonlist => {
//   var theList = ""
//   var zzz = jsonlist

//   console.log(zzz)
//   //theList = "Client: <select name='cnumber' id='cnumber' onchange='javascript:newbill.clientNum.value=document.getElementById(\"cnumber\").value'>"
//   theList = "Client: <select name='cNumber' id='cNumber'>"
//   theList += "<option value='000'>Choisir</option>"
//   for (index = 0; index < zzz.length; ++index) {
//     theList += "<option value='" + zzz[index].clientNumber + "'>" + zzz[index].clientNumber + "- " + zzz[index].billingName + "</option>"
//   }
//   theList += "</select>"

//   return theList;
// });

router.get("/newexpense", async (req, res) => {
  const generatedID = uuid()

  try {
    res.render("newexpense.hbs", {
      expenseID: generatedID
    })
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})

router.get("/expensereport/:year", async (req, res) => {
  const generatedID = uuid()

  try {
    var expenses = await Expense.aggregate([
      { $match: { $and: [{ expenseDate: { $gte: req.params.year + "/01/01" } }, { expenseDate: { $lte: req.params.year + "/12/31" } }] } },
      { "$sort": ({ "expenseCategory": -1}, {"expenseDate": 1 })}
    ])

    //var expenses = await Expense.find({ expenseDate: { $gte: req.params.year + "/01/01" } }, { expenseDate: { $lte: req.params.year + "/12/31" } })

    console.log(expenses)

    res.render("expensereport.hbs", {
      expenses: expenses
    })
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})

hbs.registerHelper("expreport", reportdatas => {

  var textDatas = "<table>"
  textDatas += "<tr><td>Catégorie</td><td style='padding-left: 10px;'>Description</td><td style='padding-left: 10px;'>Date</td><td style='padding-left: 10px;'>Montant</td><td style='padding-left: 10px;'>TPS</td><td style='padding-left: 10px;'>TVQ</td></tr>"

  for (x = 0; x < reportdatas.length; x++) {
    textDatas += "<tr><td>" + reportdatas[x].expenseCategory + "</td><td style='padding-left: 10px;'>" + reportdatas[x].expenseDesc + "</td><td style='padding-left: 10px;'>" + reportdatas[x].expenseDate + "</td><td style='padding-left: 10px;'>" + reportdatas[x].expenseAmount + "</td><td style='padding-left: 10px;'>" + reportdatas[x].expenseGST + "</td><td style='padding-left: 10px;'>" + reportdatas[x].expensePST + "</td></tr>"
  }

  return textDatas;
});

router.post("/newexpense", async (req, res) => {
  const expense = new Expense(req.body)

  try {
    await expense.save()
    res.render("expenseadded.hbs", {
      addedExpense: expense
    })
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})

function toCash(valToConvert) {
  var result = parseFloat(valToConvert)

  result = Math.round(result * 100) / 100

  return result
}

router.get("/taxesresult/:year", async (req, res) => {
  var resultSTR = ""

  try {
    var expenses = await Expense.aggregate([
      { $match: { $and: [{ expenseDate: { $gte: req.params.year + "/01/01" } }, { expenseDate: { $lte: req.params.year + "/12/31" } }] } },
      {
        $group: { _id: null, total: { $sum: "$expenseAmount" }, tps: { $sum: "$expenseGST" }, tvq: { $sum: "$expensePST" } }
      }
    ])

    var income = await WorkDone.aggregate([
      { $match: { $and: [{ itemDate: { $gte: req.params.year + "/01/01" } }, { itemDate: { $lte: req.params.year + "/12/31" } }] } },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$itemCost", "$itemQuantity"] } },
          tps: { $sum: { $multiply: ["$itemCost", "$itemQuantity", 0.05] } },
          tvq: { $sum: { $multiply: ["$itemCost", "$itemQuantity", 0.09975] } },
          //tottax: { $sum: { $multiply: ["$expenseGST", "$expensePST"] } }
        }
      }
    ])

    resultSTR += "Revenus: " + income[0].total + "<br />"
    resultSTR += "TPS reçue: " + toCash(income[0].tps) + "<br />"
    resultSTR += "TVQ reçue: " + toCash(income[0].tvq) + "<br />"

    resultSTR += "<br />"

    resultSTR += "Dépenses: " + expenses[0].total + "<br />"
    resultSTR += "TPS payée: " + toCash(expenses[0].tps) + "<br />"
    resultSTR += "TVQ payée: " + toCash(expenses[0].tvq) + "<br />"

    resultSTR += "<br />"

    resultSTR += "TPS à payer: " + toCash(income[0].tps - expenses[0].tps) + "<br />"
    resultSTR += "TVQ à payer: " + toCash(income[0].tvq - expenses[0].tvq) + "<br />"

    //console.log("Tot: " + zzz[0].total)
    res.status(200).send(resultSTR)
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})

module.exports = router
