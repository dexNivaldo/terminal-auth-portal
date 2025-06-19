/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react"
import useDebounce from "./use-debounce"
import { SortState } from "../types/sort"
import { CustomFilter } from "../types/filter"

export default function useAsyncList<T> (
    callback: (query: string, customFilter?: CustomFilter, sort?: SortState) => Promise<T>, dependencies = []
) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()
    const [items, setItems] = useState<T | []>([])
    const [query, setQuery] = useState('')
    const debouncedValue = useDebounce(query)
    const [customFilter, setCustomFilter] = useState<CustomFilter>()
    const [sort, setSort] = useState<SortState>()

    const callbackMemoized = useCallback(() => {
        setLoading(true)
        setError(undefined)
        callback(debouncedValue, customFilter, sort)
            .then(setItems)
            .catch(setError)
            .finally(() => setLoading(false))
    }, [...dependencies, debouncedValue, customFilter, sort])

    useEffect(() => {
        callbackMemoized()
    }, [callbackMemoized])

    return { loading, error, items, setItems, setQuery, query, setCustomFilter, setSort, sort, fetch: callbackMemoized }
}