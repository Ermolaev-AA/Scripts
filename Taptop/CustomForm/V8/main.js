// This Config! Move it to the HEAD!
const EAConfig = {
    CustomForm: {
        // ScopeApplication: 'All Forms',
        Redirect: { Enabled: false, Link: 'https://ownstone.ru/' },
        RedirectIfError: { Enabled: false, Link: '/error' },
        RedirectIfProxy: { Enabled: false, Link: '/error-proxy' },
        DefaultTextError: 'Что-то не так. Попробуйте через 2 минуты',
        FraudRules: {
            captcha_required: true, // Обязательно успешное прохождение капчи (true/false)
            valid_ip_required: true, // Обязательно валидный IP адрес пользователя (true/false), то есть IPv4
            valid_phone_required: true, // Обязательно валидный номер телефона (true/false) // DEV
            whatsapp_required: true, // Обязательно должен существовать whatsapp (true/false)
            telegram_required: false, // Обязательно должен существовать telegram (true/false)
            page_time: 0, // Время нахождения на странице (ms)
            focus_time: 0, // Суммарно время заполнения формы (ms)
            // Обязательно локально уникальный лид, те не имеет дублей внутри компании. Cравнивается: owner_id, phone, yclid, _ym_uid
            local_duplicates_allowed: { 
                quantity: 0, // Количество лидов, при нахождении которых не будет возникать ошибки (0 шт)
                ttl: 5443200000 // Промежуток времени от даты запроса, по которому будет осуществляться поиск (9 нед) (ms)
            },
            // Обязательно глобально уникальный лид, те вообще не имеет дублей. Cравнивается: phone, yclid, _ym_uid
            global_duplicates_allowed: {
                quantity: 9, // Количество лидов, при нахождении которых не будет возникать ошибки (10 шт)
                ttl: 2592000000 // Промежуток времени от даты запроса, по которому будет осуществляться поиск (30 дней) (ms)
            },
            ip_unique_ttl: 1814400000, // Время уникальности IP адреса пользователя (ms) (3 нед), проверка осуществляется на компанию
            network_unique_ttl: 3628800000, // Время уникальности сети пользователя (ms) (6 нед), проверка осуществляется на компанию
            geo_whitelist: [ 'RU' ], // Вайтлист гео подключения (массив, ISO коды)
            phone_code_whitelist: [], // Вайтлист кодов номера телефона (массив), для ограничения по стране происхождения номера телефона // DEV
            phone_blacklist: [], // Блэклист номеров телефона (массив) // DEV
            ip_blacklist: [], // Блэклист айпишников (массив) // DEV
            as_blacklist: [], // Блэклист провайдеров (массив) // DEV
            utm_source_blacklist: [], // Блэклист ресурсов по переходу из который при создании параметра utm_source будет возникать ошибка (массив) // DEV
            allowed_failures: 0 // Количество игнорируемых ошибок при котором проверка на мошенечиские действия все равно будет проходить успешно // DEV
        },
        Captcha: {
            Enabled: true,
            Type: 'Yandex SmartCaptcha', // values: Cloudflare Turnstile, Questions EA, Yandex SmartCaptcha
            Cloudflare: {
                SiteKey: '0x4AAAAAAB20vI22kymBmCJX',
                CompanyID: '688b652770d49260494b5930',
                SecretKey: '0x4AAAAAAB20vOXx5R_EYBelrjCnCv1t9s0' // НЕ БЕЗОПАСНО - засунуть на сервак!
            },
            Yandex: {
                SiteKay: 'ysc1_saKymuPuYDHL0fIiJUmt3AQDDdkfTmJRQGhZpPaL2fe39a4c',
                CompanyID: '688b652770d49260494b5930',
                SecretKey: 123,
            }
        },
        YMConversions: {
            YMID: 105180494,
            Filled: { Enabled: true, ID: 'filled' },
            Submitted: { Enabled: true, ID: 'submitted' },
            Identified: { Enabled: true, ID: 'identified' },
            Verified: { Enabled: true, ID: 'verified' },
            Untested: { Enabled: true, ID: 'untested' }
        },
        HandleFormWait: {
            TextDefault: 'Получить предложение',
            TextLoading: 'Пожалуйста, подождите...'
        },
        DEVMode: true,
        Webhook: 'https://h.albato.ru/wh/38/1lfhuc0/tfL4V9vDPPL2dp27jWldjRLC7rKTzo8e2vybGUSeNIk/',
        ErrorWebhook: { Enabled: false, Link: '' }, // Пока не работает
        InternalAPI: 'https://api.onycs.ru'
    }
}

// [ - ] Таймер время проведения на странице. Отправка данныйх на бек
// [ - ] Таймер времени фокусировки полей. Отправка данныйх на бек
// [ - ] Обработчик ошибок от бека и вывод кода ошибки и путь решения в error блок формы
// [ - ] Этап с усилиным подверждением через код по смс / почте или коду в месседжере (желательно релизовать все способы)
// [ - ] Генирация собственного cookie параметра для индетификации пользователя
// [ - ] Проверка тайм зон по IP пользовтеля и устройству
// [ - ] Мулти капчи и Yandex Капча Инвизибол
// [ - ] Новая Яндекс конверся по пользователям которые прошли капчу
// [ - ] Офлайн конверсии на воронку взят в работу и квалифицирован с ценной 5к
// [ - ] Дефолтный конфиг проверки проверки который будет храниться на беке чтобы сложно было заревьюшить проверку + конфиги в настройках Компаний
// [ - ] Переработать ответ Leads от сервера чтобы его нельзя было заревьюшить + перенести отправку albato запроса и бота на сервак тоже в целях безопасности
// [ - ] Проверка на впн прокси и тд Казимир давал сервис
// [ - ] Заебать казимира чтобы помог сконфигурировать Nginx чтобы забирать User IP с внутренего proxy сервера (чтобы убрать лишний запрос в теле и хедере)

import { overwriteFields } from './overwriteFields.js'
import { addCaptcha } from './addCaptcha.js'
import { overwriteSubmit } from './overwriteSubmit.js'
import { getMask } from './getMask.js'
import { verifyCaptcha } from './verifyCaptcha.js'
import { buildLead } from './buildLead.js'
import { handleFormWait } from './handleFormWait.js'
import { handleFormSuccess } from './handleFormSuccess.js'
import { buildMSG } from './buildMSG.js'
import { buildRedirectURL } from './buildRedirectURL.js'

const Config = EAConfig?.CustomForm
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

const handleFormError = (container, error, config) => {
    const defaultTextError = config?.DefaultTextError || 'Что-то не так. Попробуйте позже'
    const form = container.querySelector('form')
    const containerError = container.querySelector('.form__state-error')
    const containerTextError = containerError?.querySelector('.form__text-error span')

    if (containerTextError) containerTextError.textContent = String(error?.span || defaultTextError)

    const isHidden = (el) => !el || window.getComputedStyle(el).display === 'none'
    if (!isHidden(form)) form.style.display = 'none'
    if (isHidden(containerError)) containerError.style.display = 'block'
}

// from onSubmit.js
async function onSubmit(container, config) {
    const form = container.querySelector('form')
    const YMConversions = config?.YMConversions
    const YMID = YMConversions?.YMID

    form.addEventListener('submit', async function(event) {
        event.preventDefault()

        // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
        // -- it will be possible to add field validation...

        let YMConversionsData = { filled: false, submitted: false, identified: false, verified: false, untested: false }

        if (YMID && YMConversions?.Filled?.Enabled && YMConversions?.Filled?.ID) {
            ym(YMID, 'reachGoal', YMConversions?.Filled?.ID)
            YMConversionsData.filled = true
            if (config?.DEVMode) console.log('CONV ::', 'Filled', `(${YMID}, 'reachGoal', '${YMConversions?.Filled?.ID}')`)
        }

        const resultVerifyCaptcha = await verifyCaptcha(container, config) // verifyCaptcha
        handleFormWait(form, Config)

        try {
            const lead = await buildLead(form, Config, resultVerifyCaptcha)
            const leadData = lead?.data
            
            // YMConversions
            if (YMID && YMConversions?.Submitted?.Enabled && YMConversions?.Submitted?.ID) {
                ym(YMID, 'reachGoal', YMConversions?.Submitted?.ID)
                YMConversionsData.submitted = true
                if (config?.DEVMode) console.log('CONV ::', 'Submitted', `(${YMID}, 'reachGoal', '${YMConversions?.Submitted?.ID}')`)
            }

            if (YMID && YMConversions?.Identified?.Enabled && YMConversions?.Identified?.ID) {
                const captchaSuccess = leadData?.fraud_metadata?.verify?.find(v => v.name === 'captcha')?.success ?? false
                const whatsappSuccess = leadData?.fraud_metadata?.verify?.find(v => v.name === 'whatsapp')?.success ?? false

                if (captchaSuccess && whatsappSuccess) {
                    ym(YMID, 'reachGoal', YMConversions?.Identified?.ID)
                    YMConversionsData.identified = true
                    if (config?.DEVMode) console.log('CONV ::', 'Identified', `(${YMID}, 'reachGoal', '${YMConversions?.Identified?.ID}')`)
                }
            }

            if (YMID && YMConversions?.Verified?.Enabled && YMConversions?.Verified?.ID) {
                const isFraud = leadData?.is_fraud ?? true

                if (YMConversions?.Untested?.Enabled && YMConversions?.Untested?.ID && isFraud === true) {
                    ym(YMID, 'reachGoal', YMConversions?.Untested?.ID)
                    YMConversionsData.untested = true
                    if (config?.DEVMode) console.log('CONV ::', 'Untested', `(${YMID}, 'reachGoal', '${YMConversions?.Untested?.ID})'`)
                }

                if (isFraud === false) {
                    ym(YMID, 'reachGoal', YMConversions?.Verified?.ID)
                    YMConversionsData.verified = true
                    if (config?.DEVMode) console.log('CONV ::', 'Verified', `(${YMID}, 'reachGoal', '${YMConversions?.Verified?.ID}')`)
                } 
            }

            leadData.ym_conversions = YMConversionsData
            leadData.msg = buildMSG(leadData)

            const redirectURL = buildRedirectURL(container, Config)
            // const webhookRes = await sendWebhook(container, leadData, Config)

            if (config?.DEVMode) console.log(lead) // DEV
            if (config?.DEVMode) console.log(redirectURL) // DEV

            handleFormSuccess(container)

            if (config?.Redirect?.Enabled) window.location.href = redirectURL
        } catch (error) {
            const containerError = container.querySelector('.form__state-error')
            form.setAttribute('style', 'display: none') 
            containerError.setAttribute('style', 'display: block') 

            console.error(error)
        }
        finally {
            handleFormWait(form, Config)
        }
    })
}

async function sendWebhook(container, body, config) {
    const url = config?.Webhook || container.getAttribute('webhook')
    if (!url) throw new Error('Не задан атрибут webhook')

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
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