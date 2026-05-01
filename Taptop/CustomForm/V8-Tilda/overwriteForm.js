export const overwriteForm = (container, Config) => {
    const { OverwriteForm } = Config

    const oldForm = container.querySelector('form')
    const allInsideOldForm = [...oldForm.children]

    const removeClassesForm = OverwriteForm?.RemoveClassesForm || []
    const removeClassSet = new Set(
        removeClassesForm
            .filter(Boolean)
            .map(className => String(className).trim().replace(/^\./, ''))
            .filter(Boolean)
    )
    const newFormClass = oldForm.className
        .split(/\s+/)
        .filter(Boolean)
        .filter(className => !removeClassSet.has(className))
        .join(' ')

    // container.insertAdjacentHTML('afterbegin', `<form name="ermolaev-custom-form" class="${oldForm.className}"></form>`)
    container.insertAdjacentHTML(OverwriteForm.PositionForm, `<form name="ermolaev-custom-form" class="${newFormClass}"></form>`)
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

        // Only for Tilda
        if (el.querySelector('input[name="name"]')) {
            const input = el.querySelector('input[name="name"]')
            input.setAttribute('required', 'required')
        }

        if (el.querySelector('input[name="phone"]')) {
            const input = el.querySelector('input[name="phone"]')
            input.setAttribute('required', 'required')
        }
        // Only for Tilda end

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

    // oldForm.remove()
    oldForm.style.display = 'none'
    return newForm
}