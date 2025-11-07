export const getPageData = (form) => {
    const getContent = div => {
        const span = div?.querySelector('span')?.textContent
        const imgPath = div?.querySelector('img')?.getAttribute('src')
        if (span) return span
        if (imgPath) {
            try { return new URL(imgPath, window.location.href).href }
            catch {
                const host = new URL(window.location.href).hostname
                return 'https://' + host + imgPath
            }
        }
        return undefined
    }

    const variableContainers = form.querySelectorAll('[variable]')
    const variablesObject = {}

    variableContainers.forEach(container => {
        const key = container.getAttribute('variable')?.trim()?.replace(/-/g, '_')
        if (!key) return
        const value = getContent(container)
        if (value !== undefined) variablesObject[key] = value
    })

    return variablesObject
}