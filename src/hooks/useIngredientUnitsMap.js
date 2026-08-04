import { useState, useEffect, useRef } from 'react'

const API_BASE = import.meta.env.VITE_API_URL

/**
 * Fetches units for a list of ingredient IDs sequentially (one at a time)
 * to avoid triggering API rate limits from concurrent requests.
 *
 * Returns a map of { [ingredientId]: string[] } and a loading flag.
 */
export function useIngredientUnitsMap(ingredientIds) {
    const [unitsMap, setUnitsMap] = useState({})
    const [loading, setLoading] = useState(false)
    const abortRef = useRef(null)

    useEffect(() => {
        const ids = ingredientIds.filter(Boolean)
        if (ids.length === 0) return

        // Cancel any previous in-flight sequence
        if (abortRef.current) abortRef.current = true
        const cancelled = { value: false }
        abortRef.current = cancelled

        setLoading(true)

        async function fetchSequentially() {
            const result = {}
            for (const id of ids) {
                if (cancelled.value) return
                // Skip if we already have units for this ingredient
                if (unitsMap[id]) {
                    result[id] = unitsMap[id]
                    continue
                }
                try {
                    const res = await fetch(`${API_BASE}/api/ingredients/units?id=${encodeURIComponent(id)}`)
                    if (!res.ok) {
                        result[id] = []
                        continue
                    }
                    const data = await res.json()
                    result[id] = data?.units ?? []
                } catch {
                    result[id] = []
                }
            }
            if (!cancelled.value) {
                setUnitsMap((prev) => ({ ...prev, ...result }))
                setLoading(false)
            }
        }

        fetchSequentially()

        return () => {
            cancelled.value = true
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ingredientIds.join(',')])

    return { unitsMap, loading }
}
