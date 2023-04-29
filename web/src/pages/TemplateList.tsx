import React, {useEffect, useState} from 'react'
import useTemplates from '../hooks/useTemplate'
import {
    Box,
    Button, Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    TextField,
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MyAppBar from '../component/AppBar'
import {Template} from '../interfaces'

const TemplateList: React.FC = () => {
    const {templates, fetchTemplates, createTemplate, updateTemplate, deleteTemplate} = useTemplates()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null)
    const [isEditMode, setIsEditMode] = useState(false)

    useEffect(() => {
        fetchTemplates()
    }, [fetchTemplates])

    const handleCreate = (template: Omit<Template, 'id'>) => {
        createTemplate(template)
    }

    const handleUpdate = (template: Template) => {
        updateTemplate(template)
    }

    const handleDelete = (id: number) => {
        deleteTemplate(id)
    }

    const handleDialogOpen = () => setDialogOpen(true)
    const handleDialogClose = () => {
        setDialogOpen(false)
        setCurrentTemplate(null)
        setIsEditMode(false)
    }

    const handleCreateOrUpdate = () => {
        if (currentTemplate) {
            if (isEditMode) {
                handleUpdate(currentTemplate)
            } else {
                handleCreate(currentTemplate)
            }
        }
        handleDialogClose()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentTemplate((prev) => ({
            ...prev!,
            [e.target.name]: e.target.value,
        }))
    }

    const handleEdit = (template: Template) => {
        setCurrentTemplate(template)
        setIsEditMode(true)
        handleDialogOpen()
    }


    return (
        <React.Fragment>
            <MyAppBar/>
            <Container maxWidth="md">
                <Box>
                    <List>
                        {templates.map((template) => (
                            <ListItem key={template.id}>
                                <ListItemText primary={template.label} secondary={template.content} sx={{pr: "2rem"}}/>
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(template)}>
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton edge="end" aria-label="delete"
                                                onClick={() => handleDelete(template.id)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                    <Fab color="primary" aria-label="add" onClick={handleDialogOpen}>
                        <AddIcon/>
                    </Fab>

                    <Dialog open={dialogOpen} onClose={handleDialogClose}>
                        <DialogTitle>{isEditMode ? 'Edit Template' : 'Add Template'}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>Enter template information:</DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                name="label"
                                label="Label"
                                fullWidth
                                value={currentTemplate?.label || ''}
                                onChange={handleChange}
                            />
                            <TextField
                                margin="dense"
                                name="content"
                                label="Content"
                                fullWidth
                                multiline
                                value={currentTemplate?.content || ''}
                                onChange={handleChange}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDialogClose}>Cancel</Button>
                            <Button onClick={handleCreateOrUpdate}
                                    disabled={!currentTemplate?.label || !currentTemplate?.content}>
                                {isEditMode ? 'Update' : 'Create'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Container>
        </React.Fragment>
    )
}

export default TemplateList
