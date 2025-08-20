const kit = window;
const base = kit.location;
const kitdoc = document;
const Inst = window.DexInstance;
export const assoc = kit;
export const appx = kit;
const debugg = Inst.debbug;
export let printstatus = undefined;

export class dex{

    static depuration(message){if(debugg && debugg == true){ console.log(message); console.log( {execute:true, type:"depuration", message: message, time: `${new Date().getHours().toString().padStart(2, "0")}:${new Date().getMinutes().toString().padStart(2, "0")}:${new Date().getSeconds().toString().padStart(2, "0")}`, date: `${new Date().getDate().toString().padStart(2, "0")}/${(new Date().getMonth() + 1).toString().padStart(2, "0")}/${new Date().getFullYear()}`}); return {execute:true, type:"depuration message", message: message, time: `${new Date().getHours().toString().padStart(2, "0")}:${new Date().getMinutes().toString().padStart(2, "0")}:${new Date().getSeconds().toString().padStart(2, "0")}`, date: `${new Date().getDate().toString().padStart(2, "0")}/${(new Date().getMonth() + 1).toString().padStart(2, "0")}/${new Date().getFullYear()}`} }}
    static message(message){ console.log(`${message}`); console.log( {execute:true, type:"log", message: message, time: `${new Date().getHours().toString().padStart(2, "0")}:${new Date().getMinutes().toString().padStart(2, "0")}:${new Date().getSeconds().toString().padStart(2, "0")}`, date: `${new Date().getDate().toString().padStart(2, "0")}/${(new Date().getMonth() + 1).toString().padStart(2, "0")}/${new Date().getFullYear()}`})};
    static error(error){ console.error(`${error}`); console.log( {execute:true, type:"error", message: error, time: `${new Date().getHours().toString().padStart(2, "0")}:${new Date().getMinutes().toString().padStart(2, "0")}:${new Date().getSeconds().toString().padStart(2, "0")}`, date: `${new Date().getDate().toString().padStart(2, "0")}/${(new Date().getMonth() + 1).toString().padStart(2, "0")}/${new Date().getFullYear()}`})};
    static warn(warn){ console.warn(`${warn}`); console.log( {execute:true, type:"warning", message: warn, time: `${new Date().getHours().toString().padStart(2, "0")}:${new Date().getMinutes().toString().padStart(2, "0")}:${new Date().getSeconds().toString().padStart(2, "0")}`, date: `${new Date().getDate().toString().padStart(2, "0")}/${(new Date().getMonth() + 1).toString().padStart(2, "0")}/${new Date().getFullYear()}`})};
    static console = { clear(){ console.clear(); } }

    static dexcom = {

        currentchannels: {},

        channel: {

            build(name){

                if(!name){ dex.error("Se requiere un nombre para montar el canal."); return};
                if(!dex.dexcom.currentchannels[name]){

                    dex.dexcom.currentchannels[name] = new BroadcastChannel(name);
                    dex.depuration(`El canal ${name} se ha montado con éxito`);

                }else{

                    dex.error(`El canal ${name} ya fue montado ejecuta: dex.dexcom.channel.post() para enviar un mensaje.`)

                }

            },

            post(channel, data){

                if(!dex.dexcom.currentchannels[channel]){ dex.error(`El canal ${channel} aún no fue montado, ejecuta dex.dexcom.channel.build() para crear uno.`); return; }
                dex.dexcom.currentchannels[channel].postMessage(data);
                dex.depuration(`Se envió el mensaje ${data} a otras ventanas usando el canal ${channel}`);

            },

            listen(name, callback){

                if(!dex.dexcom.currentchannels[name]){ dex.error(`El canal ${name} aún no fue montado, ejecuta dex.dexcom.channel.build() para crear uno.`); return; }
                dex.dexcom.currentchannels[name].onmessage = (e) => callback(e.data);
                dex.depuration(`Se recibió un mensaje mediante el canal ${name}`);

            },

            close(name){

                if(dex.dexcom.currentchannels[name]){dex.dexcom.currentchannels[name].close();delete dex.dexcom.currentchannels[name];dex.depuration(`El canal ${name} fue cerrado.`);}else{dex.error(`No se encontró el canal ${name} para cerrar.`);}

            }


        },

        push(target, method, headers, content){

            let header = {};

            const defaultheader = { "content-type": "application/x-www-form-urlencoded"};

            headers == "default" ? header = defaultheader : header = headers;

            const FetchPromise = new Promise((resolve, reject) => {

               fetch(target, {
                    method: method,
                    headers: header,
                    body: content
                })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
                    }
                    return res.json();
                })
                .then(res => {
                    resolve(res);
                })
                .catch(error => {
                    dex.error(`Ocurrió un problema al conectar con el servidor. Detalle: ${error.message}`);
                    reject(error);
                });


            })

            return FetchPromise;

        },

        get(target){

            const FetchPromise = new Promise((resolve, reject) => {

                fetch(target)
                    .then(res => res.json())
                    .then(res => resolve(res))
                    .catch((error) => reject(error))

            })

            return FetchPromise;

        },



    }

    static get = {

        api: {

            name: "Dexly Developer dexkit",
            shortName: "Dexly dexkit",
            prefix: "dex",
            processor: "Nexylons Processor",
            serie: "X",
            model: "X8-20U5G4",
            manufacturer: "dexly LLC",
            version: "7.1.0",
            cores: "4",
            architecture: "x64 ARM (64 Bits)",
            runingOn: window.location.href,
            protocol: "bootx.drm",
            gen: "12",
            frecuency: "3.00GHz",
            completeName: "12th Gen dexly(R) X(TM) X8-20U5G4 @ 3.00GHz  2.90 GHz",
            defaultSlot: window.location.href+"Nexylons_HKEY_CLASSES_ROOT/DRM.flx",
            kernel: "flexsync-dexkit-5.15.0-67-pro",
            developer: "Alejandro Salinas",
            engineType: "WebRun",

            all(){

                console.table(dex.get.api);
                return dex.get.api;

            }

        },

        item(tag, selector){

            if(!selector || !["class", "id"].includes(selector)){ dex.error('Es necesario especificar el selector, estos son los parámetros permitidos: {class, id}.'); return [] }

            if(selector == "class"){

                try {
                    
                    const item = document.querySelector(`.${tag}`);
                    item.classList;
                    return item;

                } catch (error) {
                    
                    dex.error(`No se econtró el elemento con clase: ${tag} dentro del DOM, revisa la información e inténtalo de nuevo.`)

                }

            }else if(selector == "id"){

                try {
                    
                    const item = document.querySelector(`#${tag}`);
                    item.setAttribute('','')
                    return item;

                } catch (error) {
                    
                    dex.error(`No se econtró el elemento con ID: ${tag} dentro del DOM, revisa la información e inténtalo de nuevo.`)

                }

            }

        },

        collection(tag, selector){

            if(!selector || !["class", "id", "tag"].includes(selector)){ dex.error('Es necesario especificar el selector, estos son los parámetros permitidos: {class, id, tag}.'); return [] }

            let query;
            const elements = [];

            if(selector == "class"){query = `.${tag}`;}else if(selector == "id"){query = `#${tag}`;}else if(selector == "tag"){query = `${tag}`;}

            const driver = document.querySelectorAll(query);

            driver.forEach((item) => {

                elements.push(item);

            })

            elements.length < 2 ? dex.depuration(`Se retornó ${elements.length} item con selector: ${tag}`) : dex.depuration(`Se retornaron ${elements.length} items con selector: ${tag}`);

            
            if(elements.length == 0){ dex.warn(`No se encontraron elementos con el selector ${tag} en el DOM.`); return[]}else{return elements;}

        },

        battery(callback) {

            let last = { level: null, charging: null };
            let isMonitoring = false;

            const updateBattery = () => {

                if (isMonitoring) return;
                isMonitoring = true;

                navigator.getBattery().then(driver => {

                    const battery = {
                        chargeState: driver.charging,
                        level: `${Math.round(driver.level * 100)}%`
                    };

                    if (battery.level !== last.level || battery.chargeState !== last.charging) {
                        last = { level: battery.level, charging: battery.chargeState };
                        if (typeof callback === "function") callback(battery);
                    }

                    isMonitoring = false;

                }).catch(() => {
                    isMonitoring = false;
                    dex.error("No se pudo obtener información de la batería.");
                });

        };

        updateBattery();
        setInterval(updateBattery, 1000);

        },  

        connection(callback) {

            let lastState = null;
            let isChecking = false;

            const checkConnection = () => {

                if (isChecking) return;

                isChecking = true;
                const code = dex.craft.rand(64, 'mix');

                dex.dexcom.get(`https://api.dexly.space/ping/?token=${code}`).then(res => {
                    const currentState = res.event === true && res.return === code;

                    if (currentState !== lastState) {
                        lastState = currentState;
                        if (typeof callback === "function") callback(currentState);
                    }

                }).catch(() => {
                    if (lastState !== false) {
                        lastState = false;
                        if (typeof callback === "function") callback(false);
                    }
                }).finally(() => {
                    isChecking = false;
                });

    };

    checkConnection();
    setInterval(checkConnection, 1000); 

        },

        platform() {
        const ua = navigator.userAgent || navigator.vendor || window.opera;
        const plt = navigator.platform.toLowerCase();

        let os = 'Unknown';
        let type = 'Unknown';

        if (/windows phone/i.test(ua)) os = 'Windows Phone';
        else if (/windows nt/i.test(ua)) os = 'Windows';
        else if (/android/i.test(ua)) os = 'Android';
        else if (/ipad|iphone|ipod/i.test(ua)) os = 'iOS';
        else if (/macintosh|macintel|macppc|mac68k/i.test(ua)) os = 'macOS';
        else if (/linux/i.test(ua)) os = 'Linux';
        else if (/cros/i.test(ua)) os = 'ChromeOS';

        if (/mobile/i.test(ua)) {
          type = 'Phone';
        } else if (/tablet|ipad/i.test(ua)) {
          type = 'Tablet';
        } else if (/smarttv|hbbtv|appletv|googletv|netcast|viera|boxee/i.test(ua)) {
          type = 'SmartTV';
        } else if (/playstation|xbox|nintendo/i.test(ua)) {
          type = 'Console';
        } else if (/bot|crawler|spider|crawling/i.test(ua)) {
          type = 'Bot';
        } else if (/macintosh|windows|linux|cros/i.test(ua)) {
          const width = screen.width;
          const height = screen.height;
          if (width <= 1366 && height <= 768) type = 'Laptop';
          else type = 'Desktop';
        }

        let browser = 'Unknown';
        if (/chrome|crios/i.test(ua)) browser = 'Chrome';
        else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
        else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) browser = 'Safari';
        else if (/edg/i.test(ua)) browser = 'Edge';
        else if (/opera|opr/i.test(ua)) browser = 'Opera';
        else if (/msie|trident/i.test(ua)) browser = 'Internet Explorer';

        let arch = 'Unknown';
        if (navigator.userAgentData && navigator.userAgentData.architecture) {
          arch = navigator.userAgentData.architecture;
        } else if (ua.includes('WOW64') || ua.includes('Win64') || ua.includes('x86_64') || ua.includes('x64')) {
          arch = '64-bit';
        } else if (ua.includes('i686') || ua.includes('x86')) {
          arch = '32-bit';
        }

        const resolution = `${screen.width}x${screen.height}`;
        const pixelRatio = window.devicePixelRatio || 1;

        let orientation = 'Unknown';
        if (screen.orientation && screen.orientation.type) {
          orientation = screen.orientation.type.includes('landscape') ? 'landscape' : 'portrait';
        } else {
          orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        }

        const language = navigator.language || 'Unknown';
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
        const supportsSW = 'serviceWorker' in navigator;



        return {
          os,
          type,
          browser,
          arch,
          resolution,
          pixelRatio,
          orientation,
          language,
          isTouch,
          prefersDarkMode: prefersDark,
          isPWA,
          supportsServiceWorker: supportsSW,
          platform: navigator.platform
        };
        },

        screen() {

            return {
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            screenWidth: screen.width,
            screenHeight: screen.height,
            screenAvailWidth: screen.availWidth,
            screenAvailHeight: screen.availHeight,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth,
            touchSupported: navigator.maxTouchPoints > 0,
            touchPoints: navigator.maxTouchPoints,

            }
        },    

        time(format, seconds, direct){

            const data = new Date();
            const h = format == "H" ? data.getHours().toString().padStart(2, '0') : (data.getHours() - 12).toString().padStart(2, '0') ;
            const m = (data.getMinutes()).toString().padStart(2, 0);
            const s = seconds == true ? `:${ (data.getSeconds()).toString().padStart(2, 0) }` : '';
            let p;

            data.getHours() > 11 ? p = "PM" : p = "AM";

            return {

                now: `${ h != "00" ? h : '12' }:${m}${s} ${ format == "H" ? '' : p }`.trim(),
                hour: h != "00" ? h : '12',
                minute: m,
                second: s,
                period: p,

            }

        },

        date(param, lang, delimiter){

            const data = new Date();
            const date = data.getDate().toString().padStart(2, '0');
            const intmonth = ( data.getMonth() );
            const year = data.getFullYear();
            const Months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            const EnMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const Days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
            const EnDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const day = data.getDay();
            let returnthis;

            if(param == "short"){

                let string;

                if(lang == "es"){ string = `${ date }${ delimiter != undefined && delimiter.trim() !== '' ? delimiter : '/' }${ (intmonth + 1).toString().padStart(2, '0') }${ delimiter != undefined ? delimiter : '/' }${ year }` }else if(lang == "en"){ string = `${ (intmonth + 1).toString().padStart(2, '0') }${ delimiter != undefined ? delimiter : '/' }${ date }${ delimiter != undefined ? delimiter : '/' }${ year }` }else{ string = `${ date }${ delimiter != undefined && delimiter.trim() !== '' ? delimiter : '/' }${ (intmonth + 1).toString().padStart(2, '0') }${ delimiter != undefined ? delimiter : '/' }${ year }` }

                returnthis = string;

            }else if(param == "iso"){

                returnthis = `${ year }-${ (intmonth + 1).toString().padStart(2, '0') }-${date}`
                
            }else{

                returnthis = lang == "en" ? `${ EnDays[day] }, ${ EnMonths[intmonth] } ${ date }, ${ year }` : `${Days[day]} ${date} de ${Months[intmonth]} de ${year}`;

            }

            return returnthis;

        },

        fulltime(){

            return `${dex.get.date()} ${dex.get.time().now}`

        },

        urlParam(param, rule, value) {
            const url = new URL(kit.location.href);
            const params = url.searchParams;

            let data;

            if (rule === 'set') {
                params.set(param, value);
                data = { query: param, value: value };
                dex.depuration({ query: param, value: value })
                const newUrl = `${url.origin}${url.pathname}?${params.toString()}`;
                kit.history.replaceState({}, '', newUrl);

            } else if (rule === 'remove') {
                if (params.has(param)) {
                    params.delete(param);
                    data = true;

                    const newUrl = `${url.origin}${url.pathname}?${params.toString()}`;
                    kit.history.replaceState({}, '', newUrl);

                } else {
                    data = false;
                }

            } else if(rule === 'get') {
                data = params.get(param);
            }

            return data ? data : false;
        },

        dexserial(param){

          const serial = JSON.parse(localStorage.getItem('DexServiceTag'));

        }

    }

    static new = {

        transition(target){
        const Pages = document.querySelectorAll('.Page');
        let Current = document.querySelector('.Page.active');
        if(document.querySelector(`.${target}`) === Current) return

          Current.classList.remove('active');
          Current.classList.add('exit');

          setTimeout(() => {
          Current.classList.remove('exit');
          Current = document.querySelector(`.${target}`);
          Current.classList.add('active');

          }, 300)


        },

        run(FunctionName){

            window[FunctionName]();

        },

        async pdf({ selector = '.PrintPage', filename = 'com.print.pdf', scale = 2, toast = true } = {}) {
        await dex.load('https://api.dexly.space/dex/vendor/com.dexprint.renderer.js', { type:'script', cache: true })
        await dex.load('https://api.dexly.space/dex/vendor/com.dexprint.issuer.js', { type:'script', cache: true })
        const { PDFDocument } = PDFLib;
        if(toast == true){DexPdfToast.show();}
        await document.fonts.ready;
        await new Promise(r => setTimeout(r, 100));
        const ContainerElements = document.querySelectorAll(selector);
        if (ContainerElements.length === 0) {
            DexPdfToast.hide();
            throw new Error('No elements found for selector');
        }
        const PdfDoc = await PDFLib.PDFDocument.create();
        const Total = ContainerElements.length;
        let Count = 0;

        for (const ContainerElement of ContainerElements) {
            const Base64Image = await dex.new.screenshot(ContainerElement, scale);
            const ImageBytes = dex.new.base64(Base64Image);
            const Image = await PdfDoc.embedPng(ImageBytes);
            const Page = PdfDoc.addPage([Image.width, Image.height]);
            Page.drawImage(Image, { x: 0, y: 0, width: Image.width, height: Image.height });
            Count++;
            const Percent = Math.round((Count / Total) * 100);
            DexPdfToast.updateProgress(Percent);
        }

        const PdfBytes = await PdfDoc.save();
        const BlobPdf = new Blob([PdfBytes], { type: 'application/pdf' });
        const UrlPdf = URL.createObjectURL(BlobPdf);

        DexPdfToast.setDownloadUrl(UrlPdf, filename, toast);

        },

        async screenshot(Container, scale) {
        await dex.load('https://api.dexly.space/dex/vendor/com.dexprint.renderer.js', { type:'script', cache: true })
        await dex.load('https://api.dexly.space/dex/vendor/com.dexprint.issuer.js', { type:'script', cache: true })

            const Wrapper = Container.closest('.PrintWrapper');
            if (Wrapper) Wrapper.style.transform = 'none';
            const Canvas = await html2canvas(Container, { scale: scale, useCORS: true });
            if (Wrapper) Wrapper.style.transform = '';
            return Canvas.toDataURL('image/png');
        },

        base64(Base64) {
            const Raw = atob(Base64.split(',')[1]);
            const Uint8ArrayResult = new Uint8Array(Raw.length);
            for (let i = 0; i < Raw.length; i++) {
            Uint8ArrayResult[i] = Raw.charCodeAt(i);
            }
            return Uint8ArrayResult;
        },

        link(url, target){

          const link = document.createElement('a');
          link.href = url;
          target == 'self'? link.setAttribute('target','_self') : link.setAttribute('target','_blank');
          link.click()

        },

        rand(Length, Type, SaveOn, SaveKeyName){

            const KeyType = Type.toLowerCase();
            let Key = '';

            if(KeyType == "int"){

                for(let Aument = 0; Aument < Length; Aument++){
                    
                    const Random = Math.floor( Math.random() * 10 );
                    Key += Random

                }

                console.log(Key)

            }else if(KeyType == "alpha"){

                for(let Aument = 0; Aument < Length; Aument++){

                    const Random = Math.floor( Math.random() * 26 );
                    const Map = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ];
                    Key += Map[Random]

                }

                console.log(Key)

            }else if(KeyType == "mix"){

                for(let Aument = 0; Aument < Length; Aument++){
            
                    const Random = Math.floor( Math.random() * 10 );
                    Key += Random;
            
                }
            
                const String = Key;
                const Match = String.match(/0/g);
                const TotalMatched = Match ? Match.length : 0;
            
                const Letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
            
            
                for(let Aument = 0; Aument < TotalMatched; Aument++){
            
                    const Replace = Key.replace("0", Letters[ Math.floor( Math.random() * 26 ) ]);
                    Key = Replace;
            
                }
            
            

            }

            if(SaveOn == true && SaveOn == !true || SaveOn == !null){

                localStorage.setItem(SaveKeyName, Key);
                return Key

            }else{

                return Key;

            }

        },

        async hash(data){

          const encoder = new TextEncoder();
          const content = encoder.encode(data);
          const buffer = await crypto.subtle.digest('SHA-256', content);
          const raw = Array.from( new Uint8Array(buffer) );
          const hash = raw.map(byte => byte.toString(16).padStart(2,'0')).join('');

          return hash;

        },
        
        async signature(data){

          const encoder = new TextEncoder();
          const content = encoder.encode(data);
          const buffer = await crypto.subtle.digest('SHA-256', content);
          const raw = Array.from( new Uint8Array(buffer) );
          const hash = raw.map(byte => byte.toString(16).padStart(2,'0').toUpperCase()).join(':');

          return hash;

        }

    }

    static load(src, opts = {}) {
    const isURL = src.startsWith('http') || src.startsWith('//');
    const extension = src.split('.').pop().split('?')[0];
    const noCacheTypes = ['css-inline'];
    const url = opts.cache ? noCacheTypes.includes(opts.type) ? src : src : noCacheTypes.includes(opts.type) ? src : src + '?v=' + Math.random();
    const type = opts.type || (extension === 'css' ? 'style' : extension === 'js' ? 'script' : '');

    return new Promise((resolve, reject) => {
      if (type === 'style') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        link.onload = () => resolve();
        link.onerror = e => reject(e);
        document.head.appendChild(link);
      } else if (type === 'script') {
        const script = document.createElement('script');
        script.src = url;
        if (opts.defer) script.defer = true;
        if (opts.async) script.async = true;
        script.type = opts.module ? 'module' : 'text/javascript';
        script.onload = () => resolve();
        script.onerror = e => reject(e);
        document.head.appendChild(script);
      } else if (type === 'font') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.type = 'text/css';
        link.onload = () => resolve();
        link.onerror = e => reject(e);
        document.head.appendChild(link);
      } else if (type === 'image') {
        const img = document.createElement('img');
        img.src = url;
        if (opts.target) {
          const target = document.querySelector(opts.target);
          if (target) target.appendChild(img);
        }
        img.onload = () => resolve();
        img.onerror = e => reject(e);
      } else if (type === 'audio') {
        const audio = document.createElement('audio');
        audio.src = url;
        if (opts.autoplay) audio.autoplay = true;
        if (opts.controls) audio.controls = true;
        if (opts.target) {
          const target = document.querySelector(opts.target);
          if (target) target.appendChild(audio);
        }
        audio.onloadeddata = () => resolve();
        audio.onerror = e => reject(e);
      } else if (type === 'html') {
        fetch(url)
          .then(r => r.text())
          .then(html => {
            if (opts.target) {
              const target = document.querySelector(opts.target);
              if (target) target.innerHTML = html;
            }
            resolve(html);
          }).catch(reject);
      } else if (type === 'json') {
        fetch(url).then(r => r.json()).then(resolve).catch(reject);
      } else if (type === 'css-inline') {
        const style = document.createElement('style');
        style.textContent = src;
        document.head.appendChild(style);
        resolve();
      } else if (type === 'svg') {
        fetch(url)
          .then(r => r.text())
          .then(svg => {
            if (opts.target) {
              const target = document.querySelector(opts.target);
              if (target) target.innerHTML = svg;
            }
            resolve(svg);
          }).catch(reject);
      } else if (type === 'favicon') {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = url;
        document.head.appendChild(link);
        resolve();
      } else if (type === 'manifest') {
        const link = document.createElement('link');
        link.rel = 'manifest';
        link.href = url;
        document.head.appendChild(link);
        resolve();
      } else {
        reject(new Error('Unsupported type'));
      }
    });
    }

    static loadMap(arr) {
        return Promise.all(arr.map(([src, opts]) => this.load(src, opts)));
    }
}

dex.load('https://api.dexly.space/dex/vendor/com.dex.utilsman.css');



const GetTaps = Array.from( document.getElementsByTagName('tap') );

const TransitionContent = `
.Page {
  /*position: absolute;*/
  opacity: 0;
  transform: scale(1.05);
  transition: opacity 0.4s ease, transform 0.4s ease;
  z-index: 0;
}

.Page.active {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
  z-index: 1;
}

.Page.exit {
  opacity: 0;
  transform: scale(0.95);
  pointer-events: none;
  z-index: 0;
}
`;

const TransitionDriver = document.createElement('style');
TransitionDriver.innerHTML = TransitionContent;
document.head.appendChild(TransitionDriver);

class TapIDCode{

    constructor(index, encoder){

        if(encoder == "default"){

            let numeric = "";

            for(let aument = 0; aument < 5; aument++){

                const random = Math.floor( Math.random() * 10 );

                numeric += random;

            }

            this.result = `DX-${index + 1}${numeric}`;

        }

    }

}

export const tapengine = GetTaps.forEach((tap, index) => {

    tap.setAttribute('event-license', new TapIDCode(index, "default").result);
     let attrcollection = {};

    for(let attr of tap.attributes){

        attrcollection[attr.name] = attr.value;

    }

    tap.addEventListener('click', (eventscatcher) => {

        if(attrcollection.action == ":open"){

            const target = attrcollection.target;
            const link = document.createElement('a');
            link.href = target;

            if(attrcollection.type == "extlink"){ link.target = "_blank" }

            link.click();

        }else if(attrcollection.action == ":self"){

            if(attrcollection.type == "transition"){

                const Pages = document.querySelectorAll('.Page');
                let Current = document.querySelector('.Page.active');
                const target = attrcollection.target;
                if(document.querySelector(`.${target}`) === Current) return

                    Current.classList.remove('active');
                    Current.classList.add('exit');

                    setTimeout(() => {
                    Current.classList.remove('exit');
                    Current = document.querySelector(`.${target}`);
                    Current.classList.add('active');

                }, 400)


                

            }else if(attrcollection.type == "action"){

                const param = attrcollection.target;
                window[attrcollection.target](param);

            }

        }

    })

})

kit.dex = dex;

setTimeout(() => {
    
    if (!window._dexkitLoaded) {
    (async () => {
  if (!localStorage.getItem('DexServiceTag')) {
    const pretag = {
      code: dex.new.rand(15, 'mix'),
      date: dex.get.date('short'),
      os: dex.get.platform().os,
      expires: 'never',
    };

    const signaturecontent = JSON.stringify(pretag);

    console.log(signaturecontent)

    try {
      const signature = await dex.new.signature(signaturecontent);

      const tag = {
        code: dex.new.rand(15, 'mix'),
        date: dex.get.date('short'),
        os: dex.get.platform().os,
        expires: 'never',
        signature: signature
      };

      localStorage.setItem('DexServiceTag', JSON.stringify(tag));
      console.log('Etiqueta guardada con firma:', tag);

    } catch (error) {
      console.error('Error generando la firma:', error);
    }
  }
    })();
    window._dexkitLoaded = true;
    const ev = new CustomEvent('dexloaded', { detail: {state:200} });
    window.dispatchEvent(ev);
    }


},100);


const DexPdfToast = (() => {
  let ToastElement;
  let ProgressBarFill;
  let DownloadButton;
  let DownloadUrl;

  function createToast() {
    if (ToastElement) return;

    ToastElement = document.createElement('div');
    ToastElement.setAttribute('class', 'DexPrintToast');
    ToastElement.innerHTML = `
      <icon> <cc></cc> </icon>
      <t class="FileName">Póliza de Dexly Store</t>
      <div class="Status">
        
        <i class="fi fi-rr-qr-scan PrintToastScan"></i>
        <i class="fi fi-rs-check-circle PrintToastCheck" style="display: none;"></i> 
        <t class="TextStatus">Escaneando documento</t>

      </div>
      <div class="progressBar"><div></div></div>
      <i class="fi fi-sr-progress-download downloadBtn"></i>
    `;
    document.body.appendChild(ToastElement);

    ProgressBarFill = ToastElement.querySelector('.progressBar > div');
    DownloadButton = ToastElement.querySelector('.downloadBtn');


  }

  function show() {
    createToast();
    ToastElement.style.display = 'flex';
    updateProgress(0);
    DownloadButton.style.display = 'none';
    ToastElement.querySelector('.TextStatus').textContent = 'Escaneando documento';
    dex.get.item('PrintToastScan', 'class').style.display = "flex";
    dex.get.item('PrintToastCheck', 'class').style.display = "none";
    ToastElement.querySelector('.TextStatus').style.color = '#FFFFFF';
    ToastElement.querySelector('.TextStatus').style.color = "#9b9b9b";
    ToastElement.querySelector('.progressBar').style.display = "flex";
  }

  function updateProgress(percent) {
    if (ProgressBarFill) {
      ProgressBarFill.style.width = `${percent}%`;
      printstatus = percent;
    }
  }

  function setDownloadUrl(url, fileName) {
    DownloadUrl = url;
    DownloadButton.style.display = 'flex';
    dex.get.item('PrintToastScan', 'class').style.display = "none";
    dex.get.item('PrintToastCheck', 'class').style.display = "flex";
    dex.get.item('PrintToastCheck', 'class').style.color = "#1ED791"
    ToastElement.querySelector('.TextStatus').textContent = 'Listo';
    ToastElement.querySelector('.TextStatus').style.color = "#1ED791";
    ToastElement.querySelector('.progressBar').style.display = "none"
        DownloadButton.addEventListener('click', () => {
      if (DownloadUrl) {
        const a = document.createElement('a');
        a.href = DownloadUrl;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(DownloadUrl);
        hide();
      }
    });
  }

  function hide() {
    if (ToastElement) {
      ToastElement.classList.add('RemovingDexPrintToast');
      setTimeout(() => {
       
        ToastElement.style.display = 'none';
        ToastElement.classList.remove('RemovingDexPrintToast');


      }, 300);
      if (DownloadUrl) {
        URL.revokeObjectURL(DownloadUrl);
        DownloadUrl = null;
      }
    }
  }

  return {
    show,
    updateProgress,
    setDownloadUrl,
    hide
  };
})();





