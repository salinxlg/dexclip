const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('preloader', {

    done: () => ipcRenderer.send('preload:done')

});

contextBridge.exposeInMainWorld('apxcontrols', {

    apxmin: () => ipcRenderer.send('apx:min'),
    apxmax: () => ipcRenderer.send('apx:max'),
    apxcls: () => ipcRenderer.send('apx:cls')

})

contextBridge.exposeInMainWorld('maxstate', {

    maxon: (callback) => ipcRenderer.on('apx:maxon', callback),
    maxres: (callback) => ipcRenderer.on('apx:maxres', callback),

})

contextBridge.exposeInMainWorld('dexagent', {

    shortdir: (dirname) => ipcRenderer.invoke('clip:rule:shortdir', dirname),
    getdir: () => ipcRenderer.invoke('clip:rule:urldir'),
    readdir: (route) => ipcRenderer.invoke('clip:rule:readdir', route),
    openfile: (route) => ipcRenderer.invoke('clip:rule:openfile', route),
    getview: (route) => ipcRenderer.invoke('clip:rule:view', route),
    checkpath: (route) => ipcRenderer.invoke('clip:rule:checkpath', route),
    ondrivesupdated: (callback) => ipcRenderer.on('drives:updated', (e, data) => callback(data)),
    getdrives: () => ipcRenderer.invoke('clip:rule:getdrives'),
    showabout: () => ipcRenderer.send('clip:rule:about'),
    hideabout: () => ipcRenderer.send('clip:rule:closeabout'),

})

contextBridge.exposeInMainWorld('apx', {

    mode: 'com.dex.platform',
    version: '7.1.0',
    developer: 'Alejandro Salinas',
    vendor: 'Dexly LLC',
    build: '2025.08.11',
    dexagent: 'com.dex.dexagent -v 7.1.0, -cxi true, Dexly LLC',
    platform: process.platform,
    electronversion: process.versions.electron,
    nodeversion: process.versions.node,
    engine: process.versions.electron,
    state: 200,
    engine:{

    name: "Nexylons Processor",
    serie: "X",
    model: "X8-20U5G4",
    manufacturer: "Dexly LLC",
    version: "198.195.2024",
    cores: "4",
    architecture: "x64 ARM (64 Bits)",
    protocol: "bootx.drm",
    gen: "12",
    frecuency: "3.00GHz",
    completeName: "12th Gen DevLabs(R) X(TM) X8-20U5G4 @ 3.00GHz  2.90 GHz",
    defaultSlot: "X-TPS:Nexylons_HKEY_CLASSES_ROOT/DRM.flx",
    kernel: "flexsync-5.15.0-67-generic",
    developer: "Alejandro Salinas",
    year: new Date().getFullYear(),
    engineType: "com.dex.platform",

},

})