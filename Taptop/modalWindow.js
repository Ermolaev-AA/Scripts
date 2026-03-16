const modals = document.querySelectorAll('[modal]')

modals.forEach(modalElement => {
    const name = modalElement.getAttribute('modal')

    modalElement.style.display = 'none'
    modalElement.style.position = 'fixed'
    modalElement.style.zIndex = '999'

    const buttonsOpen = document.querySelectorAll(`[modal-open="${name}"]`)
    const buttonsClose = modalElement.querySelectorAll('[modal-close]')

    if (buttonsOpen.length === 0) return console.warn(`Buttons open for modal ${name} not found!`)
    if (buttonsClose.length === 0) return console.warn(`Buttons close for modal ${name} not found!`)

    buttonsOpen.forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault()
            openModal(modalElement)
        })
    })

    buttonsClose.forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault()
            closeModal(modalElement)
        })
    })
})

const openModal = (modal) => {
    document.body.style.overflow = 'hidden'
    modal.style.display = 'block'
}

const closeModal = (modal) => {
    modal.style.display = 'none'
    document.body.style.overflow = ''
}