import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["container", "item", "prevButton", "nextButton"]
  static values = {
    itemsPerPage: { type: Number, default: 4 },
    currentPage: { type: Number, default: 0 },
    touchStartX: { type: Number, default: 0 },
    isDragging: { type: Boolean, default: false }
  }

  connect() {
    this.updateVisibility()
    this.checkButtons()
    this.setupTouchEvents()
  }

  setupTouchEvents() {
    this.containerTarget.addEventListener('touchstart', this.handleTouchStart.bind(this))
    this.containerTarget.addEventListener('touchmove', this.handleTouchMove.bind(this))
    this.containerTarget.addEventListener('touchend', this.handleTouchEnd.bind(this))
  }

  handleTouchStart(event) {
    this.touchStartXValue = event.touches[0].clientX
    this.isDraggingValue = true
    this.containerTarget.style.transition = 'none'
  }

  handleTouchMove(event) {
    if (!this.isDraggingValue) return

    const currentX = event.touches[0].clientX
    const diff = this.touchStartXValue - currentX
    const translateX = -this.currentPageValue * 100 + (diff / this.containerTarget.offsetWidth) * 100

    this.containerTarget.style.transform = `translateX(${translateX}%)`
  }

  handleTouchEnd(event) {
    if (!this.isDraggingValue) return

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
    this.containerTarget.style.transform = `translateX(${-this.currentPageValue * 100}%)`
  }

  next() {
    if (this.currentPageValue < this.totalPages - 1) {
      this.currentPageValue++
      this.slideToPage()
      this.checkButtons()
    }
  }

  prev() {
    if (this.currentPageValue > 0) {
      this.currentPageValue--
      this.slideToPage()
      this.checkButtons()
    }
  }

  slideToPage() {
    this.containerTarget.style.transition = 'transform 0.3s ease'
    this.containerTarget.style.transform = `translateX(${-this.currentPageValue * 100}%)`
  }

  updateVisibility() {
    const start = this.currentPageValue * this.itemsPerPageValue
    const end = start + this.itemsPerPageValue

    this.itemTargets.forEach((item, index) => {
      if (index >= start && index < end) {
        item.classList.remove('hidden')
      } else {
        item.classList.add('hidden')
      }
    })
  }

  checkButtons() {
    this.prevButtonTarget.classList.toggle('hidden', this.currentPageValue === 0)
    this.nextButtonTarget.classList.toggle('hidden', this.currentPageValue === this.totalPages - 1)
  }

  get totalPages() {
    return Math.ceil(this.itemTargets.length / this.itemsPerPageValue)
  }
} 