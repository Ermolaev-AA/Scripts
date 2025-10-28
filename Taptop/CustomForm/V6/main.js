// This Config! Move it to the HEAD!
// const EAConfig = {
//     CustomForm: {
//         // ScopeApplication: 'All Forms',
//         YMID: 103667618,
//         Redirect: { Enabled: false, Link: '/success' },
//         RedirectIfError: { Enabled: false, Link: '/error' },
//         RedirectIfProxy: { Enabled: false, Link: '/error-proxy' },
//         FraudRules: {
//             captcha_required: true, // Обязательно успешное прохождение капчи (true/false)
//             valid_ip_required: true, // Обязательно валидный IP адрес пользователя (true/false), то есть IPv4
//             valid_phone_required: true, // Обязательно валидный номер телефона (true/false) // DEV
//             whatsapp_required: true, // Обязательно должен существовать whatsapp (true/false)
//             telegram_required: false, // Обязательно должен существовать telegram (true/false)
//             page_time: 0, // Время нахождения на странице (ms)
//             focus_time: 0, // Суммарно время заполнения формы (ms)
//             // Обязательно локально уникальный лид, те не имеет дублей внутри компании. Cравнивается: owner_id, phone, yclid, _ym_uid
//             local_duplicates_allowed: { 
//                 quantity: 0, // Количество лидов, при нахождении которых не будет возникать ошибки (0 шт)
//                 ttl: 5443200000 // Промежуток времени от даты запроса, по которому будет осуществляться поиск (9 нед) (ms)
//             },
//             // Обязательно глобально уникальный лид, те вообще не имеет дублей. Cравнивается: phone, yclid, _ym_uid
//             global_duplicates_allowed: {
//                 quantity: 9, // Количество лидов, при нахождении которых не будет возникать ошибки (10 шт)
//                 ttl: 2592000000 // Промежуток времени от даты запроса, по которому будет осуществляться поиск (30 дней) (ms)
//             },
//             ip_unique_ttl: 1814400000, // Время уникальности IP адреса пользователя (ms) (3 нед), проверка осуществляется на компанию
//             network_unique_ttl: 3628800000, // Время уникальности сети пользователя (ms) (6 нед), проверка осуществляется на компанию
//             geo_whitelist: [ 'RU' ], // Вайтлист гео подключения (массив, ISO коды)
//             phone_code_whitelist: [], // Вайтлист кодов номера телефона (массив), для ограничения по стране происхождения номера телефона // DEV
//             phone_blacklist: [], // Блэклист номеров телефона (массив) // DEV
//             ip_blacklist: [], // Блэклист айпишников (массив) // DEV
//             as_blacklist: [], // Блэклист провайдеров (массив) // DEV
//             utm_source_blacklist: [], // Блэклист ресурсов по переходу из который при создании параметра utm_source будет возникать ошибка (массив) // DEV
//             allowed_failures: 0 // Количество игнорируемых ошибок при котором проверка на мошенечиские действия все равно будет проходить успешно // DEV
//         },
//         Captcha: {
//             Enabled: true,
//             Type: 'Cloudflare Turnstile', // values: Cloudflare Turnstile, Questions EA
//             Cloudflare: {
//                 SiteKey: '0x4AAAAAAB20vI22kymBmCJX',
//                 CompanyID: '688b652770d49260494b5930',
//                 SecretKey: '0x4AAAAAAB20vOXx5R_EYBelrjCnCv1t9s0' // НЕ БЕЗОПАСНО - засунуть на сервак!
//             }
//         },
//         Webhook: 'https://h.albato.ru/wh/38/1lfhuc0/sZVbW6jS_nBytE6cjhBtNn2hjrSV4p4AQmJQ87_ZHL4/',
//         InternalAPI: 'https://api.onycs.ru'
//     }
// }

import { overwriteFields } from './overwriteFields.js'
import { addCaptcha } from './addCaptcha.js'
import { overwriteSubmit } from './overwriteSubmit.js'
import { getMask } from './getMask.js'
import { verifyCaptcha } from './verifyCaptcha.js'
import { getValues } from './getValues.js'
import { getPageData } from './getPageData.js'

const Config = EAConfig.CustomForm
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

    // addForm
    const form = clonedContainer.querySelector('form')
    if (!form) return console.warn('Form not found!')

    overwriteFields(form)
    if (Config.Captcha.Enabled === true) addCaptcha(clonedContainer, Config.Captcha)
    overwriteSubmit(form)
    getMask(form)

    onSubmit(clonedContainer, Config)
})

// from onSubmit.js
async function onSubmit(container, config) {
    const form = container.querySelector('form')

    form.addEventListener('submit', async function(event) {
        event.preventDefault()

        // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
        // -- it will be possible to add field validation...

        ym(config?.YMID, 'reachGoal', 'filled_form')

        // verifyCaptcha
        let resultVerifyCaptcha
        if (Config.Captcha.Enabled === true) {
            resultVerifyCaptcha = await verifyCaptcha(container, config)
            if (!resultVerifyCaptcha.success) return
            ym(config?.YMID, 'reachGoal', 'completed_captcha')
        }

        const submit = form.querySelector('[type="submit"]')
        const submitText = submit.querySelector('span')

        const submitTextDefault = submitText.textContent
        const submitTextLoading = 'Пожалуйста, подождите...'

        const controls = form.querySelectorAll('button')

        submitText.textContent = submitTextLoading
        form.setAttribute('aria-busy', 'true')
        controls.forEach(el => el.disabled = true)

        try {
            const lead = await buildLead(form, Config, resultVerifyCaptcha)
            ym(config?.YMID,'reachGoal','submitted_form')

            if (lead.is_fraud === false) ym(config?.YMID,'reachGoal','passed_verification')

            const redirectURL = buildRedirectURL(container, lead, Config)
            const webhookRes = await sendWebhook(container, lead, Config)

            // console.log(lead) // DEV
            // console.log(redirectURL) // DEV
            // console.log(webhookRes) // DEV

            const containerSuccess = container.querySelector('.form__state-success')
            form.setAttribute('style', 'display: none') 
            containerSuccess.setAttribute('style', 'display: block') 

            if (config?.Redirect?.Enabled) window.location.href = redirectURL
        } catch (error) {
            const containerError = container.querySelector('.form__state-error')
            form.setAttribute('style', 'display: none') 
            containerError.setAttribute('style', 'display: block') 

            console.error(error)
        }
        finally {
            form.removeAttribute('aria-busy')
            controls.forEach(el => el.disabled = false)
            submitText.textContent = submitTextDefault
        }
    })
}

async function buildLead(form, config, captchaData) {
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

    // Получаем IP
    const { ip: userIp } = await fetch('https://api64.ipify.org?format=json').then(r => r.json())

    const link = `${config.InternalAPI}/leads`
    const options = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-Client-IP': userIp,
            'X-Full-URL': window.location.href,
            'X-Cookies': document.cookie
        },
        body: JSON.stringify({
            name, 
            phone,
            fraud_rules: config.FraudRules,
            captcha_data: {
                type: captchaData?.type,
                success: captchaData?.success
            },
            page_time: 100,
            focus_time: 100
        })
    }

    // Критично: проверяем HTTP статус и выбрасываем ошибку
    const res = await fetch(link, options)
    if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`OnycsAPI HTTP ${res.status}: ${text}`)
    }

    let response
    try {
        response = await res.json()
    } catch {
        throw new Error('OnycsAPI вернул некорректный JSON')
    }

    // Дополнительно: если бэкенд вернул семантическую ошибку — тоже бросаем
    if (response?.error || response?.success === false) {
        const reason = response?.message || response?.error_reason || 'Server error OnycsAPI'
        throw new Error(reason)
    }

    const fraudMetadata = {
        is_fraud: response?.is_fraud || false,
        verify_enabled: response?.fraud_metadata?.verify_enabled || null,
        verify_success: response?.fraud_metadata?.verify_success || null,
        rules: response?.fraud_metadata?.rules || null,
        error_reason: Array.isArray(response?.fraud_metadata?.error_reason) ? response?.fraud_metadata?.error_reason.join(', ') : response?.fraud_metadata?.error_reason || 'Server error OnycsAPI',
        error_reason_arr: response?.fraud_metadata?.error_reason || [ 'Server error OnycsAPI' ]
    }

    const lead = {
        url,
        domain,
        page,
        cookie,
        params_obj: params,
        cookies_obj: cookies,
        user_data: {
            name: response?.name || null,
            phone: response?.phone || null
        },
        fields_data: values,
        captcha_data: {
            type: captchaData?.type, 
            enabled: config?.Captcha?.Enabled,
            success: captchaData?.success,
            failed: captchaData?.failed
        },
        is_fraud: response?.is_fraud || false,
        is_local_duplicate: response?.is_local_duplicate || false,
        is_global_duplicate: response?.is_global_duplicate || false,
        person_metadata: response?.person_metadata || null,
        network_metadata: response?.network_metadata || null,
        fraud_metadata: fraudMetadata,
        page_metadata: pageData,
        internal_id: response?._id
    }

    return lead
}

function buildRedirectURL(container, lead, config) {
    const domain = new URL(window.location.href).hostname
    const pageRedirect = config?.Redirect?.Link || container.getAttribute('redirect') || '/'
    const pageRedirectProxy = config?.RedirectIfProxy?.Link || container.getAttribute('redirect-proxy') || '/error-proxy'
    const page = window.location.pathname.split('/').pop() || ''
    const linkRedirect = 'https://' + domain + pageRedirect
    const linkRedirectProxy = 'https://' + domain + pageRedirectProxy

    const { evaluation } = lead
    const isFraud = lead?.is_fraud || false 
    const isLocalDuplicate = lead?.is_local_duplicate || false 
    const isGlobalDuplicate = lead?.is_global_duplicate || false 

    // console.log(isFraud, isLocalDuplicate, isGlobalDuplicate)

    let redirect = linkRedirect + 
        `?in_success=${encodeURIComponent(page)}` +
        `&is_fraud=${encodeURIComponent(isFraud)}` +
        `&is_local_duplicate=${encodeURIComponent(isLocalDuplicate)}` +
        `&is_global_duplicate=${encodeURIComponent(isGlobalDuplicate)}`

    if (evaluation?.error_reason?.includes('Connection is not from Russia!')) redirect = linkRedirectProxy

    return redirect
}

async function sendWebhook(container, lead, config) {
    const url = config?.Webhook || container.getAttribute('webhook')
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