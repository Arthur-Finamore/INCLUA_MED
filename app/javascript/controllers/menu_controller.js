import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="menu"
export default class extends Controller {
  static targets = ["menu", "menuText"]

  connect() {
    console.log("Menu controller connected")
    this.state = 0 // Estado inicial do menu
  }

 animateMenu() {
    if (this.state === 0) {
      // Ocultar nomes (a máscara cuidará disso em 0.2s)
      this.menuTarget.classList.add('shrunk')

      // Ocultar ícones após 0.1s
      setTimeout(() => {
        this.iconTargets.forEach((icon) => {
          icon.classList.add('hidden')
        })
      }, 100) // 0.1s em milissegundos

      // Iniciar redução do menu após 0.2s
      setTimeout(() => {
        this.menuTarget.classList.add('first-animation')
      }, 200) // 0.2s em milissegundos

      // Após o menu atingir 80px, mostrar ícones novamente com animação
      setTimeout(() => {
        this.iconTargets.forEach((icon) => {
          icon.classList.remove('hidden')
          icon.classList.add('slide-in')
        })
      }, 1000) // Ajuste conforme o tempo da animação do menu

      this.state = 1
    } else if (this.state === 1) {
      // Estado para possíveis futuras interações
      this.state = 0
    }
  }
}
