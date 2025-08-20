const { app, session, ipcRenderer, ipcMain, shell, systemPreferences, powerMonitor } = require('electron');
const { MicaBrowserWindow } = require('mica-electron');
const path = require('path');
const express = require('express');
const port = 5050;
const hostname = 'localhost';
const prox = express();

//Libs

const rootagent = require('fs-extra');
const os = require('os');
const { stat } = require('fs');
const { dir } = require('console');
const winattr = require('winattr');
const util = require('util');
const fs = require('fs-extra');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const drivelist = require('drivelist')


//Tasks

const getattrs = util.promisify(winattr.get);
let currentpath;

let currentdrives = []

async function detectChanges() {

  const drives = await drivelist.list()

  const currentdrives = []

  drives.forEach(drive => {
    drive.mountpoints.forEach(mount => {
      currentdrives.push({
        path: mount.path,
        removable: drive.isRemovable,
        description: drive.description
      })
    })
  })

  const win = MicaBrowserWindow.getAllWindows()[0]
  if (win) win.webContents.send('drives:updated', currentdrives)
}


setInterval(detectChanges, 2000)
app.whenReady().then(detectChanges)


//Apx

prox.use(express.static(path.join(__dirname, '..', 'public')))
prox.use('/assx', express.static(path.join(__dirname, '..', 'assx')));
prox.use('/error', express.static(path.join(__dirname, '..', 'error')));

prox.listen(port, () => { console.log(`com.dexly.server policy is mounted on http://${hostname}:${port}`) });

let preload;
let apx;
let about;

async function Mount() {

    preload = new MicaBrowserWindow({

        width:440,
        height:250,
        show:false,
        frame:false,
        autoHideMenuBar:true,
        resizable: false,
        icon: path.join(__dirname, '..', 'assx', 'img', 'logo.ico'),

        webPreferences:{

            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname, 'com.preloader.js'),
            devTools: false,

        }

    });

    about = new MicaBrowserWindow({

        width:560,
        height:550,
        frame: false,
        autoHideMenuBar: true, 
        show: false,
        minWidth:560,
        minHeight:550,
        maxWidth:560,
        maxHeight:550,
        x: 20,
        y: 20,
        icon: path.join(__dirname, '..', 'assx', 'img', 'logo.ico'),


        webPreferences:{

            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname, 'com.preloader.js')

        }

    })

    apx = new MicaBrowserWindow({

        width:955,
        height:585,
        frame: false,
        autoHideMenuBar: true, 
        show: false,
        minWidth:955,
        minHeight:535,
        icon: path.join(__dirname, '..', 'assx', 'img', 'logo.ico'),


        webPreferences:{

            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname, 'com.preloader.js')

        }

    })

    preload.setMicaAcrylicEffect();
    preload.setDarkTheme();
    preload.setRoundedCorner();
    preload.setBackgroundColor('rgba(0,0,0,.25)')

    apx.setBackgroundColor('rgba(0,0,0,.25)')
    apx.setMicaAcrylicEffect();
    apx.setDarkTheme();
    apx.setRoundedCorner();

    about.setBackgroundColor('rgba(0,0,0,.25)')
    about.setMicaAcrylicEffect();
    about.setDarkTheme();
    about.setRoundedCorner();


    apx.loadURL(`http://${hostname}:${port}`);
    preload.loadURL(`http://${hostname}:${port}/preload`);
    about.loadURL(`http://${hostname}:${port}/about`)
    preload.webContents.on('did-finish-load', () => { preload.show(); console.log(`com.dexly.apx policy has booted the app following local protocol in target: ${hostname}, local server mounted in ${port}`); runing = true })

}

app.whenReady().then(Mount);

ipcMain.on('preload:done', () => { preload.hide(); setTimeout(() => {apx.show(); apx.alwaysFocused(true);},600) });

ipcMain.on('apx:cls', () => {

    apx.close();

})

ipcMain.on('apx:min', () => {

    apx.minimize();

})

ipcMain.on('apx:max', () => {

    apx.hide();

    setTimeout(() => {

        if(apx.isMaximized()) {
            apx.restore();
            apx.webContents.send('apx:maxres');
        } else {
            apx.maximize();
            apx.webContents.send('apx:maxon');
        }

        setTimeout(() => {
            apx.show();
        }, 60);

    }, 100);

});

ipcMain.handle('clip:rule:shortdir', async (_, dirname) => {
    const parsedname = app.getPath(dirname);
    currentpath = parsedname;

    try {
        const entries = await rootagent.promises.readdir(parsedname, { withFileTypes: true });

            const dirdata = await Promise.all(entries.map(async entry => {
            const filledpath = path.join(parsedname, entry.name);
            const stats = rootagent.statSync(filledpath);

            let fileattrs = {};
            try {fileattrs = await getattrs(filledpath);} catch (error) {}

            return {
                name: entry.name,
                folder: entry.isDirectory(),
                size: stats.size,
                createdAt: stats.birthtime,
                modifiedAt: stats.mtime,
                acceded: stats.atime,
                attrs: fileattrs
            };
        }));

        return dirdata;

    } catch (error) {
        return { execute: false, details: error.message || error.toString() };
    }
    
});

ipcMain.handle('clip:rule:urldir', () => {

    return currentpath;

})

ipcMain.handle('clip:rule:readdir', async (_, route) => {
        currentpath = route;

    try {
        const entries = await rootagent.promises.readdir(route, { withFileTypes: true });

        const dirdata = await Promise.all(entries.map(async entry => {
            const filledpath = path.join(route, entry.name);

            let stats = {};
            try {
                stats = rootagent.statSync(filledpath);
            } catch (err) {
                return null; 
            }

            let fileattrs = {};
            try {
                fileattrs = await getattrs(filledpath);
            } catch (error) {}

            return {
                name: entry.name,
                folder: entry.isDirectory(),
                size: stats.size || 0,
                createdAt: stats.birthtime || null,
                modifiedAt: stats.mtime || null,
                acceded: stats.atime || null,
                attrs: fileattrs
            };
        }));

        return dirdata.filter(Boolean); 
    } catch (error) {
        console.log(error);
        return [];
    }
});

ipcMain.handle('clip:rule:openfile', async (_, route) => {

    shell.openPath(route);    
    
})

ipcMain.handle('clip:rule:view', async (_, route) => {
  try {
    const ext = path.extname(route).slice(1).toLowerCase();
    const allowedImageExts = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'];
    const allowedVideoExts = ['mp4', 'webm', 'ogg', 'ts'];
    if (allowedImageExts.includes(ext)) {
      const data = await rootagent.readFile(route);
      return `data:image/${ext};base64,${data.toString('base64')}`;
    } else if (allowedVideoExts.includes(ext)) {
      const outputPath = path.join(require('os').tmpdir(), `thumb_${Date.now()}.jpg`);
      await new Promise((resolve, reject) => {
        ffmpeg(route)
          .screenshots({
            timestamps: ['1'],
            filename: path.basename(outputPath),
            folder: path.dirname(outputPath),
            size: '320x240'
          })
          .on('end', resolve)
          .on('error', reject);
      });
      const buffer = await fs.readFile(outputPath);
      await fs.remove(outputPath);
      return 'data:image/jpeg;base64,' + buffer.toString('base64');
    } else {
      return null;
    }
  } catch {
    return '/assx/img/MIME/video.png';
  }
});

ipcMain.handle('clip:rule:checkpath', async(_, route) => {

    try {

        await rootagent.promises.readdir(route);
        return true

    } catch (error) {
        
        return false;

    }

})

ipcMain.handle('clip:rule:getdrives', () => currentdrives)

ipcMain.on('clip:rule:about', () => { about.show(); apx.minimize(); apx.alwaysFocused(false); });

ipcMain.on('clip:rule:closeabout', () => {

    about.hide();
    apx.show();
    apx.alwaysFocused(true)

})