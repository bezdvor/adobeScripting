var constRegexp = [
/маг\.*\s*винил|магнитн|mag\s*(vinil|vynyl)/i,/стикер|наклей/i,/LB|лайтбо|lightbo/i,/рама|марзан/i,/карман(ы)*\s*\-*\d{2,3}/i,/(пвх\s*\d{1,2})/i];

var nameOfconstr = ["magVinil","nakleyka","LB","rama","kerman","isPVC"];

function constructHandle(arr){
for (var i = 0; i < arr.length; i++) {
	for (var j = 0; j < constRegexp.length; j++) {
	switch (true) {
		case (constRegexp[j].test(arr[i])):
		return nameOfconstr[j];
	};
	};
};
};