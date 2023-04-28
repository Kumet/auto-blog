import os
from typing import Literal

import openai
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from langchain import OpenAI
from langchain.prompts import PromptTemplate
from pydantic import BaseModel
from wordpress_xmlrpc import Client, WordPressPost
from wordpress_xmlrpc.methods.posts import NewPost

load_dotenv()
openai.api_key = os.environ.get("OPENAI_API_KEY")

template = """
   「{title}」というテーマについて書いた記事をHTML形式でエンコーディングはutf-8で作成してください。記事の内容には以下のようなものが含まれます。

   1. タイトルの説明
   2. タイトルに関連するトピックの紹介
   3. トピックについての詳細な説明
   4. トピックに関連する統計データや事実の引用
   5. 著者の見解や意見
   6. 記事のまとめ

   記事の長さは、約500〜1000ワードを目安にしてください。文法的に正しい文章を使用し、読みやすく分かりやすい文章を心がけてください。」
       """


class PostData(BaseModel):
    wp_url: str
    wp_user_name: str
    wp_password: str
    title: str
    status: Literal["publish", "draft", "check"]

class PostContentData(BaseModel):
    wp_url: str
    wp_user_name: str
    wp_password: str
    title: str
    status: Literal["publish", "draft"]
    content: str


class LLMConfig(BaseModel):
    model_name: str = "text-davinci-002"
    template: str = template
    temperature: float = 0.7
    max_tokens: int = 1024


class AutoPostRequest(BaseModel):
    post_data: PostData
    llm_config: LLMConfig


router = APIRouter()


@router.post("/wordpress/test")
def test_api(request: AutoPostRequest):
    print(request)
    return 'test content'

@router.post("/wordpress/post")
def create_post(request: PostContentData):
    print(request)
    wp_client = Client(
        request.wp_url,
        request.wp_user_name,
        request.wp_password,
    )

    post = WordPressPost()
    post.title = request.title
    post.content = request.content
    post.post_status = request.status
    print(post)
    try:
        # wp_client.call(NewPost(post))
        post_id = wp_client.call(NewPost(post))
        print(post_id)
        return 'Post successfully created on WordPress'
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/wordpress/title_post")
def create_wordpress_post_from_title(request: AutoPostRequest):
    llm = OpenAI(
        model_name=request.llm_config.model_name,
        temperature=request.llm_config.temperature,
        max_tokens=request.llm_config.max_tokens,
    )
    prompt = PromptTemplate(
        input_variables=["title"],
        template=request.llm_config.template,
    )
    llm_result = llm(prompt.format(title=request.post_data.title))

    if request.post_data.status == 'check':
        return llm_result

    wp_client = Client(
        request.post_data.wp_url,
        request.post_data.wp_user_name,
        request.post_data.wp_password,
    )

    post = WordPressPost()
    post.title = request.post_data.title
    post.content = llm_result
    post.post_status = request.post_data.status

    try:
        # wp_client.call(NewPost(post))
        post_id = wp_client.call(NewPost(post))
        return llm_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
