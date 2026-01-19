import { normalizeRedirectLink } from './normalizeRedirectLink.js'

export const buildRedirectURL = (container, config) => {
    const Config = EAConfig?.CustomForm || config
    
    const strRedirect = Config?.Redirect?.Link || container.getAttribute('redirect') || '/success'
    if (strRedirect == 'dynamic') {
        const link = container.querySelector('[variable="dynamic-redirect"] span').textContent
        console.log(link)
        return link
    }
    
    const linkRedirect = normalizeRedirectLink(strRedirect)

    const strRedirectProxy = Config?.RedirectIfProxy?.Link || container.getAttribute('redirect-proxy') || '/error-proxy'
    const linkRedirectProxy = normalizeRedirectLink(strRedirectProxy)

    return linkRedirect 
}