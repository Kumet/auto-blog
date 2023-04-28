import React, {useEffect, useState} from 'react'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    CircularProgress,
    Container,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Slider,
    Stack,
    TextField,
    Typography
} from '@mui/material'
import usePostData from '../utils/usePostData'
import MyAppBar from '../component/AppBar'
import {Site as SiteType} from '../component/SiteTable'
import api from '../utils/api'


interface PostData {
    wp_url: string
    wp_user_name: string
    wp_password: string
    title: string
    status: string
}

interface LLMConfig {
    model_name: string
    template: string
    temperature: number
    max_tokens: number
}

interface Request {
    post_data: PostData
    llm_config: LLMConfig
}

interface WPRequest {
    wp_url: string
    wp_user_name: string
    wp_password: string
    title: string
    content: string
    status: string
}

interface modelNameOption {
    value: string
    label: string
    max_tokens: number
    pricing: string
    description: string
}


const defaultTemplate: string = '「{title}」というテーマについて書いた記事をHTML形式でエンコーディングはutf-8で作成してください。記事の内容には以下のようなものが含まれます。\n\n   1. タイトルの説明\n   2. タイトルに関連するトピックの紹介\n   3. トピックについての詳細な説明\n   4. トピックに関連する統計データや事実の引用\n   5. 著者の見解や意見\n   6. 記事のまとめ\n\n   記事の長さは、約500〜1000ワードを目安にしてください。文法的に正しい文章を使用し、読みやすく分かりやすい文章を心がけてください。'

const modelNameOptions: modelNameOption[] = [
    {
        value: 'text-davinci-003',
        label: 'text-davinci-003',
        max_tokens: 4000,
        pricing: 'Pricing / $0.0200 -￥2.6 (1K tokens)',
        description: 'GPT-3の中で最も高性能なモデルです。他のモデルで可能なあらゆるタスクが可能で、多くの場合、より高い品質、長い出力、より良い命令追従性が得られます。また、テキストに補完記号を挿入することも可能です。'
    },
    {
        value: 'text-curie-001',
        label: 'text-curie-001',
        max_tokens: 2048,
        pricing: 'Pricing / $0.0020 -￥0.26 (1K tokens)',
        description: '非常に高機能だが、Davinciより高速で低価格。'
    },
    {
        value: 'text-babbage-001',
        label: 'text-babbage-001',
        max_tokens: 2048,
        pricing: 'Pricing / $0.0005 -￥0.065 (1K tokens)',
        description: '素直な応答が可能で、非常に速く、低コスト。'
    },
    {
        value: 'text-ada-001',
        label: 'text-ada-001',
        max_tokens: 2048,
        pricing: 'Pricing / $0.0004 -￥0.052 (1K tokens)',
        description: '素直な応答が可能で、非常に速く、低コスト。'
    },
]

const Home: React.FC = () => {
    const initialState: Request = {
        post_data: {
            wp_url: '',
            wp_user_name: '',
            wp_password: '',
            // status: 'draft',
            status: 'check',
            title: '',
        },
        llm_config: {
            // model_name: 'text-davinci-003',
            model_name: 'text-ada-001',
            temperature: 0.7,
            // max_tokens: 1024,
            max_tokens: 100,
            template: defaultTemplate
        }
    }
    const [state, setState] = useState<Request>(initialState)
    const [sites, setSites] = useState<SiteType[]>([])
    const [postData, {data, error, isLoading}] = usePostData<Request>()
    const [wpPostData, wpResponse] = usePostData<WPRequest>()
    const {data: wpData, error: wpError, isLoading: wpIsLoading} = wpResponse
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [contentData, setContentData] = useState<string | undefined>()
    const [cancel, setCancel] = useState<boolean>(false)
    const isFill = state.post_data.title === ''
    const isCheck = data && state.post_data.status === 'check' && !cancel
    const selectedModel = modelNameOptions.find(modelName => modelName.value === state.llm_config.model_name)!

    const handleSiteChange = (event: { target: { value: any } }) => {
        const selectedSite: SiteType = sites.find(site => site.url === event.target.value)!
        setState((prevState) => ({
            ...prevState,
            post_data: {
                ...prevState.post_data,
                // wp_url: `${selectedSite.url}/xmlrpc.php`,
                wp_url: selectedSite.url,
                wp_user_name: selectedSite.user_name,
                wp_password: selectedSite.password,
            },
        }))
    }

    const handlePostDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target
        setState((prevState) => ({
            ...prevState,
            post_data: {
                ...prevState.post_data,
                [name]: value,
            },
        }))
    }

    const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState((prevState) => ({
            ...prevState,
            post_data: {
                ...prevState.post_data,
                status: (event.target as HTMLInputElement).value,
            },
        }))
    }
    const handleLLMConfigChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const {name, value} = event.target
        setState((prevState) => ({
            ...prevState,
            llm_config: {
                ...prevState.llm_config,
                [name]: value,
            },
        }))
    }

    const handleModelNameChange = (event: { target: { value: any } }) => {
        const selectedModelName = event.target.value
        setState((prevState) => ({
            ...prevState,
            llm_config: {
                ...prevState.llm_config,
                model_name: selectedModelName,
            },
        }))
    }

    const handleTemperatureChange = (
        event: Event,
        newValue: number | number[]
    ) => {
        setState((prevState) => ({
            ...prevState,
            llm_config: {
                ...prevState.llm_config,
                temperature: newValue as number,
            },
        }))
    }

    const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const content = event.target.value
        setContentData(content)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsEdit(true)
        setCancel(false)
        await postData('/wordpress/title_post', state)
    }

    const handleContentSubmit = (status: 'draft' | 'publish' | 'cancel') => async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const wpRequest: WPRequest = {
            wp_url: state.post_data.wp_url,
            wp_user_name: state.post_data.wp_user_name,
            wp_password: state.post_data.wp_password,
            title: state.post_data.title,
            content: contentData as string,
            status: status
        }
        console.log(wpRequest)
        switch (status) {
            case 'draft':
            case 'publish':
                await wpPostData('/wordpress/post', wpRequest)
                break
            case 'cancel':
                break
        }
        setCancel(true)
        setContentData('')
        setIsEdit(false)
        setState((prevState) => ({
            ...prevState,
            post_data: {
                ...prevState.post_data,
                title: '',
            },
        }))
    }

    useEffect(() => {
        if (data) {
            setContentData(data)
        }
    }, [data])

    useEffect(() => {
        const fetchSites = async () => {
            const response = await api.get<SiteType[]>('/site_info')
            setSites(response.data)
        }
        fetchSites()
    }, [])


    return (
        <React.Fragment>
            <MyAppBar/>
            <Container maxWidth={'md'}>
                <h2>Settings</h2>
                <FormControl fullWidth>
                    <FormControl fullWidth>
                        <InputLabel id="url-label">Site</InputLabel>
                        <Select
                            labelId="url-label"
                            id="url"
                            // defaultValue={1}
                            value={state.post_data.wp_url}
                            label="Site"
                            onChange={handleSiteChange}
                        >
                            {sites.map((site) => (
                                <MenuItem key={site.id} value={site.url}>
                                    {site.url}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <RadioGroup
                        row
                        name="status"
                        value={state.post_data.status}
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
                            value={state.llm_config.model_name}
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
                    <Typography variant="body2" sx={{pl: 2}}>
                        - Max Request / {selectedModel.max_tokens} tokens <br/>
                        - {selectedModel.pricing} <br/>
                        - {selectedModel.description}
                    </Typography>

                    <TextField
                        label="Max Tokens"
                        name="max_tokens"
                        type="number"
                        value={state.llm_config.max_tokens}
                        onChange={handleLLMConfigChange}
                        sx={{mt: 2}}
                        error={selectedModel.max_tokens < state.llm_config.max_tokens}
                    />
                    {
                        selectedModel.max_tokens < state.llm_config.max_tokens &&
                        <Typography variant="body2" color="red">tokenが大きすぎます</Typography>
                    }

                    <Accordion sx={{mt: 2}}>
                        <AccordionSummary>
                            <Typography>Temperature: {state.llm_config.temperature}</Typography>
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
                        value={state.llm_config.temperature}
                        min={0}
                        max={1}
                        step={0.1}
                        marks
                        onChange={handleTemperatureChange}
                        sx={{maxWidth: '50%', margin: '0 auto'}}
                    />

                    <TextField
                        label="Template"
                        name="template"
                        value={state.llm_config.template}
                        onChange={handleLLMConfigChange}
                        sx={{mt: 2}}
                        multiline
                    />

                    <TextField
                        label="Title"
                        name="title"
                        value={state.post_data.title}
                        onChange={handlePostDataChange}
                        sx={{mt: 2}}
                        error={isFill}
                    />

                    <TextField
                        label="Content"
                        name="content"
                        value={contentData}
                        sx={{mt: 2, mb: 4}}
                        multiline
                        disabled={!isEdit}
                        onChange={handleContentChange}
                    />

                    {(isLoading || wpIsLoading) &&
                        <Box sx={{margin: '0 auto', my: 2}}>
                            <CircularProgress/>
                        </Box>
                    }

                    {isCheck ?
                        <Stack direction="row" spacing={2} sx={{margin: '0 auto'}}>
                            <Button variant="contained" color="primary" size="large"
                                    onClick={handleContentSubmit('draft')}>
                                下書き
                            </Button>
                            <Button variant="contained" color="secondary" size="large"
                                    onClick={handleContentSubmit('publish')}>
                                投稿
                            </Button>
                            <Button variant="contained" color="error" size="large"
                                    onClick={handleContentSubmit('cancel')}>
                                キャンセル
                            </Button>
                        </Stack>
                        :
                        <Button variant="contained" color="primary" disabled={isFill} onClick={handleSubmit}>
                            Submit
                        </Button>
                    }
                    {wpData && <Typography variant="body1" color="success">{wpData}</Typography>}
                    {(error || wpError) && <Typography variant="body1" color="red">{error}</Typography>}

                </FormControl>
            </Container>
        </React.Fragment>
    )
}

export default Home