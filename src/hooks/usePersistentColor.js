import { useEffect, useState } from "react"

export default function usePersistentColor() {
  const [color, setColor] = useState(localStorage.getItem("selectedColor"))
  useEffect(() => {
    const root = document.getElementById("root")
    if (root) root.style.backgroundColor = color || ""
  }, [color])
  const onColorChange = (e) => {
    const newColor = e.target.value
    setColor(newColor)
    localStorage.setItem("selectedColor", newColor)
  }
  return { color, setColor, onColorChange }
}