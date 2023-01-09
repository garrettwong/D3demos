class Node {
  constructor(value, next) {
    this.value = null
    this.next = null
  }

  setNext(next) {
    this.next = next
  }

  getNext() {
    return this.next
  }

  getValue() {
    return this.value
  }
}
