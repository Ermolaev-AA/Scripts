export const overwriteForm = (container) => {
    const oldForm = container.querySelector('form')
    const allInsideOldForm = [...oldForm.children]

    container.insertAdjacentHTML('afterbegin', `<form name="ermolaev-custom-form" class="${oldForm.className}"></form>`)
    const newForm = container.querySelector('[name="ermolaev-custom-form"]')

    allInsideOldForm.forEach(el => {
        if (el.querySelector('input[input-value]')) {
            const input = el.querySelector('input[input-value]')
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

            return newForm.insertAdjacentHTML('beforeend', `<div field="${name}" class="${containerClass}">
                <input name="${name}" type="${type}" placeholder="${placeholder}" class="${inputClass}" ${autocomplete ? `autocomplete="${autocomplete}"` : ''} required>
            </div>`)
        }

        if (el.matches('button[type="submit"]')) {
            const submitClass = el.className
            const text = el.querySelector('span').querySelector('span').textContent

            return newForm.insertAdjacentHTML('beforeend', `<button type="submit" class="${submitClass}">
                <span>${text}</span>
            </button>`)
        }

        const clonedEl = el.cloneNode(true)
        newForm.insertAdjacentElement('beforeend', clonedEl)
    })

    oldForm.remove()
    return newForm
}