export const handleFormSuccess = (container) => {
    const form = container.querySelector('form')
    const containerSuccess = container.querySelector('.form__state-success')

    form.setAttribute('style', 'display: none') 
    containerSuccess.setAttribute('style', 'display: block') 
}