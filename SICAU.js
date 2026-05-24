/* =========================================================
   SICAU — APP.JS
   ---------------------------------------------------------
   Archivo principal de lógica del sistema académico
   Incluye:
   - Navegación SPA
   - Persistencia con localStorage
   - Animaciones
   - Avatar dinámico
   - Edición de perfil
   - Información laboral
   - Indicadores circulares
========================================================= */


/* =========================================================
   NAVEGACIÓN ENTRE PÁGINAS
========================================================= */

const usuario = JSON.parse(
  localStorage.getItem("usuarioActivo")
);

if(usuario){

  // SIDEBAR

  document.querySelector(".u-name").innerText =
    usuario.nombre;

  document.querySelector(".u-prog").innerText =
    usuario.carrera + " · " + usuario.nivel;

  // PERFIL

  document.querySelector(".p-name").innerText =
    usuario.nombre;

  document.querySelector(".p-prog").innerText =
    usuario.carrera;

  // FOTO SIDEBAR

  document.getElementById("sidebarAv").innerHTML = `
    <img
      src="${usuario.foto}"
      style="
        width:100%;
        height:100%;
        object-fit:cover;
        border-radius:50%;
      "
    >
  `;

  // FOTO PERFIL

  document.getElementById("profileAv").innerHTML = `
    <img
      src="${usuario.foto}"
      style="
        width:100%;
        height:100%;
        object-fit:cover;
        border-radius:50%;
      "
    >
  `;

}


function goTo(page, el){

  // Oculta todas las páginas
  document.querySelectorAll('.page')
    .forEach(p => p.classList.remove('active'));

  // Quita el active de todos los botones
  document.querySelectorAll('.nav-item')
    .forEach(n => n.classList.remove('active'));

  // Muestra la página seleccionada
  document
    .getElementById('page-' + page)
    .classList.add('active');

  // Activa el botón seleccionado
  if(el){
    el.classList.add('active');
  }

  // Cambia el título superior
  const titles = {
    dashboard : 'Hola, Nichole!',
    materias  : 'Mis materias',
    notas     : 'Historial académico',
    encuestas : 'Encuestas',
    perfil    : 'Perfil',
    mensajes  : 'Mensajes'
  };

  document.getElementById('pageTitle').textContent =
    titles[page] || '';

  // Guarda la página actual
  localStorage.setItem('currentPage', page);
}



/* =========================================================
   INDICADORES CIRCULARES
========================================================= */

// Circunferencia del círculo SVG
const CIRC = 2 * Math.PI * 18;


// Función para llenar un anillo
function setRing(id, pct){

  const el = document.getElementById(id);

  if(!el) return;

  el.style.strokeDasharray = CIRC;

  el.style.strokeDashoffset = CIRC;

  setTimeout(() => {

    el.style.transition =
      'stroke-dashoffset 1.3s cubic-bezier(.4,0,.2,1)';

    el.style.strokeDashoffset =
      CIRC * (1 - pct / 100);

  }, 100);
}



/* =========================================================
   CAMBIO DE AVATAR
========================================================= */

function changeAvatar(input){

  const file = input.files[0];

  if(!file) return;

  const reader = new FileReader();

  reader.onload = e => {

    const src = e.target.result;

    /* ---------- Sidebar ---------- */

    const sbAv = document.getElementById('sidebarAv');

    sbAv.querySelector('.av-text').style.display = 'none';

    let sbImg = sbAv.querySelector('img');

    if(!sbImg){

      sbImg = document.createElement('img');

      sbAv.appendChild(sbImg);
    }

    sbImg.src = src;


    /* ---------- Perfil ---------- */

    const pAv = document.getElementById('profileAv');

    document.getElementById('profileInitials')
      .style.display = 'none';

    let pImg = pAv.querySelector('img');

    if(!pImg){

      pImg = document.createElement('img');

      pImg.style.zIndex = '1';

      pAv.prepend(pImg);
    }

    pImg.src = src;


    // Guardar avatar
    localStorage.setItem('avatar', src);
  };

  reader.readAsDataURL(file);
}



/* =========================================================
   CARGAR AVATAR GUARDADO
========================================================= */

function loadAvatar(){

  const saved = localStorage.getItem('avatar');

  if(!saved) return;


  /* ---------- Sidebar ---------- */

  const sbAv = document.getElementById('sidebarAv');

  sbAv.querySelector('.av-text').style.display = 'none';

  let sbImg = sbAv.querySelector('img');

  if(!sbImg){

    sbImg = document.createElement('img');

    sbAv.appendChild(sbImg);
  }

  sbImg.src = saved;


  /* ---------- Perfil ---------- */

  const pAv = document.getElementById('profileAv');

  document.getElementById('profileInitials')
    .style.display = 'none';

  let pImg = pAv.querySelector('img');

  if(!pImg){

    pImg = document.createElement('img');

    pImg.style.zIndex = '1';

    pAv.prepend(pImg);
  }

  pImg.src = saved;
}



/* =========================================================
   EDITAR CAMPOS DEL PERFIL
========================================================= */

function editField(field, currentVal){

  const rowId = 'row-' + field;

  const row = document.getElementById(rowId);

  if(!row) return;

  const valEl = row.querySelector('.info-val');

  valEl.innerHTML = `

    <input
      class="edit-input"
      value="${currentVal}"
      id="edit-${field}"
    />

    <div class="edit-actions">

      <span
        class="btn-save"
        onclick="saveField('${field}')"
      >
        Guardar
      </span>

      <span
        class="btn-cancel"
        onclick="cancelField('${field}','${currentVal}')"
      >
        Cancelar
      </span>

    </div>
  `;
}



/* =========================================================
   GUARDAR CAMPO EDITADO
========================================================= */

function saveField(field){

  const row =
    document.getElementById('row-' + field);

  const input =
    document.getElementById('edit-' + field);

  const val = input.value.trim() || '—';

  // Guardar en localStorage
  localStorage.setItem(field, val);

  const valEl = row.querySelector('.info-val');

  valEl.innerHTML = '';

  valEl.textContent = val;

  valEl.className = 'info-val editable';

  valEl.onclick = () => editField(field, val);
}



/* =========================================================
   CANCELAR EDICIÓN
========================================================= */

function cancelField(field, orig){

  const row =
    document.getElementById('row-' + field);

  const valEl = row.querySelector('.info-val');

  valEl.innerHTML = '';

  valEl.textContent = orig;

  valEl.className = 'info-val editable';

  valEl.onclick = () => editField(field, orig);
}



/* =========================================================
   CARGAR DATOS DEL PERFIL
========================================================= */

function loadProfileData(){

  const fields = [
    'email',
    'phone',
    'city',
    'estrato'
  ];

  fields.forEach(field => {

    const saved = localStorage.getItem(field);

    if(saved){

      const row =
        document.getElementById('row-' + field);

      const valEl =
        row.querySelector('.info-val');

      valEl.textContent = saved;

      valEl.onclick =
        () => editField(field, saved);
    }

  });
}



/* =========================================================
   DÍAS LABORALES
========================================================= */

function toggleDia(el){

  el.classList.toggle('active');
}



/* =========================================================
   GUARDAR INFORMACIÓN LABORAL
========================================================= */

function saveWork(){

  const data = {

    empresa :
      document.getElementById('work-empresa').value,

    cargo :
      document.getElementById('work-cargo').value,

    entrada :
      document.getElementById('work-entrada').value,

    salida :
      document.getElementById('work-salida').value,

    obs :
      document.getElementById('work-obs').value,

    dias :
      [...document.querySelectorAll('.dia-chip.active')]
      .map(d => d.dataset.day)
  };

  // Guardar
  localStorage.setItem(
    'workData',
    JSON.stringify(data)
  );

  // Renderizar
  renderWorkData(data);
}



/* =========================================================
   MOSTRAR DATOS LABORALES
========================================================= */

function renderWorkData(data){

  const box =
    document.getElementById('work-saved');

  const content =
    document.getElementById('work-saved-content');

  box.style.display = 'block';

  content.innerHTML = `

    <div class="info-row">
      <span class="info-lbl">Empresa</span>
      <span class="info-val">
        ${data.empresa || '—'}
      </span>
    </div>

    <div class="info-row">
      <span class="info-lbl">Cargo</span>
      <span class="info-val">
        ${data.cargo || '—'}
      </span>
    </div>

    <div class="info-row">
      <span class="info-lbl">Horario</span>
      <span class="info-val">
        ${data.entrada} - ${data.salida}
      </span>
    </div>

    <div class="info-row">
      <span class="info-lbl">Días</span>
      <span class="info-val">
        ${data.dias.join(', ') || '—'}
      </span>
    </div>

    <div class="info-row">
      <span class="info-lbl">Observaciones</span>
      <span class="info-val">
        ${data.obs || '—'}
      </span>
    </div>

  `;
}



/* =========================================================
   CARGAR DATOS LABORALES
========================================================= */

function loadWorkData(){

  const saved =
    localStorage.getItem('workData');

  if(!saved) return;

  const data = JSON.parse(saved);

  renderWorkData(data);
}



/* =========================================================
   CARGAR ÚLTIMA PÁGINA ABIERTA
========================================================= */

function loadLastPage(){

  const savedPage =
    localStorage.getItem('currentPage');

  if(!savedPage) return;

  document.querySelectorAll('.nav-item')
    .forEach(item => {

      const text =
        item.textContent.trim().toLowerCase();

      if(text.includes(savedPage)){

        goTo(savedPage, item);
      }
    });
}



/* =========================================================
   INICIALIZACIÓN GENERAL
========================================================= */

window.addEventListener('load', () => {

  /* ---------- Rings ---------- */

  setRing('ring-asist', 60);

  setRing('ring-tareas', 90);

  setRing('ring-prom', 76);

  setRing('ring-act', 45);


  /* ---------- Datos ---------- */

  loadProfileData();

  loadAvatar();

  loadWorkData();

  loadLastPage();

});


function changeAvatar(input) {
  const file = input.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    const imageData = e.target.result;

    // FOTO PERFIL GRANDE
    const profileAv = document.getElementById("profileAv");
    profileAv.innerHTML = `<img src="${imageData}" alt="avatar">`;

    // FOTO SIDEBAR
    const sidebarAv = document.getElementById("sidebarAv");
    sidebarAv.innerHTML = `<img src="${imageData}" alt="avatar">`;

    // GUARDAR EN LOCALSTORAGE
    localStorage.setItem("userAvatar", imageData);
  };

  reader.readAsDataURL(file);
}
// CARGAR FOTO GUARDADA
window.addEventListener("load", () => {
  const savedAvatar = localStorage.getItem("userAvatar");

  if (savedAvatar) {
    const profileAv = document.getElementById("profileAv");

    if (profileAv) {
      profileAv.innerHTML = `<img src="${savedAvatar}" alt="avatar">`;
    }

    const sidebarAv = document.getElementById("sidebarAv");

    if (sidebarAv) {
      sidebarAv.innerHTML = `<img src="${savedAvatar}" alt="avatar">`;
    }
  }
});

function cerrarSesion() {
  window.location.href = "Login.html";
}