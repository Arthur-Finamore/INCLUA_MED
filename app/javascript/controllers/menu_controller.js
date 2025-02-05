import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["menu", "menuText", "icon", "arrow", "arrowForward"]

  connect() {
    console.log("Menu controller connected")
    this.state = 0
    this.setInitialIcon()
    this.arrowForwardTarget.classList.add('hidden')
  }

  // Define o ícone inicial com base na rota atual
  setInitialIcon() {
    const currentPath = this.element.dataset.currentPath;
    const pathMappings = {
      '/instrucoes': 'icon-home-selected.svg',
      '/procedures': 'icon-procedures-selected.svg',
      '/opine': 'icon-opine-selected.svg'
    };

    this.iconTargets.forEach(icon => {
      const defaultSrc = icon.dataset.iconDefault
      const selectedSrc = icon.dataset.iconSelected
      
      // Verifica se o caminho atual corresponde ao ícone
      if (selectedSrc.includes(pathMappings[currentPath])) {
        icon.src = selectedSrc
      } else {
        icon.src = defaultSrc
      }
    })
  }

  // Manipula o clique nos itens do menu
  selectItem(event) {
    const clickedIcon = event.currentTarget.querySelector('[data-menu-target="icon"]')
    
    // Reseta todos os ícones para o estado padrão
    this.iconTargets.forEach(icon => {
      icon.src = icon.dataset.iconDefault
    })
    
    // Define o ícone clicado como selecionado
    clickedIcon.src = clickedIcon.dataset.iconSelected
  }

  animateMenu() {
    if (this.state === 0) {
      // Primeiro clique na seta quando o menu está expandido
      console.log("Iniciando animação do menu para estado reduzido")

      // Passo 1: Animação da máscara
      this.menuTarget.classList.add('shrunk')

      // Passo 2: Ocultar ícones e seta após 0.2s
      setTimeout(() => {
        this.iconTargets.forEach((icon) => {
          icon.classList.add('hidden')
        })
        this.arrowTarget.classList.add('hidden')
        console.log("Ícones e seta ocultados")
      }, 200)

      // Passo 3: Iniciar animação de redução do menu
      this.menuTarget.classList.add('first-animation')

      // Passo 4: Remover textos do layout após 0.4s
      setTimeout(() => {
        this.menuTextTargets.forEach((text) => {
          text.classList.add('hide-text')
        })
        console.log("Textos ocultados")
      }, 400)

      // Passo 5: Reaparecer ícones e setas após 0.7s
      setTimeout(() => {
        this.iconTargets.forEach((icon) => {
          icon.classList.remove('hidden')
          icon.classList.add('reappear')
        })
        this.arrowTarget.classList.remove('hidden')
        this.arrowForwardTarget.classList.remove('hidden')

        // Centralizar a seta
        this.arrowTarget.classList.add('center-arrow')
        this.arrowTarget.classList.add('arrow-height')
        this.menuTarget.classList.add('icons-visible')
        console.log("Ícones e setas reaparecidos e centralizados")
      }, 700)

      // Passo 6: Remover textos do layout após 0.7s
      setTimeout(() => {
        this.menuTextTargets.forEach((text) => {
          text.classList.add('hide-text-hidden')
        })
        console.log("Textos removidos do layout")
      }, 700)

      this.state = 1

    } else if (this.state === 1) {
      // Segundo clique na seta quando o menu está reduzido
      console.log("Iniciando animação do menu para ocultar completamente")

      // Passo 1: Iniciar animação de redução total do menu
      this.menuTarget.classList.add('hide-menu')

      // Passo 2: Ocultar ícones e setas imediatamente
      this.iconTargets.forEach((icon) => {
        icon.classList.add('hidden')
      })
      this.arrowTarget.classList.add('hidden')
      this.arrowForwardTarget.classList.add('hidden')
      console.log("Ícones e setas ocultados")

      this.state = 2

    } else if (this.state === 2) {
      // Clique para redefinir o menu para o estado inicial
      console.log("Resetando menu para estado expandido")

      // Remover todas as classes de animação e estilos inline
      this.menuTarget.classList.remove('first-animation', 'shrunk', 'icons-visible', 'hide-menu')
      this.menuTarget.style.width = '250px'
      this.menuTarget.style.visibility = 'visible'

      this.iconTargets.forEach((icon) => {
        icon.classList.remove('hidden', 'reappear')
      })

      this.menuTextTargets.forEach((text) => {
        text.classList.remove('hide-text', 'hide-text-hidden')
      })

      // Remover a centralização da seta
      this.arrowTarget.classList.remove('center-arrow', 'arrow-height')
      this.arrowTarget.classList.remove('hidden')
      this.arrowForwardTarget.classList.add('hidden')

      this.state = 0
    }
  }
}
