import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv('DASHSCOPE_API_KEY'),
    base_url='https://dashscope.aliyuncs.com/compatible-mode/v1'
)

completion = client.embeddings.create(
    model="text-embedding-v4",
    input="我想知道迪士尼的退票政策",
    dimensions=1024,
    encoding_format="float"
)

print(completion.model_dump_json())
