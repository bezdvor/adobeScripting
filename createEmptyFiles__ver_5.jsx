#target photoshop
app.bringToFront();
#include testFunction.jsx

//===================== ВАЖНО!!!!!!=========================
//	физический размер файлов не должен превышать 10,5 м. по большей стороне при разрешении 72 dpi
//	или 7,6м. по большей стороне при разрешении 100dpi

startRulerUnits = app.preferences.rulerUnits
startTypeUnits = app.preferences.typeUnits
startDisplayDialogs = app.displayDialogs
//change settings
app.preferences.rulerUnits = Units.PIXELS
app.preferences.typeUnits = TypeUnits.PIXELS
app.displayDialogs = DialogModes.NO

var fileList = File.openDialog('File list', 'Text files:*.TXT'); //выбираем список файлов
if (!fileList) {
	alert('No file list');
	exit();
};

var projectFolder = fileList.parent.fsName; //устанавливаем папку для файлов там, где находится текстовый файл со списком 
if (!projectFolder) {
	alert('No project folder!');
	exit();
};

var dpi = prompt("Разрешение файлов (dpi):", "72"); //устанавливаем разрешение для файлов

fileList.open("r");
while (!fileList.eof) { //проходим циклом каждую строчку из списка файлов

	var initString = fileList.readln(); //входная строка из текстового файла
	//============================================ПОИСК РАЗМЕРОВ ДОКУМЕНТА
	var regPattern = /\d{2,}(x|х)\d{2,}/ig; //паттерн для поиска размеров, без учета регистра, ищет все совпадения
	var sliceFileName = initString.slice(2, initString.length - 2); //отсекаем по два символа с каждой стороны строки
	sliceFileName = sliceFileName.match(regPattern); //поиск и запись в переменную совпадения по регулярному выражению
	sliceFileName = sliceFileName.toString(); //преобразовываем в строку
	var regPatforX = /(x|х)/ig; //паттерн для поиска х, т.е. символа разбивки на ширину и высоту
	sliceFileName = sliceFileName.split(regPatforX); //разбивка строки на массив по регулярному выражению 
	var sizes = sliceFileName.slice(); //копируем массив с размерами при помощи метода slice
	sizes.splice(1, 1); //убираем внутри значек "х"
	//============================================
	var materialString = initString.slice(15);
	var cloth = materialString.match(/ткан|ткани ЛБ|ткань ЛБ|Бергер|berger|EcoDisplay|textile|fabric|quat|кватро|кваттро/i); //возвращает совпадение или null без учета регистра
	var film = materialString.match(/пленк|плёнк|накл|наклейк|винил|оракал|vinyl|vinil|Oracal|Orajet/i); //возвращает совпадение или null без учета регистра
	var pvh = materialString.match(/пвх|pvh|pvc/i); //возвращает совпадение или null без учета регистра
	var paper = materialString.match(/бумага|paper/i);
	var constructString = initString.slice(13, 25);
	var construct = constructString.match(/рама|LB|лайтбо|маг винил|магвинил|магнитн|пвх|pvh/i); //возвращает совпадение или null без учета регистра
	var workString = initString.split("__");

	if (workString.length > 8) {
		var initCell = workString[8];
		var quattroDim = initCell.match(regPattern);
		quattroDim = quattroDim.split(regPatforX);
		var quattroSizes = quattroDim.slice();
		quattroSizes.splice(1, 1);
		var cellSizeW = parseInt(quattroSizes[0]);
		var cellSizeH = parseInt(quattroSizes[1]);
	}

	var orderNum = workString[0].toString();
	var positionNum = workString[1].toString();
	if (positionNum.length < 2) {
		positionNum = "0" + positionNum;
	}
	var constructNum = workString[2].toString();
	var material = workString[3].toString();
	var workSizes = sizes.join("x");
	var graphic = workString[5].toString();
	var windowType = workString[6].toString();
	var amount = workString[7];
	var Width = f_mm_To_px(parseInt(sizes[0]), dpi);
	var Height = f_mm_To_px(parseInt(sizes[1]), dpi);
	/*var myRatio = (Width / Height);
	myRatio = myRatio.toFixed(2);
	myRatio = myRatio.split("");
	myRatio[1] = ",";
	myRatio = myRatio.join("");
	if (Width > Height) {
		windowType = windowType + "--" + myRatio + "--гори";
	} else if (Width < Height) {
		windowType = windowType + "--" + myRatio + "--верт";
	} else if (Width = Height) {
		windowType = windowType + "--" + myRatio + "--квад";
	} else {
		alert("С размерами что-то не так!!!");
		exit();
	}*/
	var fileName = [orderNum, positionNum, constructNum, material, workSizes, graphic, windowType, amount];
	fileName = fileName.join("__");
	var newDoc = app.documents.add(Width, Height, dpi, fileName, NewDocumentMode.CMYK, DocumentFill.TRANSPARENT);
	var guide = app.activeDocument.guides;

	if (Width >= Height) {
		var smallSide = Height;
	} else {
		var smallSide = Width;
	}
	var xDim = Math.round(smallSide / 14); //часть в процентах меньшей части !!!
	//====================================== ЗАДАЕМ ЦВЕТ СЛОЯ !!!!
	//makeSolidFillAdjLayer(21, 0, 73, 0);
	//======================================

	// раскоментить и МОЖНО ВСТАВИТЬ ОБЪЕКТ прописав путь!!!!
	// цифры 100, 100 - это реальные размеры (100%) объекта который вставляется

	//placeObj (100, 100, "d:\\Work\\ADIDAS_RU\\S8320_2_RU_Зоя_Perf_МОНТАЖ_таблички на витрины 2,3,4 волны EOSS FW19_29.11.19\\in\\tabl2-2.tif");
	//=========================================
	//======================================== РИСУЕМ ПРЯМОУГОЛЬНИК !!!!
	/*	var rectColor = new SolidColor();

		rectColor.cmyk.cyan = 0;
		rectColor.cmyk.magenta = 0;
		rectColor.cmyk.yellow = 0;
		rectColor.cmyk.black = 0;
	*/
	//function drawRect (rectLeft, rectTop, rectRight, rectBottom, rectColor)
	//drawRect(xDim, xDim, Width - xDim, Height - xDim, rectColor);

	if (cloth !== null) {
		var initBleeds = f_mm_To_px(35, dpi); // базовые вылеты для ткани 35 мм.
		if (Width >= f_mm_To_px(2500, dpi) && Width <= f_mm_To_px(3999, dpi)) {
			initBleeds = f_mm_To_px(40, dpi);
		};
		if (Width >= f_mm_To_px(4000, dpi) && Width <= f_mm_To_px(4999, dpi)) {
			initBleeds = f_mm_To_px(45, dpi);
		};
		if (Width >= f_mm_To_px(5000, dpi)) {
			initBleeds = f_mm_To_px(55, dpi);
		};
	}
	if (film !== null || pvh !== null || paper !== null) {
		initBleeds = f_mm_To_px(5, dpi);
	}

	if (construct !== null) {
		var filePocket = initBleeds;
		setGuide('H', UnitValue() - filePocket);
		setGuide('H', UnitValue() + Height + filePocket);
	}
	if (constructNum == "карманы") {
		filePocket = f_mm_To_px(40, dpi);
		setGuide('H', UnitValue() + Height + initBleeds + filePocket);
		setGuide('H', UnitValue() - initBleeds - filePocket);
	} else if (constructNum == "карманы-35") {
		filePocket = f_mm_To_px(40, dpi);
		setGuide('H', UnitValue() + Height + initBleeds + filePocket);
		setGuide('H', UnitValue() - initBleeds - filePocket);
	};
	else if (constructNum == "карманы-40") {
		filePocket = f_mm_To_px(45, dpi);
		setGuide('H', UnitValue() + Height + initBleeds + filePocket);
		setGuide('H', UnitValue() - initBleeds - filePocket);
	};
	else if (constructNum == "карманы-50") {
		filePocket = f_mm_To_px(55, dpi);
		setGuide('H', UnitValue() + Height + initBleeds + filePocket);
		setGuide('H', UnitValue() - initBleeds - filePocket);
	};
	else if (constructNum == "карманы-100") {
		filePocket = f_mm_To_px(105, dpi);
		setGuide('H', UnitValue() + Height + initBleeds + filePocket);
		setGuide('H', UnitValue() - initBleeds - filePocket);
	};

	if (cloth !== null) {
		setGuide('V', UnitValue());
		setGuide('V', UnitValue() - initBleeds);
		setGuide('V', UnitValue() + xDim);
		setGuide('V', UnitValue() + (xDim * 2));
		//setGuide('V', UnitValue() + (xDim * 3));
		//setGuide('V', UnitValue() + (xDim * 4));
		setGuide('V', UnitValue() + Width - xDim);
		setGuide('V', UnitValue() + Width - (xDim * 2));
		//setGuide('V', UnitValue() + Width - (xDim * 3));
		//setGuide('V', UnitValue() + Width - (xDim * 4));
		setGuide('V', UnitValue() + Width);
		setGuide('V', UnitValue() + Width + initBleeds);
		setGuide('V', UnitValue() + (Width / 2));
		//setGuide('V', UnitValue() + (Width / 4));
		setGuide('H', UnitValue());
		setGuide('H', UnitValue() + xDim);
		setGuide('H', UnitValue() + (xDim * 2));
		//setGuide('H', UnitValue() + (xDim * 3));
		//setGuide('H', UnitValue() + (xDim * 4));
		setGuide('H', UnitValue() + (Height / 2));
		//setGuide('H', UnitValue() + (Height / 4));
		setGuide('H', UnitValue() + Height - xDim);
		setGuide('H', UnitValue() + Height - (xDim * 2));
		//setGuide('H', UnitValue() + Height - (xDim * 3));
		//setGuide('H', UnitValue() + Height - (xDim * 4));
		setGuide('H', UnitValue() + Height);
	};

	if (film !== null) {
		setGuide('V', UnitValue());
		setGuide('V', UnitValue() - initBleeds);
		setGuide('V', UnitValue() + xDim);
		setGuide('V', UnitValue() + (xDim * 2));
		setGuide('V', UnitValue() + Width - xDim);
		setGuide('V', UnitValue() + Width);
		setGuide('V', UnitValue() + Width + initBleeds);
		setGuide('V', UnitValue() + (Width / 2));
		setGuide('V', UnitValue() + Width - (xDim * 2));
		setGuide('H', UnitValue() - initBleeds);
		setGuide('H', UnitValue());
		setGuide('H', UnitValue() + xDim);
		setGuide('H', UnitValue() + (Height / 2));
		setGuide('H', UnitValue() + (xDim * 2));
		setGuide('H', UnitValue() + Height - (xDim * 2));
		setGuide('H', UnitValue() + Height - xDim);
		setGuide('H', UnitValue() + Height);
		setGuide('H', UnitValue() + Height + initBleeds);
	};

	if (pvh !== null) {
		setGuide('V', UnitValue());
		setGuide('V', UnitValue() - initBleeds);
		setGuide('V', UnitValue() + xDim);
		setGuide('V', UnitValue() + (xDim * 2));
		setGuide('V', UnitValue() + Width - xDim);
		setGuide('V', UnitValue() + Width);
		setGuide('V', UnitValue() + Width + initBleeds);
		setGuide('V', UnitValue() + (Width / 2));
		setGuide('V', UnitValue() + Width - (xDim * 2));
		setGuide('H', UnitValue() - initBleeds);
		setGuide('H', UnitValue());
		setGuide('H', UnitValue() + xDim);
		setGuide('H', UnitValue() + (Height / 2));
		setGuide('H', UnitValue() + (xDim * 2));
		setGuide('H', UnitValue() + Height - (xDim * 2));
		setGuide('H', UnitValue() + Height - xDim);
		setGuide('H', UnitValue() + Height);
		setGuide('H', UnitValue() + Height + initBleeds);
	};

	if (paper !== null) {
		setGuide('V', UnitValue());
		setGuide('V', UnitValue() - initBleeds);
		setGuide('V', UnitValue() + xDim);
		setGuide('V', UnitValue() + (xDim * 2));
		setGuide('V', UnitValue() + Width - xDim);
		setGuide('V', UnitValue() + Width);
		setGuide('V', UnitValue() + Width + initBleeds);
		setGuide('V', UnitValue() + (Width / 2));
		setGuide('V', UnitValue() + Width - (xDim * 2));
		setGuide('H', UnitValue() - initBleeds);
		setGuide('H', UnitValue());
		setGuide('H', UnitValue() + xDim);
		setGuide('H', UnitValue() + (Height / 2));
		setGuide('H', UnitValue() + (xDim * 2));
		setGuide('H', UnitValue() + Height - (xDim * 2));
		setGuide('H', UnitValue() + Height - xDim);
		setGuide('H', UnitValue() + Height);
		setGuide('H', UnitValue() + Height + initBleeds);
	};

	savePSD(projectFolder + "/" + fileName + '.psd');
	app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);

} //конец while

alert('Все!');
fileList.close();

app.preferences.rulerunits = startRulerUnits
app.preferences.typeunits = startTypeUnits
app.displayDialogs = startDisplayDialogs