import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["menu", "menuText", "icon", "arrow"]

  connect() {
    console.log("Menu controller connected")
    this.state = 0
    this.setInitialIcon()
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
      console.log("Iniciando animação do menu")

      // Passo 1: Animação da máscara
      this.menuTarget.classList.add('shrunk')

      // Passo 2: Ocultar ícones após 0.2s
      setTimeout(() => {
        this.iconTargets.forEach((icon) => {
          icon.classList.add('hidden')
        })
        this.arrowTarget.classList.add('hidden')
        console.log("Ícones ocultados")
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

      // Passo 5: Reaparecer ícones e centralizar seta após 1.2s
      setTimeout(() => {
        this.iconTargets.forEach((icon) => {
          icon.classList.remove('hidden')
          icon.classList.add('reappear')
        })
        this.arrowTarget.classList.remove('hidden')


        // Centralizar a seta
        this.arrowTarget.classList.add('center-arrow')
        this.arrowTarget.classList.add('arrow-height')
        this.menuTarget.classList.add('icons-visible')
        console.log("Ícones reaparecidos e centralizados, seta centralizada")
      }, 700)

      // Passo 6: Remover textos do layout após 0.7s
      setTimeout(() => {
        this.menuTextTargets.forEach((text) => {
          text.classList.add('hide-text-hidden')
        })
        console.log("Textos removidos do layout")
      }, 700)

      this.state = 1
    } else {
      // Resetar para o estado inicial
      console.log("Resetando menu")

      this.menuTarget.classList.remove('first-animation', 'shrunk', 'icons-visible')
      this.menuTarget.style.width = '250px'
      this.menuTarget.style.visibility = 'visible'

      this.iconTargets.forEach((icon) => {
        icon.classList.remove('hidden', 'reappear')
      })

      this.menuTextTargets.forEach((text) => {
        text.classList.remove('hide-text', 'hide-text-hidden')
      })

      // Remover a centralização da seta
      this.arrowTarget.classList.remove('center-arrow')
      this.arrowTarget.classList.remove('arrow-height')


      this.state = 0
    }
  }
}
