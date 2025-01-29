const productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito"));
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const numeritoTexto = document.querySelector("#numerito");
let botonesBorrar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciarCarrito = document.querySelector("#carrito-acciones-vaciar");
const botonComprarCarrito = document.querySelector("#carrito-acciones-comprar");
const total = document.querySelector("#carrito-total");

function cargarProductosCarrito() {
  contenedorCarritoProductos.innerHTML = "";
  if (productosEnCarrito && productosEnCarrito.length !== 0) {
    contenedorCarritoVacio.classList.add("disable");
    contenedorCarritoComprado.classList.add("disable");
    contenedorCarritoAcciones.classList.remove("disable");
    contenedorCarritoProductos.classList.remove("disable");
    productosEnCarrito.forEach((producto) => {
      const div = document.createElement("div");
      div.classList.add("carrito-producto");
      div.innerHTML = `
              <img class="carrito-imagen" src="${producto.imagen}" alt="${producto.nombre}" />
              <div class="carrito-producto-titulo">
                <small>Nombre</small>
                <h3>${producto.nombre}</h3>
              </div>
              <div class="carrito-producto-cantidad">
                <small>Cantidad</small>
                <p>${producto.cantidad}</p>
              </div>
              <div class="carrito-producto-precio">
                <small>Precio</small>
                <p>${producto.precio}</p>
              </div>
              <div class="carrito-producto-subtotal">
                <small>Subtotal</small>
                <p>${producto.cantidad * producto.precio}</p>
              </div>
              <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
                 
          `;
      contenedorCarritoProductos.append(div);
    });
    const div = document.createElement("div");
  } else {
    contenedorCarritoVacio.classList.remove("disable");
    contenedorCarritoComprado.classList.add("disable");
    contenedorCarritoAcciones.classList.add("disable");
    contenedorCarritoProductos.classList.add("disable");
  }
  actualizarNumerito();
  actualizaBotonesEliminar();
  actualizarTotal();
}

cargarProductosCarrito();

function actualizarNumerito() {
  const numerito = productosEnCarrito.reduce((total, producto) => total + producto.cantidad, 0);
  numeritoTexto.innerText = numerito;
}

function calcularTotales() {
  productosEnCarrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
}

function actualizaBotonesEliminar() {
  botonesBorrar = document.querySelectorAll(".carrito-producto-eliminar");
  botonesBorrar.forEach((boton) => {
    boton.addEventListener("click", eliminarDelCarrito);
  });
}

function eliminarDelCarrito(e) {
  const id = parseInt(e.currentTarget.id);
  const indice = productosEnCarrito.findIndex((producto) => producto.id === id);
  console.log("id ", id);
  console.log(JSON.stringify(productosEnCarrito));
  console.log(indice);
  Toastify({
    text: ` has eliminado el producto ${productosEnCarrito[indice].nombre} `,
    style: {
      background: "linear-gradient(to right, #ec0a0a, #e97272)",
    },
    duration: 3000,
  }).showToast();
  productosEnCarrito.splice(indice, 1);
  cargarProductosCarrito();
  localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
  console.log(productosEnCarrito);
}

botonVaciarCarrito.addEventListener("click", () => {
  productosEnCarrito.length = 0;
  localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
  cargarProductosCarrito();
  Swal.fire({
    title: "Vaciar Carrito",
    text: `Tu carrito ha sido vaciado`,
    confirmButtonText: "OK",
    icon: "question",
  });
});

botonComprarCarrito.addEventListener("click", () => {
  Swal.fire({
    title: "Finalizar compra?",
    text: `Tu compra asiende a ${total.innerText}
            Estas de acuerdo`,
    showDenyButton: true,
    confirmButtonText: "Finalizar Compra",
    denyButtonText: `Seguir comprando`,
    icon: "question",
  }).then((result) => {
    if (result.isConfirmed) {
      productosEnCarrito.length = 0;
      localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
      cargarProductosCarrito();
      contenedorCarritoVacio.classList.add("disable");
      contenedorCarritoComprado.classList.remove("disable");
      contenedorCarritoAcciones.classList.add("disable");
      contenedorCarritoProductos.classList.add("disable");
      actualizarNumerito();
      Swal.fire({
        title: "Compra Finalizada",
        text: "Gracias por tu compra",
        icon: "success ",
      });
    }
  });
});

function actualizarTotal() {
  const totalCalculado = productosEnCarrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
  total.innerText = `$${totalCalculado}`;
}
