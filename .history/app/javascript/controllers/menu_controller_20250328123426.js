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
    this.setupMenu();
    this.setupResizeListener();
  }

  initializeState() {
    this.state = this.STATE.EXPANDED;
    this.setInitialIcon();
    this.arrowForwardTarget.classList.add('hidden');
    this.hamburgerIconTarget.classList.add('hidden');
    this.menuTarget.classList.remove(
      'shrunk', 'icons-visible', 'hide-menu', 'hide-menu-vertical',
      'first-animation', 'first-animation-vertical'
    );
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
    window.addEventListener('resize', () => {
      this.menuTarget.style.width = this.sizeChecker() 
        ? this.MENU_WIDTHS.mobile 
        : this.MENU_WIDTHS.desktop;
    });
  }

  sizeChecker() {
    return window.innerWidth <= 450;
  }

  menuMobileStarter() {
    if (!this.sizeChecker()) return;

    this.state = this.STATE.HIDDEN;
    this.menuTarget.classList.add(this.sizeChecker() ? 'hide-menu-vertical' : 'hide-menu');
    
    this.toggleElementsVisibility({
      icons: false,
      arrows: false,
      hamburger: true,
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

  // CORREÇÃO 1: Ícones iniciam brancos exceto o selecionado
  setInitialIcon() {
    const currentPath = this.element.dataset.menuCurrentPath;
    const pathMappings = {
      '/instrucoes': 'icon-home-selected.svg',
      '/procedures': 'icon-procedures-selected.svg',
      '/opine': 'icon-opine-selected.svg'
    };

    this.iconTargets.forEach(icon => {
      icon.src = icon.dataset.iconDefault; // Reseta para branco
      const selectedFile = pathMappings[currentPath];
      if (selectedFile && icon.dataset.iconSelected.endsWith(selectedFile)) {
        icon.src = icon.dataset.iconSelected; // Aplica verde apenas se corresponder exatamente
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
    
    if (event.target === this.arrowTarget) {
      this.handleArrowBackClick();
    } else if (event.target === this.hamburgerIconTarget && this.state === this.STATE.HIDDEN) {
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
    console.log("Resetando menu de estado oculto para expandido via hamburger");
    this.animateReverseMenuToExpandedState();
    this.state = this.STATE.EXPANDED;
  }

  handleArrowForwardClick() {
    if (this.state === this.STATE.REDUCED || this.state === this.STATE.HIDDEN) {
      console.log("Resetando menu de estado oculto para expandido via arrowForward");
      this.animateReverseMenuToExpandedState();
      this.state = this.STATE.EXPANDED;
    }
  }

  // CORREÇÃO 2: Garante que arrow-forward fica visível no estado reduzido
  transitionToReducedState() {
    console.log("Iniciando animação do menu para estado reduzido");
    this.updateActiveScreenClass('active-screen-default', 'active-screen-bigger');
    
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
      this.toggleElementsVisibility({ 
        icons: true, 
        arrows: true // Mostra ambas as setas
      });
      this.arrowTarget.classList.add('center-arrow', 'arrow-height');
      this.menuTarget.classList.add('icons-visible');
      this.menuTextTargets.forEach(text => text.classList.add('hide-text-hidden'));
    }, 700);

    setTimeout(() => {
      this.toggleElementsVisibility({ logoReduzida: true });
      this.logoReduzidaTarget.classList.add('pulse-animation-logo-reduzida');
      this.logoReduzidaCircleTarget.classList.add('pulse-animation-logo-reduzida');
    }, 850);

    this.state = this.STATE.REDUCED;
  }

  transitionToHiddenState() {
    console.log("Iniciando animação do menu para ocultar completamente");
    this.updateActiveScreenClass('active-screen-bigger', 'active-screen-fullscreen');

    this.logoReduzidaTarget.classList.add('fade-out-logo-reduzida-animation');
    this.logoReduzidaCircleTarget.classList.add('shrink-circle-logo-reduzida-animation');

    setTimeout(() => {
      this.toggleElementsVisibility({ logoReduzida: false });
    }, 800);

    this.menuTarget.classList.add(this.sizeChecker() ? 'hide-menu-vertical' : 'hide-menu');
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

  animateReverseMenuToExpandedState() {
    console.log("Iniciando animação reversa do menu para estado expandido");

    this.menuTarget.classList.remove(
      'reverse-expand-animation', 
      'reverse-expand-animation-vertical',
      'reverse-expand-animation-hamburger',
      'reverse-expand-animation-hamburger-vertical'
    );

    this.arrowTarget.classList.remove('center-arrow', 'arrow-height');
    this.arrowForwardTarget.classList.add('hidden');

    const screenClassMap = {
      [this.STATE.HIDDEN]: ['active-screen-fullscreen', 'active-screen-default'],
      [this.STATE.REDUCED]: ['active-screen-bigger', 'active-screen-default']
    };

    if (screenClassMap[this.state]) {
      this.updateActiveScreenClass(...screenClassMap[this.state]);
    }

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

    const onAnimationEnd = () => {
      this.resetMenuToFullExpandedStateNoAnimation();
      logoMenu.classList.remove('unclipped-logo-animation');
      logoMenu.removeEventListener('animationend', onAnimationEnd);
    };

    logoMenu.addEventListener('animationend', onAnimationEnd);

    void this.menuTarget.offsetWidth;
    this.menuTarget.classList.add(
      this.sizeChecker() 
        ? 'reverse-expand-animation-vertical' 
        : 'reverse-expand-animation'
    );

    setTimeout(() => {
      this.toggleElementsVisibility({ icons: true });
    }, 200);

    setTimeout(() => {
      this.toggleElementsVisibility({ arrows: true });
    }, 600);
  }

  resetMenuToFullExpandedStateNoAnimation() {
    const activeScreen = document.getElementById('active-screen');
    if (activeScreen) {
      activeScreen.className = 'active-screen-default';
    }

    this.menuTarget.className = 'menu';
    this.menuTarget.removeAttribute('style');
    
    this.menuTarget.style.width = this.sizeChecker() 
      ? this.MENU_WIDTHS.mobile 
      : this.MENU_WIDTHS.desktop;
    this.menuTarget.style.position = 'absolute';
    this.menuTarget.style.left = '0';
    this.menuTarget.style.top = '0';

    const logoMenu = this.element.querySelector('.logo-menu');
    if (logoMenu) {
      logoMenu.className = 'logo-menu';
    }

    this.setInitialIcon();

    this.arrowForwardTarget.classList.add('hidden');
    this.arrowTarget.classList.remove('center-arrow', 'arrow-height');

    this.toggleElementsVisibility({
      logoReduzida: false,
      icons: true,
      menuTexts: true,
      arrows: true,
      hamburger: false
    });

    void this.menuTarget.offsetHeight;

    console.log("Menu totalmente resetado para o estado expandido sem animação");
    this.state = this.STATE.EXPANDED;
  }

  // CORREÇÃO 3: Controle correto da visibilidade das setas
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
      this.arrowTarget.classList.toggle('hidden', !arrows);
      this.arrowForwardTarget.classList.toggle('hidden', !arrows); // Mostra/oculta ambas
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