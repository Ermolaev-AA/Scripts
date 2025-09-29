const containers = document.querySelectorAll('[ea-form="container"]')

containers.forEach(container => {
    const clonedContainer = container.cloneNode(true)
    while (clonedContainer.attributes.length > 0) clonedContainer.removeAttribute(clonedContainer.attributes[0].name)

    const containerClass = container.className
    const attrRedirect = container.getAttribute('redirect')
    const attrRedirectProxy = container.getAttribute('redirect-proxy')
    const attrWebhook = container.getAttribute('webhook')
    const attrCaptchaStep = container.getAttribute('captcha-step') // values: before, after, inside, random

    clonedContainer.className = containerClass
    if (attrRedirect !== null) clonedContainer.setAttribute('redirect', attrRedirect)
    if (attrRedirectProxy !== null) clonedContainer.setAttribute('redirect-proxy', attrRedirectProxy)
    if (attrWebhook !== null) clonedContainer.setAttribute('webhook', attrWebhook)
    if (attrCaptchaStep !== null) clonedContainer.setAttribute('captcha-step', attrCaptchaStep)
    
    container.parentNode.insertBefore(clonedContainer, container.nextSibling)
    clonedContainer.querySelector('re-captcha').remove()
    container.remove()

    addForm(clonedContainer)
})

function addForm(container) {
    const form = container.querySelector('form')

    overwriteFields(form)
    const dataCaptcha = addCaptcha(container)
    overwriteSubmit(form)
    getMask(form)

    onSubmit(container, dataCaptcha)
}

function overwriteFields(form) {
    const inputs = form.querySelectorAll('input[input-value]')

    inputs.forEach(input => {
        const name = input.getAttribute('input-value')
        const type = input.getAttribute('type')
        const placeholder = input.getAttribute('placeholder')
        const containerClass = input.parentElement.className
        const inputClass = input.className

        const autocompleteMap = {
            name: 'name',
            firstname: 'given-name',
            lastname: 'family-name',
            email: 'email',
            phone: 'tel',
            tel: 'tel'
        }

        const autocomplete = autocompleteMap[name] || ''

        const newField = `<div field="${name}" class="${containerClass}">
            <input name="${name}" type="${type}" placeholder="${placeholder}" class="${inputClass}" ${autocomplete ? `autocomplete="${autocomplete}"` : ''} required>
        </div>`

        form.insertAdjacentHTML('beforeend', newField)
        input.parentElement.remove()
    })
}

function addCaptcha(container) {
    const form = container.querySelector('form')
    const captchaStep = container.getAttribute('captcha-step')

    const input = form.querySelector('input')
    const containerClass = input.parentElement.className
    const inputClass = input.className

    const style = `
        display: none;
        min-width: 350px;
    `

    const questions = [
        // {
        //     question: 'Напишите текстом 0',
        //     answers: ['Ноль', 'ноль', '0']
        // },
        // {
        //     question: 'Напишите текстом 1',
        //     answers: ['Один', 'один', '1']
        // },
        // {
        //     question: 'Напишите текстом 2',
        //     answers: ['Два', 'два', '2']
        // },
        // {
        //     question: 'Напишите текстом 3',
        //     answers: ['Три', 'три', '3']
        // },
        // {
        //     question: 'Напишите текстом 5',
        //     answers: ['Пять', 'пять', '5']
        // },
        {
            question: 'Скольк будет 2+2?',
            answers: ['4', 'Четыре', 'четыре']
        },
        {
            question: 'Скольк будет 1+2?',
            answers: ['3', 'Три', 'три']
        },
        {
            question: 'Скольк будет 3+2?',
            answers: ['5', 'Пять', 'пять']
        },
        {
            question: 'Скольк будет 4+4?',
            answers: ['8', 'Восемь', 'восемь']
        },
        {
            question: 'Скольк будет 5+4?',
            answers: ['9', 'Девять', 'девять']
        },
    ]

    const question = questions[Math.floor(Math.random() * questions.length)]

    const captcha = `<div field="captcha" class="${containerClass}" style="${style}">
        <input name="captcha" type="text" placeholder="${question.question}" attempts="0" class="${inputClass}">
    </div>`

    form.insertAdjacentHTML('beforeend', captcha)

    return question
}

function overwriteSubmit(form) {
    const submit = form.querySelector('button[type="submit"]')
    const submitClass = submit.className
    const text = submit.querySelector('span').querySelector('span').textContent

    const newSubmit = `<button type="submit" class="${submitClass}">
        <span>${text}</span>
    </button>`

    form.insertAdjacentHTML('beforeend', newSubmit)
    submit.remove()
}

function getMask(form) {
    const inputPhone = form.querySelector('[name="phone"]')
    if (!inputPhone) return

    const phoneValue = IMask(inputPhone, {
        mask: '+{7} 000 000 00 00',
        lazy: true,
        placeholderChar: ''
    })

    inputPhone.addEventListener('blur', function () {
        if (phoneValue.unmaskedValue.length < 11) {
            phoneValue.value = ''
        }
    })
}

function onSubmit(container, dataCaptcha) {
    const form = container.querySelector('form')

    form.addEventListener('submit', async function(event) {
        event.preventDefault()

        // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
        // -- it will be possible to add field validation...

        const captchaPassed = captchaVerification(form, dataCaptcha)
        if (!captchaPassed) return

        const submit = form.querySelector('[type="submit"]')
        const submitText = submit.querySelector('span')

        const submitTextDefault = submitText.textContent
        const submitTextLoading = 'Пожалуйста, подождите...'

        const controls = form.querySelectorAll('button')

        submitText.textContent = submitTextLoading
        form.setAttribute('aria-busy', 'true')
        controls.forEach(el => el.disabled = true)

        try {
            const lead = await buildLead(form)
            const redirectURL = buildRedirectURL(container, lead)
            const webhookRes = await sendWebhook(container, lead)

            // console.log(lead) // DEV
            console.log(redirectURL) // DEV
            // console.log(webhookRes) // DEV

            window.location.href = redirectURL
        } finally {
            form.removeAttribute('aria-busy')
            controls.forEach(el => el.disabled = false)
            submitText.textContent = submitTextDefault
        }
        // тут

        // const lead = await buildLead(form)

        // console.log(lead)
    })
}

function captchaVerification(form, dataCaptcha) {
    const fieldCaptcha = form.querySelector('[field="captcha"]')
    const captchaExists = !!fieldCaptcha
    const captchaVisible = (captchaExists && fieldCaptcha) ? getComputedStyle(fieldCaptcha).display !== 'none' : false

    if (captchaExists && !captchaVisible) {
        const fields = form.querySelectorAll('[field]')

        fields.forEach(field => { field.style.display = 'none' })
        fieldCaptcha.style.display = 'block'
        return false
    }

    if (captchaExists && captchaVisible) {
        const input = fieldCaptcha.querySelector('input')
        const answers = dataCaptcha.answers
        const value = input.value

        if (!answers.map(a => a.toLowerCase()).includes(value.toLowerCase())) {
            const attempts = parseInt(input.getAttribute('attempts'), 10)

            if (attempts >= 4) {
                console.log('Капча провалена!') // End

                input.disabled = true
                return false
            }

            const newAttempts = attempts + 1
            input.setAttribute('attempts', newAttempts.toString())
            
            input.value = ''
            return false
        }
    }

    return true
}

function getValues(form) {
    const formData = new FormData(form)
    const formValues = {}
    
    for (let [key, value] of formData.entries()) {
        if (key === 'captcha') {
            const captchaField = form.querySelector('[field="captcha"] input')
            const question = captchaField.placeholder
            
            formValues[key] = {
                question: question,
                answer: value
            }
        } else {
            formValues[key] = value
        }
    }

    return formValues
}

function getPageData(form) {
    const getContent = div => {
        const span = div?.querySelector('span')?.textContent
        const imgPath = div?.querySelector('img')?.getAttribute('src')
        if (span) return span
        if (imgPath) {
            try { return new URL(imgPath, window.location.href).href }
            catch {
                const host = new URL(window.location.href).hostname
                return 'https://' + host + imgPath
            }
        }
        return undefined
    }

    const variableContainers = form.querySelectorAll('[variable]')
    const variablesObject = {}

    variableContainers.forEach(container => {
        const key = container.getAttribute('variable')?.trim()?.replace(/-/g, '_')
        if (!key) return
        const value = getContent(container)
        if (value !== undefined) variablesObject[key] = value
    })

    return variablesObject
}

async function buildLead(form) {
    const url = window.location.href
    const cookie = document.cookie
    const domain = new URL(window.location.href).hostname
    const page = window.location.pathname.split('/').pop() || ''

    const params = Object.fromEntries(new URL(window.location.href).searchParams.entries())
    const cookies = cookie ? Object.fromEntries(cookie.split(/; */).map(pair => {
        const [k, ...v] = pair.split('=')
        return [decodeURIComponent(k), decodeURIComponent(v.join('='))]
    })) : {}

    const values = getValues(form)
    const pageData = getPageData(form)

    const name = values?.name
    const phone = values?.phone ? values.phone.replace(/\D/g, '') : ''

    const { ip: userIp } = await fetch('https://api64.ipify.org?format=json').then(r => r.json())

    // const customer = 'test' // DEV
    const response = await fetch('https://api.onycs.ru/leads', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-Client-IP': userIp,
            'X-Full-URL': window.location.href,
            'X-Cookies': document.cookie
        },
        body: JSON.stringify({
            name, 
            phone
        })
    }).then(r => r.json())

    const evaluation = {
        is_fraud: false,
        reason_str: 'Server error OnycsAPI',
        reason: [ 'Server error OnycsAPI' ]
    }

    if (response) {
        evaluation.is_fraud = response.evaluation.is_fraud
        evaluation.reason_str = Array.isArray(response.evaluation.reason) ? response.evaluation.reason.join(', ') : response.evaluation.reason
        evaluation.reason = response.evaluation.reason
    }

    const lead = {
        url,
        domain,
        page,
        cookie,
        params,
        cookies,
        data: response.data,
        evaluation,
        duplicates: response.duplicates,
        values,
        page_data: pageData,
    }

    return lead
}

function buildRedirectURL(container, lead) {
    const domain = new URL(window.location.href).hostname
    const pageRedirect = container.getAttribute('redirect') || '/'
    const pageRedirectProxy = container.getAttribute('redirect-proxy') || '/error-proxy'
    const page = window.location.pathname.split('/').pop() || ''
    const linkRedirect = 'https://' + domain + pageRedirect
    const linkRedirectProxy = 'https://' + domain + pageRedirectProxy

    const { evaluation, data } = lead
    const isFraud = evaluation?.is_fraud || false 
    const isLocalDuplicate = data?.is_local_duplicate || false 
    const isGlobalDuplicate = data?.is_global_duplicate || false 

    let redirect = linkRedirect + 
        `?in_success=${encodeURIComponent(page)}` +
        `&is_fraud=${encodeURIComponent(isFraud)}` +
        `&is_local_duplicate=${encodeURIComponent(isLocalDuplicate)}` +
        `&is_global_duplicate=${encodeURIComponent(isGlobalDuplicate)}`

    if (evaluation?.reason.includes('Connection is not from Russia!')) redirect = linkRedirectProxy

    return redirect
}

async function sendWebhook(container, lead) {
    const url = container.getAttribute('webhook')
    if (!url) throw new Error('Не задан атрибут webhook')

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`HTTP ${res.status}: ${text}`)
    }

    const ct = res.headers.get('content-type') || ''
    const cl = res.headers.get('content-length')

    let response
    if (res.status === 204 || cl === '0') {
      response = null
    } else if (ct.includes('application/json')) {
      try {
        response = await res.json()
      } catch {
        const txt = await res.text()
        console.warn('Некорректный JSON от сервера:', txt)
        response = null
      }
    } else {
      response = await res.text()
    }

    return response
}