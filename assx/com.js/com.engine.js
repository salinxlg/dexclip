import { dex, assoc } from './com.dexkit.js';

dex.load('/assx/com.css/com.config.css');
dex.load('/assx/com.css/com.fit.css');
dex.get.item('c', 'class').addEventListener('click', window.apxcontrols.apxcls);
dex.get.item('mx', 'class').addEventListener('click', window.apxcontrols.apxmax);
dex.get.item('mn', 'class').addEventListener('click', window.apxcontrols.apxmin);

//Tasks

let runned = false;
localStorage.removeItem('$USERMACHINE(LASTPATH)');

window.maxstate.maxon(() => {

    dex.get.item('Maximize', 'class').style.display = "none";
    dex.get.item('Restore', 'class').style.display = "block";

})


window.maxstate.maxres(() => {

    dex.get.item('Maximize', 'class').style.display = "block"
    dex.get.item('Restore', 'class').style.display = "none"

})

const resizer = document.querySelector('.resizer');
const sidebar = document.querySelector('.sidebar');
const content = document.querySelector('.content');

let isResizing = false;
const minWidth = 200;
const maxWidth = 250;

const savedWidth = localStorage.getItem('sidebar-width');
if (savedWidth) {
    sidebar.style.width = savedWidth + 'px';
    content.style.width = `calc(100% - ${savedWidth}px)`;
}

function startResize(e) {
    isResizing = true;
    document.body.classList.add('resizing');
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
    document.addEventListener('touchmove', resize);
    document.addEventListener('touchend', stopResize);
}

function resize(e) {
    if (!isResizing) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const newWidth = clientX;
    if (newWidth >= minWidth && newWidth <= maxWidth) {
        sidebar.style.width = newWidth + 'px';
            content.style.width = `calc(100% - ${newWidth}px)`;

    }
}

function stopResize() {
    if (isResizing) {
        isResizing = false;
        document.body.classList.remove('resizing');
        localStorage.setItem('sidebar-width', sidebar.offsetWidth);
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
        document.removeEventListener('touchmove', resize);
        document.removeEventListener('touchend', stopResize);
    }
}

resizer.addEventListener('mousedown', startResize);
resizer.addEventListener('touchstart', startResize, { passive: true });


dex.get.collection('.mainfolders child', 'tag').forEach((option, index) => {

    const shortdirmap = ["apx:home", 'desktop', 'downloads', 'documents', 'apx:oschub']
    option.addEventListener('click', () => { if(shortdirmap[index] != 'apx:home' && shortdirmap[index] != 'apx:oschub'){     dex.get.item('about', 'class').classList.remove('active') ;dex.get.item('directories', 'class').classList.remove('active'); dex.get.item('directories', 'class').classList.add('exit'); setTimeout(() => {RenderFiles(assoc.dexagent.shortdir(shortdirmap[index]));}, 300); setTimeout(() => {dex.get.item('directories', 'class').classList.remove('exit'); dex.get.item('directories', 'class').classList.add('active');    }, 600); if(runned == false){dex.new.transition('directories'); runned = true;}  }})
})


async function RenderFiles(Files) {
  RenderPath(await assoc.dexagent.getdir());
  const files = await Files;
  const mimemap = await dex.dexcom.get('/assx/com.js/com.mime.map.json');
  dex.get.item('filescontent', 'class').innerHTML = '';

  function naturalCompare(a, b) {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    const regex = /(\d+)|(\D+)/g;

    const chunksA = nameA.match(regex);
    const chunksB = nameB.match(regex);

    const len = Math.min(chunksA.length, chunksB.length);

    for (let i = 0; i < len; i++) {
      const chunkA = chunksA[i];
      const chunkB = chunksB[i];

      if (chunkA !== chunkB) {
        const numA = parseInt(chunkA, 10);
        const numB = parseInt(chunkB, 10);

        if (!isNaN(numA) && !isNaN(numB)) {
          if (numA !== numB) return numA - numB;
        } else {
          if (chunkA < chunkB) return -1;
          if (chunkA > chunkB) return 1;
        }
      }
    }

    return chunksA.length - chunksB.length;
  }

  files.sort((a, b) => {
    if (a.folder && !b.folder) return -1;
    if (!a.folder && b.folder) return 1;
    return naturalCompare(a, b);
  });

  for (const file of files) {
    if (file.attrs.hidden !== true) {
      const render = document.createElement('div');
      render.setAttribute('name', file.name);
      render.setAttribute('created-at', file.createdAt);
      render.setAttribute('modified-at', file.modifiedAt);
      render.setAttribute('size', file.size);
      render.setAttribute('folder', file.folder);
      render.setAttribute('attrs', JSON.stringify(file.attrs));
      render.setAttribute('acceded', file.acceded);
      render.setAttribute('class', 'child');

      const placeholder = document.createElement('mime');
      let mimedata = 'generic';

      if (file.folder) {
        mimedata = mimemap['folder'] || mimemap['generic'];
      } else {
        const filenameParts = file.name.split('.');
        const ext = filenameParts.pop().toLowerCase();
        const isPreviewable = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'mp4', 'webm', 'ogg', 'ts'].includes(ext);

        if (isPreviewable) {
          const fpath = `${localStorage.getItem('$USERMACHINE(PATH)')}\\${file.name}`;
          const view = await assoc.dexagent.getview(fpath);
          mimedata = view || mimemap[ext] || mimemap['generic'];
          placeholder.style.borderRadius = "5px"
        }else {
          mimedata = mimemap[ext] || mimemap['generic'];
        }
      }

      placeholder.style.backgroundImage = `url(${mimedata})`;

      const label = document.createElement('name');
      label.textContent = file.name;
      label.title = file.name;

      render.appendChild(placeholder);
      render.appendChild(label);

      dex.get.item('filescontent', 'class').appendChild(render);
    }
  }
  ReloadDir();
}

async function RenderPath(path) {
    path = path.replace(/\\\\/g, '\\');
    const Raw = dex.get.item('rawpath', 'class');
    const pretty = dex.get.item('prettypath', 'class');
    localStorage.setItem('$USERMACHINE(PATH)', path);
    Raw.value = path;

    const segment = path.split(/[\\/]/);

    const specialFolders = ['Desktop', 'Documents', 'Downloads'];
    let startIndex = 0;

    for (let i = 0; i < segment.length; i++) {
        if (specialFolders.includes(segment[i])) {
            startIndex = i;
            break;
        }
    }

    const displaySegments = segment.slice(startIndex);

    if (displaySegments.length > 0) {
        const first = displaySegments[0];
        if (first === 'Desktop') displaySegments[0] = 'Escritorio';
        else if (first === 'Documents') displaySegments[0] = 'Documentos';
        else if (first === 'Downloads') displaySegments[0] = 'Descargas';
    }

    const prettypath = displaySegments.join('<i class="fi fi-rr-angle-small-right"></i>');
    dex.get.item('SearchInFiles', 'class').setAttribute('placeholder', `Buscar en ${ displaySegments.pop() }`);
    dex.get.item('SearchInFiles', 'class').value = ""

    pretty.innerHTML = `<i class="fi fi-tr-screen"></i>  <i class="fi fi-rr-angle-small-right"></i> ${prettypath}`;
}

async function ReloadDir() {

    dex.get.collection('.filescontent .child', 'tag').forEach((child, index) => {

        child.ondblclick = async function(){

            const name = child.getAttribute('name');
            const folder = child.getAttribute('folder');
            const cpath = localStorage.getItem('$USERMACHINE(PATH)');
            const npath = `${cpath}\\${name}`;

            if(folder == 'true'){

                dex.get.item('directories', 'class').classList.remove('active'); dex.get.item('directories', 'class').classList.add('exit'); setTimeout(async () => {RenderFiles(await assoc.dexagent.readdir(npath))}, 300); setTimeout(() => {dex.get.item('directories', 'class').classList.remove('exit'); dex.get.item('directories', 'class').classList.add('active');}, 600); if(runned == false){dex.new.transition('directories'); runned = true;}
                RenderPath(npath)

            }else{

                assoc.dexagent.openfile(npath);

            }

        }

    })
    
}

dex.get.collection('.navigation i', 'tag').forEach((button, index) => {

  button.onclick = function(){

      if(index == 0){

          const cpath = localStorage.getItem('$USERMACHINE(PATH)');
          const segment = cpath.split(/[\\/]/);

          if(segment.length > 1){

            const last = segment.pop();
            last != '' ? localStorage.setItem('$USERMACHINE(LASTPATH)', last) : localStorage.setItem('$USERMACHINE(LASTPATH)', 'Users')

          }else{

            return

          }

          if(segment.length === 1 && segment[0] == 'C:'){

            segment[0] = `${segment[0]}\\`;

          }

          const npath = segment.join("\\");
          localStorage.setItem('$USERMACHINE(PATH)', npath);
          dex.get.item('directories', 'class').classList.remove('active'); dex.get.item('directories', 'class').classList.add('exit'); setTimeout(async () => {RenderFiles(await assoc.dexagent.readdir(npath))}, 300); setTimeout(() => {dex.get.item('directories', 'class').classList.remove('exit'); dex.get.item('directories', 'class').classList.add('active');}, 600); if(runned == false){dex.new.transition('directories'); runned = true;}


      }else if(index == 1){

        const last = localStorage.getItem('$USERMACHINE(LASTPATH)');
        if(last){

          const cpath = localStorage.getItem('$USERMACHINE(PATH)').split(/[\\/]/);
          cpath.push(last);
          const npath = cpath.join('\\');
          dex.get.item('directories', 'class').classList.remove('active'); dex.get.item('directories', 'class').classList.add('exit'); setTimeout(async () => {RenderFiles(await assoc.dexagent.readdir(npath))}, 300); setTimeout(() => {dex.get.item('directories', 'class').classList.remove('exit'); dex.get.item('directories', 'class').classList.add('active');}, 600); if(runned == false){dex.new.transition('directories'); runned = true;}
          localStorage.setItem('$USERMACHINE(PATH)', npath)
          localStorage.removeItem('$USERMACHINE(LASTPATH)')

        }


      }else if(index == 2){

        dex.get.item('directories', 'class').classList.remove('active'); dex.get.item('directories', 'class').classList.add('exit'); setTimeout(async () => {RenderFiles(await assoc.dexagent.readdir(localStorage.getItem('$USERMACHINE(PATH)')))}, 300); setTimeout(() => {dex.get.item('directories', 'class').classList.remove('exit'); dex.get.item('directories', 'class').classList.add('active');}, 600); if(runned == false){dex.new.transition('directories'); runned = true;}


      }

  }

})

dex.get.item('prettypath', 'class').addEventListener('click', () => {

  dex.get.item('prettypath', 'class').style.display = "none";
  dex.get.item('rawpath', 'class').style.display = "flex";
  dex.get.item('rawpath', 'class').focus();
  dex.get.item('rawpath', 'class').select()

})

dex.get.item('rawpath', 'class').addEventListener('focusout', () => {

  dex.get.item('prettypath', 'class').style.display = "flex";
  dex.get.item('rawpath', 'class').style.display = "none";

})

dex.get.item('rawpath', 'class').addEventListener('keydown', async(e) => {

  if(e.keyCode == 13){

     const check =  await assoc.dexagent.checkpath(dex.get.item('rawpath', 'class').value)
     if(check == true){

      if(dex.get.item('rawpath', 'class').value.toLowerCase() == 'c:' || dex.get.item('rawpath', 'class').value.toLowerCase() == 'c:/' || dex.get.item('rawpath', 'class').value.toLowerCase() == 'c:\\'){

         dex.get.item('directories', 'class').classList.remove('active'); dex.get.item('directories', 'class').classList.add('exit'); setTimeout(async () => {RenderFiles(await assoc.dexagent.readdir('C:\\'));localStorage.setItem('$USERMACHINE(PATH)', 'C:');}, 300); setTimeout(() => {dex.get.item('directories', 'class').classList.remove('exit'); dex.get.item('directories', 'class').classList.add('active');}, 600); if(runned == false){dex.new.transition('directories'); runned = true;}

      }else if(dex.get.item('rawpath', 'class').value.startsWith('http://') || dex.get.item('rawpath', 'class').value.startsWith('https://')){



      }else{

        dex.get.item('directories', 'class').classList.remove('active'); dex.get.item('directories', 'class').classList.add('exit'); setTimeout(async () => {RenderFiles(await assoc.dexagent.readdir(dex.get.item('rawpath', 'class').value))}, 300); setTimeout(() => {dex.get.item('directories', 'class').classList.remove('exit'); dex.get.item('directories', 'class').classList.add('active');}, 600); if(runned == false){dex.new.transition('directories'); runned = true;}

      }

    }else{}

    dex.get.item('rawpath', 'class').blur()

  }

})

const FilesSearchBar = dex.get.item('SearchInFiles', 'class');
FilesSearchBar.addEventListener('keyup', () => {
const value = FilesSearchBar.value.toLowerCase();

  if(FilesSearchBar.value.trim() !== ''){

    dex.get.collection('.filescontent .child', 'tag').forEach((file, index) => {

      file.style.display = "none";
      const key = file.getAttribute('name').toLowerCase();

      if(key != null){

        if(key.includes(value)){

          file.style.display = "flex";

        }

      }

    })

  }else{

 dex.get.collection('.filescontent .child', 'tag').forEach((file, index) => {

      file.style.display = "flex";

 })

  }

})

assoc.addEventListener('keydown', e=> {

  if(e.ctrlKey && e.keyCode == 70){
    
    e.preventDefault();
    FilesSearchBar.focus();

  }else if(e.keyCode == 27){

    FilesSearchBar.blur()

  }

})


assoc.dexagent.ondrivesupdated(drives => {

  const container = document.querySelector('.ExternalDisks');
  container.innerHTML = ''
  drives.forEach(drive => {

    if(drive.path != 'C:\\'){

      const preplabel = drive.removable == true ? `Disco extraible (${drive.path.split('\\')[0]})` : `Partición de disco (${drive.path.split('\\')[0]})`
      const prepicon = drive.removable == true ? 'fi fi-rr-usb-pendrive' : 'fi fi-rs-chart-pie-alt minicon';

      const child = document.createElement('child');
      child.setAttribute('path', drive.path)

      const corner = document.createElement('corner');
      child.appendChild(corner);

      const icon = document.createElement('i');
      icon.setAttribute('class', prepicon);
      child.appendChild(icon);

      const label = document.createElement('t');
      label.innerHTML = preplabel
      child.appendChild(label);

      container.appendChild(child)

      UpdateDisks();

    }

  })
})

function UpdateDisks(){

  dex.get.collection('.ExternalDisks child', 'tag').forEach((disk, index) => {

    disk.onclick = async function(){

      const path = disk.getAttribute('path');
      dex.get.item('directories', 'class').classList.remove('active'); dex.get.item('directories', 'class').classList.add('exit'); setTimeout(async () => {RenderFiles(await assoc.dexagent.readdir(path))}, 300); setTimeout(() => {dex.get.item('directories', 'class').classList.remove('exit'); dex.get.item('directories', 'class').classList.add('active');}, 600); if(runned == false){dex.new.transition('directories'); runned = true;}


    }

  })

}

dex.get.item('LocalDisk', 'class').addEventListener('click', SeeDisk)

function SeeDisk(){

    dex.get.item('about', 'class').classList.remove('active');dex.get.item('directories', 'class').classList.remove('active'); dex.get.item('directories', 'class').classList.add('exit'); setTimeout(async () => {RenderFiles(await assoc.dexagent.readdir('C:\\'))}, 300); setTimeout(() => {dex.get.item('directories', 'class').classList.remove('exit'); dex.get.item('directories', 'class').classList.add('active');}, 600); if(runned == false){dex.new.transition('directories'); runned = true;}

}

dex.get.item('AboutDex', 'class').addEventListener('click', function(){

  dex.new.transition('about')

})

/*window.addEventListener('dblclick', function(){

  assoc.dexagent.showabout();

})*/

