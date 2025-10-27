export const overwriteFields = (form) => {
    const inputs = form.querySelectorAll('input[input-value]')

    inputs.forEach(input => {
        const name = input.getAttribute('input-value')
        const type = input.getAttribute('type')
        const placeholder = input.getAttribute('placeholder')
        const containerClass = input.parentElement.className
        const inputClass = input.className

        const autocompleteMap = {
            name: 'name',
            firstname: 'given-name',
            lastname: 'family-name',
            email: 'email',
            phone: 'tel',
            tel: 'tel'
        }

        const autocomplete = autocompleteMap[name] || ''

        const newField = `<div field="${name}" class="${containerClass}">
            <input name="${name}" type="${type}" placeholder="${placeholder}" class="${inputClass}" ${autocomplete ? `autocomplete="${autocomplete}"` : ''} required>
        </div>`

        form.insertAdjacentHTML('beforeend', newField)
        input.parentElement.remove()
    })
}