#target Illustrator

//================ functions ================
function mmToP(value) {
	R = (value * 2.83465);
	return R
}

function poTomm(value) {
	R = (value * 0.352778);
	return R
}

app.documents.add(DocumentColorSpace.CMYK, mmToP(300), mmToP(670));
var myDoc = app.activeDocument;
//================= создание спотового цвета ==================
var newSpot = myDoc.spots.add();

newSpot.name = "cutColor";
newSpot.colorType = ColorModel.SPOT;
newSpot.color = myDoc.swatches[9].color;

var newSpotColor = new SpotColor();
newSpotColor.spot = newSpot;
newSpotColor.tint = 100;
//==============================================================

//myDoc.rulerUnits = RulerUnits.Millimeters;
var width = 10.0;
var height = 20.0;

myDoc.layers[0].name = "CMYK";
var dirImages = new Folder("d:\\3");
var imageList = dirImages.getFiles();
var itemToPlace = {};
for (var i = 0; i < imageList.length; i++) {
	itemToPlace = myDoc.placedItems.add();
	itemToPlace.layer = myDoc.layers.getByName("CMYK");
	itemToPlace.file = imageList[i];
	itemToPlace.top = myDoc.height;
	itemToPlace.left = 0;
}

var myLayer = myDoc.layers.add();
myLayer.name = "cut";
var artLayer = myDoc.layers.getByName("cut");
var artbrd = myDoc.artboards[0].artboardRect;
var rndRect_01 = artLayer.pathItems.roundedRectangle((mmToP(670) - mmToP(75)), ((artbrd[2] / 2) - (mmToP(width) / 2)), mmToP(width), mmToP(height), mmToP(width), mmToP(width));
var rndRect_02 = artLayer.pathItems.roundedRectangle((mmToP(670) - mmToP(575)), ((artbrd[2] / 2) - (mmToP(width) / 2)), mmToP(width), mmToP(height), mmToP(width), mmToP(width));
var rndRect_03 = artLayer.pathItems.rectangle(artbrd[1], 0.0, artbrd[2], artbrd[1]);

for (var i = 0; i < myDoc.pathItems.length; i++) {
	var pathRef = myDoc.pathItems[i];
	pathRef.filled = false;
	pathRef.stroked = true;
	pathRef.strokeWidth = 1.0;
	pathRef.strokeColor = newSpotColor;
};
