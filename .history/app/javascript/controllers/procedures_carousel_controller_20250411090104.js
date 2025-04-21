import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["container", "item", "prevButton", "nextButton"]
  static values = {
    itemsPerPage: { type: Number, default: 4 },
    currentPage: { type: Number, default: 0 }
  }

  connect() {
    this.updateVisibility()
    this.checkButtons()
  }

  next() {
    if (this.currentPageValue < this.totalPages - 1) {
      this.currentPageValue++
      this.updateVisibility()
      this.checkButtons()
    }
  }

  prev() {
    if (this.currentPageValue > 0) {
      this.currentPageValue--
      this.updateVisibility()
      this.checkButtons()
    }
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