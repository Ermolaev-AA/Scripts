export const getValues = (form) => {
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