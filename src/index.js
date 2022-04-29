const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const { guardarIp, listarIp } = require("./models/guardarIp");
const url = require("url");
const path = require("path");
let ventanas = {};

app.on("ready", () => {
  ventanas.mainWindow = new BrowserWindow({ width: 720, height: 600 });
  ventanas.mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "views/index.html"),
      protocol: "file",
      slashes: true,
    })
  );
  const mainMenu = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(mainMenu);
  ventanas.mainWindow.on("closed", () => {
    app.quit();
  });
});

ipcMain.on("product:new", (e, newProduct) => {
  // send to the Main Window
  let path = require("path");
  let myPythonScriptPath = path.resolve(__dirname, "../conexion.py");
  let { PythonShell } = require("python-shell");
  let pyshell = new PythonShell(myPythonScriptPath, {
    args: [newProduct.name],
  });
  pyshell.on("message", (e) => {
    ventanas.mainWindow.webContents.send("product:new", {
      name: "Resultados de Script",
      description: e,
    });
  });
  pyshell.end(function (err) {
    if (err) throw err;
  });
});

ipcMain.on("agregarIp", (e, relation) => {
  const { ip, nombre } = relation;
  guardarIp(ip, nombre);
  ventanas.ventana2.webContents.send("agregarIp", relation);
});
ipcMain.on("listarDispositivos", (e,nombreVentana) => {
  ventanas[nombreVentana].webContents.send("listarDispositivos", listarIp());
});

const templateMenu = [
  {
    label: "File",
    submenu: [
      {
        label: "Consultar Equipo",
        accelerator: "Ctrl+N",
        click() {
          createNewProductWindow();
        },
      },
      {
        label: "Listado Ip",
        accelerator: "Ctrl+P",
        click() {
          ventana2Test();
        },
      },
      {
        label: "Desconectar",
        click() {
          ventanas.mainWindow.webContents.send("products:remove-all");
        },
      },
      {
        label: "Salir",
        accelerator: process.platform == "darwin" ? "command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        },
      },
    ],
  },
];

// if you are in Mac, just add the Name of the App
if (process.platform === "darwin") {
  templateMenu.unshift({
    label: app.getName(),
  });
}

function createNewProductWindow() {
  ventanas.newProductWindow = new BrowserWindow({
    width: 400,
    height: 230,
    title: "Add A New Product",
  });
  ventanas.newProductWindow.setMenu(null);

  ventanas.newProductWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "views/new-product.html"),
      protocol: "file",
      slashes: true,
    })
  );
  ventanas.newProductWindow.on("closed", () => {
    newProductWindow = null;
  });
}

function ventana2Test() {
  ventanas.ventana2 = new BrowserWindow({
    width: 1200,
    height: 500,
    title: "Vincular Ip",
  });
  ventanas.ventana2.loadURL(
    url.format({
      pathname: path.join(__dirname, "views/ventanaTets.html"),
      protocol: "file",
      slashes: true,
    })
  );

  ventanas.ventana2.on("closed", () => {
    newProductWindow = null;
  });
}
if (process.env.NODE_ENV !== "production") {
  templateMenu.push({
    label: "DevTools",
    submenu: [
      {
        label: "Show/Hide Dev Tools",
        accelerator: process.platform == "darwin" ? "Comand+D" : "Ctrl+D",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        role: "reload",
      },
    ],
  });
}
