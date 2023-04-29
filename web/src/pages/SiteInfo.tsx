import React, {useEffect, useState} from 'react'
import {Box, Button, Container, TextField} from '@mui/material'
import SiteTable from '../component/SiteTable'
import MyAppBar from '../component/AppBar'
import {Site} from '../interfaces'
import useSite from '../hooks/useSite'

const SiteInfo: React.FC = () => {
    const {sites, fetchSites, createSite, updateSite, deleteSite} = useSite()
    const [currentSite, setCurrentSite] = useState<Site>({id: 0, url: '', user_name: '', password: ''})

    useEffect(() => {
        fetchSites()
    }, [fetchSites])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentSite((prev) => ({
            ...prev!,
            [e.target.name]: e.target.value
        }))
    }

    const handleCreate = () => {
        if (currentSite) {
            createSite(currentSite)
        }
    }

    const handleUpdate = (site: Site) => {
        updateSite(site)
    }

    const handleDelete = (id: number) => {
        deleteSite(id)
    }


    return (
        <React.Fragment>
            <MyAppBar/>
            <Container maxWidth="md">
                <Box sx={{my: 2}}>
                    <Box>
                        <TextField label="URL" value={currentSite?.url} sx={{mx: 1}} name="url"
                                   onChange={handleChange}/>
                        <TextField label="User Name" value={currentSite?.user_name} sx={{mx: 1}} name="user_name"
                                   onChange={handleChange}/>
                        <TextField label="Password" value={currentSite?.password} sx={{mx: 1}} name="password"
                                   onChange={handleChange}/>
                        <Button variant="contained" color="primary" sx={{height: '56px'}} onClick={handleCreate}>
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
