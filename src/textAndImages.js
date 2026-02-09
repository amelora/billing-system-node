// Enter your configuration values here
var imagesPath = "../images/"
var imagesList = ["city.png", "city2.png", "city3.png", "city4.png", "city5.png", "city6.png"]
var imgWidth = 270, imgHeight = 159
var buttonsColor = "#27727C"
var buttonsHover = "#4CDEF1"
var taiMainTitle = `Even though using "lorem ipsum" often arouses curiosity due to its resemblance to classical Latin, it is not intended to have meaning.`
var taiMainText = `Where text is visible in a document, people tend to focus on the textual content rather than upon overall
presentation, so publishers use lorem ipsum when displaying a typeface or design in order to direct the focus to
presentation. "Lorem ipsum" also approximates a typical distribution of spaces in English.
Where text is visible in a document, people tend to focus on the textual content rather than upon overall
presentation, so publishers use lorem ipsum when displaying a typeface or design in order to direct the focus to
presentation. "Lorem ipsum" also approximates a typical distribution of spaces in English.
Where text is visible in a document, people tend to focus on the textual content rather than upon overall
presentation, so publishers use lorem ipsum when displaying a typeface or design in order to direct the focus to
presentation. "Lorem ipsum" also approximates a typical distribution of spaces in English.`


// Do not edit below this line
function swapImage(newPictNumber) {
  var items = document.getElementById("taiImgContainers").getElementsByTagName("div");

  for (var i = 0; i < items.length; i++) {
    items[i].style.visibility = (i == newPictNumber - 1) ? 'visible' : 'hidden';
  }
}

function createTextImgBox() {
  document.writeln("<div id='taiMainbox'>")
  document.writeln("<div id='taiInnerBox1'>")
  document.writeln("<div id='taiMainBox2'>")
  document.writeln("<h3><span id='taiMainTitle'>" + taiMainTitle + "</span></h3>")
  document.writeln("<span id='taiMainText'>" + taiMainText + "</span>")
  document.writeln("</div>")
  document.writeln("<div id='taiImgColumn'>")
  document.writeln("<div id='taiImageBox'>")
  document.writeln("<div id='taiImgContainers'>")

  for (imgCpt = 1; imgCpt <= imagesList.length; ++imgCpt) {
    document.writeln("<div id='taiImgContainer" + imgCpt + "' class='taiImgContainer'><img id='taiSwapingImg" + imgCpt + "' src='../images/" + imagesList[imgCpt - 1] + "' class='taiSwapingImg'></div>")
  }
  document.getElementById("taiImgContainer1").style.visibility = "visible"

  document.writeln("</div>")

  document.writeln("<div id='taiImgBtnContainer'>")
  document.writeln("<div style='display: inline-block;'>")

  for (imgCpt = 1; imgCpt <= imagesList.length; ++imgCpt) {
    document.writeln("<div id='taiSwapButton' onclick='javascript: swapImage(" + imgCpt + ");'></div>")
    if (imgCpt < imagesList.length) {
      document.writeln("<div id='taiSpacer'></div>")
    }
  }

  document.writeln("</div>")
  document.writeln("</div>")
  document.writeln("</div>")
  document.writeln("</div>")
  document.writeln("</div>")
  document.writeln("</div>")

  //document.getElementById("taiImgBtnContainer").style.top = imgHeight + "px"
}