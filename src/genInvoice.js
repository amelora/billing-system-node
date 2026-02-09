const fs = require("fs")
const PDFDocument = require("pdfkit")

// Le PDF est généré une seule fois et diffusé simultanément
// vers le navigateur et vers le disque afin d'éviter une double
// génération et garantir que le fichier affiché est identique
// à celui sauvegardé.
function createInvoice(appConfig, client, invoice, workItems, path, outputs = {}) {
  const doc = new PDFDocument({ margin: 10 })

  // IMPORTANT: pipe AVANT d'écrire et avant doc.end()
  if (outputs.fileStream) {
      // PDFKit requiert que les streams soient attachés
      // avant l'appel à doc.end(), sinon le document peut
      // être incomplet ou vide selon le viewer.   
      doc.pipe(outputs.fileStream)
  } else if (path) {
      doc.pipe(fs.createWriteStream(path))
  }

  if (outputs.responseStream) {
    doc.pipe(outputs.responseStream)
  }

  generateHeader(doc, appConfig, client)
  generateInvoiceTable(doc, invoice, workItems, appConfig)
  generateCustomerInformation(doc, client, invoice)
  //generateFooter(doc)

  doc.end()
}

function getCompanyProfile(appConfig, clientNumber) {
  const company = (appConfig && appConfig.company) ? appConfig.company : {}

  const profiles = (appConfig && appConfig.companyProfiles) ? appConfig.companyProfiles : null
  const override = profiles && profiles[clientNumber] ? profiles[clientNumber] : {}

  return {
    name: company.name || "",
    titleLine1: override.titleLine1 || company.titleLine1 || "",
    titleLine2: override.titleLine2 || company.titleLine2 || "",
    address1: company.address1 || "",
    address2: company.address2 || "",
    postal: company.postal || "",
    phone: company.phone || "",
    email: company.email || "",
    gstNumber: company.gstNumber || "",
    qstNumber: company.qstNumber || "",
  }
}

function generateHeader(doc, appConfig, client) {
  const c = getCompanyProfile(appConfig, client && client.clientNumber)

  doc
    .fillColor("#444444")
    .font("Helvetica-Bold")
    .fontSize(20)
    .text(c.name, 20, 18)
    .font("Helvetica-BoldOblique")
    .fontSize(10)
    .text(c.titleLine1, 20, 38)
    .text(c.titleLine2, 20, 50)
    .font("Helvetica")
    .text(c.address1, 20, 68)
    .text(c.address2, 20, 80)
    .text(c.postal, 20, 92)
    .text(`Téléphone ${c.phone}`, 468, 38, { width: 120, align: "right" })
    .text(c.email, 468, 50, { width: 120, align: "right" })
    .text(`TPS: ${c.gstNumber}`, 468, 68, { width: 120, align: "right" })
    .text(`TVQ: ${c.qstNumber}`, 468, 80, { width: 120, align: "right" })
    .fontSize(30)
    .font("Helvetica-BoldOblique")
    .fontSize(10)
    .font("Helvetica-Bold")
    .moveDown()
}


function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Payment is due within 15 days. Thank you for your business.",
      50,
      780,
      { align: "center", width: 500 }
    )
}

function generateCustomerInformation(doc, client, invoice) {
  //const shipping = invoice.shipping

  doc
    .fontSize(9)
    .font("Times-Roman")
    .text(client.clientNumber, 82, 118)
    .text(client.billingName, 82, 131)
    .text(client.billingAddress, 82, 144)
    .text(client.billingCity, 82, 157)
    .text(client.billingState, 82, 170)
    .text(client.billingPostalCode, 82, 183)
    .text(reformatDate(invoice.invoiceDate), 466, 144)
    .text(invoice.invoiceTerm, 469, 157)
    .fontSize(9)
    .font("Helvetica-Bold")
    .text(`Facture # ${invoice.invoiceNumber}`, 434, 119)
    .moveDown()
}

function generateTableRow(doc, y, c1, c2, c3, c4, c5) {
  doc.save()
    .moveTo(16, y - 10)
    .lineTo(595, y - 10)
    .fill("#000000")

  doc
    .font("Times-Roman")
    .fontSize(11)
    .text(c1, 20, y) //Description
    .text(c2, 378, y, { width: 55 }) //Date of work
    .text(c3, 450, y, { width: 40, align: "center" }) //Tarif
    .text(c4, 498, y, { width: 25, align: "center" }) //Quant
    .text(c5, 543, y, { width: 45, align: "right" }) //Amount
}

function generateTableSubRow(doc, y, c1) {
  doc
    .fontSize(10)
    .text(c1, 30, y) //Description
}

function toMoney(amount) {
  const roundedAmount = Math.round(amount * 100) / 100
  let inStr = roundedAmount.toString()

  if (Number.isInteger(roundedAmount)) {
    inStr += ".00"
  } else {
    if (Number.isInteger(roundedAmount * 10)) {
      inStr += "0"
    }
  }

  return inStr
}

function addDigit(number) {
  if (parseInt(number) < 10) {
    return "0" + parseInt(number)
  } else {
    return parseInt(number).toString()
  }
}

function formatDate(dateVal) {
  const theDate = new Date(dateVal)
  const result = addDigit(theDate.getDate()) + "-" + addDigit(theDate.getMonth() + 1) + "-" + theDate.getFullYear()

  return result
}

function reformatDate(dateVal) {
  return dateVal.substring(8) + "-" + dateVal.substring(5, 7) + "-" + dateVal.substring(0, 4)
}

function generateInvoiceTable(doc, invoice, workItems, appConfig) {
  let i, j, invoiceTableTop = 188
  let position = invoiceTableTop + 36
  let itemsTotal = 0, tpsVal = 0, tvqVal = 0, totalVal = 0
  const amountPaid = invoice.amountPaid

  // Les taux de taxes sont volontairement chargés depuis la configuration
  // applicative afin de permettre un changement sans modification du code
  // (ex: ajustement fiscal ou environnement de démo).
  const gstRate = appConfig && appConfig.taxes && typeof appConfig.taxes.gstRate === "number" ? appConfig.taxes.gstRate : 0.05
  const qstRate = appConfig && appConfig.taxes && typeof appConfig.taxes.qstRate === "number" ? appConfig.taxes.qstRate : 0.09975

  doc
    .roundedRect(16, 112, 579, 84, 5) // Customer info box
    .lineWidth(1)
    .fillOpacity(0.8)
    .fillAndStroke("#C6D9F1", "black")

  doc
    .rect(80, 116, 30, 10) //Account # box
    .lineWidth(0)
    .fillOpacity(1)
    .fillAndStroke("white", "white")

    .rect(80, 129, 200, 10) // Name box
    .lineWidth(0)
    .fillOpacity(1)
    .fillAndStroke("white", "white")

    .rect(80, 142, 200, 10) // Address box
    .lineWidth(0)
    .fillOpacity(1)
    .fillAndStroke("white", "white")

    .rect(80, 155, 200, 10) // Town box
    .lineWidth(0)
    .fillOpacity(1)
    .fillAndStroke("white", "white")

    .rect(80, 168, 200, 10) // State box
    .lineWidth(0)
    .fillOpacity(1)
    .fillAndStroke("white", "white")

    .rect(80, 181, 200, 10) // Postal code box
    .lineWidth(0)
    .fillOpacity(1)
    .fillAndStroke("white", "white")

    .roundedRect(410, 116, 125, 13, 5) // Invoice # box
    .lineWidth(1)
    .fillOpacity(1)
    .fillAndStroke("white", "black")

    .rect(464, 142, 47, 10) // Date box
    .lineWidth(0)
    .fillOpacity(1)
    .fillAndStroke("white", "white")

    .rect(464, 155, 15, 10) // Term box
    .lineWidth(0)
    .fillOpacity(1)
    .fillAndStroke("white", "white")

  doc
    .fillAndStroke("black", "black")
    .fontSize(9)
    .font("Helvetica-Bold")
    .text("# Compte", 20, 118)
    .text("Nom", 20, 131)
    .text("Adresse", 20, 144)
    .text("Ville", 20, 157)
    .text("Province", 20, 170)
    .text("Code postal", 20, 183)
    .text("Date", 434, 144)
    .text("Terme", 434, 157)
    .text("jours", 484, 157)

  doc
    .roundedRect(16, 196, 579, 509, 5) // Main box
    .lineWidth(1).fillOpacity(1)
    .fillAndStroke("white", "black")

  doc
    .roundedRect(468, 705, 127, 61, 5)
    .lineWidth(1).fillOpacity(1)
    .fillAndStroke("#C6D9F1", "black")

  console.log("Déjà payé: " + invoice.amountPaid)

  doc
    .fillAndStroke("black", "black")
    .font("Times-Bold")
    .fontSize(10)
    .text("DESCRIPTION", 20, 202)
    .text("DATE", 390, 202)
    .text("TARIF", 455, 202)
    .text("QTE", 500, 202)
    .text("MONTANT", 540, 202)
    .font("Times-Roman")
    .text("SOUS-TOTAL", 473, 711)
    .text(`TPS (${toMoney(gstRate * 100)}%)`, 473, 722)
    .text(`TVQ (${toMoney(qstRate * 100)}%)`, 473, 733)
    .font("Times-Bold")
    .text("TOTAL", 473, 755)
    .font("Times-Roman")

  if (invoice.amountPaid > 0) {
    doc.text("PAYÉ", 473, 744)
  }

  for (i = 0; i < invoice.invoiceItemsList.length; i++) {
    const item = workItems.find(oneItem => oneItem.workID == invoice.invoiceItemsList[i])

    generateTableRow(
      doc,
      position,
      item.itemDesc,
      formatDate(item.itemDate),
      toMoney(item.itemCost),
      item.itemQuantity,
      toMoney(item.itemCost * item.itemQuantity)
    )

    for (j = 0; j < item.tasks.length; j++) {
      position += 12
      generateTableSubRow(doc, position, item.tasks[j].taskDesc)
    }

    position += 20
    itemsTotal += item.itemCost * item.itemQuantity
  }

  tpsVal = itemsTotal * gstRate
  tvqVal = itemsTotal * qstRate
  totalVal = itemsTotal + tpsVal + tvqVal - amountPaid

  doc
    .text(toMoney(itemsTotal), 533, 711, { width: 55, align: "right" })
    .text(toMoney(tpsVal), 533, 722, { width: 55, align: "right" })
    .text(toMoney(tvqVal), 533, 733, { width: 55, align: "right" })
    .font("Times-Bold")
    .text(toMoney(totalVal), 533, 755, { width: 55, align: "right" })

  if (amountPaid) {
    doc
      .font("Times-Roman").fillColor("firebrick")
      .text("(" + toMoney(amountPaid) + ")", 537, 744, { width: 55, align: "right" })
      .fillColor("black")
  }
}

module.exports = {
  createInvoice
}
