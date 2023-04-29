import React, {useState} from 'react'
import {Box, Button, Table, TableBody, TableCell, TableHead, TableRow, TextField,} from '@mui/material'
import {Site, SiteProps} from '../interfaces'

const SiteTable: React.FC<SiteProps> = ({sites, onUpdate, onDelete}) => {
    const [editSite, setEditSite] = useState<Site | null>(null)
    const [showPassword, setShowPassword] = useState<number | null>(null)

    const handleUpdate = () => {
        if (editSite) {
            onUpdate(editSite)
            setEditSite(null)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditSite((prev) => ({
            ...prev!,
            [e.target.name]: e.target.value
        }))
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
                                {editSite?.id === site.id ? (
                                    <TextField
                                        fullWidth
                                        name="url"
                                        value={editSite.url}
                                        onChange={handleChange}
                                        autoFocus
                                    />
                                ) : (
                                    site.url
                                )}
                            </TableCell>
                            <TableCell>
                                {editSite?.id === site.id ? (
                                    <TextField
                                        fullWidth
                                        name="user_name"
                                        value={editSite.user_name}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    site.user_name
                                )}
                            </TableCell>
                            <TableCell>
                                {editSite?.id === site.id ? (
                                    <TextField
                                        fullWidth
                                        name="password"
                                        value={editSite.password}
                                        onChange={handleChange}
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
                                {editSite?.id === site.id ? (
                                    <Button variant="contained" color="primary" sx={{height: '56px'}}
                                            onClick={handleUpdate}>
                                        Save
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        sx={{height: '56px'}}
                                        onClick={() => {setEditSite(site)}}
                                    >
                                        Edit
                                    </Button>
                                )}
                                {editSite?.id !== site.id &&
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
