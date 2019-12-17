var constRegexp = [/маг\.*\s*винил|магнитн|mag\s*(vinil|vynyl)/i, /стикер|наклей/i, /LB|лайтбо|lightbo/i, /рама|марзан/i, /карман(ы)*/i, /(пвх\s*1)/i, /(пвх\s*2)/i, /(пвх\s*3)/i, /(пвх\s*4)/i, /(пвх\s*5)/i, /(пвх\s*6)/i, /(пвх\s*8)/i, /(пвх\s*10)/i, /paper|бумага|картон/i, /(по)*резка/i];
var constName = ["магвинил", "наклейка", "LB", "рама", "карманы", "ПВХ_1мм", "ПВХ_2мм", "ПВХ_3мм", "ПВХ_4мм", "ПВХ_5мм", "ПВХ_6мм", "ПВХ_8мм", "ПВХ_10мм", "бумага", "плоттер"];

function constructHandle(arr) {
    var out = null;
    inner: for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < constRegexp.length; j++) {
            switch (true) {
                case (constRegexp[j].test(arr[i])):
                    //var tmp = arr[i].match(constRegexp[j]);
                    var out = constName[j];
                    break inner;
            };
        };
    };
    return out
};

//============= Вспомогательные Функции ====================
function makeSolidFillAdjLayer(C, M, Y, B) {
    var idMk = charIDToTypeID("Mk  ");
    var desc3 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref1 = new ActionReference();
    var idcontentLayer = stringIDToTypeID("contentLayer");
    ref1.putClass(idcontentLayer);
    desc3.putReference(idnull, ref1);
    var idUsng = charIDToTypeID("Usng");
    var desc4 = new ActionDescriptor();
    var idType = charIDToTypeID("Type");
    var desc5 = new ActionDescriptor();
    var idClr = charIDToTypeID("Clr ");
    var desc6 = new ActionDescriptor();
    var idCyn = charIDToTypeID("Cyn ");
    desc6.putDouble(idCyn, C);
    var idMgnt = charIDToTypeID("Mgnt");
    desc6.putDouble(idMgnt, M);
    var idYlw = charIDToTypeID("Ylw ");
    desc6.putDouble(idYlw, Y);
    var idBlck = charIDToTypeID("Blck");
    desc6.putDouble(idBlck, B);
    var idCMYC = charIDToTypeID("CMYC");
    desc5.putObject(idClr, idCMYC, desc6);
    var idsolidColorLayer = stringIDToTypeID("solidColorLayer");
    desc4.putObject(idType, idsolidColorLayer, desc5);
    var idcontentLayer = stringIDToTypeID("contentLayer");
    desc3.putObject(idUsng, idcontentLayer, desc4);
    executeAction(idMk, desc3, DialogModes.NO);
};
//==============================================================================

function f_mm_To_px(mm, res) {
    // ensure that there is at least one document open
    R = Math.round(mm * res / 25.4);
    return R; // quit
}

function f_px_To_mm(px, res) {
    // ensure that there is at least one document open
    R = Math.round(px * 25.4 / res);
    return R; // quit
}

function savePSB(saveFile) {
    var desc1 = new ActionDescriptor();
    var desc2 = new ActionDescriptor();
    desc2.putBoolean(stringIDToTypeID('maximizeCompatibility'), false); //  true - увеличивает размер файла на 40+ процентов для совместимости со старыми версиями
    desc1.putObject(charIDToTypeID('As  '), charIDToTypeID('Pht8'), desc2);
    desc1.putPath(charIDToTypeID('In  '), new File(saveFile));
    desc1.putBoolean(charIDToTypeID('LwCs'), true);
    executeAction(charIDToTypeID('save'), desc1, DialogModes.NO);
};

function savePSD(saveAsName) {
    try {
        var pso = new PhotoshopSaveOptions();
        pso.alphaChannels = false;
        pso.embedColorProfile = false;
        pso.layers = true;
        pso.spotColors = false;
        app.activeDocument.saveAs(File(saveAsName), pso);
    } catch (e) {
        alert(e);
    }

}

function setGuide(direction, value) {

    if (direction == 'V') {
        direction = Direction.VERTICAL;
    }
    if (direction == 'H') {
        direction = Direction.HORIZONTAL;
    }
    return app.activeDocument.guides.add(direction, value); // in pixels
}

function ps_EXIF_add() {
    app.activeDocument.info.author = "Alex Bezdvornyj";
    app.activeDocument.info.caption = "";
    app.activeDocument.info.captionWriter = "Bezdvor81";
    app.activeDocument.info.keywords = ["Script generated file"];
    app.activeDocument.info.city = "Kiev";
    app.activeDocument.info.copyrightNotice = "Copyright (c)";
    app.activeDocument.info.copyrighted = CopyrightedType.PUBLICDOMAIN;
    app.activeDocument.info.country = "Ukraine";
}

function placeObj(scaleW, scaleH, file) {

    var objectDesc = new ActionDescriptor();
    objectDesc.putInteger(charIDToTypeID("Idnt"), 3);
    objectDesc.putPath(charIDToTypeID("null"), new File(file));
    objectDesc.putEnumerated(charIDToTypeID("FTcs"), charIDToTypeID("QCSt"), charIDToTypeID("Qcsa"));

    var positionDesc = new ActionDescriptor();
    positionDesc.putUnitDouble(charIDToTypeID("Hrzn"), charIDToTypeID("#Pxl"), 0);
    positionDesc.putUnitDouble(charIDToTypeID("Vrtc"), charIDToTypeID("#Pxl"), 0);

    objectDesc.putObject(charIDToTypeID("Ofst"), charIDToTypeID("Ofst"), positionDesc);
    objectDesc.putUnitDouble(charIDToTypeID("Wdth"), charIDToTypeID("#Prc"), scaleW);
    objectDesc.putUnitDouble(charIDToTypeID("Hght"), charIDToTypeID("#Prc"), scaleH);

    executeAction(charIDToTypeID("Plc "), objectDesc, DialogModes.NO);
}


//==================================================================================РИСОВАНИЕ ПРЯМОУГОЛЬНИКА
function drawRect(rectLeft, rectTop, rectRight, rectBottom, rectColor) {

    var dRectangle = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(stringIDToTypeID('contentLayer'));
    dRectangle.putReference(charIDToTypeID('null'), ref1);

    var desc3 = new ActionDescriptor();

    var fillColorDesc = new ActionDescriptor(); // Fill Descriptor

    var colorDesc = new ActionDescriptor(); // CMYK Color Descriptor
    colorDesc.putDouble(charIDToTypeID('Cyn '), rectColor.cmyk.cyan);
    colorDesc.putDouble(charIDToTypeID('Mgnt'), rectColor.cmyk.magenta);
    colorDesc.putDouble(charIDToTypeID('Ylw '), rectColor.cmyk.yellow);
    colorDesc.putDouble(charIDToTypeID('Blck'), rectColor.cmyk.black);
    fillColorDesc.putObject(charIDToTypeID('Clr '), charIDToTypeID('CMYC'), colorDesc);
    desc3.putObject(charIDToTypeID('Type'), stringIDToTypeID('solidColorLayer'), fillColorDesc);

    var rectDimDesc = new ActionDescriptor();
    rectDimDesc.putInteger(stringIDToTypeID('unitValueQuadVersion'), 1);
    rectDimDesc.putUnitDouble(charIDToTypeID('Top '), charIDToTypeID('#Pxl'), rectTop);
    rectDimDesc.putUnitDouble(charIDToTypeID('Left'), charIDToTypeID('#Pxl'), rectLeft);
    rectDimDesc.putUnitDouble(charIDToTypeID('Btom'), charIDToTypeID('#Pxl'), rectBottom);
    rectDimDesc.putUnitDouble(charIDToTypeID('Rght'), charIDToTypeID('#Pxl'), rectRight);
    rectDimDesc.putUnitDouble(stringIDToTypeID('topRight'), charIDToTypeID('#Pxl'), -1.000000);
    rectDimDesc.putUnitDouble(stringIDToTypeID('topLeft'), charIDToTypeID('#Pxl'), -1.000000);
    rectDimDesc.putUnitDouble(stringIDToTypeID('bottomLeft'), charIDToTypeID('#Pxl'), -1.000000);
    rectDimDesc.putUnitDouble(stringIDToTypeID('bottomRight'), charIDToTypeID('#Pxl'), -1.000000);
    desc3.putObject(charIDToTypeID('Shp '), charIDToTypeID('Rctn'), rectDimDesc);

    var strokeStyleDesc = new ActionDescriptor();
    strokeStyleDesc.putInteger(stringIDToTypeID('strokeStyleVersion'), 2);
    strokeStyleDesc.putBoolean(stringIDToTypeID('strokeEnabled'), false);
    strokeStyleDesc.putBoolean(stringIDToTypeID('fillEnabled'), true);
    strokeStyleDesc.putUnitDouble(stringIDToTypeID('strokeStyleLineWidth'), charIDToTypeID('#Pnt'), 3.000000);
    strokeStyleDesc.putUnitDouble(stringIDToTypeID('strokeStyleLineDashOffset'), charIDToTypeID('#Pnt'), 0.000000);
    strokeStyleDesc.putDouble(stringIDToTypeID('strokeStyleMiterLimit'), 100.000000);
    strokeStyleDesc.putEnumerated(stringIDToTypeID('strokeStyleLineCapType'), stringIDToTypeID('strokeStyleLineCapType'), stringIDToTypeID('strokeStyleButtCap'));
    strokeStyleDesc.putEnumerated(stringIDToTypeID('strokeStyleLineJoinType'), stringIDToTypeID('strokeStyleLineJoinType'), stringIDToTypeID('strokeStyleMiterJoin'));
    strokeStyleDesc.putEnumerated(stringIDToTypeID('strokeStyleLineAlignment'), stringIDToTypeID('strokeStyleLineAlignment'), stringIDToTypeID('strokeStyleAlignInside'));
    strokeStyleDesc.putBoolean(stringIDToTypeID('strokeStyleScaleLock'), false);
    strokeStyleDesc.putBoolean(stringIDToTypeID('strokeStyleStrokeAdjust'), false);

    var list1 = new ActionList();
    strokeStyleDesc.putList(stringIDToTypeID('strokeStyleLineDashSet'), list1);
    strokeStyleDesc.putEnumerated(stringIDToTypeID('strokeStyleBlendMode'), charIDToTypeID('BlnM'), charIDToTypeID('Nrml'));
    strokeStyleDesc.putUnitDouble(stringIDToTypeID('strokeStyleOpacity'), charIDToTypeID('#Prc'), 100.000000);

    var desc8 = new ActionDescriptor(); // Stroke Color Descriptor

    var colorDesc = new ActionDescriptor(); // CMYK Color Descriptor
    colorDesc.putDouble(charIDToTypeID('Cyn '), 0.000000);
    colorDesc.putDouble(charIDToTypeID('Mgnt'), 0.000000);
    colorDesc.putDouble(charIDToTypeID('Ylw '), 0.000000);
    colorDesc.putDouble(charIDToTypeID('Blck'), 0.000000);
    desc8.putObject(charIDToTypeID('Clr '), charIDToTypeID('CMYC'), colorDesc);
    strokeStyleDesc.putObject(stringIDToTypeID('strokeStyleContent'), stringIDToTypeID('solidColorLayer'), desc8);
    strokeStyleDesc.putDouble(stringIDToTypeID('strokeStyleResolution'), 100.000000);
    desc3.putObject(stringIDToTypeID('strokeStyle'), stringIDToTypeID('strokeStyle'), strokeStyleDesc);
    dRectangle.putObject(charIDToTypeID('Usng'), stringIDToTypeID('contentLayer'), desc3);
    executeAction(charIDToTypeID('Mk  '), dRectangle, DialogModes.NO);

    return;
};


function f_SaveAsTIFF(saveAsName) {
    var tso = new TiffSaveOptions();
    tso.embedColorProfile = true;
    tso.imageCompression = TIFFEncoding.TIFFLZW;
    tso.byteOrder = ByteOrder.IBM;
    app.activeDocument.saveAs(File(saveAsName), tso);
}

function makeColor(c, m, y, k) {
    var ink = new CMYKColor();
    ink.cyan = c;
    ink.magenta = m;
    ink.yellow = y;
    ink.black = k;
    return ink;
}