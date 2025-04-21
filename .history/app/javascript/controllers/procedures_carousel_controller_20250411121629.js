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
      this.checkButtons()
      this.setupTouchEvents()
      this.setupContainerWidth()
      this.resetPosition()
    } else {
      this.disableCarousel()
    }
  }

  disableCarousel() {
    this.containerTarget.style.transform = 'none'
    this.prevButtonTarget.style.display = 'none'
    this.nextButtonTarget.style.display = 'none'
  }

  setupContainerWidth() {
    const itemWidth = this.itemTargets[0].offsetWidth
    const totalWidth = itemWidth * this.itemTargets.length 
    this.containerTarget.style.width = `${totalWidth}px`
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
    const translateX = -this.currentPageValue * (this.containerTarget.offsetWidth / 3) + diff

    this.containerTarget.style.transform = `translateX(${translateX}px)`
  }

  handleTouchEnd(event) {
    if (!this.isDraggingValue || window.innerWidth > 950) return

    const endX = event.changedTouches[0].clientX
    const diff = this.touchStartXValue - endX
    const threshold = this.containerTarget.offsetWidth * 0.2

    this.containerTarget.style.transition = 'transform 0.3s ease'

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && this.currentPageValue < this.totalPages - 1) {
        this.next()
      } else if (diff < 0 && this.currentPageValue > 0) {
        this.prev()
      } else {
        this.resetPosition()
      }
    } else {
      this.resetPosition()
    }

    this.isDraggingValue = false
  }

  resetPosition() {
    if (window.innerWidth > 950) return
    const itemWidth = this.itemTargets[0].offsetWidth
    const translateX = -this.currentPageValue * (itemWidth * 2 + 10)
    this.containerTarget.style.transform = `translateX(${translateX}px)`
  }

  next() {
    if (window.innerWidth > 950) return
    if (this.currentPageValue < this.totalPages - 1) {
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
    const translateX = -this.currentPageValue * (itemWidth * 2 + 10)
    this.containerTarget.style.transform = `translateX(${translateX}px)`
  }

  checkButtons() {
    if (window.innerWidth > 950) return
    this.prevButtonTarget.classList.toggle('hidden', this.currentPageValue === 0)
    this.nextButtonTarget.classList.toggle('hidden', this.currentPageValue === this.totalPages - 1)
  }

  get totalPages() {
    return Math.ceil(this.itemTargets.length + 50px / this.itemsPerPageValue)
  }
} 