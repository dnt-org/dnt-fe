import { useEffect, useState } from "react"
import { supabase } from "../config/supabase-client"

const useSystemInfos = () => {
  const [infos, setInfos] = useState([])

  useEffect(() => {
    let channel = null
    let mounted = true

    const init = async () => {
      console.log("init")
      if (!supabase) return

      const { data, error } = await supabase.schema("public").from('system_infos').select("*")
      if (!error && mounted) setInfos(Array.isArray(data) ? data : [])

      channel = supabase
        .channel("public-system-infos")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "system_infos" },
          (payload) => {
            console.log("postgres_changes", payload)
            const next = payload?.new ?? payload?.old
            if (!next) return
            setInfos((prev) => {
              const id = next.id ?? next.documentId
              if (id == null) return prev
              const idx = prev.findIndex((r) => (r.id ?? r.documentId) === id)
              if (idx >= 0) {
                const copy = prev.slice()
                copy[idx] = next
                return copy
              }
              return [next, ...prev]
            })
          }
        )
        .subscribe()
    }

    init()

    return () => {
      mounted = false
      try {
        if (channel) supabase?.removeChannel(channel)
      } catch {}
    }
  }, [])

  return infos
}

export { useSystemInfos }
