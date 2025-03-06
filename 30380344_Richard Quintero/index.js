console.log("Bienvenido a IPTracker");

// API de https://www.ipify.org/
const URL_API_IP = "https://api.ipify.org/?format=json";

// APIs de https://geo.ipify.org/docs
const URL_API_GEO ="https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_WpHYm7XeBlLfdPuYVz3s2AJ2HieMn&ipAddress=";
const URL_API_GEO_DOMAIN ="https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_WpHYm7XeBlLfdPuYVz3s2AJ2HieMn&domain=";

// Aqui se guarda la IP del usuario
let IP = "";

// Aqui se guarda la Geolocalizacion del usuario
let Geo = "";

// Aqui se guarda el Popup para mostrar la informacion del usuario
let contPopup = "";

// Latitud Inicial
let latitud = "6.52448";

// Longitud Inicial
let longitud = "-65.46779";

// Aqui se guarda la posicion de un marcador
let marcador;

// Establece el mapa en estas coordenadas (Venezuela) y un zoom al maximo
let map = L.map("map").setView([latitud, longitud], 6);

// Agregar una capa de openstreetmap
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(map);

// Boton para filtrar busqueda por Ip
const btnIp = document.getElementById("btnIp");

// Boton para filtrar busqueda por Dominio
const btnDomain = document.getElementById("btnDomain");

// Objeto con los ejemplos para cada tipo de busqueda
const ejemplos = {
   ip: {
      primero: '200.8.113.234',
      segundo: '192.168.0.1',
   },
   dominio: {
      primero: 'inter.com.ve',
      segundo: 'www.ejemplo.com',
   }
}

// Aqui se guarda los datos de la dirección
let infoUser = {}

// Formulario
let formulario = document.getElementById("form");

// Input de Ips
let IPs = document.getElementById("ip");

// Boton para buscar direccion por Ip
let sendIp = document.getElementById('sendIp')

// Boton para mostrar los datos de la busqueda
let showData = document.getElementById('showData')

// Aqui se guarda la etiqueta body
const body = document.querySelector("body")

// Boton para cambiar el tema
const buttomTheme = document.getElementById('switch-theme')

// Al cargar la pagina se obtiene la IP y la Geolocalizacion del usuario
document.addEventListener("DOMContentLoaded", async () => {
   btnIp.style.display = 'none'
   await obtenerIp();
   if (!IP) return alertError();
   // console.log(IP);
   
   await obtenerGeo(IP)
   if (!Geo) return alertError()
   // console.log(Geo);

   document.getElementById("loader").classList.toggle('loader-off')

   map.flyTo([Geo.location.lat, Geo.location.lng], 18);

   contPopup = await crearPopup(Geo)
   // console.log(contPopup);
   buttonShowData()

   marcador.remove()
   await GenerarMarcador(Geo.location.lat, Geo.location.lng, contPopup)
});

// Funcion para obtener la IP del usuario
const obtenerIp = async () => {
   try {
      await fetch(URL_API_IP)
         .then(res => res.json())
         .then(res => IP = res.ip)
   } catch (error) {
      console.error(error.message)
   }
};

// Funcion para obtener la Geolocalizacion del usuario por IP
const obtenerGeo = async (ip) => {
   try {
      await fetch(`${URL_API_GEO}${ip}`)
         .then(res => res.json())
         .then(res => Geo = res)
   } catch (error) {
      console.error(error.message)
   }
};

// Funcion para obtener la Geolocalizacion del usuario por dominio
const obtenerGeoDominio = async (domain) => {
   try {
      await fetch(`${URL_API_GEO_DOMAIN}${domain}`)
         .then(res => res.json())
         .then(res => Geo = res)
   } catch (error) {
      console.error(error.message);
   }
};

// Funcion para asignar un marcador en el mapa
const GenerarMarcador = (lat, lng, contPopup = null) => {
   marcador = L.marker([lat, lng]).addTo(map);
   marcador
      .bindPopup(
         contPopup 
            ? contPopup 
            : "Aqui debe ir la información del cliente"
      ).openPopup();
}

// Crea un marcador inicial por defecto
GenerarMarcador(latitud, longitud, "Venezuela")

// Funcion para crar un popup con la información del usuario
const crearPopup = (location) => {
   infoUser = {
      ip: location.ip,
      country: location.location.country,
      region: location.location.region,
      city: location.location.city,
      timezone: location.location.timezone,
      geonameId: location.location.geonameId,
      lat: location.location.lat,
      lon: location.location.lng,
      asn: location.as ? location.as.asn : 'No fue encontrado',
      name: location.as ? location.as.name : 'No fue encontrado',
      route: location.as ? location.as.route : 'No fue encontrado',
      domain: location.as ? location.as.domain : location.domains[0],
      type: location.as ? location.as.type : 'No fue encontrado',
      isp: location.isp,
      proxy: location.proxy.proxy,
      vpn: location.proxy.vpn,
   }
   contPopup = document.createRange().createContextualFragment(/*html*/
      `<div id="contPopup">
         <p class="msg-popup">Ip: ${infoUser.ip}</p>
         <p class="msg-popup">🗺️Location⬇️</p>
         <p class="msg-popup">Country: ${infoUser.country}</p>
         <p class="msg-popup">Region: ${infoUser.region}</p>
         <p class="msg-popup">City: ${infoUser.city}</p>
         <p class="msg-popup">Coordinates: ${infoUser.lat}, ${infoUser.lon}</p>
         <p class="msg-popup">Timezone: ${infoUser.timezone}</p>
         <p class="msg-popup">GeonameId: ${infoUser.geonameId}</p>
         <p class="msg-popup">🌐As⬇️</p>
         <p class="msg-popup">Asn: ${infoUser.asn}</p>
         <p class="msg-popup">Name: ${infoUser.name}</p>
         <p class="msg-popup">Route: ${infoUser.route}</p>
         <p class="msg-popup">Domain: ${infoUser.domain}</p>
         <p class="msg-popup">Type: ${infoUser.type}</p>
         <p class="msg-popup">🖥️Isp➡️: ${infoUser.isp}</p>
         <p class="msg-popup">🌐Proxy➡️: ${infoUser.proxy}</p>
         <p class="msg-popup">🌐VPN➡️: ${infoUser.vpn}</p>
      </div>`
   )
   return contPopup
}

// Crea un popup con las coordenadas de donde hace click en el mapa
const popup = L.popup();
map.on("click", (e) => {
   popup
      .setLatLng(e.latlng)
      .setContent(`Latidud: ${e.latlng.lat} <br> Longitud: ${e.latlng.lng}`)
      .openOn(map);
});

// Asigna una capa al minimapa
const osm2 = new L.TileLayer(
   "https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png",
   { minZoom: 5, maxZoom: 15, attribution: "CartoDB" }
);

// Crea un minimapa
let miniMap = new L.Control.MiniMap(osm2, {
   toggleDisplay: true,
   minimized: false,
   position: "bottomleft",
}).addTo(map);

// Evento para filtrar la busqueda por IP
btnIp.addEventListener("click", e => {
   btnIp.style.display = 'none'
   btnDomain.style.display = 'block'
   const filtro = btnIp.textContent
   filtrarEjemplos(filtro)
   filtrarBusqueda(filtro)
   IPs = document.getElementById("ip");
   sendIp = document.getElementById('sendIp')

   // Evento del boton al buscar una ubicacion por IP
   sendIp.addEventListener("click", async (e) => {
      e.preventDefault();
      const regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      const newIP = IPs.value.trim()
      if (regex.test(newIP)) {
         infoUser = {}
         Geo = ''
         if(showData === null) buttonShowData()
         await obtenerGeo(newIP)
         if (!Geo) return alertError()
         const lat = Geo.location.lat
         const lng = Geo.location.lng
         map.flyTo([lat, lng], 18);
         marcador.remove()
         contPopup = crearPopup(Geo)
         GenerarMarcador(lat, lng, contPopup)
      } else {
         return Swal.fire('Un momento!', 'La IP ingresada no es valida', 'warning')
      }
   });
})

// Evento para filtrar la busqueda por Dominio
btnDomain.addEventListener("click", e => {
   btnIp.style.display = 'block'
   btnDomain.style.display = 'none'
   const filtro = btnDomain.textContent
   filtrarEjemplos(filtro)
   filtrarBusqueda(filtro)
   const dominio = document.getElementById("dominio");
   const sendDominio = document.getElementById('sendDominio')

   // Evento del boton al buscar una ubicacion por Dominio
   sendDominio.addEventListener("click", async (e) => {
      e.preventDefault();
      const regex = /^[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
      const newDomain = dominio.value.trim()
      if (regex.test(newDomain)) {
         infoUser = {}
         Geo = ''
         if(showData === null) buttonShowData()
         await obtenerGeoDominio(newDomain)
         if (!Geo) return alertError()
         const lat = Geo.location.lat
         const lng = Geo.location.lng
         map.flyTo([lat, lng], 18);
         marcador.remove()
         contPopup = crearPopup(Geo)
         GenerarMarcador(lat, lng, contPopup)
      } else {
         return Swal.fire('Un momento!', 'El Dominio ingresado no es valido', 'warning');
      }
   });
})

// Funcion para filtrar los ejemplos por un filtro
const filtrarEjemplos = (filtro) => {
   const oneLowerCase = filtro.toLowerCase()
   const contenedorEjemplos = document.querySelector('.contenedor-ejemplos')
   
   while(contenedorEjemplos.firstChild){
      contenedorEjemplos.removeChild(contenedorEjemplos.firstChild)
   }
   const texto1 = document.createElement("h2");
   const texto2 = document.createElement("p");
   const texto3 = document.createElement("p");
   texto1.textContent = `${filtro} de ejemplo:`
   

   for (const key in ejemplos) {
      if (key === oneLowerCase) {
         texto2.textContent = `${ejemplos[key].primero}`
         texto3.textContent = `${ejemplos[key].segundo}`
      }
   }
   
   contenedorEjemplos.appendChild(texto1);
   contenedorEjemplos.appendChild(texto2);
   contenedorEjemplos.appendChild(texto3);
}

// Funcion para filtrar el formulario por un filtro
const filtrarBusqueda = (filtro) => {
   const oneLowerCase = filtro.toLowerCase()

   const label = document.createElement("label");
   label.setAttribute('for', `${oneLowerCase}`)
   label.textContent = `Buscar dirección por ${filtro}`

   const input = document.createElement("input");
   input.type = 'text'
   input.name = `${oneLowerCase}`
   input.id = `${oneLowerCase}`
   input.classList.add('buscador')

   for (const key in ejemplos) {
      if (key === oneLowerCase) {
         input.placeholder = `Ejemplo: ${ejemplos[key].primero}`
      }
   }

   const boton = document.createElement("button");

   switch (filtro) {
      case 'Ip':
         boton.id = 'sendIp'
         break;
      case 'Dominio':
         boton.id = 'sendDominio'
         break;
   }
   boton.classList.add('btn','btnForm')
   boton.textContent = 'Buscar'

   while(formulario.firstChild){
      formulario.removeChild(formulario.firstChild)
   }

   formulario.appendChild(label);
   formulario.appendChild(input);
   formulario.appendChild(boton);

   if (infoUser.ip) buttonShowData()
}

// Evento del boton al buscar una ubicacion por IP
sendIp.addEventListener("click", async (e) => {
   e.preventDefault();
   const regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
   const newIP = IPs.value.trim()
   if (regex.test(newIP)) {
      infoUser = {}
      Geo = ''
      if(showData === null) buttonShowData()
      await obtenerGeo(newIP)
      if (!Geo) return alertError()
      const lat = Geo.location.lat
      const lng = Geo.location.lng
      map.flyTo([lat, lng], 18);
      marcador.remove()
      contPopup = crearPopup(Geo)
      GenerarMarcador(lat, lng, contPopup)
   } else {
      return Swal.fire('Un momento!', 'La IP ingresada no es valida', 'warning')
   }
});

// Evento para cambiar entre Dark Mode y Ligth Mode
buttomTheme.addEventListener('click', e => {
   body.classList.toggle('darkmode')
   if (body.classList.contains('darkmode')) {
      buttomTheme.removeChild(buttomTheme.firstChild)
      addLigthMode()
   } else{
      buttomTheme.removeChild(buttomTheme.firstChild)
      addDarkMode()
   }
})

// Funcion para crear el boton para Dark Mode
const addDarkMode = () => {
   const iconDark = document.createElement('i')
   iconDark.classList.add('fa-solid', 'fa-moon')
   buttomTheme.appendChild(iconDark)
}

// Funcion para crear el boton para Ligth Mode
const addLigthMode = () => {
   const iconLight = document.createElement('i')
   iconLight.classList.add('fa-sharp', 'fa-solid', 'fa-sun')
   buttomTheme.appendChild(iconLight)
}

// Inicia el tema de la pagina segun la preferencia del sistema del usuario 
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
   body.classList.add('darkmode')
   addLigthMode()
} else{
   addDarkMode()
}

// Funcion para crear el boton de mostrar datos de la busqueda
const buttonShowData = () => {
   const buttonData = document.createElement('button')
   buttonData.classList.add('btn', 'btn-data')
   buttonData.id = "showData"
   buttonData.textContent = 'Datos'

   formulario.appendChild(buttonData)
   showData = document.getElementById('showData')

   // Evento para mostrar los datos de la busqueda
   showData.addEventListener('click', e => {
      e.preventDefault()
      if(!infoUser.ip) return Swal.fire('Error', 'No hay datos para mostrar', 'error')
      showAlert(infoUser)
   })
}

// funcion para crear la alerta con la información de la busqueda
function showAlert(data) {
   Swal.fire({
      icon: 'info',
      title: 'Datos',
      html: 
         `
            <div>
               <p class="msg-alert">Ip: ${data.ip}</p>
               <p class="msg-alert">🗺️Location⬇️</p>
               <p class="msg-alert">Country: ${data.country}</p>
               <p class="msg-alert">Region: ${data.region}</p>
               <p class="msg-alert">City: ${data.city}</p>
               <p class="msg-alert">Coordinates: ${data.lat}, ${data.lon}</p>
               <p class="msg-alert">Timezone: ${data.timezone}</p>
               <p class="msg-alert">GeonameId: ${data.geonameId}</p>
               <p class="msg-alert">🌐As⬇️</p>
               <p class="msg-alert">Asn: ${data.asn}</p>
               <p class="msg-alert">Name: ${data.name}</p>
               <p class="msg-alert">Route: ${data.route}</p>
               <p class="msg-alert">Domain: ${data.domain}</p>
               <p class="msg-alert">Type: ${data.type}</p>
               <p class="msg-alert">🖥️Isp➡️: ${data.isp}</p>
               <p class="msg-alert">🌐Proxy➡️: ${data.proxy}</p>
               <p class="msg-alert">🌐VPN➡️: ${data.vpn}</p>
            </div>
         `,
      showCloseButton: true,
   })
}

// Función para crear la alerta de error en la peticion
function alertError(){
   Swal.fire('Error', 'La peticion no se pudo completar, revise su conexión a internet y vuelva a intentarlo', 'error')
}
