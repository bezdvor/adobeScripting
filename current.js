//You can load as a string an external file (either binary or not). In the following code, both files are in the same folder:

var currentPath = (new File($.fileName)).path // retrieve the current script path
var scriptToLoad = new File (currentPath + "/illustratorScript.js") // the script to load
try {
    if (!scriptToLoad.exists) { throw new Error("script not found!"); }
    scriptToLoad.open ("r"); // read only
    var message = scriptToLoad.read();
    scriptToLoad.close()
} catch (error) {
    alert("Error parsing the file: " + error.description);
}
var bt = new BridgeTalk();
bt.target = "illustrator";
bt.body = message;
bt.send();