// // // // // // // // //
// // // // // // // // //
// // // // // // // // //
// // // // // // // // //
// // // // // // // // //

const containers = document.querySelectorAll('[form="container"]')

containers.forEach(container => {
    const getInput = div => div ? div.querySelector('input') : null
    const getContent = div => {
        const span = div.querySelector('span')?.textContent
        const imgPath = div.querySelector('img')?.getAttribute('src')

        if (span) return span
        if (imgPath) return 'https://' + new URL(window.location.href).hostname + imgPath
    }

    const input = {}
    const variable = {}
    const value = {
        url: window.location.href,
        domain: new URL(window.location.href).hostname,
        page: window.location.pathname.split('/').pop(),
        cookie: document.cookie,
        is_bot: 'disabled'
    }

    container.querySelectorAll('[metric-input]').forEach(el => {
        const key = el.getAttribute('metric-input').replace(/-/g, '_')
        input[key] = getInput(el)
    })

    container.querySelectorAll('[metric-variable]').forEach(el => {
        const key = el.getAttribute('metric-variable').replace(/-/g, '_')
        variable[key] = getContent(el)
    })

    for (const key in variable) value[key] = variable[key]
    for (const key in input) {
        const val = value?.[key]

        if (val !== undefined) {
            input[key].value = val
            // console.log(`${key} →`, val) // DEBUG
        } else {     
            console.warn(`The value for the «${key}» field was not found!`) // DEBUG
        }
    }

    // // // //     // // // //     // // // //     // // // //     // // // //
    // // // //     // // // //     // // // //     // // // //     // // // //
    // // // //     // // // //     // // // //     // // // //     // // // //

    const containerPhone = container.querySelector('[form-input="phone"]')
    const inputPhone = getInput(containerPhone)
    const phoneMask = containerPhone?.getAttribute('mask')

    if (inputPhone) getMask(inputPhone, phoneMask)

    const instance = container.getAttribute('instance')
    const token = container.getAttribute('token')
    const redirect = container.getAttribute('redirect')

    if (instance && token) {
        if (redirect) getVerified(container)
    }

})

function getMask(field, mask) {
    var phoneValue = IMask(field, {
        mask: '+{7} 000 000 00 00',
        lazy: true,
        placeholderChar: ''
    })
    
    field.addEventListener('blur', function() {
        // Если введенная длина меньше длины маски, то сбрасываем значение поля
        // Если введенная длина меньше 11 (длины номера с маской), то сбрасываем значение поля
        if (phoneValue.unmaskedValue.length < 11) {
            phoneValue.value = '' // Очищаем значение поля
        }
    })
}

function getVerified(container) {
    const form = container.querySelector('form')
    
    form.addEventListener('submit', async function(event) {
        const requiredContainers = form.querySelectorAll('[required-input="true"]')
        const requiredInputs = Array.from(requiredContainers).map(container => container.querySelector('input'))
        const emptyInputs = requiredInputs.filter(input => !input || input.value.trim() === '')

        if (emptyInputs.length > 0) {
            console.warn('Заполнены не все обязательные поля!')
        } else {
            const instance = container.getAttribute('instance')
            const token = container.getAttribute('token')
            const phoneNumber = form.querySelector('[form-input="phone"]').querySelector('input').value.replace(/\D/g, '')

            const url = `https://api.green-api.com/waInstance${instance}/checkWhatsapp/${token}`
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber: phoneNumber })
            }

            const verified = await fetch(url, options)
                .then(response => response.json())
                .then(data => {
                    const isBotInput = container.querySelector('[metric-input="is-bot"]').querySelector('input')
                    const isBot = !data.existsWhatsapp

                    isBotInput.value = isBot
                    getRedirect(isBot, container)
                })
                .catch(error => {
                    console.error(error)
                })
        }
    })
}

function getRedirect(value, container) {
    const observer = new MutationObserver((mutationsList, observer) => { 
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (container.classList.contains('is-success')) {
                    const domain = new URL(window.location.href).hostname
                    const pageRedirect = container.getAttribute('redirect')
                    const page = window.location.pathname.split('/').pop()
                    const redirect = 'https://' + domain + pageRedirect

                    window.location.href = redirect + `?in_success=${page}&is_bot=${value}`
                    observer.disconnect()
                    break
                } 
            }
        }
    })

    observer.observe(container, { attributes: true, attributeFilter: ['class'] })
}