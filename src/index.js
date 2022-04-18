const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  dialog,
  ipcRenderer,
} = require("electron");

const url = require("url");
const path = require("path");
const { log } = require("console");

let mainWindow;
let newProductWindow;

// Reload in Development for Browser Windows
if (process.env.NODE_ENV !== "production") {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "../node_modules", ".bin", "electron"),
  });
}

app.on("ready", () => {
  // The Main Window
  mainWindow = new BrowserWindow({ width: 720, height: 600 });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "views/index.html"),
      protocol: "file",
      slashes: true,
    })
  );

  // Menu
  const mainMenu = Menu.buildFromTemplate(templateMenu);
  // Set The Menu to the Main Window
  Menu.setApplicationMenu(mainMenu);

  // If we close main Window the App quit
  mainWindow.on("closed", () => {
    app.quit();
  });
});

function createNewProductWindow() {
  newProductWindow = new BrowserWindow({
    width: 400,
    height: 330,
    title: "Add A New Product",
  });
  newProductWindow.setMenu(null);

  newProductWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "views/new-product.html"),
      protocol: "file",
      slashes: true,
    })
  );
  newProductWindow.on("closed", () => {
    newProductWindow = null;
  });
}

// Ipc Renderer Events
ipcMain.on("product:new", (e, newProduct) => {
  // send to the Main Window
  let datas = "";
  let path = require("path");
  let myPythonScriptPath = path.resolve(__dirname, "../conexion.py");
  let { PythonShell } = require("python-shell");
  let pyshell = new PythonShell(myPythonScriptPath);
  pyshell.on("message", (e) => {
    mainWindow.webContents.send("product:new", {
      name: "Resultados de Script",
      description: e,
    });
    newProductWindow.close();
  });
  pyshell.end(function (err) {
    if (err) throw err;
    console.log("finished");
  });
});

ipcMain.on("telnet:response", (e) => {
  console.log(e);
  console.log("Se llamo aca");
  //dialog.showMessageBox(mainWindow, { message: e });
});

// Menu Template
const templateMenu = [
  {
    label: "File",
    submenu: [
      {
        label: "New Product",
        accelerator: "Ctrl+N",
        click() {
          createNewProductWindow();
        },
      },
      {
        label: "Remove All Products",
        click() {
          mainWindow.webContents.send("products:remove-all");
        },
      },
      {
        label: "Exit",
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

// Developer Tools in Development Environment
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

