class Confirm {
  static #list = []

  constructor(data) {
    this.code = Confirm.generateCode()
    this.data = data
  }

  static generateCode = () => {
    return Math.floor(Math.random() * 9000) + 1000
  }

  static create = (data) => {
    // recogemos los datos
    this.#list.push(new Confirm(data))
    // borramos los codigos despues de 24 horas
    setTimeout(() => {
      this.delete(code)
    }, 24 * 60 * 60 * 1000), // son 24 horas en milisegundas
      console.log(this.#list)
  }

  static delete = (code) => {
    // se hace la comprobacion
    const length = this.#list

    this.#list = this.#list.filter(
      (item) => item.code !== code,
    )
    // si se cambio el largo de la lista entonces se devuelve true sino es asi se devuelve false
    return this.length > this.#list.length
  }

  static getData = (code) => {
    const obj = this.#list.find(
      (item) => item.code === code,
    )
    return obj ? obj.data : null
  }
}

module.exports = {
  Confirm,
}
