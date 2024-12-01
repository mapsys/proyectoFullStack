function Usuario(nombre, apellido) {
  (this.nombre = nombre), (this.apellido = apellido);
}

function suma(a, b) {
  return a + b;
}

let suma2 = suma(10, 2);

console.log(suma2);
