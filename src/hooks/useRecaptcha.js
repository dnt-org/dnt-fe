import { useEffect, useRef } from 'react'

/**
 * useRecaptcha — mounts a reCAPTCHA v2 Invisible widget on the given container
 * and exposes a Promise-based getToken() helper.
 *
 * Usage:
 *   const { getToken, reset } = useRecaptcha('my-recaptcha-container')
 *   // In JSX: <div id="my-recaptcha-container" hidden />
 *
 * getToken() resolves with the token string, or null on expiry / error.
 * When VITE_MOCK_RECAPTCHA=true it resolves immediately with 'mock_token'.
 */
export default function useRecaptcha(containerId) {
  const resolveRef = useRef(null)
  const widgetIdRef = useRef(null)

  useEffect(() => {
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY
    if (!siteKey) {
      console.error('[useRecaptcha] VITE_RECAPTCHA_SITE_KEY is not set')
      return
    }

    const render = () => {
      const container = document.getElementById(containerId)
      if (!container || !window.grecaptcha?.render) return
      if (container.hasChildNodes()) return // already rendered

      try {
        widgetIdRef.current = window.grecaptcha.render(containerId, {
          sitekey: siteKey,
          size: 'invisible',
          callback: (token) => {
            resolveRef.current?.(token)
            resolveRef.current = null
          },
          'expired-callback': () => {
            resolveRef.current?.(null)
            resolveRef.current = null
          },
          'error-callback': () => {
            resolveRef.current?.(null)
            resolveRef.current = null
          },
        })
      } catch (err) {
        console.error('[useRecaptcha] render error:', err.message)
      }
    }

    // Poll until the grecaptcha script is ready
    const interval = setInterval(() => {
      if (window.grecaptcha?.render) {
        clearInterval(interval)
        render()
      }
    }, 100)

    return () => {
      clearInterval(interval)
      if (widgetIdRef.current !== null && window.grecaptcha?.reset) {
        try { window.grecaptcha.reset(widgetIdRef.current) } catch (_) { /* ignore */ }
      }
    }
  }, [containerId])

  /** Returns a Promise that resolves with the reCAPTCHA token (or null on failure). */
  const getToken = () => {
    if (import.meta.env.VITE_MOCK_RECAPTCHA === 'true') {
      return Promise.resolve('mock_token')
    }
    return new Promise((resolve) => {
      resolveRef.current = resolve
      try {
        if (widgetIdRef.current !== null) {
          window.grecaptcha?.execute(widgetIdRef.current)
        } else {
          window.grecaptcha?.execute()
        }
      } catch (err) {
        console.error('[useRecaptcha] execute error:', err.message)
        resolve(null)
      }
    })
  }

  /** Resets the widget so the same instance can be used again. */
  const reset = () => {
    try {
      if (widgetIdRef.current !== null) {
        window.grecaptcha?.reset(widgetIdRef.current)
      } else {
        window.grecaptcha?.reset()
      }
    } catch (_) { /* ignore */ }
  }

  return { getToken, reset }
}
