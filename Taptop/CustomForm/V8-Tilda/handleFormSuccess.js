export const handleFormSuccess = (container) => {
    // const form = container.querySelector('form[name="ermolaev-custom-form"]')
    // const containerSuccess = container.querySelector('.form__state-success')

    // form.setAttribute('style', 'display: none') 
    // containerSuccess.setAttribute('style', 'display: block') 

    const form = container.querySelector('form[name="ermolaev-custom-form"]')
    const submit = form.querySelector('[type="submit"]')
    const submitText = submit.querySelector('.t-btnflex__text') || submit.querySelector('span') || submit

    const inputs = form.querySelectorAll('.t-input-block')
    inputs.forEach(input => {
        input.style.display = 'none'
    })

    setTimeout(() => {
        submit.disabled = true
        submit.style.backgroundColor = '#2e7d32'
        submit.style.borderColor = '#2e7d32'
        submit.style.color = '#ffffff'
        submit.style.cursor = 'not-allowed'
        submit.style.pointerEvents = 'none'

        if (submitText) submitText.textContent = 'Форма успешно отправлена!'
    }, 300)
}