// app/javascript/controllers/menu_controller.js

import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "menu",
    "menuText",
    "icon",
    "arrow",
    "arrowForward",
    "hamburgerIcon",
    "logoReduzida",
    "logoReduzidaCircle"
  ]

  connect() {
    console.log("Menu controller connected");
    this.state = 0;
    this.setInitialIcon();
    this.arrowForwardTarget.classList.add('hidden');
    this.hamburgerIconTarget.classList.add('hidden'); // Garante que o hamburger começa escondido

    document.addEventListener("dblclick", () =>{
      document.documentElement.requestFullscreen().catch((e) => {console.log(e);})
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    });

  }

  // Define o ícone inicial com base na rota atual
  setInitialIcon() {
    const currentPath = this.element.dataset.menuCurrentPath;
    const pathMappings = {
      '/instrucoes': 'icon-home-selected.svg',
      '/procedures': 'icon-procedures-selected.svg',
      '/opine': 'icon-opine-selected.svg'
    };

    this.iconTargets.forEach(icon => {
      const defaultSrc = icon.dataset.iconDefault;
      const selectedSrc = icon.dataset.iconSelected;

      // Verifica se o caminho atual corresponde ao ícone
      if (selectedSrc.includes(pathMappings[currentPath])) {
        icon.src = selectedSrc;
      } else {
        icon.src = defaultSrc;
      }
    });
  }


  updateActiveScreenClass(oldClass, newClass) {
    const activeScreen = document.getElementById('active-screen');
    if (activeScreen) {
      activeScreen.classList.replace(oldClass, newClass);
    }
  }




  // Manipula o clique nos itens do menu
  selectItem(event) {
    // Remove a classe 'green' de todos os textos do menu
    this.menuTextTargets.forEach(text => {
      text.classList.remove('green');
    });

    // Obtém o elemento <p> do link clicado
    const clickedParagraph = event.currentTarget.querySelector('.menu-text');

    // Adiciona a classe 'green' ao parágrafo clicado
    if (clickedParagraph) {
      clickedParagraph.classList.add('green');
    }

    const clickedIcon = event.currentTarget.querySelector('[data-menu-target="icon"]');

    // Reseta todos os ícones para o estado padrão
    this.iconTargets.forEach(icon => {
      icon.src = icon.dataset.iconDefault;
    });

    // Define o ícone clicado como selecionado
    clickedIcon.src = clickedIcon.dataset.iconSelected;
  }

  animateMenu(event) {
    console.log("animateMenu called, state:", this.state, "event.target:", event.target);
    const activeScreen = document.getElementById('active-screen');

    if (event.target === this.arrowTarget) { // Clicou na seta para voltar (arrow-back)
      if (this.state === 0) {
        // Primeiro clique na seta quando o menu está expandido
        console.log("Iniciando animação do menu para estado reduzido");
        this.updateActiveScreenClass('active-screen-default', 'active-screen-bigger');

        // Passo 1: Animação da máscara
        this.menuTarget.classList.add('shrunk');

        // Aplicar a clipagem do logo
        const logoMenu = this.element.querySelector('.logo-menu');
        logoMenu.classList.add('clipped-logo');

        // Passo 2: Ocultar ícones e seta após 0.2s
        setTimeout(() => {
          this.iconTargets.forEach((icon) => {
            icon.classList.add('hidden');
          });
          this.arrowTarget.classList.add('hidden');
          console.log("Ícones e seta ocultados");
        }, 200);

        // Passo 3: Iniciar animação de redução do menu
        this.menuTarget.classList.add('first-animation');

        // Passo 4: Ocultar textos do menu após 0.4s
        setTimeout(() => {
          this.menuTextTargets.forEach((text) => {
            text.classList.add('hide-text');
          });
          console.log("Textos do menu ocultados");
        }, 400);

        // Passo 5: Reaparecer ícones e setas após 0.7s
        setTimeout(() => {
          this.iconTargets.forEach((icon) => {
            icon.classList.remove('hidden');
            icon.classList.add('reappear');
          });
          this.arrowTarget.classList.remove('hidden');
          this.arrowForwardTarget.classList.remove('hidden');

          // Centralizar a seta
          this.arrowTarget.classList.add('center-arrow');
          this.arrowTarget.classList.add('arrow-height');
          this.menuTarget.classList.add('icons-visible');
          console.log("Ícones e setas reaparecidos e centralizados");
        }, 700);

        // Passo 6: Remover textos do layout após 0.7s
        setTimeout(() => {
          this.menuTextTargets.forEach((text) => {
            text.classList.add('hide-text-hidden');
          });
          console.log("Textos removidos do layout");
        }, 700);

        // Passo 7: Mostrar logo-reduzida.svg e círculo e iniciar animação pulsante após 0.9s
        setTimeout(() => {
          this.logoReduzidaTarget.classList.remove('hidden'); // Mostrar logo reduzida
          this.logoReduzidaTarget.classList.add('pulse-animation-logo-reduzida'); // Iniciar animação pulsante
          this.logoReduzidaCircleTarget.classList.remove('hidden'); // Mostrar círculo
          this.logoReduzidaCircleTarget.classList.add('pulse-animation-logo-reduzida'); // Iniciar animação pulsante no círculo
          console.log("Logo reduzida e círculo exibidos, animação pulsante iniciada");
        }, 850);

        this.state = 1;

      } else if (this.state === 1) {
        // Segundo clique na seta quando o menu está reduzido
        console.log("Iniciando animação do menu para ocultar completamente");
        this.updateActiveScreenClass('active-screen-bigger', 'active-screen-fullscreen');

        // **NOVO CÓDIGO: Iniciar animações de fade-out e shrink da logo reduzida e círculo**
        this.logoReduzidaTarget.classList.add('fade-out-logo-reduzida-animation');
        this.logoReduzidaCircleTarget.classList.add('shrink-circle-logo-reduzida-animation');
        console.log("Iniciadas animações de fade-out da logo reduzida e shrink do círculo");

        // Ocultar logo reduzida e círculo após as animações
        setTimeout(() => {
          this.logoReduzidaTarget.classList.add('hidden');
          this.logoReduzidaCircleTarget.classList.add('hidden');
          console.log("Logo reduzida e círculo ocultados após animações");
        }, 800); // Tempo suficiente para as animações terminarem

        // **FIM DO NOVO CÓDIGO**

        // Passo 1: Iniciar animação de ocultação total do menu
        this.menuTarget.classList.add('hide-menu');

        // Passo 2: Ocultar ícones e setas imediatamente
        this.iconTargets.forEach((icon) => {
          icon.classList.add('hidden');
        });
        this.arrowTarget.classList.add('hidden');
        this.arrowForwardTarget.classList.add('hidden');
        console.log("Ícones e setas ocultados");

        this.state = 2;

        // Passo 3: Exibir o ícone do menu hamburger após 0.7s
        setTimeout(() => {
          this.hamburgerIconTarget.classList.remove('hidden');
          this.hamburgerIconTarget.classList.add('icon');
          this.hamburgerIconTarget.classList.add('reappear');
          console.log("Ícone do menu hamburger exibido");
        }, 700);

      } else if (this.state === 2) {
        // Clique para redefinir o menu para o estado inicial
        console.log("Resetando menu para estado expandido e exibindo hamburger");

        // Ocultar setas completamente
        this.arrowTarget.classList.add('hidden');
        this.arrowForwardTarget.classList.add('hidden');
      }
    } else if (event.target === this.hamburgerIconTarget) { // Clicou no menu hamburger
      if (this.state === 2) {
        console.log("Resetando menu de estado oculto para expandido via hamburger");
        this.animateReverseMenuToExpandedState();
        this.state = 0;
        console.log("State after hamburger click:", this.state);
      }
    } else if (event.target === this.arrowForwardTarget) { // Clicou na seta para avançar (arrow-forward)
      if (this.state === 1) {
        // Animação reversa de estado reduzido para expandido
        this.animateReverseMenuToExpandedState();
        this.arrowForwardTarget.classList.add('display-block');
        this.state = 0;
      } else if (this.state === 2) {
        // Se estiver completamente oculto, resetar para o estado inicial expandido
        console.log("Resetando menu de estado oculto para expandido via arrowForward");
        this.animateReverseMenuToExpandedState();
        this.state = 0;
      }
    }
  }

  animateReverseMenuToExpandedState() {
    console.log("Iniciando animação reversa do menu para estado expandido");

    if (this.state === 2) {
      // Expandindo de estado oculto
      this.updateActiveScreenClass('active-screen-fullscreen', 'active-screen-default');
    } else if (this.state === 1) {
      // Expandindo de estado reduzido
      this.updateActiveScreenClass('active-screen-bigger', 'active-screen-default');
    }

    // Ocultar arrow-forward imediatamente
    setTimeout(() => { this.arrowForwardTarget.classList.add('hidden');}, 200);

    // Iniciar animações de fade-out e shrink
    this.logoReduzidaTarget.classList.add('fade-out-logo-reduzida-animation');
    this.logoReduzidaCircleTarget.classList.add('shrink-circle-logo-reduzida-animation');
    console.log("Iniciadas animações de fade-out da logo reduzida e shrink do círculo");

    // Ocultar logo reduzida e círculo após as animações
    setTimeout(() => {
      this.logoReduzidaTarget.classList.add('hidden');
      this.logoReduzidaCircleTarget.classList.add('hidden');
      console.log("Logo reduzida e círculo ocultados após animações reversas");
    }, 800); // Tempo suficiente para as animações terminarem

    // Ocultar ícones e seta após 0.2s
    setTimeout(() => {
      this.iconTargets.forEach((icon) => {
        icon.classList.add('hidden');
      });
      this.arrowTarget.classList.add('hidden');
      console.log("Ícones e seta ocultados para animação reversa");
    }, 200);

    // Reaparecer textos do menu imediatamente
    this.menuTextTargets.forEach((text) => {
      text.classList.remove('hide-text-hidden');
    });
    console.log("Textos do menu readicionados ao layout");

    // **Remover a classe .icons-visible ANTES do setTimeout**
    this.menuTarget.classList.remove('icons-visible');

    // Iniciar animação de expansão após 0.4s
   
      // Aplicar animação de desclipagem e remover classe clipped-logo
      const logoMenu = this.element.querySelector('.logo-menu');
      logoMenu.classList.remove('clipped-logo');
      logoMenu.classList.add('unclipped-logo-animation');
      console.log("Classe unclipped-logo-animation adicionada ao logo.png");

      // Listener para o fim da animação
      const onAnimationEnd = () => {
        this.resetMenuToFullExpandedStateNoAnimation();
        logoMenu.classList.remove('unclipped-logo-animation');
        logoMenu.removeEventListener('animationend', onAnimationEnd);
        console.log("Animação de desclipagem concluída, menu resetado.");
      };

      logoMenu.addEventListener('animationend', onAnimationEnd);

      this.menuTarget.classList.add('reverse-expand-animation');
      console.log("Iniciando animação de expansão reversa para 250px");

      // Reaparecer ícones e seta durante a expansão
      setTimeout(() => {
        this.iconTargets.forEach((icon) => {
          icon.classList.remove('hidden');
          icon.classList.add('reappear');
        });
      }, 200);
        setTimeout(() => {
          this.arrowTarget.classList.remove('hidden');
        }, 600);
        this.menuTextTargets.forEach((text) => {
          text.classList.remove('hide-text');
        });
        console.log("Ícones, seta e textos reaparecendo durante a expansão reversa");
      
    
  }

  resetMenuToFullExpandedStateNoAnimation() {
    const activeScreen = document.getElementById('active-screen')

    if (activeScreen) {
      activeScreen.classList.remove(
        'active-screen-bigger',
        'active-screen-fullscreen'
      );
      activeScreen.classList.add('active-screen-default');
    }

    this.menuTarget.classList.remove(
      'first-animation',
      'shrunk',
      'icons-visible',
      'hide-menu',
      'reverse-shrink-animation',
      'reverse-expand-animation'
    );
    this.menuTarget.style.width = '250px';
    this.menuTarget.style.visibility = 'visible';

    // Não manipular as classes do logo aqui, pois já foram ajustadas após a animação
    // Certifique-se de não adicionar ou remover 'clipped-logo' ou 'unclipped-logo-animation' aqui

    // Ocultar logo reduzida e círculo
    this.logoReduzidaTarget.classList.add('hidden');
    this.logoReduzidaTarget.classList.remove('pulse-animation-logo-reduzida', 'fade-out-logo-reduzida-animation');
    this.logoReduzidaCircleTarget.classList.add('hidden');
    this.logoReduzidaCircleTarget.classList.remove('pulse-animation-logo-reduzida', 'shrink-circle-logo-reduzida-animation');

    // Garantir que os ícones estejam visíveis e as animações resetadas
    this.iconTargets.forEach((icon) => {
      icon.classList.remove('hidden', 'reappear');
    });

    // Garantir que os textos do menu estejam visíveis
    this.menuTextTargets.forEach((text) => {
      text.classList.remove('hide-text', 'hide-text-hidden');
    });

    // Resetar setas
    this.arrowTarget.classList.remove('center-arrow', 'arrow-height', 'hidden');
    this.arrowForwardTarget.classList.add('hidden');
    this.hamburgerIconTarget.classList.add('hidden');

    console.log("Menu totalmente resetado para o estado expandido sem animação");

    // Adicionado para corrigir o estado após expansão via hamburger
    this.state = 0;
    console.log("State reset to 0 in resetMenuToFullExpandedStateNoAnimation");
  }
}