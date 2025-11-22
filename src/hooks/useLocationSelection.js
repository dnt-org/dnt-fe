import { useEffect, useState } from "react"
import { getCountries, getCountryByCode, getDistrictByCode } from "../services/countries"

export default function useLocationSelection() {
  const [countries, setCountries] = useState([])
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const list = await getCountries()
        if (!mounted) return
        setCountries(list)
        const savedCountry = localStorage.getItem("nation") || localStorage.getItem("selectedCountryName") || ""
        const savedProvince = localStorage.getItem("province") || localStorage.getItem("selectedProvinceName") || ""
        const savedDistrict = localStorage.getItem("district") || ""
        if (savedCountry) {
          setSelectedCountry(savedCountry)
          try {
            const states = await getCountryByCode(savedCountry)
            if (!mounted) return
            setProvinces(states)
            if (savedProvince) {
              setSelectedProvince(savedProvince)
              try {
                const ds = await getDistrictByCode(savedProvince)
                if (!mounted) return
                setDistricts(ds)
                if (savedDistrict) setSelectedDistrict(savedDistrict)
              } catch {}
            }
          } catch {}
        }
      } catch {}
    })()
    return () => {
      mounted = false
    }
  }, [])

  const handleCountryChange = async (e) => {
    const name = e.target.value
    setSelectedCountry(name)
    localStorage.setItem("nation", name || "")
    if (!name) {
      localStorage.removeItem("province")
      localStorage.removeItem("district")
      setProvinces([])
      setDistricts([])
      setSelectedProvince("")
      setSelectedDistrict("")
      return
    }
    try {
      const states = await getCountryByCode(name)
      setProvinces(states)
      setSelectedProvince("")
      setDistricts([])
      setSelectedDistrict("")
    } catch {
      setProvinces([])
      setDistricts([])
    }
  }

  const handleProvinceChange = async (e) => {
    const val = e.target.value
    setSelectedProvince(val)
    localStorage.setItem("province", val || "")
    if (val) {
      try {
        const ds = await getDistrictByCode(val)
        setDistricts(ds)
        setSelectedDistrict("")
        localStorage.removeItem("district")
      } catch {
        setDistricts([])
      }
    } else {
      setDistricts([])
      setSelectedDistrict("")
      localStorage.removeItem("district")
    }
  }

  const handleDistrictChange = (e) => {
    const val = e.target.value
    setSelectedDistrict(val)
    localStorage.setItem("district", val || "")
  }

  return {
    countries,
    provinces,
    districts,
    selectedCountry,
    selectedProvince,
    selectedDistrict,
    handleCountryChange,
    handleProvinceChange,
    handleDistrictChange,
  }
}