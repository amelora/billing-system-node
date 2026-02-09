function getCssPixelValue(element, property) {
  var theElement = document.getElementById(element)
  var style = window.getComputedStyle(theElement)
  var theProperty = style.getPropertyValue(property)
  var value = parseInt(theProperty, 10)
  return value
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function swapText(textArray, divObj) { //Fonction qui affiche un texte en progression et reviens pour en afficher un autre
  msgBox = divObj
  theWidth = getCssPixelValue("textdemo", "width")
  var counter = 0

  while (counter < 2) {
    for (index = 0; index <= 1; ++index) {
      msgBox.innerHTML = textArray[index][0]
      msgBox.style.width = "0px"
      theWidth = getCssPixelValue("textdemo", "width")
      while (theWidth <= textArray[0][1]) {
        // message = document.getElementById("message")
        // text = message.innerHTML
        // message.innerHTML = text + "Width: " + boxWidth + " Height: " + boxHeight + "<br>"
        msgBox.style.width = (theWidth + 1) + "px"
        theWidth = getCssPixelValue("textdemo", "width")
        // counter++
        // document.getElementById("message").innerHTML = counter
        await sleep(10)
      }
      await sleep(1500)
      while (theWidth > 0) {
        // message = document.getElementById("message")
        // text = message.innerHTML
        // message.innerHTML = text + "Width: " + boxWidth + " Height: " + boxHeight + "<br>"
        msgBox.style.width = (theWidth - 1) + "px"
        theWidth = getCssPixelValue("textdemo", "width")
        //counter++
        //document.getElementById("message").innerHTML = counter

        await sleep(10)
      }
      await sleep(500)
    }
    counter++
  }
  msgBox.innerHTML = "<nobr>Dévelopeur web</nobr>"
  while (theWidth <= 100) {
    // message = document.getElementById("message")
    // text = message.innerHTML
    // message.innerHTML = text + "Width: " + boxWidth + " Height: " + boxHeight + "<br>"
    msgBox.style.width = (theWidth + 1) + "px"
    theWidth = getCssPixelValue("textdemo", "width")
    // counter++
    // document.getElementById("message").innerHTML = counter
    await sleep(10)
  }
}

module.exports.swapText = swapText
module.exports.getCssPixelValue = getCssPixelValue