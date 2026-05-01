import { overwriteFields } from './overwriteFields.js'
import { addCaptcha } from './addCaptcha.js'
import { overwriteSubmit } from './overwriteSubmit.js'

import { overwriteForm } from './overwriteForm.js'

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
    clonedContainer.querySelector('re-captcha')?.remove() // old taptop captcha (google captcha)
    clonedContainer.querySelector('[name="smart-token"]')?.remove()
    container.remove()

    // addForm
    const form = overwriteForm(clonedContainer)
    if (Config.Captcha.Enabled === true) addCaptcha(clonedContainer, Config.Captcha)

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
            if (config?.DEVMode) console.log(`CUSTOM FORM :: Форма успешно отправлена на сервер! [${new Date().toLocaleString('ru-RU')}]`)

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

                if (captchaSuccess && YMConversions?.CaptchaSuccess) {
                    ym(YMID, 'reachGoal', YMConversions?.CaptchaSuccess?.ID)
                    YMConversionsData.CaptchaSuccess = true
                    if (config?.DEVMode) console.log('CONV ::', 'CaptchaSuccess', `(${YMID}, 'reachGoal', '${YMConversions?.CaptchaSuccess?.ID}')`)
                }

                if (whatsappSuccess && YMConversions?.WASuccess) {
                    ym(YMID, 'reachGoal', YMConversions?.WASuccess?.ID)
                    YMConversionsData.WASuccess = true
                    if (config?.DEVMode) console.log('CONV ::', 'WASuccess', `(${YMID}, 'reachGoal', '${YMConversions?.WASuccess?.ID}')`)
                }

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
            const webhookRes = await sendWebhook(container, leadData, Config)
            if (config?.DEVMode) console.log(`CUSTOM FORM :: Вебхук успешно отправлен! [${new Date().toLocaleString('ru-RU')}]`)

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