export const verifyCaptcha = async (container, config) => {
    const form = container.querySelector('form')
    const typeCaptcha = config.Captcha.Type

    // if Type Captcha = Questions EA
    if (typeCaptcha === 'Questions EA') {
        const fieldCaptcha = form.querySelector('[field="captcha"]')
        const captchaExists = !!fieldCaptcha
        const captchaVisible = (captchaExists && fieldCaptcha) ? getComputedStyle(fieldCaptcha).display !== 'none' : false
        const fields = form.querySelectorAll('[field]')

        let result = {
            type: 'Questions EA', 
            success: true,
            failed: false
        }

        if (captchaExists && !captchaVisible) {
            fields.forEach(field => { field.style.display = 'none' })
            fieldCaptcha.style.display = 'block'
            result.success = false
            return result
        }
    
        if (captchaExists && captchaVisible) {
            const input = fieldCaptcha.querySelector('input')
            const answers = input.getAttribute('answers').split(',')
            const value = input.value
    
            if (!answers.map(a => a.toLowerCase()).includes(value.toLowerCase())) {
                const attempts = parseInt(input.getAttribute('attempts'), 10)
    
                if (attempts >= 4) {
                    const containerError = container.querySelector('.form__state-error')
                    form.setAttribute('style', 'display: none') 
                    containerError.setAttribute('style', 'display: block') 

                    console.log('The captcha «Questions EA» has failed!') // End
    
                    input.disabled = true
                    result.success = false
                    result.failed = true
                    return result
                }
    
                const newAttempts = attempts + 1
                input.setAttribute('attempts', newAttempts.toString())
                
                input.value = ''
                result.success = false
                return result
            }
        }

        fields.forEach(field => { field.style.display = 'block' })
        fieldCaptcha.style.display = 'none'

        console.log('The captcha «Questions EA» has been passed!')
        return result
    }

    // if Type Captcha = Cloudflare Turnstile
    if (typeCaptcha === 'Cloudflare Turnstile') {
        const turnstileResponse = form?.querySelector('[name="cf-turnstile-response"]')?.value
        let result = {
            type: 'Cloudflare Turnstile', 
            success: false,
            failed: false
        }
        
        // if (!turnstileResponse) {
        //     console.error('The Cloudflare Turnstile token was not found!')
        //     result.success = false
        //     return result
        // }

        const link = `${config.InternalAPI}/leads/verify-captcha`
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'Cloudflare Turnstile', 
                token: turnstileResponse, 
                company: config.Captcha?.Cloudflare?.CompanyID, 
                kay: config.Captcha?.Cloudflare?.SecretKey
            })
        }

        try {
            const response = await fetch(link, options)
            const resResult = await response.json()
            
            if (resResult.success) {
                console.log('The captcha «Cloudflare Turnstile» has been passed!')
                result.success = true
                return result
            } else {
                const containerError = container.querySelector('.form__state-error')
                form.setAttribute('style', 'display: none') 
                containerError.setAttribute('style', 'display: block') 
                
                console.error('Captcha verification failed:', resResult.error)
                result.success = false
                result.failed = true
                return result
            }
        } catch (error) {
            const containerError = container.querySelector('.form__state-error')
            form.setAttribute('style', 'display: none') 
            containerError.setAttribute('style', 'display: block') 

            console.error('Error verifying captcha:', error)
            result.success = false
            result.failed = true
            return result
        }
    }

    return console.error('The Captcha Type does not exist or is specified incorrectly!')
}