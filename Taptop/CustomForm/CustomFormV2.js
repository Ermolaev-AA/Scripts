const FETCH_URL = 'http://localhost:4848/customers'

function delay(ms) {
    return new Promise(res => setTimeout(res, ms))
}

async function fetchJSON(url, opts = {}) {
    const res = await fetch(url, opts)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}

function waitForClass(el, className, timeout = 20000) {
    return new Promise((resolve, reject) => {
        if (!el) return reject(new Error('Element not found'))
        if (el.classList.contains(className)) return resolve(true)

        const obs = new MutationObserver(muts => {
            for (const m of muts) {
                if (m.type === 'attributes' && m.attributeName === 'class') {
                    if (el.classList.contains(className)) {
                        obs.disconnect()
                        clearTimeout(t)
                        resolve(true)
                        return
                    }
                }
            }
        })

        const t = setTimeout(() => {
            obs.disconnect()
            reject(new Error(`Timeout waiting for .${className}`))
        }, timeout)

        obs.observe(el, { attributes: true, attributeFilter: ['class'] })
    })
}

async function fetchCustomerPayload({ name, phone, url, cookie }) {
    const DEFAULTS = {
        isFraud: 'disabled',
        isLocalDuplicate: 'disabled',
        isGlobalDuplicate: 'disabled',
        whatsappExists: 'disabled',
        telegramExists: 'disabled',
        complaints: 'disabled'
    }

    try {
        const ip = await Promise.race([
            fetchJSON('https://api.ipify.org?format=json').then(j => j.ip),
            delay(1000).then(() => 'unknown')
        ])

        const customer = await Promise.race([
            fetchJSON(FETCH_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, url, cookie, ip })
            }),
            delay(1500).then(() => null)
        ])

        if (!customer) return DEFAULTS

        return {
            isFraud: customer?.is_fraud ?? DEFAULTS.isFraud,
            isLocalDuplicate: customer?.is_local_duplicate ?? DEFAULTS.isLocalDuplicate,
            isGlobalDuplicate: customer?.is_global_duplicate ?? DEFAULTS.isGlobalDuplicate,
            whatsappExists: customer?.contact_report?.whatsapp_exists ?? DEFAULTS.whatsappExists,
            telegramExists: customer?.contact_report?.telegram_exists ?? DEFAULTS.telegramExists,
            complaints: customer?.complaints ?? DEFAULTS.complaints
        }
    } catch {
        return DEFAULTS
    }
}

function applyValuesToInputs(input, payload) {
    if (!input) return
    if (input.is_fraud) input.is_fraud.value = payload.isFraud
    if (input.is_local_duplicate) input.is_local_duplicate.value = payload.isLocalDuplicate
    if (input.is_global_duplicate) input.is_global_duplicate.value = payload.isGlobalDuplicate
    if (input.whatsapp_exists) input.whatsapp_exists.value = payload.whatsappExists
    if (input.telegram_exists) input.telegram_exists.value = payload.telegramExists
    if (input.complaints) input.complaints.value = payload.complaints
}

function buildRedirectURL(container, { isFraud, isLocalDuplicate, isGlobalDuplicate }) {
    const domain = new URL(window.location.href).hostname
    const pageRedirect = container.getAttribute('redirect') || '/'
    const page = window.location.pathname.split('/').pop() || ''
    const redirect = 'https://' + domain + pageRedirect

    return (
        redirect +
        `?in_success=${encodeURIComponent(page)}` +
        `&is_fraud=${encodeURIComponent(isFraud)}` +
        `&is_local_duplicate=${encodeURIComponent(isLocalDuplicate)}` +
        `&is_global_duplicate=${encodeURIComponent(isGlobalDuplicate)}`
    )
}

function getMask(field, mask) {
    if (!field || typeof IMask !== 'function') return
    const phoneValue = IMask(field, {
        mask: '+{7} 000 000 00 00',
        lazy: true,
        placeholderChar: ''
    })
    field.addEventListener('blur', function () {
        if (phoneValue.unmaskedValue.length < 11) {
            phoneValue.value = ''
        }
    })
}

const containers = document.querySelectorAll('[form="container"]')

containers.forEach(container => {
    const getInput = div => div ? div.querySelector('input') : null
    const getContent = div => {
        const span = div?.querySelector('span')?.textContent
        const imgPath = div?.querySelector('img')?.getAttribute('src')
        if (span) return span
        if (imgPath) {
            try {
                return new URL(imgPath, window.location.href).href
            } catch {
                const host = new URL(window.location.href).hostname
                return 'https://' + host + imgPath
            }
        }
        return undefined
    }

    const input = {}
    const variable = {}
    const value = {
        url: window.location.href,
        domain: new URL(window.location.href).hostname,
        page: window.location.pathname.split('/').pop() || '',
        cookie: document.cookie,
        is_fraud: 'disabled',
        is_local_duplicate: 'disabled',
        is_global_duplicate: 'disabled',
        whatsapp_exists: 'disabled',
        telegram_exists: 'disabled',
        complaints: 'disabled'
    }

    container.querySelectorAll('[metric-input]').forEach(el => {
        const key = el.getAttribute('metric-input')?.replace(/-/g, '_')
        if (!key) return
        input[key] = getInput(el)
    })

    container.querySelectorAll('[metric-variable]').forEach(el => {
        const key = el.getAttribute('metric-variable')?.replace(/-/g, '_')
        if (!key) return
        variable[key] = getContent(el)
    })

    for (const key in variable) value[key] = variable[key]
    for (const key in input) {
        const val = value?.[key]
        if (val !== undefined && input[key]) {
            input[key].value = val
        } else {
            console.warn(`The value for the «${key}» field was not found!`)
        }
    }

    const containerPhone = container.querySelector('[form-input="phone"]')
    const inputPhone = getInput(containerPhone)
    const phoneMask = containerPhone?.getAttribute('mask')
    if (inputPhone) getMask(inputPhone, phoneMask)

    const redirectAttr = container.getAttribute('redirect')
    if (redirectAttr) gatePreSubmit(container, input)
})

function gatePreSubmit(container, input) {
    const form = container.querySelector('form')
    if (!form) return

    form.addEventListener('click', e => {
        const t = e.target
        if (t && (t.matches('button[type="submit"]') || t.matches('input[type="submit"]'))) {
            form._submitter = t
        }
    }, true)

    form.addEventListener('submit', async e => {
        if (form.dataset.prepared === '1') {
            delete form.dataset.prepared
            return
        }

        e.preventDefault()
        e.stopImmediatePropagation()

        try {
            const requiredContainers = form.querySelectorAll('[required-input="true"]')
            const requiredInputs = Array.from(requiredContainers).map(c => c.querySelector('input'))
            const emptyInputs = requiredInputs.filter(i => !i || i.value.trim() === '')
            if (emptyInputs.length > 0) {
                console.warn('Заполнены не все обязательные поля!')
                return
            }

            const name = form.querySelector('[form-input="name"] input')?.value || ''
            const phone = (form.querySelector('[form-input="phone"] input')?.value || '').replace(/\D/g, '')
            const url = window.location.href
            const cookie = document.cookie

            const successReady = waitForClass(container, 'is-success', 20000).catch(() => false)
            const payload = await fetchCustomerPayload({ name, phone, url, cookie })

            applyValuesToInputs(input, payload)

            form.dataset.prepared = '1'
            form.requestSubmit(form._submitter)

            const ok = await successReady
            if (ok) {
                const linkRedirect = buildRedirectURL(container, {
                    isFraud: payload.isFraud,
                    isLocalDuplicate: payload.isLocalDuplicate,
                    isGlobalDuplicate: payload.isGlobalDuplicate
                })
                window.location.href = linkRedirect
            }
        } catch (err) {
            console.warn('Pre-submit error (soft):', err?.message || err)
        }
    }, true)
}