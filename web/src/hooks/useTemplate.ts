import {useCallback, useState} from 'react'
import api from './api'


export interface Template {
    id: number;
    label: string;
    content: string;
}

const useTemplates = () => {
    const [templates, setTemplates] = useState<Template[]>([])

    const fetchTemplates = useCallback(async () => {
        try {
            const response = await api.get<Template[]>('/template')
            setTemplates(response.data)
        } catch (error) {
            console.error(error)
        }
    }, [])

    const createTemplate = useCallback(async (newTemplate: Omit<Template, 'id'>) => {
        try {
            await api.post('/template', newTemplate)
            await fetchTemplates()
        } catch (error) {
            console.error(error)
        }
    }, [fetchTemplates])

    const updateTemplate = useCallback(async (updatedTemplate: Template) => {
        try {
            await api.put(`/template/${updatedTemplate.id}`, updatedTemplate)
            await fetchTemplates()
        } catch (error) {
            console.error(error)
        }
    }, [fetchTemplates])

    const deleteTemplate = useCallback(async (id: number) => {
        try {
            await api.delete(`/template/${id}`)
            await fetchTemplates()
        } catch (error) {
            console.error(error)
        }
    }, [fetchTemplates])

    return {templates, fetchTemplates, createTemplate, updateTemplate, deleteTemplate}
}

export default useTemplates