#target bridge
#include testFunction.jsx;

//=============== Variables =====================
var myInfo_01 = "adidasWinComp";
var orderNum = "noname";
var myMaterial = "noname";
var mySides = "noname";
var constrName = "noname";
var myArr = [];
var splitArr = [];
var nameArr = [];
var sizeArr = [
	[],
	[]
];

var posIndex = "";
var materIndex = "";
var widthIndex = "";
var heightIndex = "";
var countIndex = "";
var sideIndex = "";

var fileList = File("d:\\1\\buffer.tsv");
if (!fileList) {
	alert('No file list');
	exit();
};
//==== constructions patterns ====================
var magVinilConstr = /маг\.*\s*винил|магнитн|mag\s*(vinil|vynyl)/i;
var stickerConstr = /стикер|наклей/i;
var liboxConstr = /LB|лайтбо|lightbo/i;
var ramaConstr = /рама|марзан/i;
var karmanConstr = /карман(ы)*\s*\-*\d{2,3}/i;
var pvcConstr = /(пвх\s*\-*\d{1,2}\s*(\u043C\u043C|mm))/i;
//==== patterns======
var headPos = /\u2116*\s*((\u043C\u0430\u043A\u0435\u0442\u0430)|(\u043F\.(\u043F|\u043D)))/i; //поиск номера позиции, № п.п, п.н (КРОМЕ ПОЗИЦИЙ где в колонке написано № макета!!!)
//var headPos = /(\u0023*\s*\u043F\s*[\.\,]\s*\(\u043D|\u043F))/i;//поиск номера позиции, № п.п, п.н
var headMaterial = /Материал/i;
var headWight = /Ширина/i; //в реге запятые заменены на нижнее подчеркивание
//var headWight = /(Ширина\_*\s*\u043C\u043C)/i; //в реге запятые заменены на нижнее подчеркивание
var headHeight = /Высота/i; //в реге запятые заменены на нижнее подчеркивание
//var headHeight = /(Высота\_*\s*\u043C\u043C)/i; //в реге запятые заменены на нижнее подчеркивание
var headSide = /(во\s*сторо)/i;
var headCount = /итого|(Количество\_*\s*шт*)|Кол-во\_*\s*шт|всего/i; //в реге запятые заменены на нижнее подчеркивание
var stringEnd = /(\u000D\u000A)/i;
var tabSplit = /\t/i; //(\t{1,3})
var orderReg_01 = /[SDE\u041B\u043B\u0415\u0435]\d{4}(\u005F\d{1,2})*/i; //pattern of order num ИЩЕТ НОМЕР ЗАКАЗА
var stringDelim = /\d{1,3}:\s*\(\d{1,3}\)\s*/i;
var stringRepl = /,\r\n/gi;
var matchPos = /\d{1,4}/i;
var cloth = /ткан|ткани ЛБ|ткань ЛБ|Бергер|berger|EcoDisplay|textile|fabric|quat|кватро|кваттро/i; //pattern for cloth
var film = /пленк|плёнк|накл|наклейк|винил|оракал|vinyl|vinil|Oracal|Orajet/i; //pattern of film
var pvc = /пвх|pvh|pvc/i; //pattern of pvc
var paper = /бумага|paper/i; //pattern of paper or karton
//=================================================
fileList.open("r");
while (!fileList.eof) {
	var initString = fileList.readln();
	var tmpString = initString.split(stringEnd);
	myArr.push(tmpString + "\u000D\u000A"); //добавляем в массив с преобразованием в строку
};
fileList.close();

for (var i = 0; i < myArr.length; i++) {
	var commaChange = myArr[i].replace(/\u002C/g, "_"); //заменяем запятую на нижнее подчеркивание
	splitArr.push(commaChange.split(tabSplit));
};

for (var i = 0; i < splitArr.length; i++) {
	for (var k = 0; k < splitArr[i].length; k++) {
		if (splitArr[i][k].length === 0) {
			splitArr[i][k] = "\u00A7"; //ставит вместо пустого элемента массива знак параграфа
		};
	};
};
//============== ПОЗИЦИОНИРОВАНИЕ ПО КОЛОНКАМ =====================
for (var i = 0; i < splitArr.length; i++) {
	for (var j = 0; j < splitArr[i].length; j++) {
		switch (true) {
			case (headPos.test(splitArr[i][j])):
				posIndex = new Number(j)
		};
		switch (true) {
			case (headMaterial.test(splitArr[i][j])):
				materIndex = new Number(j)
		};
		switch (true) {
			case (headSide.test(splitArr[i][j])):
				sideIndex = new Number(j)
		};
		switch (true) {
			case (headWight.test(splitArr[i][j])):
				sizeArr[0].push(new Number(j));
		}
		switch (true) {
			case (headHeight.test(splitArr[i][j])):
				sizeArr[1].push(new Number(j));
		}
		switch (true) {
			case (headCount.test(splitArr[i][j])):
				countIndex = new Number(j)
		};
	};
};

widthIndex = sizeArr[0][0]; //задаем первое совпадение по регу как ширину
heightIndex = sizeArr[1][0]; //задаем первое совпадение по регу как высоту
//====================== ПОИСК НОМЕРА ЗАКАЗА =====================
outer: for (var i = 0; i < splitArr.length; i++) {
	for (var z = 0; z < splitArr[i].length; z++) {
		if (orderReg_01.test(splitArr[i][z])) {
			orderNum = splitArr[i][z].match(orderReg_01);
			orderNum = orderNum[0];
			break outer;
		}
	}
};
//=================================== Основной Наполняющий Цикл ======================================
//====================================================================================================
for (var i = 0; i < splitArr.length; i++) {
	for (var j = 0; j < splitArr[i].length; j++) {
		switch (true) {
			case (cloth.test(splitArr[i][j])):
				myMaterial = "\u0442\u043A\u0430\u043D\u044C"; //ткань
				break;
			case (film.test(splitArr[i][j])):
				myMaterial = "\u043F\u043B\u0435\u043D\u043A\u0430";
				break;
			case (pvc.test(splitArr[i][j])):
				myMaterial = "\u041F\u0412\u0425"; //ПВХ большими буквами
				break;
			case (paper.test(splitArr[i][j])):
				myMaterial = "\u0431\u0443\u043C\u0430\u0433\u0430";
				break;
		}; //end switch
	}; //end for(j)

	for (var n = 0; n < splitArr[i].length; n++) {
		switch (true) {
			case (n == sideIndex):
				switch (true) {
					case (new Number(splitArr[i][n]) == 1):
						mySides = "4+0__";
						break;
					case (new Number(splitArr[i][n]) == 2):
						mySides = "4+4__";
						break;
					default:
						mySides = "";
						break;
				}
		}; //конец внешнего свича
	}; //end for(n)

	if (mySides == "") {
		var myInfo_02 = "infoSup__"
	} else {
		myInfo_02 = ""
	};

	nameArr.push(orderNum + "_RU" + "__" + splitArr[i][posIndex] + "__" + constructHandle(splitArr[i]) + "__" + myMaterial + "__" + splitArr[i][widthIndex] + "x" + splitArr[i][heightIndex] + "__" + myInfo_01 + "__" + mySides + myInfo_02 + splitArr[i][countIndex] + "sht");
}; // end of for (i) конец основного наполняющего цикла

//========================= Запись результатов в текстовый файл =============================
var resultFile = File("d:\\1\\result.txt");
if (!resultFile.exists) {
	alert('No file list');
	exit();
};

resultFile.open("w");
for (var i = 0; i < nameArr.length; i++) {
	resultFile.writeln(nameArr[i]);
}
resultFile.close();