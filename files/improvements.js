const documentBody = document.querySelector('body')
const loader = document.querySelector('.curtain')
const checkbox = document.querySelector('.curtainCheckBox')

export function switchLoader() {
  // setTimeout(() => {
  //   checkbox.checked = false
  // },3000)
}

loader.addEventListener('transitionend', () => {
  loader.remove()
  documentBody.classList.remove('loader')
  documentBody.classList.add('scrollable')
})