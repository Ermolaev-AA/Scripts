const showHideContainers = document.querySelectorAll('[show-hide-block]')

const DURATION_MS = 250
const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)'

showHideContainers.forEach(container => {
    const name = container.getAttribute('show-hide-block')
    const button = document.querySelector(`[show-hide-button="${name}"]`)

    if (!name) return console.warn(`Attribute show-hide-block for container ${container.id} not found!`)
    if (!button) return console.warn(`Button show-hide-button="${name}" for container ${container.id} not found!`)

    let isOpen = false

    container.style.overflow = 'hidden'
    container.style.maxHeight = '0'
    container.style.opacity = '0'
    container.style.transition = `max-height ${DURATION_MS}ms ${EASING}, opacity ${DURATION_MS}ms ${EASING}`
    container.style.display = 'none'

    const buttonShowText = button.getAttribute('show-text') || 'Скрыть'
    const buttonHideText = button.getAttribute('hide-text') || 'Показать'

    button.textContent = buttonHideText

    const open = () => {
        isOpen = true
        container.style.display = ''
        container.style.maxHeight = '0'
        container.style.opacity = '0'
        void container.offsetHeight
        requestAnimationFrame(() => {
            container.style.maxHeight = `${container.scrollHeight}px`
            container.style.opacity = '1'
        })
    }

    const close = () => {
        isOpen = false
        const h = container.scrollHeight
        container.style.maxHeight = `${h}px`
        void container.offsetHeight
        container.style.maxHeight = '0'
        container.style.opacity = '0'
    }

    container.addEventListener('transitionend', e => {
        if (e.target !== container || e.propertyName !== 'max-height') return
        if (isOpen) {
            container.style.maxHeight = 'none'
        } else {
            container.style.display = 'none'
        }
    })

    button.addEventListener('click', () => {
        if (isOpen) {
            if (container.style.maxHeight === 'none') {
                container.style.maxHeight = `${container.scrollHeight}px`
                void container.offsetHeight
            }
            close()
        } else {
            open()
        }
        button.textContent = isOpen ? buttonShowText : buttonHideText
    })
})
