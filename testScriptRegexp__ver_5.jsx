#target photoshop
app.bringToFront();
//#include functions.jsx

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

var fileList = File("d:\\8\\buffer.tsv");
if (!fileList) {
	alert('No file list');
	exit();
};
var projectFolder = fileList.parent.fsName; //устанавливаем папку для файлов там, где находится текстовый файл со списком 
if (!projectFolder) {
	alert('No project folder!');
	exit();
};

//var dpi = prompt("Разрешение файлов (dpi):", "72"); //устанавливаем разрешение для файлов

//============================== Variables ==============================
var orderNum = null;//номер заказа
var tmp = [];
var tmp_02 = "";
var resultArr = [];
//============
var tabResult;
var workArr = [];
var workArr02 = [];
var indexArr = [];
//var materIndex = initString.match(materTemplate).index;
//var widthIndex = initString.match(widthTemplate).index;
//var heightIndex = initString.match(heightTemplate).index;


//============================== Patterns ===============================
var orderReg_01 = /[SDE\u041B\u043B\u0415\u0435]\d{4}(\u005F\d{1,2})*/i;//паттерн номера заказа по буквам S, D, E, Л, Е русское
var workSizes = /(\t\d{2,5}\t\d{2,5})/i;//паттерн поиска размеров с табуляциями 
var strNum = /(^\d{1,3}\t)/i;//паттерн поиска номера позиции должен быть только первой колонкой!!!!!
var tabTemplate = /\t/g;
var materTemplate = /материа/i;
var widthTemplate = /ширин/i;
var heightTemplate = /высот/i;
var sideTemplate = /(Количество|кол-во)\s*(стор|ст)/i;
//var countTemplate = /(?<=(Количество|кол-во)\s*(стор|ст))(Количество|кол-во|итого|всего)/gi;

//=======================================================================

fileList.open("r");
while(!fileList.eof){
var initString = fileList.readln();
if (initString.match(orderReg_01) != null) {
	orderNum = initString.match(orderReg_01)[0].toString();
	break;
}
};

//=====================================================
while(!fileList.eof){
var initString = fileList.readln();
if (materTemplate.test(initString) && widthTemplate.test(initString) && heightTemplate.test(initString)) {
while (tabResult = tabTemplate.exec(initString)) {
workArr.push(tabResult.index);
	switch(tabResult.index) {
  case (initString.match(materTemplate).index - 1): //0 материал
    indexArr.push(workArr.length);
break;
  case (initString.match(widthTemplate).index - 1): //1 ширина
    indexArr.push(workArr.length);
 break;
 case (initString.match(heightTemplate).index - 1): //2 высота
    indexArr.push(workArr.length);
 break;
}//end of switch
}//end of while
break;
}//end of if
} //end of while
//====================================================
if (fileList.tell() > 0) {
	fileList.seek(0,0);
}

//====================================================
while(!fileList.eof){
var initString = fileList.readln();
if (indexArr[0] && indexArr[1] && initString.match(strNum) != null) {
tmp = initString.split(/\t/);

tmp_02 = ("__" + tmp[0] + "__" + tmp[indexArr[0]] + "__" + tmp[indexArr[1]] + "x" + tmp[indexArr[2]] + "__" + "sht").toString();
resultArr.push(orderNum + tmp_02);
}
};

//alert(workArr);
//alert(indexArr);

for (var i = 0; i < resultArr.length; i++) {
	//alert(resultArr[i]);
}

//alert(orderNum);
//alert(tabArr);
//alert(numArr);
fileList.close();

var resultFile = File("d:\\8\\result.txt");
resultFile.open("w");
for (var i = 0; i < resultArr.length; i++) {
      resultFile.writeln(resultArr[i]);
};
    resultFile.close();





