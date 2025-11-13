import { useState, useEffect } from 'react'

/**
 * Hook personalizado para debouncear un valor.
 * @param value El valor que se quiere debouncear.
 * @param delay El tiempo de espera en milisegundos después de que el valor deje de cambiar.
 * @returns El valor debounceado.
 */
export function useDebounce<T>(value: T, delay: number): T {
  // Estado para guardar el valor debounceado
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Se crea un temporizador que actualizará el estado después del 'delay' especificado
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Función de limpieza que se ejecuta si 'value' o 'delay' cambian antes de que
    // el temporizador termine. Esto cancela el temporizador anterior y crea uno nuevo.
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay]) // Solo se vuelve a ejecutar si el valor o el delay cambian

  return debouncedValue
}