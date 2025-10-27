export const addCaptcha = (container, config) => {
    const form = container.querySelector('form')
    // const captchaStep = container.getAttribute('captcha-step')
    const type = config.Type

    if (type === 'Questions EA') {
        const input = form.querySelector('input')
        const containerClass = input.parentElement.className
        const inputClass = input.className
        const style = 'display: none; min-width: 350px'
    
        const questions = [
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
            }
        ]

        const question = questions[Math.floor(Math.random() * questions.length)]
    
        const captcha = `<div field="captcha" class="${containerClass}" style="${style}">
            <input name="captcha" type="text" placeholder="${question.question}" answers="${question.answers}" attempts="0" class="${inputClass}">
        </div>`
    
        form.insertAdjacentHTML('beforeend', captcha)
    
        return question
    }

    if (type === 'Cloudflare Turnstile') {
        const key = config.Cloudflare.SiteKey
        const captcha = `<div field="captcha" style="display: none">
            <div class="cf-turnstile" data-sitekey="${key}"></div>
        </div>`

        form.insertAdjacentHTML('beforeend', captcha)
    }

}