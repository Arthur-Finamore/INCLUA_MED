import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["menu", "menuText", "icon", "arrow", "arrowForward", "hamburgerIcon"]

  connect() {
    console.log("Menu controller connected");
    this.state = 0;
    this.setInitialIcon();
    this.arrowForwardTarget.classList.add('hidden');
    this.hamburgerIconTarget.classList.add('hidden'); // Garante que o hamburger começa escondido
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

  // Manipula o clique nos itens do menu
  selectItem(event) {
    // Remove 'green' class from all menu texts
    this.menuTextTargets.forEach(text => {
      text.classList.remove('green');
    });

    // Get the paragraph element of the clicked link
    const clickedParagraph = event.currentTarget.querySelector('.menu-text');

    // Add 'green' class to the clicked paragraph
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
    if (event.target === this.arrowTarget) { // Clicou na seta para voltar (arrow-back)
      if (this.state === 0) {
        // Primeiro clique na seta quando o menu está expandido
        console.log("Iniciando animação do menu para estado reduzido");

        // Passo 1: Animação da máscara
        this.menuTarget.classList.add('shrunk');

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

        // Passo 4: Remover textos do layout após 0.4s
        setTimeout(() => {
          this.menuTextTargets.forEach((text) => {
            text.classList.add('hide-text');
          });
          console.log("Textos ocultados");
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

        this.state = 1;

      } else if (this.state === 1) {
        // Segundo clique na seta quando o menu está reduzido
        console.log("Iniciando animação do menu para ocultar completamente");

        // Passo 1: Iniciar animação de redução total do menu
        this.menuTarget.classList.add('hide-menu');

        // Passo 2: Ocultar ícones e setas imediatamente
        this.iconTargets.forEach((icon) => {
          icon.classList.add('hidden');
        });
        this.arrowTarget.classList.add('hidden');
        this.arrowForwardTarget.classList.add('hidden');
        console.log("Ícones e setas ocultados");

        this.state = 2;

        // Passo 3: Exibir o ícone do menu hamburger
        setTimeout(() => { this.hamburgerIconTarget.classList.remove('hidden'); }, 700);
        setTimeout(() => { this.hamburgerIconTarget.classList.add('icon'); }, 700);
        setTimeout(() => { this.hamburgerIconTarget.classList.add('reappear'); }, 700);


      } else if (this.state === 2) {
        // Clique para redefinir o menu para o estado inicial
        console.log("Resetando menu para estado inicial e exibindo hamburger");

        // Passo 1: Ocultar as setas (arrow-back e arrow-forward) completamente
        this.arrowTarget.classList.add('hidden');
        this.arrowForwardTarget.classList.add('hidden');
      }
    } else if (event.target === this.arrowForwardTarget) { // Clicou na seta para avançar (arrow-forward)
      if (this.state === 1) {
        // Animação reversa de estado reduzido para expandido
        this.animateReverseMenuToExpandedState(); // Chama a função de animação reversa
        this.state = 0; // Reseta o estado para expandido
      } else if (this.state === 2) {
        // Se estiver completamente oculto, resetar para o estado inicial expandido
        console.log("Resetando menu de estado oculto para expandido via arrowForward (indireto)");
        this.resetMenuToExpandedState(); // Mantém resetMenuToExpandedState para o estado 2 (mas agora ele anima)
      }
    }
  }

  resetMenuToExpandedState() {
    if (this.state === 2) {
      console.log("Resetando menu de estado oculto para expandido via hamburger (direto) - Animado");
      this.animateReverseMenuToExpandedState(); // Chama a função de animação reversa para hamburger também
      this.state = 0; // Reseta o estado para expandido
    } else {
      console.log("Resetando menu para estado expandido - Sem animação direta para outros casos");
      // Reseta para expandido SEM animação, para chamadas diretas sem ser do hamburger/arrowForward do estado 1.
      this.resetMenuToFullExpandedStateNoAnimation();
    }
  }


  animateReverseMenuToExpandedState() {
    console.log("Iniciando animação reversa do menu para estado expandido");

    setTimeout(() => { this.arrowForwardTarget.classList.add('hidden'); }, 200);// Oculta arrow-forward no início da animação reversa

    // Passo 2: Ocultar ícones e seta após 0.2s (tempo da animação reverse-shrink)
    setTimeout(() => {
      this.iconTargets.forEach((icon) => {
        icon.classList.add('hidden');
      });
      this.arrowTarget.classList.add('hidden');
      console.log("Ícones e seta ocultados para animação reversa");
    }, 200); // 0.2s = tempo de reverse-shrink-animation


    // ***TEXTOS REAPARECEM AQUI, ANTES DA EXPANSÃO***
    this.menuTextTargets.forEach((text) => {
      text.classList.remove('hide-text-hidden'); // Reaparecer textos no layout IMEDIATAMENTE
    });
    console.log("Textos readicionados ao layout IMEDIATAMENTE");


    // Passo 3: Iniciar animação de expansão para 260px após a redução inicial
    setTimeout(() => {
      this.menuTarget.classList.add('reverse-expand-animation');
      console.log("Iniciando animação de expansão reversa para 260px");

      // Passo 4: Reaparecer ícones e seta durante a expansão (ou logo após o início) e ANIMAR TEXTOS
      setTimeout(() => {
        this.iconTargets.forEach((icon) => {
          icon.classList.remove('hidden');
          setTimeout(() => { icon.classList.add('reappear');}, 0); });
          setTimeout(() => {this.arrowTarget.classList.remove('hidden');}, 400);
          this.menuTextTargets.forEach((text) => {
          setTimeout(() => { text.classList.remove('hide-text');}, 700); // ANIMAÇÃO DE DESMASCARAMENTO DOS TEXTOS
        });
        console.log("Ícones, seta e textos reaparecendo/animando durante a expansão reversa");
      }, 600); // Inicia o reaparecimento/animação 0.1s após o início da expansão (total 0.3s após clique)

    }, 200); // Inicia a expansão após 0.2s da redução inicial (total 0.4s após clique)


    // Passo 5: Resetar menu para estado expandido original após a animação de expansão terminar (0.6s de reverse-expand + delays)
    setTimeout(() => {
      this.resetMenuToFullExpandedStateNoAnimation();
      console.log("Menu resetado para estado expandido final");
    }, 800); // 0.8s = 0.2s (shrink) + 0.6s (expand) - Tempo total aproximado da animação reversa
  }


  resetMenuToFullExpandedStateNoAnimation() {
    this.menuTarget.classList.remove('first-animation', 'shrunk', 'icons-visible', 'hide-menu', 'reverse-shrink-animation', 'reverse-expand-animation');
    this.menuTarget.style.width = '250px';
    this.menuTarget.style.visibility = 'visible';

    this.iconTargets.forEach((icon) => {
      icon.classList.remove('hidden');
      icon.classList.remove('reappear'); // Remove reappear class to prevent animation on reset
    });

    this.menuTextTargets.forEach((text) => {
      text.classList.remove('hide-text', 'hide-text-hidden');
    });

    this.arrowTarget.classList.remove('center-arrow', 'arrow-height', 'hidden');
    this.arrowForwardTarget.classList.add('hidden'); // Garante que arrow-forward fica hidden no estado expandido
    this.hamburgerIconTarget.classList.add('hidden'); // Esconde o hamburger ao resetar para expandido
  }
}