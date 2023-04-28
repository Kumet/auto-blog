import React, {useState} from 'react'
import {Box, Button, Table, TableBody, TableCell, TableHead, TableRow, TextField,} from '@mui/material'

export interface Site {
    id: number;
    url: string;
    user_name: string;
    password: string;
}

interface SiteProps {
    sites: Site[];
    onUpdate: (id: number, url: string, user_name: string, password: string) => void;
    onDelete: (id: number) => void;
}

const SiteTable: React.FC<SiteProps> = ({sites, onUpdate, onDelete}) => {
    const [editSiteId, setEditSiteId] = useState<number | null>(null)
    const [url, setUrl] = useState('')
    const [user_name, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState<number | null>(null)

    const handleUpdate = (id: number) => {
        onUpdate(id, url, user_name, password)
        setUrl('')
        setUserName('')
        setPassword('')
        setEditSiteId(null)
    }

    return (
        <Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>URL</TableCell>
                        <TableCell>User Name</TableCell>
                        <TableCell>Password</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sites.map((site) => (
                        <TableRow key={site.id}>
                            <TableCell>
                                {editSiteId === site.id ? (
                                    <TextField
                                        fullWidth
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        autoFocus
                                    />
                                ) : (
                                    site.url
                                )}
                            </TableCell>
                            <TableCell>
                                {editSiteId === site.id ? (
                                    <TextField
                                        fullWidth
                                        value={user_name}
                                        onChange={(e) => setUserName(e.target.value)}
                                    />
                                ) : (
                                    site.user_name
                                )}
                            </TableCell>
                            <TableCell>
                                {editSiteId === site.id ? (
                                    <TextField
                                        fullWidth
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                ) : (
                                    <span
                                        style={{cursor: 'pointer'}}
                                        onClick={() => setShowPassword(showPassword === site.id ? null : site.id)}
                                    >
                                        {showPassword === site.id ? site.password : '••••••••'}
                                    </span>
                                )}
                            </TableCell>

                            <TableCell>
                                {editSiteId === site.id ? (
                                    <Button variant="contained" color="primary" sx={{height: '56px'}}
                                            onClick={() => handleUpdate(site.id)}>
                                        Save
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        sx={{height: '56px'}}
                                        onClick={() => {
                                            setUrl(site.url)
                                            setUserName(site.user_name)
                                            setPassword(site.password)
                                            setEditSiteId(site.id)
                                        }}
                                    >
                                        Edit
                                    </Button>
                                )}
                                {editSiteId !== site.id &&
                                    <Button variant="outlined" color="error" sx={{height: '56px', mx: 1}}
                                            onClick={() => onDelete(site.id)}>
                                        Delete
                                    </Button>
                                }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    )
}

export default SiteTable
