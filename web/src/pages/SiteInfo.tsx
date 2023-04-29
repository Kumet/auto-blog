import React, {useEffect, useState} from 'react'
import {Box, Button, Container, TextField} from '@mui/material'
import SiteTable from '../component/SiteTable'
import api from '../utils/api'
import MyAppBar from '../component/AppBar'
import {Site as SiteType} from '../interfaces'

const SiteInfo: React.FC = () => {
    const [sites, setSites] = useState<SiteType[]>([])
    const [newUrl, setNewUrl] = useState('')
    const [newUserName, setNewUserName] = useState('')
    const [newPassword, setNewPassword] = useState('')

    useEffect(() => {
        const fetchSites = async () => {
            const response = await api.get<SiteType[]>('/site_info')
            setSites(response.data)
        }
        fetchSites()
    }, [])

    const handleAdd = async () => {
        const newSite = {
            url: newUrl,
            user_name: newUserName,
            password: newPassword,
        }
        const response = await api.post<SiteType>('/site_info', newSite)
        setSites([...sites, response.data])
        setNewUrl('')
        setNewUserName('')
        setNewPassword('')
    }

    const handleUpdate = async (id: number, url: string, user_name: string, password: string) => {
        const updatedSite = {url, user_name, password}
        await api.put(`/site_info/${id}`, updatedSite)
        const updatedSites = sites.map((site) => (site.id === id ? {...site, url, user_name, password} : site))
        setSites(updatedSites)
    }

    const handleDelete = async (id: number) => {
        await api.delete(`/site_info/${id}`)
        const updatedSites = sites.filter((site) => site.id !== id)
        setSites(updatedSites)
    }

    return (
        <React.Fragment>
            <MyAppBar/>
            <Container maxWidth="md">
                <Box sx={{my: 2}}>
                    <Box>
                        <TextField label="URL" value={newUrl} sx={{mx: 1}} onChange={(e) => setNewUrl(e.target.value)}/>
                        <TextField label="User Name" value={newUserName} sx={{mx: 1}}
                                   onChange={(e) => setNewUserName(e.target.value)}/>
                        <TextField label="Password" value={newPassword} sx={{mx: 1}}
                                   onChange={(e) => setNewPassword(e.target.value)}/>
                        <Button variant="contained" color="primary" sx={{height: '56px'}} onClick={handleAdd}>
                            Add Site
                        </Button>
                    </Box>
                    <SiteTable sites={sites} onUpdate={handleUpdate} onDelete={handleDelete}/>
                </Box>
            </Container>
        </React.Fragment>
    )
}

export default SiteInfo
