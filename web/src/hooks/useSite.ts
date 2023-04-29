import {useCallback, useState} from 'react'
import api from '../utils/api'
import {Site} from '../interfaces'


const useSite = () => {
    const [sites, setSites] = useState<Site[]>([])

    const fetchSites = useCallback(async () => {
        try {
            const response = await api.get<Site[]>('/site_info')
            setSites(response.data)
        } catch (error) {
            console.error(error)
        }
    }, [])

    const createSite = useCallback(async (newSite: Omit<Site, 'id'>) => {
        try {
            await api.post('/site_info', newSite)
            await fetchSites()
        } catch (error) {
            console.error(error)
        }
    }, [fetchSites])

    const updateSite = useCallback(async (updateSite: Site) => {
        try {
            await api.put(`/site_info/${updateSite.id}`, updateSite)
            await fetchSites()
        } catch (error) {
            console.log(error)
        }
    }, [fetchSites])

    const deleteSite = useCallback(async (id: number) => {
        try {
            await api.delete(`/site_info/${id}`)
            await fetchSites()
        } catch (error) {
            console.error(error)
        }
    }, [fetchSites])
    return {sites, fetchSites, createSite, updateSite, deleteSite}
}

export default useSite