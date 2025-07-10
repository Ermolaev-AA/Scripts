// // // // // // 
// // // // // //
// // // // // //
// // // // // //

const containers = document.querySelectorAll('[form="container"]')

containers.forEach(container => {
    const div_url = container.querySelector('[metric-input="url"]')
    const div_domain = container.querySelector('[metric-input="domain"]')
    const div_page = container.querySelector('[metric-input="page"]')
    const div_cookie = container.querySelector('[metric-input="cookie"]')
    const div_heading = container.querySelector('[metric-input="heading"]')
    const div_description = container.querySelector('[metric-input="description"]')
    const div_ads_name = container.querySelector('[metric-input="ads-name"]')
    const div_image = container.querySelector('[metric-input="image"]')
    const div_point_1 = container.querySelector('[metric-input="point-1"]')
    const div_point_2 = container.querySelector('[metric-input="point-2"]')
    const div_point_3 = container.querySelector('[metric-input="point-3"]')
    const div_budget_class = container.querySelector('[metric-input="budget-class"]')
    const div_is_bot = container.querySelector('[metric-input="is-bot"]')

    const getInput = div => div ? div.querySelector('input') : null

    const input_url = getInput(div_url)
    const input_domain = getInput(div_domain)
    const input_page = getInput(div_page)
    const input_cookie = getInput(div_cookie)
    const input_heading = getInput(div_heading)
    const input_description = getInput(div_description)
    const input_ads_name = getInput(div_ads_name)
    const input_image = getInput(div_image)
    const input_point_1 = getInput(div_point_1)
    const input_point_2 = getInput(div_point_2)
    const input_point_3 = getInput(div_point_3)
    const input_budget_class = getInput(div_budget_class)
    const input_is_bot = getInput(div_is_bot)

    const getText = div => div ? div.querySelector('span')?.textContent : null
    const getImage = div => div ? 'https://' + new URL(window.location.href).hostname + div.querySelector('img')?.getAttribute('src') : null

    const value_url = window.location.href
    const value_domain = new URL(window.location.href).hostname
    const value_page = window.location.pathname.split('/').pop()
    const value_cookie = document.cookie
    const value_heading = getText(container.querySelector('[metric-variable="heading"]'))
    const value_description = getText(container.querySelector('[metric-variable="description"]'))
    const value_ads_name = getText(container.querySelector('[metric-variable="ads-name"]'))
    const value_image = getImage(container.querySelector('[metric-variable="image"]'))
    const value_point_1 = getText(container.querySelector('[metric-variable="point-1"]'))
    const value_point_2 = getText(container.querySelector('[metric-variable="point-2"]'))
    const value_point_3= getText(container.querySelector('[metric-variable="point-3"]'))
    const value_budget_class = getText(container.querySelector('[metric-variable="budget-class"]'))
    const value_is_bot = 'disabled'

    const getValue = (input, value, name) => {
        if (input) {
            input.value = value

            // DEBUG
            // console.log(`GET VALUE :: ${name} ::`, value)
        } else {
            console.warn(`Поле ${name} не существует!`)
        }
    }

    getValue(input_url, value_url, 'URL')
    getValue(input_domain, value_domain, 'DOMAIN')
    getValue(input_page, value_page, 'PAGE')
    getValue(input_cookie, value_cookie, 'COOKIE')
    getValue(input_heading, value_heading, 'HEADING')
    getValue(input_description, value_description, 'DESCRIPTION')
    getValue(input_ads_name, value_ads_name, 'ADS NAME')
    getValue(input_image, value_image, 'IMAGE')
    getValue(input_point_1, value_point_1, 'POINT 1')
    getValue(input_point_2, value_point_2, 'POINT 2')
    getValue(input_point_3, value_point_3, 'POINT 3')
    getValue(input_budget_class, value_budget_class, 'BUDGET CLASS')
    getValue(input_is_bot, value_is_bot, 'IS BOT')

    const div_phone = container.querySelector('[form-input="phone"]')
    const input_phone = getInput(div_phone)
    const instance = container.getAttribute('instance')
    const token = container.getAttribute('token')
    const redirect = container.getAttribute('redirect')

    if (input_phone) {
        const mask_phone = div_phone.getAttribute('mask')

        if (mask_phone) {
            maskPhone(input_phone, mask_phone)
        } 

        if (instance && token) {
            if (redirect) {
                getVerified(container)
            }
        }
    }

})

function maskPhone(field, mask) {
    var phoneValue = IMask(field, {
        mask: '+{7} 000 000 00 00',
        lazy: true,
        placeholderChar: ''
    });
    
    field.addEventListener('blur', function() {
        // Если введенная длина меньше длины маски, то сбрасываем значение поля
        // Если введенная длина меньше 11 (длины номера с маской), то сбрасываем значение поля
        if (phoneValue.unmaskedValue.length < 11) {
            phoneValue.value = ''; // Очищаем значение поля
        }
    });
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
