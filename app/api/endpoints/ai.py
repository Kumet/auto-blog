import os

import openai
from dotenv import load_dotenv
from fastapi import APIRouter
from pydantic import BaseModel
from langchain import OpenAI
from langchain.prompts import PromptTemplate



router = APIRouter()
load_dotenv()
openai.api_key = os.environ.get("OPENAI_API_KEY")


@router.post("/ai/title")
def generate_blog_post(title: str) -> str:
    llm = OpenAI(max_tokens=2048)
    template = """
「{title}」というテーマについて書いた記事を作成してください。記事の内容には以下のようなものが含まれます。

1. タイトルの説明
2. タイトルに関連するトピックの紹介
3. トピックについての詳細な説明
4. トピックに関連する統計データや事実の引用
5. 著者の見解や意見
6. 記事のまとめ

記事の長さは、約500〜1000ワードを目安にしてください。文法的に正しい文章を使用し、読みやすく分かりやすい文章を心がけてください。」
    """
    prompt = PromptTemplate(
        input_variables=['title'],
        template=template,
    )
    return llm(prompt.format(title=title))
