// Función para cargar el archivo JSON
async function leerProductos() {
  try {
    const response = await fetch("js/productos.json");
    if (!response.ok) {
      throw new Error("Error al cargar el archivo JSON");
    }
    const data = await response.json();
    productos = data.productos;
  } catch (error) {
    console.error("Error:", error);
  }
}

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategoria = document.querySelectorAll(".boton-categoria");
const tituloPagina = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numeritoTexto = document.querySelector("#numerito");
let productosEnCarrito;
const cantidadItems = document.getElementById("carrito-contenido-cantidad");
const totalItems = document.getElementById("carrito-contenido-precio");
const contenidoCarrito = document.getElementById("carrito-contenido");
const btnUserLogin = document.getElementById("btnUserLogin");
const userName = document.getElementById("user-name");
const modalForm = document.getElementById("modalForm");
const closeForm = document.getElementById("btnCerrarForm");
const btnLogin = document.getElementById("btnLogin");
const loginName = document.getElementById("user");
const loginpass = document.getElementById("pass");
let user = {};

// Funcion para cargar productos a la pagina
function cargarProductos(productos) {
  contenedorProductos.innerHTML = "";

  for (let i = 0; i < productos.length; i++) {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `  
        <img class="producto-imagen" src="${productos[i].imagen}" alt="${productos[i].imagen}" />
        <div class="producto-descripcion">
          <h3 class="producto-titulo">${productos[i].nombre}</h3>
          <p class="producto-precio">${productos[i].precio}</p>
          <button class="producto-agregar" id="${productos[i].id}">Agregar</button>
        </div>
    `;
    contenedorProductos.append(div);
  }
  actualizaBotonesAgregar();
}
// Agrego un listener a cada boton comprar
function actualizaBotonesAgregar() {
  botonesAgregar = document.querySelectorAll(".producto-agregar");
  if (user.name !== undefined) {
    botonesAgregar.forEach((boton) => {
       // debi agregar esto porque sino se me mexclaban los listeners
      const nuevoBoton = boton.cloneNode(true);
      boton.replaceWith(nuevoBoton);
      nuevoBoton.classList.add("habilitado");
      nuevoBoton.addEventListener("click", agregarAlCarrito);
    });
  } else {
    botonesAgregar.forEach((boton) => {
      // debi agregar esto porque sino se me mexclaban los listeners
      const nuevoBoton = boton.cloneNode(true);
      boton.replaceWith(nuevoBoton);
      nuevoBoton.classList.remove("habilitado");
      nuevoBoton.setAttribute("title", "Debes iniciar sesión para poder comprar");
      nuevoBoton.removeEventListener("click", agregarAlCarrito);
      nuevoBoton.addEventListener("click", (e) => {
        Toastify({
          text: "Debes estar logeado para poder comprar",
          duration: 3000
          }).showToast();
      });
    });
  }
}

function agregarAlCarrito(e) {
  const botonId = e.currentTarget.id;
  const productoAgregado = productos.find((producto) => producto.id == botonId);
  if (productosEnCarrito.some((producto) => producto.id === productoAgregado.id)) {
    const index = productosEnCarrito.findIndex((producto) => producto.id === productoAgregado.id);
    productosEnCarrito[index].cantidad++;
  } else {
    productoAgregado.cantidad = 1;
    productosEnCarrito.push(productoAgregado);
  }
  actualizarDatosCarrito();

  localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
  Toastify({
    text: ` ${productoAgregado.nombre} agregado al carrito`,
    duration: 3000
    }).showToast();
}

function actualizarDatosCarrito() {
  const items = productosEnCarrito.reduce((total, producto) => total + producto.cantidad, 0);
  const total = productosEnCarrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
  if (items === 0) {
    contenidoCarrito.classList.add("disable");
  } else {
    contenidoCarrito.classList.remove("disable");
  }
  numeritoTexto.innerText = items;
  cantidadItems.innerText = items;
  totalItems.innerText = `$${total}`;
}

function habilitaLogin() {
    modalForm.style.display = "flex";
}

function login(e) {
  e.preventDefault();
  modalForm.style.display = "none";
  user.name = loginName.value;
  user.password = loginpass.value;
  localStorage.setItem("user", JSON.stringify(user));
  actualizarUser();
  btnUserLogin.addEventListener("click", logOut);
  Toastify({
    text: "Te has logeado correctamente",
    gravity: "bottom",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    duration: 5000
    }).showToast();
}
function actualizarUser() {
  btnLogin.addEventListener("click", login);
  closeForm.addEventListener("click", () => {
    modalForm.style.display = "none";
  });
  if (localStorage.getItem("user")) {
    user = JSON.parse(localStorage.getItem("user"));
    userName.innerText = `Bienvenido ${user.name} \nClick to logout`;
    actualizaBotonesAgregar();
    btnUserLogin.addEventListener("click", logOut);
  } else {
    userName.innerText = "Iniciar Sesión";
    actualizaBotonesAgregar();
    btnUserLogin.addEventListener("click", habilitaLogin);
  }
}
function logOut() {
  user = {};
  localStorage.removeItem("user");
  userName.innerText = "Iniciar Sesión";
  actualizaBotonesAgregar();
  actualizarUser();
}
async function main() {
  await leerProductos();
  cargarProductos(productos);

  // Event listeners para los botones de categoria
  for (let i = 0; i < botonesCategoria.length; i++) {
    botonesCategoria[i].addEventListener("click", (e) => {
      botonesCategoria.forEach((boton) => boton.classList.remove("active"));
      e.currentTarget.classList.add("active");
      if (e.currentTarget.id === "todos") {
        cargarProductos(productos);
        tituloPagina.innerText = "Todos los productos";
      } else {
        const productosCategoria = productos.filter((producto) => producto.categoria.nombre === e.currentTarget.id);
        cargarProductos(productosCategoria);
        tituloPagina.innerText = e.currentTarget.innerText;
      }
    });
  }
  actualizarUser();
  

  if (localStorage.getItem("productos-en-carrito")) {
    productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito"));
    actualizarDatosCarrito();
  } else {
    productosEnCarrito = [];
  }
}

main();
