let path = require('path');
let myPythonScriptPath = path.resolve(__dirname, '../conexion.py');
let { PythonShell } = require('python-shell');
let pyshell = new PythonShell(myPythonScriptPath);
pyshell.on('message', function (message) {
    console.log(message);
});
pyshell.end(function (err) {
    if (err) throw err;
    console.log('finished');
});
