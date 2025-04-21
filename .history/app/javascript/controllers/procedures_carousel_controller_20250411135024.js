import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["container", "item", "prevButton", "nextButton"]
  static values = {
    itemsPerPage: { type: Number, default: 2 },
    currentPage: { type: Number, default: 0 },
    touchStartX: { type: Number, default: 0 },
    isDragging: { type: Boolean, default: false }
  }

  connect() {
    if (window.innerWidth <= 950) {
      this.updateItemsPerPage()
      this.checkButtons()
      this.setupTouchEvents()
      this.setupContainerWidth()
      this.resetPosition()
    } else {
      this.disableCarousel()
    }

    // Adiciona listener para redimensionamento da janela
    window.addEventListener('resize', this.handleResize.bind(this))
  }

  disconnect() {
    window.removeEventListener('resize', this.handleResize.bind(this))
  }

  handleResize() {
    if (window.innerWidth <= 950) {
      this.updateItemsPerPage()
      this.setupContainerWidth()
      this.resetPosition()
      this.checkButtons()
    } else {
      this.disableCarousel()
    }
  }

  updateItemsPerPage() {
    this.itemsPerPageValue = window.innerWidth <= 540 ? 1 : 2
  }

  disableCarousel() {
    this.containerTarget.style.transform = 'none'
    this.prevButtonTarget.style.display = 'none'
    this.nextButtonTarget.style.display = 'none'
  }

  setupContainerWidth() {
    const itemWidth = this.itemTargets[0].offsetWidth
    const gap = 10 // gap entre os itens
    const padding = 20 // padding lateral
    const totalWidth = (itemWidth * this.itemTargets.length) + (gap * (this.itemTargets.length - 1)) + (padding * 2)
    this.containerTarget.style.width = `${totalWidth}px`
    this.containerTarget.style.padding = `0 ${padding}px`
  }

  setupTouchEvents() {
    this.containerTarget.addEventListener('touchstart', this.handleTouchStart.bind(this))
    this.containerTarget.addEventListener('touchmove', this.handleTouchMove.bind(this))
    this.containerTarget.addEventListener('touchend', this.handleTouchEnd.bind(this))
  }

  handleTouchStart(event) {
    if (window.innerWidth > 950) return
    this.touchStartXValue = event.touches[0].clientX
    this.isDraggingValue = true
    this.containerTarget.style.transition = 'none'
  }

  handleTouchMove(event) {
    if (!this.isDraggingValue || window.innerWidth > 950) return

    const currentX = event.touches[0].clientX
    const diff = this.touchStartXValue - currentX
    const itemWidth = this.itemTargets[0].offsetWidth
    const gap = 10
    const padding = 20
    const translateX = -this.currentPageValue * (itemWidth + gap) + diff

    this.containerTarget.style.transform = `translateX(${translateX}px)`
  }

  handleTouchEnd(event) {
    if (!this.isDraggingValue || window.innerWidth > 950) return

    const endX = event.changedTouches[0].clientX
    const diff = this.touchStartXValue - endX
    const threshold = this.containerTarget.offsetWidth * 0.2

    this.containerTarget.style.transition = 'transform 0.3s ease'

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && !this.isLastItemFullyVisible()) {
        this.next()
      } else if (diff < 0 && !this.isFirstItemFullyVisible()) {
        this.prev()
      } else {
        this.resetPosition()
      }
    } else {
      this.resetPosition()
    }

    this.isDraggingValue = false
  }

  isFirstItemFullyVisible() {
    const firstItem = this.itemTargets[0]
    const containerRect = this.containerTarget.getBoundingClientRect()
    const itemRect = firstItem.getBoundingClientRect()
    return itemRect.left >= containerRect.left
  }

  isLastItemFullyVisible() {
    const lastItem = this.itemTargets[this.itemTargets.length - 1]
    const containerRect = this.containerTarget.getBoundingClientRect()
    const itemRect = lastItem.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const maxTranslateX = -(this.itemTargets.length - this.itemsPerPageValue) * (this.itemTargets[0].offsetWidth + 10)
    const currentTranslateX = this.getCurrentTranslateX()

    // Verifica se o último item está visível e se não podemos mais rolar para a direita
    return itemRect.right <= viewportWidth || currentTranslateX <= maxTranslateX
  }

  getCurrentTranslateX() {
    const style = window.getComputedStyle(this.containerTarget)
    const matrix = new WebKitCSSMatrix(style.transform)
    return matrix.m41
  }

  resetPosition() {
    if (window.innerWidth > 950) return
    const itemWidth = this.itemTargets[0].offsetWidth
    const gap = 10
    const padding = 20
    const translateX = -this.currentPageValue * (itemWidth + gap)
    this.containerTarget.style.transform = `translateX(${translateX}px)`
  }

  next() {
    if (window.innerWidth > 950) return
    if (!this.isLastItemFullyVisible()) {
      this.currentPageValue++
      this.slideToPage()
      this.checkButtons()
    }
  }

  prev() {
    if (window.innerWidth > 950) return
    if (this.currentPageValue > 0) {
      this.currentPageValue--
      this.slideToPage()
      this.checkButtons()
    }
  }

  slideToPage() {
    if (window.innerWidth > 950) return
    this.containerTarget.style.transition = 'transform 0.3s ease'
    const itemWidth = this.itemTargets[0].offsetWidth
    const gap = 10
    const padding = 20
    const translateX = -this.currentPageValue * (itemWidth + gap)
    this.containerTarget.style.transform = `translateX(${translateX}px)`
  }

  checkButtons() {
    if (window.innerWidth > 950) return
    
    // Seta esquerda: aparece quando não estamos na primeira página
    this.prevButtonTarget.classList.toggle('hidden', this.currentPageValue === 0)
    
    // Seta direita: desaparece quando o último item está visível
    this.nextButtonTarget.classList.toggle('hidden', this.isLastItemFullyVisible())
  }

  get totalPages() {
    return Math.ceil(this.itemTargets.length / this.itemsPerPageValue)
  }
} 