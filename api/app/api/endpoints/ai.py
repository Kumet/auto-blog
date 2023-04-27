import os

import openai
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from langchain import OpenAI
from langchain.prompts import PromptTemplate
from wordpress_xmlrpc import Client, WordPressPost
from wordpress_xmlrpc.methods.posts import NewPost

router = APIRouter()
load_dotenv()
openai.api_key = os.environ.get("OPENAI_API_KEY")


@router.post("/ai/title")
def generate_blog_post(title: str) -> str:
    llm = OpenAI(max_tokens=3000)
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
    prompt = PromptTemplate(
        input_variables=["title"],
        template=template,
    )
    return llm(prompt.format(title=title))


@router.post("/ai/auto_post")
def post_draft_content_from_title(title: str):
    llm = OpenAI(max_tokens=3000)
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
    prompt = PromptTemplate(
        input_variables=["title"],
        template=template,
    )
    url = "https://finger-seo.com/xmlrpc.php"
    user = "nobukawa.ken@gmail.com"
    password = "finfin!"
    status = "draft"
    content = llm(prompt.format(title=title))
    # content = '下書き投稿テスト'

    wp_client = Client(url, user, password)

    post = WordPressPost()
    post.title = title
    post.content = content
    post.post_status = status

    try:
        post_id = wp_client.call(NewPost(post))
        return {"post_id": post_id, "message": "Post successfully created on WordPress"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
