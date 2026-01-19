import { getValues } from './getValues.js'
import { getPageData } from './getPageData.js'

export const buildLead = async (form, config, captchaData) => {
    const url = window.location.href
    const cookie = document.cookie
    const domain = new URL(window.location.href).hostname
    const page = window.location.pathname.split('/').pop() || ''

    const params = Object.fromEntries(new URL(window.location.href).searchParams.entries())
    const cookies = cookie ? Object.fromEntries(cookie.split(/; */).map(pair => {
        const [k, ...v] = pair.split('=')
        return [decodeURIComponent(k), decodeURIComponent(v.join('='))]
    })) : {}

    const values = getValues(form)
    const pageData = getPageData(form)

    const name = values?.name
    const phone = values?.phone ? values.phone.replace(/\D/g, '') : ''

    // Получаем IP
    const { ip: userIp } = await fetch('https://api64.ipify.org?format=json').then(r => r.json())

    const link = `${config.InternalAPI}/leads`
    const options = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-Client-IP': userIp,
            'X-Full-URL': window.location.href,
            'X-Cookies': document.cookie
        },
        body: JSON.stringify({
            name, 
            phone,
            fraud_rules: config.FraudRules,
            captcha_data: {
                type: captchaData?.type,
                success: captchaData?.success
            },
            page_time: 100,
            focus_time: 100
        })
    }

    // Критично: проверяем HTTP статус и выбрасываем ошибку
    const res = await fetch(link, options)
    if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`OnycsAPI HTTP ${res.status}: ${text}`)
    }

    let response
    try {
        response = await res.json()
    } catch {
        throw new Error('OnycsAPI вернул некорректный JSON')
    }

    // Дополнительно: если бэкенд вернул семантическую ошибку — тоже бросаем
    if (response?.error || response?.success === false) {
        const reason = response?.message || response?.error_reason || 'Server error OnycsAPI'
        throw new Error(reason)
    }

    const lead = {
        success: !!response,
        data: {
            url,
            domain,
            page,
            cookie,
            params_obj: params,
            cookies_obj: cookies,
            user_data: {
                name: response?.name || null,
                phone: response?.phone || null
            },
            fields_data: values,
            is_fraud: response?.is_fraud || false,
            is_local_duplicate: response?.is_local_duplicate || false,
            is_global_duplicate: response?.is_global_duplicate || false,
            person_metadata: response?.person_metadata || null,
            network_metadata: response?.network_metadata || null,
            fraud_metadata: {
                is_fraud: response?.is_fraud || false,
                verify_enabled: response?.fraud_metadata?.verify_enabled || null,
                verify_success: response?.fraud_metadata?.verify_success || null,
                rules: response?.fraud_metadata?.rules || null,
                verify: response?.fraud_metadata?.verify || null,
                error_reason: Array.isArray(response?.fraud_metadata?.error_reason) ? response?.fraud_metadata?.error_reason.join(', ') : response?.fraud_metadata?.error_reason || 'Server error OnycsAPI',
                error_reason_arr: response?.fraud_metadata?.error_reason || [ 'Server error OnycsAPI' ]
            },
            page_metadata: pageData,
            internal_id: response?._id
        }
    }

    return lead
}