export const buildMSG = (data) => {
    const title = `#${data?.is_fraud ? 'Fraud' : 'Lead'} #V7`
    const name = `Name: ${data?.user_data?.name}`
    const phone = `Phone: +${data?.user_data?.phone}`
    const heading = `Heading: ${data?.page_metadata?.heading}`
    const description = `Description: ${data?.page_metadata?.description}`
    const isFraud = `Is Fraud: ${data?.is_fraud}`
    const isLocalDuplicate = `Is Local Duplicate: ${data?.is_local_duplicate}`
    const isGlobalDuplicate = `Is Global Duplicate: ${data?.is_global_duplicate}`
    const ymTitle = `YM ClienID: <code>${data?.cookies_obj?._ym_uid}</code>`
    const formFilled = `Conv Filled: ${data?.ym_conversions?.filled}`
    const formSubmitted = `Conv Submitted: ${data?.ym_conversions?.submitted}`
    const formIdentified = `Conv Identified: ${data?.ym_conversions?.identified}`
    const formVerified = `Conv Verified: ${data?.ym_conversions?.verified}`
    const formUntested = `Conv Untested: ${data?.ym_conversions?.untested}`
    const ip = `IP: ${data?.network_metadata?.user_ip}`
    const network = `Network: ${data?.network_metadata?.network}`
    const networkType = `Type: ${data?.network_metadata?.network_type}`
    const countryCode = `Country Code: ${data?.network_metadata?.country_code}`
    const asName = `AS Name: ${data?.network_metadata?.as_name}`
    const asDomain = `AS Domain: ${data?.network_metadata?.as_domain}`
    const asn = `ASN: ${data?.network_metadata?.asn}`
    const utmSource = `UTM Source: ${data?.params_obj?.utm_source}`
    const utmCampaign = `UTM Campaign: ${data?.params_obj?.utm_campaign}`
    const utmTerm = `UTM Term: ${data?.params_obj?.utm_term}`
    const ymUid = `_ym_uid: <code>${data?.cookies_obj?._ym_uid}</code>`
    const yclid = `yclid: <code>${data?.params_obj?.yclid}</code>`
    const internalID = `Internal ID: <code>${data?.internal_id}</code>`
    const site = `Site: <a href="${data?.url}">${data?.domain}</a>`

    let errorReasonPoints = ''
    const errorReasonArr = data?.fraud_metadata?.error_reason_arr
    errorReasonArr.forEach(errorReason => {
        errorReasonPoints += `- ${errorReason}\n`
    })

    const errorReason = `Error Reason ${data?.fraud_metadata?.verify_success} out of ${data?.fraud_metadata?.verify_enabled}\n` + errorReasonPoints

    const msg = `${title}

${name}
${phone}

${heading}
${description}
${site}

${isFraud}
${isLocalDuplicate}
${isGlobalDuplicate}

${errorReason}
${ymTitle}
${formFilled}
${formSubmitted}
${formIdentified}
${formVerified}
${formUntested}

${ip}
${network}
${networkType}

${countryCode}
${asName}
${asDomain}
${asn}

${utmSource}
${utmCampaign}
${utmTerm}

${ymUid}
${yclid}

${internalID}`

    return msg
}