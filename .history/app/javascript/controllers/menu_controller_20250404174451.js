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

  // Constantes para melhor legibilidade
  MENU_WIDTHS = {
    mobile: "180px",
    desktop: "250px"
  }

  STATE = {
    EXPANDED: 0,
    REDUCED: 1,
    HIDDEN: 2
  }

  connect() {
    console.log("Menu controller connected");
    this.initializeState();
    this.setupFullscreenHandler();
    if (this.sizeChecker()) {
      this.menuMobileStarter();
    } else {
      this.setupMenu();
    }
    this.setupResizeListener();
  }

  // [CORREÇÃO] Adicionado reset completo de posicionamento
  initializeState() {
    this.state = this.STATE.EXPANDED;
    this.setInitialIcon();
    
    // Reset crítico de elementos
    this.arrowForwardTarget.classList.add('hidden');
    this.hamburgerIconTarget.classList.add('hidden');
    this.arrowTarget.classList.remove('center-arrow', 'arrow-height');
    
    // Remove todas as classes de animação residual
    this.menuTarget.classList.remove(
      'shrunk', 'icons-visible', 'hide-menu', 'hide-menu-vertical',
      'first-animation', 'first-animation-vertical'
    );
    
    // [CORREÇÃO] Garante posicionamento absoluto original
    this.menuTarget.style.position = 'absolute';
    this.menuTarget.style.left = '0';
    this.menuTarget.style.top = '0';
  }

  setupFullscreenHandler() {
    const fullscreenButton = document.getElementById('fullscreen-button');
    
    const updateFullscreenText = () => {
      const fullscreenText = fullscreenButton.querySelector('p');
      const isFullscreen = document.fullscreenElement || window.innerHeight === screen.height;
      fullscreenText.textContent = isFullscreen ? 'MINIMIZAR' : 'MAXIMIZAR';
    };

    fullscreenButton.addEventListener("click", () => {
      document.fullscreenElement 
        ? document.exitFullscreen() 
        : document.documentElement.requestFullscreen().catch(console.error);
    });

    document.addEventListener('fullscreenchange', updateFullscreenText);
    document.addEventListener('keydown', (e) => e.key === 'F11' && setTimeout(updateFullscreenText, 100));
    window.addEventListener('resize', () => {
      clearTimeout(window.resizeDebounce);
      window.resizeDebounce = setTimeout(updateFullscreenText, 100);
    });
  }

  setupMenu() {
    this.sizeChecker();
    this.menuStarter();
    this.menuMobileStarter();
  }

  setupResizeListener() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const isMobile = this.sizeChecker();
        this.menuTarget.style.width = isMobile ? this.MENU_WIDTHS.mobile : this.MENU_WIDTHS.desktop;
        
        // Resetar estado se mudar entre mobile/desktop
        if (isMobile && this.state !== this.STATE.HIDDEN) {
          this.menuMobileStarter();
        } else if (!isMobile && this.state === this.STATE.HIDDEN) {
          this.resetMenuToFullExpandedStateNoAnimation();
        }
      }, 100);
    });
  }

  sizeChecker() {
    return window.innerWidth <= 450;
  }

  menuMobileStarter() {
    if (!this.sizeChecker()) return;
  
    this.state = this.STATE.HIDDEN;
    this.menuTarget.classList.add('hide-menu-vertical');
    
    this.toggleElementsVisibility({
      icons: false,
      arrows: false,
      hamburger: true, // Mostra apenas o hamburger
      logoReduzida: false,
      menuTexts: false
    });
  
    this.updateActiveScreenClass('active-screen-default', 'active-screen-fullscreen');
  }

  menuStarter() {
    this.menuTarget.style.width = this.sizeChecker() 
      ? this.MENU_WIDTHS.mobile 
      : this.MENU_WIDTHS.desktop;
  }

  // [CORREÇÃO] Garante que apenas o ícone ativo fique selecionado
  setInitialIcon() {
    const currentPath = this.element.dataset.menuCurrentPath;
    const pathMappings = {
      '/instrucoes': 'icon-home-selected.svg',
      '/procedures': 'icon-procedures-selected.svg',
      '/opine': 'icon-opine-selected.svg'
    };

    this.iconTargets.forEach(icon => {
      // Reseta todos os ícones para o estado padrão primeiro
      icon.src = icon.dataset.iconDefault;
      
      // Aplica seleção apenas se houver correspondência exata
      if (pathMappings[currentPath] && icon.dataset.iconSelected.includes(pathMappings[currentPath])) {
        icon.src = icon.dataset.iconSelected;
      }
    });
  }

  updateActiveScreenClass(oldClass, newClass) {
    document.getElementById('active-screen')?.classList.replace(oldClass, newClass);
  }

  selectItem(event) {
    setTimeout(() => {
      const newClass = this.state === this.STATE.REDUCED 
        ? 'active-screen-bigger' 
        : 'active-screen-default';
      this.updateActiveScreenClass('active-screen-default', newClass);
    }, 400);

    this.menuTextTargets.forEach(text => text.classList.remove('green'));
    event.currentTarget.querySelector('.menu-text')?.classList.add('green');

    const clickedIcon = event.currentTarget.querySelector('[data-menu-target="icon"]');
    this.iconTargets.forEach(icon => icon.src = icon.dataset.iconDefault);
    clickedIcon.src = clickedIcon.dataset.iconSelected;
  }

  animateMenu(event) {
    console.log("animateMenu called, state:", this.state, "event.target:", event.target);
    
    // Adiciona prevenção de comportamento padrão
    event.preventDefault();
    event.stopPropagation();
  
    if (this.sizeChecker()) {
      this.handleMobileAnimation(event);
    } else {
      if (event.target === this.arrowTarget) {
        this.handleArrowBackClick();
      } else if (event.target === this.hamburgerIconTarget && this.state === this.STATE.HIDDEN) {
        this.handleHamburgerClick();
      } else if (event.target === this.arrowForwardTarget) {
        this.handleArrowForwardClick();
      }
    }
  }
  
  // Novo método para lidar especificamente com animações mobile
  handleMobileAnimation(event) {
    if (event.target === this.arrowTarget) {
      if (this.state === this.STATE.EXPANDED) {
        this.transitionToReducedState();
      } else if (this.state === this.STATE.REDUCED) {
        this.transitionToHiddenState();
      }
    } else if (event.target === this.hamburgerIconTarget) {
      this.handleHamburgerClick();
    } else if (event.target === this.arrowForwardTarget) {
      this.handleArrowForwardClick();
    }
  }

  handleArrowBackClick() {
    switch (this.state) {
      case this.STATE.EXPANDED:
        this.transitionToReducedState();
        break;
      case this.STATE.REDUCED:
        this.transitionToHiddenState();
        break;
      case this.STATE.HIDDEN:
        this.prepareResetToExpanded();
        break;
    }
  }

  handleHamburgerClick() {
    console.log("Hamburger clicado, estado atual:", this.state);
    
    if (this.sizeChecker()) {
      // Implementação para mobile
      console.log("Abrindo menu mobile via hamburger");
      
      // Remove a classe do hamburger imediatamente
      this.hamburgerIconTarget.classList.add('hidden');
      
      // Se estiver oculto, expande o menu
      if (this.state === this.STATE.HIDDEN) {
        this.animateReverseMenuToExpandedState();
      }
      // Se já estiver expandido, mantém o estado (não faz nada)
      
      this.state = this.STATE.EXPANDED;
    } else {
      // Implementação original para desktop
      console.log("Resetando menu de estado oculto para expandido via hamburger");
      
      // Remove a classe do hamburger
      this.hamburgerIconTarget.classList.add('hidden');
      
      // Remove classes de animação residual
      this.menuTarget.classList.remove(
        'reverse-expand-animation-hamburger',
        'reverse-expand-animation-hamburger-vertical'
      );
  
      // Reset de elementos
      this.arrowTarget.classList.remove('center-arrow', 'arrow-height');
      this.arrowForwardTarget.classList.add('hidden');
      
      // Atualiza a tela ativa
      this.updateActiveScreenClass('active-screen-fullscreen', 'active-screen-default');
      
      // Reset das animações da logo
      this.logoReduzidaTarget.classList.remove(
        'pulse-animation-logo-reduzida',
        'fade-out-logo-reduzida-animation'
      );
      this.logoReduzidaCircleTarget.classList.remove(
        'pulse-animation-logo-reduzida',
        'shrink-circle-logo-reduzida-animation'
      );
  
      // Animação do logo
      const logoMenu = this.element.querySelector('.logo-menu');
      logoMenu.classList.remove('clipped-logo');
      logoMenu.classList.add('unclipped-logo-animation');
      logoMenu.style.marginLeft = '-38px';
  
      const onAnimationEnd = () => {
        logoMenu.style.marginLeft = '0px';
        setTimeout(() => {
          this.resetMenuToFullExpandedStateNoAnimation();
          logoMenu.classList.remove('unclipped-logo-animation');
        }, 10);
        logoMenu.removeEventListener('animationend', onAnimationEnd);
      };
  
      logoMenu.addEventListener('animationend', onAnimationEnd);
  
      // Força recálculo e inicia animação
      void this.menuTarget.offsetWidth;
      this.menuTarget.classList.add('reverse-expand-animation-hamburger');
  
      // Atualiza visibilidade dos elementos
      this.toggleElementsVisibility({
        hamburger: false,
        arrows: true,
        icons: true,
        menuTexts: true,
        logoReduzida: false
      });
  
      this.state = this.STATE.EXPANDED;
    }
  }

  handleArrowForwardClick() {
    if (this.state === this.STATE.REDUCED || this.state === this.STATE.HIDDEN) {
      console.log("Resetando menu de estado oculto para expandido via arrowForward");
      
      // REMOVE IMEDIATAMENTE a classe que centraliza os itens
      this.menuTarget.classList.remove('icons-visible');
      
      this.animateReverseMenuToExpandedState();
      this.state = this.STATE.EXPANDED;
    }
  }

  // [CORREÇÃO] Animação de redução melhorada
  transitionToReducedState() {

    if (this.sizeChecker()) {
      this.transitionToHiddenState(); // Pula direto para oculto em mobile
      return;
    }
    console.log("Iniciando animação do menu para estado reduzido");
    this.updateActiveScreenClass('active-screen-default', 'active-screen-bigger');
    
    // Reset de estados anteriores
    this.logoReduzidaTarget.classList.remove('pulse-animation-logo-reduzida');
    this.logoReduzidaCircleTarget.classList.remove('pulse-animation-logo-reduzida');
    
    this.menuTarget.classList.add('shrunk');
    const logoMenu = this.element.querySelector('.logo-menu');
    logoMenu.classList.add('clipped-logo');
    
    setTimeout(() => {
      this.toggleElementsVisibility({ icons: false, arrows: false });
    }, 200);

    this.menuTarget.classList.add(this.sizeChecker() ? 'first-animation-vertical' : 'first-animation');

    setTimeout(() => {
      this.menuTextTargets.forEach(text => text.classList.add('hide-text'));
    }, 400);

    setTimeout(() => {
      this.toggleElementsVisibility({ icons: true, arrows: true });
      this.arrowTarget.classList.add('center-arrow', 'arrow-height');
      this.menuTarget.classList.add('icons-visible');
      this.menuTextTargets.forEach(text => text.classList.add('hide-text-hidden'));

      // [NOVO] Delay de 0.7s para mostrar arrow-forward
      setTimeout(() => {
        this.arrowForwardTarget.classList.remove('hidden');
      }, 0); // 700ms = 0.7 segundos
    }, 700);

    setTimeout(() => {
      this.toggleElementsVisibility({ logoReduzida: true });
      // [CORREÇÃO] Reinicia animações da logo
      this.logoReduzidaTarget.classList.remove('pulse-animation-logo-reduzida');
      this.logoReduzidaCircleTarget.classList.remove('pulse-animation-logo-reduzida');
      void this.logoReduzidaTarget.offsetWidth; // Força recálculo
      void this.logoReduzidaCircleTarget.offsetWidth;
      this.logoReduzidaTarget.classList.add('pulse-animation-logo-reduzida');
      this.logoReduzidaCircleTarget.classList.add('pulse-animation-logo-reduzida');
    }, 850);

    this.state = this.STATE.REDUCED;
  }

transitionToHiddenState() {
  console.log("Iniciando animação do menu para ocultar completamente");
  
  // Adiciona verificação específica para mobile
  if (this.sizeChecker()) {
    this.menuTarget.classList.add('hide-menu-vertical');
    this.updateActiveScreenClass('active-screen-default', 'active-screen-fullscreen');
    
    // Esconde elementos imediatamente para mobile
    this.toggleElementsVisibility({
      icons: false,
      arrows: false,
      hamburger: false,
      logoReduzida: false
    });
    
    // Mostra hamburger após animação
    setTimeout(() => {
      this.toggleElementsVisibility({ hamburger: true });
    }, 700);
    
    this.state = this.STATE.HIDDEN;
    return;
  }

  // Restante do código original para desktop...
  this.updateActiveScreenClass('active-screen-bigger', 'active-screen-fullscreen');
  this.arrowTarget.classList.add('hidden');
  this.arrowForwardTarget.classList.add('hidden');

  this.logoReduzidaTarget.classList.add('fade-out-logo-reduzida-animation');
  this.logoReduzidaCircleTarget.classList.add('shrink-circle-logo-reduzida-animation');

  setTimeout(() => {
    this.toggleElementsVisibility({ logoReduzida: false });
  }, 800);

  this.menuTarget.classList.add('hide-menu');
  this.toggleElementsVisibility({ icons: false, arrows: false });

  this.state = this.STATE.HIDDEN;

  setTimeout(() => {
    this.toggleElementsVisibility({ hamburger: true });
  }, 700);
}

  prepareResetToExpanded() {
    console.log("Resetando menu para estado expandido e exibindo hamburger");
    this.menuTarget.classList.add(
      this.sizeChecker() 
        ? 'reverse-expand-animation-hamburger-vertical' 
        : 'reverse-expand-animation-hamburger'
    );
    this.toggleElementsVisibility({ arrows: false });
  }

  

  // [CORREÇÃO PRINCIPAL] Animação reversa totalmente resetada
  animateReverseMenuToExpandedState() {
    console.log("Iniciando animação reversa do menu para estado expandido");
  
    // Tratamento específico para mobile (novo)
    if (this.sizeChecker()) {
      console.log("Resetando menu mobile de estado oculto para expandido");
      
      this.toggleElementsVisibility({ logoReduzida: false });
  
      // Remove todas as classes de animação residual
      this.menuTarget.classList.remove(
        'reverse-expand-animation', 
        'reverse-expand-animation-vertical',
        'reverse-expand-animation-hamburger',
        'reverse-expand-animation-hamburger-vertical'
      );
  
      // Reset crítico antes de iniciar animação
      this.arrowTarget.classList.remove('center-arrow', 'arrow-height');
      this.arrowForwardTarget.classList.add('hidden');
      this.arrowTarget.classList.add('hidden');
  
      // Atualiza classes da tela ativa
      this.updateActiveScreenClass('active-screen-fullscreen', 'active-screen-default');
  
      // Reset completo das animações da logo
      this.logoReduzidaTarget.classList.remove(
        'pulse-animation-logo-reduzida',
        'fade-out-logo-reduzida-animation'
      );
      this.logoReduzidaCircleTarget.classList.remove(
        'pulse-animation-logo-reduzida',
        'shrink-circle-logo-reduzida-animation'
      );
  
      const logoMenu = this.element.querySelector('.logo-menu');    
      logoMenu.classList.remove('clipped-logo');
      logoMenu.classList.add('unclipped-logo-animation');
      logoMenu.style.marginLeft = '-38px';
  
      const onAnimationEnd = () => {      
        logoMenu.style.marginLeft = '0px';
        setTimeout(() => {
          this.resetMenuToFullExpandedStateNoAnimation();
          logoMenu.classList.remove('unclipped-logo-animation');
        }, 10);  
        logoMenu.removeEventListener('animationend', onAnimationEnd);
      };
  
      logoMenu.addEventListener('animationend', onAnimationEnd);
  
      // Força recálculo de layout antes da animação
      void this.menuTarget.offsetWidth;
      this.menuTarget.classList.add('reverse-expand-animation-vertical');
  
      this.toggleElementsVisibility({ logoReduzida: false, icons: false, menuTexts: false });
      setTimeout(() => {
        this.arrowForwardTarget.classList.add('hidden');     
        this.toggleElementsVisibility({ arrows: true, icons: true, menuTexts: true });
      }, 600);
      
      return;
    }
  
    // Implementação original para desktop (mantida)
    this.toggleElementsVisibility({ logoReduzida: false });
  
    // Remove todas as classes de animação residual
    this.menuTarget.classList.remove(
      'reverse-expand-animation', 
      'reverse-expand-animation-vertical',
      'reverse-expand-animation-hamburger',
      'reverse-expand-animation-hamburger-vertical'
    );
  
    // Reset crítico antes de iniciar animação
    this.arrowTarget.classList.remove('center-arrow', 'arrow-height');
    this.arrowForwardTarget.classList.add('hidden');
    this.arrowTarget.classList.add('hidden');
  
    const screenClassMap = {
      [this.STATE.HIDDEN]: ['active-screen-fullscreen', 'active-screen-default'],
      [this.STATE.REDUCED]: ['active-screen-bigger', 'active-screen-default']
    };
  
    if (screenClassMap[this.state]) {
      this.updateActiveScreenClass(...screenClassMap[this.state]);
    }
  
    // Reset completo das animações da logo
    this.logoReduzidaTarget.classList.remove(
      'pulse-animation-logo-reduzida',
      'fade-out-logo-reduzida-animation'
    );
    this.logoReduzidaCircleTarget.classList.remove(
      'pulse-animation-logo-reduzida',
      'shrink-circle-logo-reduzida-animation'
    );
  
    const logoMenu = this.element.querySelector('.logo-menu');    
    logoMenu.classList.remove('clipped-logo');
    logoMenu.classList.add('unclipped-logo-animation');
    logoMenu.style.marginLeft = '-38px';
  
    const onAnimationEnd = () => {      
      logoMenu.style.marginLeft = '0px';
      setTimeout(() => {
        this.resetMenuToFullExpandedStateNoAnimation();
        logoMenu.classList.remove('unclipped-logo-animation');
      }, 10);  
      logoMenu.removeEventListener('animationend', onAnimationEnd);
    };
  
    logoMenu.addEventListener('animationend', onAnimationEnd);
  
    // Força recálculo de layout antes da animação
    void this.menuTarget.offsetWidth;
    this.menuTarget.classList.add(
      this.sizeChecker() 
        ? 'reverse-expand-animation-vertical' 
        : 'reverse-expand-animation'
    );
  
    // [CORREÇÃO] Garante que arrow-forward fica oculto
    this.toggleElementsVisibility({ logoReduzida: false, icons: false, menuTexts: false });
    setTimeout(() => {
      this.arrowForwardTarget.classList.add('hidden');     
      this.toggleElementsVisibility({ arrows: true, icons: true, menuTexts: true });
    }, 600);
  }

  // [CORREÇÃO PRINCIPAL] Reset completo do estado expandido
  resetMenuToFullExpandedStateNoAnimation() {
    const activeScreen = document.getElementById('active-screen');
    if (activeScreen) {
      activeScreen.className = 'active-screen-default';
    }

    // Reset completo do menu
    this.menuTarget.className = 'menu';
    this.menuTarget.removeAttribute('style');
    
    // Reaplica estilos base
    this.menuTarget.style.width = this.sizeChecker() 
      ? this.MENU_WIDTHS.mobile 
      : this.MENU_WIDTHS.desktop;
    this.menuTarget.style.position = 'absolute';
    this.menuTarget.style.left = '0';
    this.menuTarget.style.top = '0';

    // Reset do logo principal
    // const logoMenu = this.element.querySelector('.logo-menu');
    // if (logoMenu) {
    //   logoMenu.className = 'logo-menu';
    // }

    // Reset dos ícones
    this.setInitialIcon();

    // [CORREÇÃO CRÍTICA] Reset completo das setas
    this.arrowForwardTarget.classList.add('hidden');
    this.arrowTarget.classList.remove('center-arrow', 'arrow-height');
    this.arrowTarget.classList.add('arrow-back'); // Garante classe CSS original

    // Reset de visibilidade
    this.toggleElementsVisibility({
      arrows: true, // Mantém arrow-back visível
      hamburger: false
    });

    // Força recálculo de layout final
    void this.menuTarget.offsetHeight;

    console.log("Menu totalmente resetado para o estado expandido sem animação");
    this.state = this.STATE.EXPANDED;
  }

  toggleElementsVisibility({
    icons = null,
    arrows = null,
    hamburger = null,
    logoReduzida = null,
    menuTexts = null
  }) {
    if (icons !== null) {
      this.iconTargets.forEach(icon => 
        icons ? icon.classList.remove('hidden') : icon.classList.add('hidden'));
    }
    if (arrows !== null) {
      // Mostra/oculta arrow-back conforme parâmetro
      this.arrowTarget.classList.toggle('hidden', !arrows);
      // [CORREÇÃO] Mostra arrow-forward APENAS no estado reduzido
      // this.arrowForwardTarget.classList.toggle('hidden', this.state !== this.STATE.REDUCED);
    }
    if (hamburger !== null) {
      hamburger 
        ? this.hamburgerIconTarget.classList.remove('hidden') 
        : this.hamburgerIconTarget.classList.add('hidden');
    }
    if (logoReduzida !== null) {
      this.logoReduzidaTarget.classList.toggle('hidden', !logoReduzida);
      this.logoReduzidaCircleTarget.classList.toggle('hidden', !logoReduzida);
    }
    if (menuTexts !== null) {
      this.menuTextTargets.forEach(text => {
        if (menuTexts) {
          text.classList.remove('hide-text', 'hide-text-hidden');
        } else {
          text.classList.add('hide-text-hidden');
        }
      });
    }
  }
}