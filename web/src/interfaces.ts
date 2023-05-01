export interface ApiResponse<T> {
    data?: T
    error?: string
    isLoading: boolean
}

export interface Page {
    label: string
    path: string
}

export interface Site {
    id: number;
    url: string;
    user_name: string;
    password: string;
}

export interface SiteProps {
    sites: Site[];
    onUpdate: (site: Site) => void;
    onDelete: (id: number) => void;
}

export interface PostData {
    wp_url: string
    wp_user_name: string
    wp_password: string
    title: string
    status: string
}

export interface LLMConfig {
    model_name: string
    template: string
    temperature: number
    max_tokens: number
}

export interface Request {
    post_data: PostData
    llm_config: LLMConfig
}

export interface WPRequest {
    wp_url: string
    wp_user_name: string
    wp_password: string
    title: string
    content: string
    status: string
}

export interface modelNameOption {
    value: string
    label: string
    max_tokens: number
    pricing: string
    description: string
}

export interface Template {
    id: number;
    label: string;
    content: string;
}

export interface Settings {
    id: number
    site_info: Site
    template: Template
    status: string
    model_name: string
    temperature: number
    max_tokens: number
}
