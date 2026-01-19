export const normalizeRedirectLink = (str) => {
    const domain = new URL(window.location.href).hostname
    const page = window.location.pathname.split('/').pop() || ''

    if (str.startsWith('/')) return 'http://' + domain + str + `?in_success=${encodeURIComponent(page)}`
    return str + `?utm_source=${encodeURIComponent(domain)}&utm_contractor=Ermolaev`
}