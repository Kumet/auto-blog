import React, {useEffect, useState} from 'react'
import MyAppBar from '../component/AppBar'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary, Button,
    Container,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select, Slider, TextField,
    Typography
} from '@mui/material'
import useSettings from '../hooks/useSettings'
import useSite from '../hooks/useSite'
import useTemplates from '../hooks/useTemplate'
import {Settings as SettingsType, Site, Template} from '../interfaces'
import {modelNameOptions} from './Home'


const Settings: React.FC = () => {
    const {settings, fetchSettings, createSettings, updateSettings} = useSettings()
    const {sites, fetchSites} = useSite()
    const {templates, fetchTemplates} = useTemplates()
    const [currentSettings, setCurrentSettings] = useState<SettingsType | null>(null)
    const [isCreateMode, setIsCreateMode] = useState<boolean>(false)
    const selectedModel = modelNameOptions.find(
        modelName => modelName.value === currentSettings?.model_name)!

    useEffect(() => {
        fetchSettings()
        fetchSites()
        fetchTemplates()
    }, [fetchSettings, fetchSites, fetchTemplates])

    useEffect(() => {
        if (settings) {
            if (settings.length === 0) {
                setIsCreateMode(true)
                setCurrentSettings({
                    id: 0,
                    site_info: {id: 0, url: '', user_name: '', password: ''},
                    template: {id: 0, label: '', content: ''},
                    temperature: 0,
                    model_name: '',
                    status: 'check',
                    max_tokens: 0,
                })
            } else {
                setIsCreateMode(false)
                setCurrentSettings(settings[0])
            }
        }
    }, [settings])

    const handleSiteChange = (event: { target: { value: any } }) => {
        const selectedSite: Site = sites.find(site => site.url === event.target.value)!
        setCurrentSettings((prev) => ({
            ...prev!,
            site_info: selectedSite
        }))
    }
    const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentSettings((prev) => ({
            ...prev!,
            status: (event.target as HTMLInputElement).value
        }))
    }

    const handleModelNameChange = (event: { target: { value: any } }) => {
        const selectedModelName = event.target.value
        setCurrentSettings((prev) => ({
            ...prev!,
            model_name: selectedModelName
        }))
    }

    const handleTemperatureChange = (
        event: Event,
        newValue: number | number[]
    ) => {
        setCurrentSettings((prev) => ({
            ...prev!,
            temperature: newValue as number
        }))
    }

    const handleSelectTemplate = (event: { target: { value: any } }) => {
        setCurrentSettings((prev) => ({
            ...prev!,
            template: templates.find(template => template.label === event.target.value)!
        }))
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target
        setCurrentSettings((prev) => ({
            ...prev!, [name]: value
        }))
    }

    const handleCreateSettings = async (settings: Omit<SettingsType, 'id'>) => {
        await createSettings(settings)
    }

    const handleUpdateSettings = async (settings: SettingsType) => {
        await updateSettings(settings)
    }

    const handleCreateOrUpdate = () => {
        if (currentSettings) {
            if (isCreateMode) {
                handleCreateSettings(currentSettings)
            } else {
                handleUpdateSettings(currentSettings)
            }
        }
    }

    return (
        <React.Fragment>
            <MyAppBar/>
            <Container maxWidth="md">
                <h2>Settings</h2>
                <FormControl fullWidth>
                    <FormControl fullWidth>
                        <InputLabel id="url-label">Site</InputLabel>
                        <Select
                            labelId="url-label"
                            id="url"
                            value={currentSettings?.site_info.url || ''}
                            label="Site"
                            onChange={handleSiteChange}
                        >
                            {sites.map((site) => (
                                <MenuItem key={site.id} value={site.url}>
                                    {site.url}
                                </MenuItem>
                            ))}
                        </Select>

                        <RadioGroup
                            row
                            name="status"
                            value={currentSettings?.status || ''}
                            onChange={handleStatusChange}
                            sx={{mt: 2}}
                        >
                            <FormControlLabel
                                value="check"
                                control={<Radio/>}
                                label="確認"
                            />
                            <FormControlLabel
                                value="draft"
                                control={<Radio/>}
                                label="下書き"
                            />
                            <FormControlLabel
                                value="publish"
                                control={<Radio/>}
                                label="投稿"
                            />
                        </RadioGroup>

                        <FormControl fullWidth sx={{mt: 2}}>
                            <InputLabel id="model-name-label">Model Name</InputLabel>
                            <Select
                                labelId="model-name-label"
                                id="model-name"
                                value={currentSettings?.model_name || ''}
                                label="Model Name"
                                onChange={handleModelNameChange}
                            >
                                {modelNameOptions.map((option) => (
                                    <MenuItem key={option.label} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </FormControl>

                    {selectedModel &&
                        <Typography variant="body2" sx={{pl: 2}}>
                            - Max Request / {selectedModel.max_tokens} tokens <br/>
                            - {selectedModel.pricing} <br/>
                            - {selectedModel.description}
                        </Typography>
                    }

                    <TextField
                        label="Max Tokens"
                        name="max_tokens"
                        type="number"
                        value={currentSettings?.max_tokens || ''}
                        onChange={handleInputChange}
                        sx={{mt: 2}}
                    />

                    <Accordion sx={{mt: 2}}>
                        <AccordionSummary>
                            <Typography>Temperature: {currentSettings?.temperature || 0}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Temperature -
                                簡潔に言うと、この値が低ければ低いほど、最も確率が高い回答が常に選ばれるため、結果はより決定論的になります。この値を上げると、ランダム性が増し、より多様で創造的なアウトプットが可能になります。つまり、他の回答の可能性のある重みを増やすことになります。応用例としては、事実に基づくQAなどでは、この値を低くして、より事実に基づいた簡潔な回答を促すとよいでしょう。逆に、詩の生成やその他の創造的なタスクでは、temperatureを上げると効果的かもしれません。
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Slider
                        valueLabelDisplay="auto"
                        value={currentSettings?.temperature || 0}
                        min={0}
                        max={1}
                        step={0.1}
                        marks
                        onChange={handleTemperatureChange}
                        sx={{maxWidth: '50%', margin: '0 auto'}}
                    />

                    <FormControl fullWidth>
                        <InputLabel id="template-select">template select</InputLabel>
                        <Select
                            labelId="template-select"
                            id="template-select"
                            value={currentSettings?.template.label || ''}
                            label="template select"
                            onChange={handleSelectTemplate}
                        >
                            {templates.map((template) => (
                                <MenuItem key={template.id} value={template.label ?? ''}>
                                    {template.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Template"
                        name="template"
                        value={currentSettings?.template.content || ''}
                        sx={{mt: 2, mb: 4}}
                        multiline
                    />

                    <Button variant="contained" color="primary" onClick={handleCreateOrUpdate}>
                        Save
                    </Button>
                </FormControl>
            </Container>
        </React.Fragment>
    )
}

export default Settings