import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="menu"
export default class extends Controller {
  static targets = ["menu", "menuText", "icon"]

  connect() {
    console.log("Menu controller connected")
    this.state = 0 // Estado inicial do menu
  }

  animateMenu() {
    if (this.state === 0) {
      // Adiciona a classe 'shrunk' para iniciar a ocultação dos nomes
      this.menuTarget.classList.add('shrunk')

      // Ocultar ícones 0.2 segundos após o clique
      setTimeout(() => {
        this.iconTargets.forEach((icon) => {
          icon.classList.add('hidden')
        })
      }, 200) // 200 milissegundos = 0.2 segundos

      // O menu continua sua animação normalmente
      this.menuTarget.classList.add('first-animation')

      this.state = 1
    } else {
      // Reseta para o estado inicial
      this.menuTarget.classList.remove('first-animation', 'shrunk')
      this.menuTarget.style.width = '250px'
      this.menuTarget.style.visibility = 'visible'

      // Remover a classe 'hidden' dos ícones para restaurá-los
      this.iconTargets.forEach((icon) => {
        icon.classList.remove('hidden')
      })

      this.state = 0
    }
  }
}
