export const handleFormWait = (form, config) => {
    const Config = EAConfig?.CustomForm || config
    const TextDefault = Config?.HandleFormWait?.TextDefault || 'Получить предложение'
    const TextLoading = Config?.HandleFormWait?.TextLoading || 'Пожалуйста, подождите...'

    const submit = form.querySelector('[type="submit"]')
    const submitText = submit.querySelector('span')
    const controls = form.querySelectorAll('button')
    const status = form.getAttribute('aria-busy') === 'true'

    if (status) {
        submitText.textContent = TextDefault
        form.setAttribute('aria-busy', 'false')
        controls.forEach(el => el.disabled = false)
    } else {
        submitText.textContent = TextLoading
        form.setAttribute('aria-busy', 'true')
        controls.forEach(el => el.disabled = true)
    }
}