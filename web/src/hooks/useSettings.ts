import {useCallback, useState} from 'react'
import api from '../utils/api'
import {Settings} from '../interfaces'


const useSettings = () => {
    const [settings, setSettings] = useState<Settings[]>([])

    const fetchSettings = useCallback(async () => {
        try {
            const response = await api.get<Settings[]>('/settings')
            setSettings(response.data)
        } catch (error) {
            console.error(error)
        }
    }, [])

    const createSettings = useCallback(async (newSettings: Omit<Settings, 'id'>) => {
        try {
            await api.post('/settings', newSettings)
            await fetchSettings()
        } catch (error) {
            console.error(error)
        }
    }, [fetchSettings])

    const updateSettings = useCallback(async (updatedSettings: Settings) => {
        try {
            await api.put(`/settings/${updatedSettings.id}`, updatedSettings)
            await fetchSettings()
        } catch (error) {
            console.error(error)
        }
    }, [fetchSettings])

    const deleteSettings = useCallback(async (id: number) => {
        try {
            await api.delete(`/settings/${id}`)
            await fetchSettings()
        } catch (error) {
            console.error(error)
        }
    }, [fetchSettings])

    return {settings, fetchSettings, createSettings, updateSettings, deleteSettings}
}

export default useSettings