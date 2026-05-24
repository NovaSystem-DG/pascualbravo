const usuarioInput = document.getElementById("usuario");

const preview = document.getElementById("profilePreview");

const previewImg = document.getElementById("previewImg");

const previewName = document.getElementById("previewName");

const previewCareer = document.getElementById("previewCareer");

const errorMsg = document.getElementById("errorMsg");


// DETECTAR USUARIO

usuarioInput.addEventListener("input", () => {

  const valor = usuarioInput.value.trim();

  const usuarioEncontrado = usuarios.find(
    u => u.usuario === valor
  );

if(usuarioEncontrado){

  preview.style.display = "flex";

  const savedAvatar = localStorage.getItem("userAvatar");

  if(savedAvatar){

    previewImg.src = savedAvatar;

  }else{

    previewImg.src = usuarioEncontrado.foto;

  }

  previewName.innerText =
    usuarioEncontrado.nombre;

  previewCareer.innerText =
    usuarioEncontrado.carrera;

}else{

  preview.style.display = "none";

}

});


// LOGIN

function login(){

  const usuario = document
    .getElementById("usuario")
    .value.trim();

  const password = document
    .getElementById("password")
    .value;

  const encontrado = usuarios.find(

    u =>

      u.usuario === usuario &&
      u.password === password

  );

  if(encontrado){

    localStorage.setItem(
      "usuarioActivo",
      JSON.stringify(encontrado)
    );

    window.location.href = "SICAU.html";

  }else{

    errorMsg.innerText =
      "Usuario o contraseña incorrectos";

  }

}