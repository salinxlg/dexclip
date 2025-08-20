window.DexInstance = {
    name: "Dexkit Instance", //Puedes establecer un nombre para esta instancia.
    rootName: "com.engine.js",   //Nombre del archivo principal de la aplicación.
    rootPath: "/assx/com.js/", //Solo se requiere la ubicación relativa, no es necesario mencionar el nombre del archivo.
    debbug: false, //Muestra información útil sobre procesos y errores en la consola, se debe desactivar al terminar el desarrollo.
    drc: true,
    taskman: true
};

(async () => {
  const { dex } = await import(`./com.dexkit.js?v=${Math.random()}`);
  const NewUrl = `${window.DexInstance.rootPath}${window.DexInstance.rootName}`;
  dex.load(NewUrl, { module: true });
})();



