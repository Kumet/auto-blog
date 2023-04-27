from typing import Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from wordpress_xmlrpc import Client, WordPressPost
from wordpress_xmlrpc.methods.posts import NewPost


class PostData(BaseModel):
    wp_url: str
    wp_user_name: str
    wp_password: str
    title: str
    content: str
    status: Literal['publish', 'draft']


router = APIRouter()


@router.post("/wordpress/post")
def create_wordpress_post(post_data: PostData):
    wp_client = Client(post_data.wp_url, post_data.wp_user_name, post_data.wp_password)

    post = WordPressPost()
    post.title = post_data.title
    post.content = post_data.content
    post.post_status = post_data.status

    try:
        post_id = wp_client.call(NewPost(post))
        return {"post_id": post_id, "message": "Post successfully created on WordPress"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
