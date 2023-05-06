import os

import openai
import tiktoken
from dotenv import load_dotenv
from fastapi import APIRouter
from langchain import OpenAI
from langchain.prompts import PromptTemplate

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


@router.get("/ai/calc_token")
def calc_token(model_name: str, prompt: str) -> int:
    encoding = tiktoken.encoding_for_model(model_name)
    tokens = encoding.encode(prompt)
    tokens_count = len(tokens)
    return tokens_count


@router.get("/ai/to_html")
def sentence_to_html(sentence: str) -> str:
    template = """下記の文章をエンコーディングがutf-8のHTML形式に変更してください

{sentence}
"""
    llm = OpenAI(model_name="gpt-3.5-turbo")
    prompt = PromptTemplate(
        input_variables=["sentence"],
        template=template,
    )
    return llm(prompt.format(sentence=sentence))

@router.get('/ai/description')
def get_description(product_name: str) -> str:
    template = """コストコの商品の{product_name}について100~150文字で説明してください。"""
    llm = OpenAI(model_name="text-davinci-003")
    prompt = PromptTemplate(
        input_variables=["product_name"],
        template=template,
    )
    return llm(prompt.format(product_name=product_name))
