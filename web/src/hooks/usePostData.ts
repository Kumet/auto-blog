import {useCallback, useState} from 'react'
import api from '../utils/api'
import {AxiosError} from 'axios'

interface ApiResponse<T> {
    data?: T
    error?: string
    isLoading: boolean
}

const usePostData = <T, >(): [(endpoint: string, data: T) => Promise<void>, ApiResponse<string>] => {
    const [response, setResponse] = useState<string>()
    const [error, setError] = useState<string>()
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const postData = useCallback(async (endpoint: string, data: T) => {
        setError('')
        setIsLoading(true)
        try {
            const result = await api.post<string>(endpoint, data)
            setResponse(result.data)
        } catch (err) {
            setError((err as AxiosError).message)
        } finally {
            setIsLoading(false)
        }
    }, [])
    return [postData, {data: response, error, isLoading}]
}

export default usePostData