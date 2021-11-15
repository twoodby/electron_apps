const { ipcMain } = require('electron');
const electron = require('electron');

const { app, BrowserWindow, Menu } = electron

let mainWindow;
let addWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/main.html`);
    mainWindow.on('close', () => {
        app.quit()
    })
    
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);

});

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add New ToDo'
    });
    addWindow.loadURL(`file://${__dirname}/add.html`);
    addWindow.on('close', () => addWindow = null)
}

ipcMain.on('todo:add', (event, todo) => {
    mainWindow.webContents.send('todo:add', todo)
    addWindow.close()
    addWindow = null
})


const menuTemplate = [
    {
        label: 'File',
        submenu: [
            { label: 'New ToDo',
                click() {
                    createAddWindow()
                }
            },
            { label: 'Reset List', 
                accelerator: "Command+C",
                click() {
                    mainWindow.send("todo:clear", null)
                }

            },
            { label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit()
                }

            }
        ]
        
    }
];

if (process.platform === 'darwin') {
    menuTemplate.unshift({})
}

if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'DEVELOPER',
        submenu: [
            { role: 'reload' },
            { label: "Dev Tools", 
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools()
            }, 
            accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I'}

        ]
    })

}