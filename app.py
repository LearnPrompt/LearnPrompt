import os
from typing import Iterator

import gradio as gr
from dotenv import load_dotenv
from distutils.util import strtobool
import requests

from llama2_wrapper import LLAMA2_WRAPPER

os.environ['no_proxy'] = '127.0.0.1,localhost'

load_dotenv()

DEFAULT_SYSTEM_PROMPT = os.getenv("DEFAULT_SYSTEM_PROMPT", "")
MAX_MAX_NEW_TOKENS = int(os.getenv("MAX_MAX_NEW_TOKENS", 2048))
DEFAULT_MAX_NEW_TOKENS = int(os.getenv("DEFAULT_MAX_NEW_TOKENS", 1024))
MAX_INPUT_TOKEN_LENGTH = int(os.getenv("MAX_INPUT_TOKEN_LENGTH", 4000))

MODEL_PATH = os.getenv("MODEL_PATH")
assert MODEL_PATH is not None, f"MODEL_PATH is required, got: {MODEL_PATH}"
BACKEND_TYPE = os.getenv("BACKEND_TYPE")
assert BACKEND_TYPE is not None, f"BACKEND_TYPE is required, got: {BACKEND_TYPE}"

LOAD_IN_8BIT = bool(strtobool(os.getenv("LOAD_IN_8BIT", "True")))

llama2_wrapper = LLAMA2_WRAPPER(
    model_path=MODEL_PATH,
    backend_type=BACKEND_TYPE,
    max_tokens=MAX_INPUT_TOKEN_LENGTH,
    load_in_8bit=LOAD_IN_8BIT,
    # verbose=True,
)

DESCRIPTION = """
# 📚雅思口语学习助手😊

This is a chatbot based on IELTS-llama2. 
- Background: [雅思学习助手](https://confluence.inner.youdao.com/pages/viewpage.action?pageId=277793503)
- Datasets: [雅思学习助手资源整合](https://confluence.inner.youdao.com/pages/viewpage.action?pageId=277785296)
- 优化过程：[雅思口语助手训练](https://confluence.inner.youdao.com/pages/viewpage.action?pageId=279695935)
- 
- Example分为四组：分别对应雅思口语考试的四个部分：出题，对话，评估, 范文。
-
- 🔥实际测试可以访问[雅思口语助手测试案例](https://confluence.inner.youdao.com/pages/viewpage.action?pageId=281828617)来编写自己的例子🔥
"""

class Messages_lst:
    def __init__(self):
        self.memorty = {
            "topic":"",
            "Questions":"",
            "answer":[],
            "Eval":"",
            "NewResponse":""
        }

    def update(self, message, type):
        if type != "answer":
            self.memorty[type] = message
        else:
            self.memorty[type].append(message)
    
    def reset(self, message, type):
        if type != "answer":
            self.memorty[type] = ""
        else:
            tmp = self.memorty[type]
            self.memorty[type] = tmp[:-1]
    
    def resetALL(self):
        self.memorty = {
            "topic":"",
            "Questions":"",
            "answer":[],
            "Eval":"",
            "NewResponse":""
        }
    
    def get(self, message, type):
        if type != "answer":
            return self.memorty[type]
        else:
            return "\n".join(self.memorty[type])


Messages_whole = Messages_lst()

def clear_and_save_textbox(message: str) -> tuple[str, str]:
    return "", message


def display_input(
    message: str, history: list[tuple[str, str]]
) -> list[tuple[str, str]]:
    history.append((message, ""))
    return history


def delete_prev_fn(history: list[tuple[str, str]]) -> tuple[list[tuple[str, str]], str]:
    try:
        message, _ = history.pop()
    except IndexError:
        message = ""
    return history, message or ""


def generate(
    message: str,
    history_with_input: list[tuple[str, str]],
    system_prompt: str,
    max_new_tokens: int,
    temperature: float,
    top_p: float,
    top_k: int,
) -> Iterator[list[tuple[str, str]]]:
    if max_new_tokens > MAX_MAX_NEW_TOKENS:
        raise ValueError

    history = history_with_input[:-1]
    generator = llama2_wrapper.run(
        message, history, system_prompt, max_new_tokens, temperature, top_p, top_k
    )
    try:
        first_response = next(generator)
        yield history + [(message, first_response)]
    except StopIteration:
        yield history + [(message, "")]
    for response in generator:
        yield history + [(message, response)]


def http_bot(prompt):
    headers = {"User-Agent": "vLLM Client"}
    pload = {
        "prompt": prompt,
        "stream": True,
        "max_tokens": 1024,
        'temperature':0.7,
        'top_p':0.95,
        'presence_penalty': 1.1
        
    }
    response = requests.post("http://10.105.68.40:11002/generate",
                             headers=headers,
                             json=pload,
                             stream=True)

    for chunk in response.iter_lines(chunk_size=8192,
                                     decode_unicode=False,
                                     delimiter=b"\0"):
        if chunk:
            data = json.loads(chunk.decode("utf-8"))
            output = data["text"][0]
            yield output


def generate_vllm(
    message: str,
    history_with_input: list[tuple[str, str]],
    system_prompt: str,
    max_new_tokens: int,
    temperature: float,
    top_p: float,
    top_k: int,
) -> Iterator[list[tuple[str, str]]]:
    if max_new_tokens > MAX_MAX_NEW_TOKENS:
        raise ValueError

    history = history_with_input[:-1]
    # generator = llama2_wrapper.run(
    #     message, history, system_prompt, max_new_tokens, temperature, top_p, top_k
    # )
    # try:
    #     first_response = next(generator)
    #     yield history + [(message, first_response)]
    # except StopIteration:
    #     yield history + [(message, "")]
    # for response in generator:
    #     yield history + [(message, response)]

    headers = {"User-Agent": "vLLM Client"}
    pload = {
        "prompt": prompt,
        "stream": True,
        "max_tokens": 1024,
        'temperature':0.7,
        'top_p':0.95,
        'presence_penalty': 1.1
        
    }
    response = requests.post("http://10.105.68.40:11002/generate",
                             headers=headers,
                             json=pload,
                             stream=True)

    for chunk in response.iter_lines(chunk_size=8192,
                                     decode_unicode=False,
                                     delimiter=b"\0"):
        if chunk:
            data = json.loads(chunk.decode("utf-8"))
            output = data["text"][0]
            yield history + [(message, output)]



def process_example1(message: str, type: str) -> tuple[str, list[tuple[str, str]]]:
    generator = generate(message, [], DEFAULT_SYSTEM_PROMPT, 1024, 1, 0.95, 50)
    for x in generator:
        pass
    Messages_whole.update(message, type)
    return "", x

def process_example2(message: str) -> tuple[str, list[tuple[str, str]]]:
    generator = generate(message, [], DEFAULT_SYSTEM_PROMPT, 1024, 1, 0.95, 50)
    for x in generator:
        pass
    return "", x


def process_example3(message: str) -> tuple[str, list[tuple[str, str]]]:
    generator = generate(message, [], DEFAULT_SYSTEM_PROMPT, 1024, 1, 0.95, 50)
    for x in generator:
        pass
    return "", x


def process_example4(message: str) -> tuple[str, list[tuple[str, str]]]:
    generator = generate(message, [], DEFAULT_SYSTEM_PROMPT, 1024, 1, 0.95, 50)
    for x in generator:
        pass
    return "", x

# def process_file(file_path):
#     # 在这里处理你的文件
#     return "File received: " + file_path


def check_input_token_length(
    message: str, chat_history: list[tuple[str, str]], system_prompt: str
) -> None:
    input_token_length = llama2_wrapper.get_input_token_length(
        message, chat_history, system_prompt
    )
    if input_token_length > MAX_INPUT_TOKEN_LENGTH:
        raise gr.Error(
            f"The accumulated input is too long ({input_token_length} > {MAX_INPUT_TOKEN_LENGTH}). Clear your chat history and try again."
        )


with gr.Blocks(css="style.css") as demo:
    gr.Markdown(DESCRIPTION)

    with gr.Group():
        chatbot1 = gr.Chatbot(label="Chatbot")
        with gr.Row():
            textbox1 = gr.Textbox(
                container=False,
                show_label=False,
                placeholder="输入雅思口语part1的主题",
                scale=10,
            )
            # submit_button = gr.Button("Submit", variant="primary", scale=1, min_width=0)
            button1 = gr.Button("出题", variant="primary", scale=1, min_width=0)

        with gr.Row():
            retry_button1 = gr.Button("🔄  Retry", variant="secondary")
            undo_button1 = gr.Button("↩️ Undo", variant="secondary")
            clear_button1 = gr.Button("🗑️  Clear", variant="secondary")

        gr.Examples(
            examples=[
                "Provide candidates with IELTS Speaking Part1 task\nPart1 task is to ask five questions around a topic\nthe topic is usually general questions and a range of familiar topics such as home, family, work, studies and interests\nThe five questions are progressive and interrelated\nAs it is an oral test, the questions will be simple\nGenerate an IELTS Speaking Part1 task on the topic of Emotional Intelligence",
                "Provide candidates with IELTS Speaking Part1 task\nPart1 task is to ask five questions around a topic\nthe topic is usually general questions and a range of familiar topics such as home, family, work, studies and interests\nThe five questions are progressive and interrelated\nAs it is an oral test, the questions will be simple\nGenerate an IELTS Speaking Part1 task on the topic of Weather and Climate"
            ],
            inputs=[textbox1,"topic"],
            outputs=[textbox1, chatbot1],
            fn=process_example1,
            cache_examples=True,
        )
    
    with gr.Group():
        chatbot2 = gr.Chatbot(label="Chatbot1")
        with gr.Row():
            textbox2a = gr.Textbox(
                container=False,
                show_label=False,
                placeholder="输入雅思口语part1的主题",
                scale=5,
            )
            textbox2b = gr.Textbox(
                container=False,
                show_label=False,
                placeholder="输入主题对应的问题",
                scale=5,
            )
            # submit_button = gr.Button("Submit", variant="primary", scale=1, min_width=0)
            # button1 = gr.Button("出题", variant="primary", scale=1, min_width=0)
            button2 = gr.Button("对话", variant="primary", scale=1, min_width=0)

        with gr.Row():
            retry_button2 = gr.Button("🔄  Retry", variant="secondary")
            undo_button2 = gr.Button("↩️ Undo", variant="secondary")
            clear_button2 = gr.Button("🗑️  Clear", variant="secondary")

        gr.Examples(
            examples=[
                "Scene: You are in an IELTS Speaking Part1 examination session, where you are tasked with asking questions related to the topic of headphones. You must ask one question at a time to simulate the examination experience.\nRole: You are Echo, a 27-year-old Chinese IELTS examiner. You are patient, highly educated, erudite, knowledgeable, and friendly. Your main task is to ask the test takers questions.\n\nGuidelines:\nSelf-introduction: Briefly introduce yourself to the test taker.\nMain Task: Ask one question at a time, focusing on the topic of study.\nSubtasks:\n1. Keep your introduction and any additional statements concise.\n2. Focus on asking questions rather than expressing opinions (e.g., only one additional sentence plus the question).\n3. Ensure the questions are in line with the following:\n、Do you use headphones?\n、When do you use headphones?\n、What type of headphones do you use?\n、In what occasions will you not use headphones?\n\nNote: Your responses should remain professional and aligned with the role of an IELTS examiner",
                "Scene: You are in an IELTS Speaking Part1 examination session, where you are tasked with asking questions related to the topic of color. You must ask one question at a time to simulate the examination experience.\nRole: You are Echo, a 27-year-old Chinese IELTS examiner. You are patient, highly educated, erudite, knowledgeable, and friendly. Your main task is to ask the test takers questions.\n\nGuidelines:\nSelf-introduction: Briefly introduce yourself to the test taker.\nMain Task: Ask one question at a time, focusing on the topic of study.\nSubtasks:\n1. Keep your introduction and any additional statements concise.\n2. Focus on asking questions rather than expressing opinions (e.g., only one additional sentence plus the question).\n3. Ensure the questions are in line with the following:\nWhat\u2019s your favorite colour and why?\nWhat colours are the walls of the rooms in your home?\nWhat colours are the walls of the rooms in your home?\nDo you prefer dark colours or bright colours?\n\nNote: Your responses should remain professional and aligned with the role of an IELTS examiner"
            ],
            inputs=textbox,
            outputs=[textbox, chatbot],
            fn=process_example1,
            cache_examples=True,
        )
              

    with gr.Group():
        chatbot2 = gr.Chatbot(label="Chatbot2")
        with gr.Row():
            textbox3 = gr.Textbox(
                container=False,
                show_label=False,
                placeholder="输入雅思口语part1的主题",
                scale=4,
            )
            textbox4 = gr.Textbox(
                container=False,
                show_label=False,
                placeholder="输入主题对应的问题",
                scale=4,
            )
            textbox5 = gr.Textbox(
                container=False,
                show_label=False,
                placeholder="输入你的完整回复",
                scale=4,
            )
            # submit_button = gr.Button("Submit", variant="primary", scale=1, min_width=0)
            # button1 = gr.Button("出题", variant="primary", scale=1, min_width=0)
            button3 = gr.Button("评估", variant="primary", scale=1, min_width=0)

        with gr.Row():
            retry_button2 = gr.Button("🔄  Retry", variant="secondary")
            undo_button2 = gr.Button("↩️ Undo", variant="secondary")
            clear_button2 = gr.Button("🗑️  Clear", variant="secondary")

        gr.Examples(
            examples=[
                "You are an IELTS speaking scorer, and your role is to evaluate and score a test taker's responses in IELTS Speaking PART 1. Your assessment will focus on the test taker's ability to answer all questions, stay on topic, and provide rich and extended responses.\n\nPart1 Task Focus: \nFocus on the test taker's ability to communicate opinions and information on the given topic, ensuring that they answer each question and stay on topic.\n\nTopic: \nRain\n\nQuestions:\nDo you like rainy days?\nDoes it rain much in your city?\nWould you like to live in a place that is dry or wet?\n\nResponses from the test taker:\nI definitely love rainy days. There\u2019s just something special about it. I especially enjoy taking a nap while it\u2019s raining outside. I love the  feeling of being wrapped up in a soft blanket while drifting off . It feels so warm and cozy. And after the nap, I always open the window and take deep breaths , as I enjoy the unique smell after the rain. It\u2019s like a combination of rain, earth, and plants , super fragrant and fresh\nWhere I\u2019m from  , in the north part of China, we experience a  fair amount of rainfall throughout the year. But the rainy season usually in the summer, from June to August, occasionally we get heavy downpours and thunderstorms . In winter time, we tend to get  snow more than rain.\nAs a person who loves spending time outdoors/is very outdoorsy  , I would definitely prefer to live in a place that is dry. I find it  easier to make outdoor plans when I know the weather is going to be clear and sunny . For example, I love hiking and camping  , and it's much more enjoyable to do those activities when it's not rainy or muddy rain? That sounds nasty\n\nEvaluation Criteria and Feedback:\nCompleteness of Answers: Assess whether the test taker has answered all the questions and provide feedback on any missed or incomplete answers.\nRelevance: Evaluate whether the test taker has stayed on topic, without digressing, and provide specific examples if any deviation is observed.\nRichness of Responses: Assess the depth and richness of the answers and provide feedback on how to enhance the content.\nLexical Resource: Assess the variety, adequacy, and appropriateness of words used. Quote specific phrases from the responses and provide detailed examples to enhance vocabulary and expression.\nGrammatical Range and Accuracy: Evaluate the complexity and correctness of spoken sentences. Reference specific sentences from the responses and offer concrete examples for improving grammar and sentence structures.\n\nScoring Guidelines:\n9:Expert user: The test taker has fully operational command of the language. Their use of English is appropriate, accurate, and fluent, and shows complete understanding.\n8:Very good user: The test taker has fully operational command of the language with only occasional unsystematic inaccuracies and inappropriate usage. They may misunderstand some things in unfamiliar situations. They handle complex and detailed argumentation well.\n7:Good user: The test taker has operational command of the language, though with occasional inaccuracies, inappropriate usage, and misunderstandings in some situations. They generally handle complex language well and understand detailed reasoning.\n6:Competent user: The test taker has an effective command of the language despite some inaccuracies, inappropriate usage, and misunderstandings. They can use and understand fairly complex language, particularly in familiar situations.\n5:Modest user: The test taker has a partial command of the language and copes with overall meaning in most situations, although they are likely to make many mistakes. They should be able to handle basic communication in their own field.\n4:Limited user: The test taker's basic competence is limited to familiar situations. They frequently show problems in understanding and expression. They are not able to use complex language.\n3:Extremely limited user: The test taker conveys and understands only general meaning in very familiar situations. There are frequent breakdowns in communication.\n2:Intermittent user: The test taker has great difficulty understanding spoken and written English.\n1:Non-user: The test taker has no ability to use the language except a few isolated words.\n0:Did not attempt the test: The test taker did not answer the questions.\n\nYour Task: \nYou have been provided with the test taker's complete responses. Based on the above criteria, conduct a thorough assessment and provide specific feedback and suggestions to improve their speaking ability. Evaluate completeness, relevance, and richness of responses. In the last row score according to the guidelines and explain the reasons for the scoring. Do not ask questions or initiate a conversation; your role is strictly to evaluate.\n",

            ],
            inputs=textbox,
            outputs=[textbox, chatbot],
            fn=process_example1,
            cache_examples=True,
        )

    with gr.Group():
        chatbot3 = gr.Chatbot(label="Chatbot3")
        with gr.Row():
            textbox6 = gr.Textbox(
                container=False,
                show_label=False,
                placeholder="输入雅思口语part1的主题",
                scale=3,
            )
            textbox7 = gr.Textbox(
                container=False,
                show_label=False,
                placeholder="输入主题对应的问题",
                scale=3,
            )
            textbox8 = gr.Textbox(
                container=False,
                show_label=False,
                placeholder="输入你的完整回复",
                scale=3,
            )
            textbox9 = gr.Textbox(
                container=False,
                show_label=False,
                placeholder="输入上一步给出的完整评估",
                scale=3,
            )
            # submit_button = gr.Button("Submit", variant="primary", scale=1, min_width=0)
            # button1 = gr.Button("出题", variant="primary", scale=1, min_width=0)
            button4 = gr.Button("范文", variant="primary", scale=1, min_width=0)

        with gr.Row():
            retry_button = gr.Button("🔄  Retry", variant="secondary")
            undo_button = gr.Button("↩️ Undo", variant="secondary")
            clear_button = gr.Button("🗑️  Clear", variant="secondary")

        gr.Examples(
            examples=[
                "Rewrite the candidate's response into a sample text with an IELTS Speaking score of 8, based on the topic, the questions, the responses from the test taker and the examiner's assessment.\n\nTopic: \nHandwriting\n\nQuestions:\n\u3001Do you prefer to write letters by hand or by computer?\n\u3001Do you think computers might one day replace handwriting?\n\u3001How can children today improve or practice their handwriting?\n\nResponses from the test taker:\nI, of course, prefer to write letters by email on the computer. In recent years I think my handwriting has gone downhill to be honest. I can't write as nicely as I used to because I barely get any practice apart from perhaps making lecture notes or shopping lists or scrawling down my ideas on paper. So, if I have to write a letter then I can write faster, clearer and easier on a computer. Computers are way more convenient for writing letters.\nI think they already basically have, at least in most communications today \u2013 from study, to work, to messages, in almost every sphere of life, I think we type on phones and computers and rarely actually write anything by hand. So, yeah, I think it has already happened that computers have replaced handwriting, almost entirely.\nChildren usually learn to write Chinese characters in school. Still today this is learned initially by hand, so that the children can learn to recognize Chinese \u2013 and one of the best ways to imprint the characters in the memory, is through writing. So, we have quite a strict education in terms of learning to write, from a young age. I think this is the main practice that kids get with handwriting today. They have to write a lot in school by hand still, at least in their early years.\n\nexaminer's assessment:\nCompleteness of Answers: The test taker has answered all the questions completely. They have provided a detailed response to each question, explaining their preferences, routines, and future plans.\n\nRelevance: The test taker has stayed on topic throughout their responses. They have focused on the topic of getting up early and have not deviated from it. They have also related their answers to their personal experiences, which makes their responses more engaging and relevant.\n\nRichness of Responses: The test taker has provided rich and extended responses. They have given detailed descriptions of their morning routine, their favorite morning of the week, and their desire to change their routine in the future. They could enhance the richness of their responses by providing more specific examples or anecdotes.\n\nLexical Resource: The test taker has used a variety of words and phrases, such as \"peel myself out of bed\", \"blend my daily smoothies\", and \"lie-in\". However, they could improve their vocabulary by using more precise and descriptive words. For example, instead of saying \"I get a bit tired\", they could say \"I feel fatigued\" or \"I experience lethargy\".\n\nGrammatical Range and Accuracy: The test taker has demonstrated a good command of English grammar. Their sentences are generally well-structured and accurate. However, there are a few minor errors, such as the use of \"lie-in\" instead of \"sleep in\". They could improve their grammar by reviewing common English idioms and expressions.\n\nScore: 7 - Good user. The test taker has operational command of the language, though with occasional inaccuracies, inappropriate usage, and misunderstandings in some situations. They generally handle complex language well and understand detailed reasoning. They could improve their score by expanding their vocabulary, providing more specific examples in their responses, and reviewing common English idioms and expressions.\n\nRewrite the IELTS Speaking responses into a version that would receive a score of 8. Exclude any additional notes or comments."
            ],
            inputs=textbox,
            outputs=[textbox, chatbot],
            fn=process_example1,
            cache_examples=True,
        )
        
    # with gr.Row():
    #     retry_button = gr.Button("🔄  Retry", variant="secondary")
    #     undo_button = gr.Button("↩️ Undo", variant="secondary")
    #     clear_button = gr.Button("🗑️  Clear", variant="secondary")
    # with gr.Row():
    #     iface = gr.Interface(fn=process_file, inputs=gr.inputs.File(), outputs="text")

    saved_input = gr.State()

    with gr.Accordion(label="Advanced options", open=False):
        system_prompt = gr.Textbox(
            label="System prompt", value=DEFAULT_SYSTEM_PROMPT, lines=6
        )
        max_new_tokens = gr.Slider(
            label="Max new tokens",
            minimum=1,
            maximum=MAX_MAX_NEW_TOKENS,
            step=1,
            value=DEFAULT_MAX_NEW_TOKENS,
        )
        temperature = gr.Slider(
            label="Temperature",
            minimum=0.1,
            maximum=4.0,
            step=0.1,
            value=1.0,
        )
        top_p = gr.Slider(
            label="Top-p (nucleus sampling)",
            minimum=0.05,
            maximum=1.0,
            step=0.05,
            value=0.95,
        )
        top_k = gr.Slider(
            label="Top-k",
            minimum=1,
            maximum=1000,
            step=1,
            value=50,
        )

    # gr.Examples(
    #     examples=[
    #         "Provide candidates with IELTS Speaking Part1 task\nPart1 task is to ask five questions around a topic\nthe topic is usually general questions and a range of familiar topics such as home, family, work, studies and interests\nThe five questions are progressive and interrelated\nAs it is an oral test, the questions will be simple\nGenerate an IELTS Speaking Part1 task on the topic of Emotional Intelligence",
    #         "Scene: You are in an IELTS Speaking Part1 examination session, where you are tasked with asking questions related to the topic of headphones. You must ask one question at a time to simulate the examination experience.\nRole: You are Echo, a 27-year-old Chinese IELTS examiner. You are patient, highly educated, erudite, knowledgeable, and friendly. Your main task is to ask the test takers questions.\n\nGuidelines:\nSelf-introduction: Briefly introduce yourself to the test taker.\nMain Task: Ask one question at a time, focusing on the topic of study.\nSubtasks:\n1. Keep your introduction and any additional statements concise.\n2. Focus on asking questions rather than expressing opinions (e.g., only one additional sentence plus the question).\n3. Ensure the questions are in line with the following:\n、Do you use headphones?\n、When do you use headphones?\n、What type of headphones do you use?\n、In what occasions will you not use headphones?\n\nNote: Your responses should remain professional and aligned with the role of an IELTS examiner",
    #         "You are an IELTS speaking scorer, and your role is to evaluate and score a test taker's responses in IELTS Speaking PART 1. Your assessment will focus on the test taker's ability to answer all questions, stay on topic, and provide rich and extended responses.\n\nPart1 Task Focus: \nFocus on the test taker's ability to communicate opinions and information on the given topic, ensuring that they answer each question and stay on topic.\n\nTopic: \nRain\n\nQuestions:\nDo you like rainy days?\nDoes it rain much in your city?\nWould you like to live in a place that is dry or wet?\n\nResponses from the test taker:\nI definitely love rainy days. There\u2019s just something special about it. I especially enjoy taking a nap while it\u2019s raining outside. I love the  feeling of being wrapped up in a soft blanket while drifting off . It feels so warm and cozy. And after the nap, I always open the window and take deep breaths , as I enjoy the unique smell after the rain. It\u2019s like a combination of rain, earth, and plants , super fragrant and fresh\nWhere I\u2019m from  , in the north part of China, we experience a  fair amount of rainfall throughout the year. But the rainy season usually in the summer, from June to August, occasionally we get heavy downpours and thunderstorms . In winter time, we tend to get  snow more than rain.\nAs a person who loves spending time outdoors/is very outdoorsy  , I would definitely prefer to live in a place that is dry. I find it  easier to make outdoor plans when I know the weather is going to be clear and sunny . For example, I love hiking and camping  , and it's much more enjoyable to do those activities when it's not rainy or muddy rain? That sounds nasty\n\nEvaluation Criteria and Feedback:\nCompleteness of Answers: Assess whether the test taker has answered all the questions and provide feedback on any missed or incomplete answers.\nRelevance: Evaluate whether the test taker has stayed on topic, without digressing, and provide specific examples if any deviation is observed.\nRichness of Responses: Assess the depth and richness of the answers and provide feedback on how to enhance the content.\nLexical Resource: Assess the variety, adequacy, and appropriateness of words used. Quote specific phrases from the responses and provide detailed examples to enhance vocabulary and expression.\nGrammatical Range and Accuracy: Evaluate the complexity and correctness of spoken sentences. Reference specific sentences from the responses and offer concrete examples for improving grammar and sentence structures.\n\nScoring Guidelines:\n9:Expert user: The test taker has fully operational command of the language. Their use of English is appropriate, accurate, and fluent, and shows complete understanding.\n8:Very good user: The test taker has fully operational command of the language with only occasional unsystematic inaccuracies and inappropriate usage. They may misunderstand some things in unfamiliar situations. They handle complex and detailed argumentation well.\n7:Good user: The test taker has operational command of the language, though with occasional inaccuracies, inappropriate usage, and misunderstandings in some situations. They generally handle complex language well and understand detailed reasoning.\n6:Competent user: The test taker has an effective command of the language despite some inaccuracies, inappropriate usage, and misunderstandings. They can use and understand fairly complex language, particularly in familiar situations.\n5:Modest user: The test taker has a partial command of the language and copes with overall meaning in most situations, although they are likely to make many mistakes. They should be able to handle basic communication in their own field.\n4:Limited user: The test taker's basic competence is limited to familiar situations. They frequently show problems in understanding and expression. They are not able to use complex language.\n3:Extremely limited user: The test taker conveys and understands only general meaning in very familiar situations. There are frequent breakdowns in communication.\n2:Intermittent user: The test taker has great difficulty understanding spoken and written English.\n1:Non-user: The test taker has no ability to use the language except a few isolated words.\n0:Did not attempt the test: The test taker did not answer the questions.\n\nYour Task: \nYou have been provided with the test taker's complete responses. Based on the above criteria, conduct a thorough assessment and provide specific feedback and suggestions to improve their speaking ability. Evaluate completeness, relevance, and richness of responses. In the last row score according to the guidelines and explain the reasons for the scoring. Do not ask questions or initiate a conversation; your role is strictly to evaluate.\n",
    #         "Rewrite the candidate's response into a sample text with an IELTS Speaking score of 8, based on the topic, the questions, the responses from the test taker and the examiner's assessment.\n\nTopic: \nHandwriting\n\nQuestions:\n\u3001Do you prefer to write letters by hand or by computer?\n\u3001Do you think computers might one day replace handwriting?\n\u3001How can children today improve or practice their handwriting?\n\nResponses from the test taker:\nI, of course, prefer to write letters by email on the computer. In recent years I think my handwriting has gone downhill to be honest. I can't write as nicely as I used to because I barely get any practice apart from perhaps making lecture notes or shopping lists or scrawling down my ideas on paper. So, if I have to write a letter then I can write faster, clearer and easier on a computer. Computers are way more convenient for writing letters.\nI think they already basically have, at least in most communications today \u2013 from study, to work, to messages, in almost every sphere of life, I think we type on phones and computers and rarely actually write anything by hand. So, yeah, I think it has already happened that computers have replaced handwriting, almost entirely.\nChildren usually learn to write Chinese characters in school. Still today this is learned initially by hand, so that the children can learn to recognize Chinese \u2013 and one of the best ways to imprint the characters in the memory, is through writing. So, we have quite a strict education in terms of learning to write, from a young age. I think this is the main practice that kids get with handwriting today. They have to write a lot in school by hand still, at least in their early years.\n\nexaminer's assessment:\nCompleteness of Answers: The test taker has answered all the questions completely. They have provided a detailed response to each question, explaining their preferences, routines, and future plans.\n\nRelevance: The test taker has stayed on topic throughout their responses. They have focused on the topic of getting up early and have not deviated from it. They have also related their answers to their personal experiences, which makes their responses more engaging and relevant.\n\nRichness of Responses: The test taker has provided rich and extended responses. They have given detailed descriptions of their morning routine, their favorite morning of the week, and their desire to change their routine in the future. They could enhance the richness of their responses by providing more specific examples or anecdotes.\n\nLexical Resource: The test taker has used a variety of words and phrases, such as \"peel myself out of bed\", \"blend my daily smoothies\", and \"lie-in\". However, they could improve their vocabulary by using more precise and descriptive words. For example, instead of saying \"I get a bit tired\", they could say \"I feel fatigued\" or \"I experience lethargy\".\n\nGrammatical Range and Accuracy: The test taker has demonstrated a good command of English grammar. Their sentences are generally well-structured and accurate. However, there are a few minor errors, such as the use of \"lie-in\" instead of \"sleep in\". They could improve their grammar by reviewing common English idioms and expressions.\n\nScore: 7 - Good user. The test taker has operational command of the language, though with occasional inaccuracies, inappropriate usage, and misunderstandings in some situations. They generally handle complex language well and understand detailed reasoning. They could improve their score by expanding their vocabulary, providing more specific examples in their responses, and reviewing common English idioms and expressions.\n\nRewrite the IELTS Speaking responses into a version that would receive a score of 8. Exclude any additional notes or comments."
    #     ],
    #     inputs=textbox,
    #     outputs=[textbox, chatbot],
    #     fn=process_example,
    #     cache_examples=True,
    # )
    # gr.Examples(
    #     examples=[
    #         "Provide candidates with IELTS Speaking Part1 task\nPart1 task is to ask five questions around a topic\nthe topic is usually general questions and a range of familiar topics such as home, family, work, studies and interests\nThe five questions are progressive and interrelated\nAs it is an oral test, the questions will be simple\nGenerate an IELTS Speaking Part1 task on the topic of Emotional Intelligence",
    #     ],
    #     inputs=textbox,
    #     outputs=[textbox, chatbot],
    #     fn=process_example1,
    #     cache_examples=True,
    # )

    # gr.Examples(
    #     examples=[
    #         "Scene: You are in an IELTS Speaking Part1 examination session, where you are tasked with asking questions related to the topic of headphones. You must ask one question at a time to simulate the examination experience.\nRole: You are Echo, a 27-year-old Chinese IELTS examiner. You are patient, highly educated, erudite, knowledgeable, and friendly. Your main task is to ask the test takers questions.\n\nGuidelines:\nSelf-introduction: Briefly introduce yourself to the test taker.\nMain Task: Ask one question at a time, focusing on the topic of study.\nSubtasks:\n1. Keep your introduction and any additional statements concise.\n2. Focus on asking questions rather than expressing opinions (e.g., only one additional sentence plus the question).\n3. Ensure the questions are in line with the following:\n、Do you use headphones?\n、When do you use headphones?\n、What type of headphones do you use?\n、In what occasions will you not use headphones?\n\nNote: Your responses should remain professional and aligned with the role of an IELTS examiner",
    #     ],
    #     inputs=textbox,
    #     outputs=[textbox, chatbot],
    #     fn=process_example2,
    #     cache_examples=True,
    # )

    # gr.Examples(
    #     examples=[
    #         "You are an IELTS speaking scorer, and your role is to evaluate and score a test taker's responses in IELTS Speaking PART 1. Your assessment will focus on the test taker's ability to answer all questions, stay on topic, and provide rich and extended responses.\n\nPart1 Task Focus: \nFocus on the test taker's ability to communicate opinions and information on the given topic, ensuring that they answer each question and stay on topic.\n\nTopic: \nRain\n\nQuestions:\nDo you like rainy days?\nDoes it rain much in your city?\nWould you like to live in a place that is dry or wet?\n\nResponses from the test taker:\nI definitely love rainy days. There\u2019s just something special about it. I especially enjoy taking a nap while it\u2019s raining outside. I love the  feeling of being wrapped up in a soft blanket while drifting off . It feels so warm and cozy. And after the nap, I always open the window and take deep breaths , as I enjoy the unique smell after the rain. It\u2019s like a combination of rain, earth, and plants , super fragrant and fresh\nWhere I\u2019m from  , in the north part of China, we experience a  fair amount of rainfall throughout the year. But the rainy season usually in the summer, from June to August, occasionally we get heavy downpours and thunderstorms . In winter time, we tend to get  snow more than rain.\nAs a person who loves spending time outdoors/is very outdoorsy  , I would definitely prefer to live in a place that is dry. I find it  easier to make outdoor plans when I know the weather is going to be clear and sunny . For example, I love hiking and camping  , and it's much more enjoyable to do those activities when it's not rainy or muddy rain? That sounds nasty\n\nEvaluation Criteria and Feedback:\nCompleteness of Answers: Assess whether the test taker has answered all the questions and provide feedback on any missed or incomplete answers.\nRelevance: Evaluate whether the test taker has stayed on topic, without digressing, and provide specific examples if any deviation is observed.\nRichness of Responses: Assess the depth and richness of the answers and provide feedback on how to enhance the content.\nLexical Resource: Assess the variety, adequacy, and appropriateness of words used. Quote specific phrases from the responses and provide detailed examples to enhance vocabulary and expression.\nGrammatical Range and Accuracy: Evaluate the complexity and correctness of spoken sentences. Reference specific sentences from the responses and offer concrete examples for improving grammar and sentence structures.\n\nScoring Guidelines:\n9:Expert user: The test taker has fully operational command of the language. Their use of English is appropriate, accurate, and fluent, and shows complete understanding.\n8:Very good user: The test taker has fully operational command of the language with only occasional unsystematic inaccuracies and inappropriate usage. They may misunderstand some things in unfamiliar situations. They handle complex and detailed argumentation well.\n7:Good user: The test taker has operational command of the language, though with occasional inaccuracies, inappropriate usage, and misunderstandings in some situations. They generally handle complex language well and understand detailed reasoning.\n6:Competent user: The test taker has an effective command of the language despite some inaccuracies, inappropriate usage, and misunderstandings. They can use and understand fairly complex language, particularly in familiar situations.\n5:Modest user: The test taker has a partial command of the language and copes with overall meaning in most situations, although they are likely to make many mistakes. They should be able to handle basic communication in their own field.\n4:Limited user: The test taker's basic competence is limited to familiar situations. They frequently show problems in understanding and expression. They are not able to use complex language.\n3:Extremely limited user: The test taker conveys and understands only general meaning in very familiar situations. There are frequent breakdowns in communication.\n2:Intermittent user: The test taker has great difficulty understanding spoken and written English.\n1:Non-user: The test taker has no ability to use the language except a few isolated words.\n0:Did not attempt the test: The test taker did not answer the questions.\n\nYour Task: \nYou have been provided with the test taker's complete responses. Based on the above criteria, conduct a thorough assessment and provide specific feedback and suggestions to improve their speaking ability. Evaluate completeness, relevance, and richness of responses. In the last row score according to the guidelines and explain the reasons for the scoring. Do not ask questions or initiate a conversation; your role is strictly to evaluate.\n",
    #     ],
    #     inputs=textbox,
    #     outputs=[textbox, chatbot],
    #     fn=process_example3,
    #     cache_examples=True,
    # )

    # gr.Examples(
    #     examples=[
    #         "Rewrite the candidate's response into a sample text with an IELTS Speaking score of 8, based on the topic, the questions, the responses from the test taker and the examiner's assessment.\n\nTopic: \nHandwriting\n\nQuestions:\n\u3001Do you prefer to write letters by hand or by computer?\n\u3001Do you think computers might one day replace handwriting?\n\u3001How can children today improve or practice their handwriting?\n\nResponses from the test taker:\nI, of course, prefer to write letters by email on the computer. In recent years I think my handwriting has gone downhill to be honest. I can't write as nicely as I used to because I barely get any practice apart from perhaps making lecture notes or shopping lists or scrawling down my ideas on paper. So, if I have to write a letter then I can write faster, clearer and easier on a computer. Computers are way more convenient for writing letters.\nI think they already basically have, at least in most communications today \u2013 from study, to work, to messages, in almost every sphere of life, I think we type on phones and computers and rarely actually write anything by hand. So, yeah, I think it has already happened that computers have replaced handwriting, almost entirely.\nChildren usually learn to write Chinese characters in school. Still today this is learned initially by hand, so that the children can learn to recognize Chinese \u2013 and one of the best ways to imprint the characters in the memory, is through writing. So, we have quite a strict education in terms of learning to write, from a young age. I think this is the main practice that kids get with handwriting today. They have to write a lot in school by hand still, at least in their early years.\n\nexaminer's assessment:\nCompleteness of Answers: The test taker has answered all the questions completely. They have provided a detailed response to each question, explaining their preferences, routines, and future plans.\n\nRelevance: The test taker has stayed on topic throughout their responses. They have focused on the topic of getting up early and have not deviated from it. They have also related their answers to their personal experiences, which makes their responses more engaging and relevant.\n\nRichness of Responses: The test taker has provided rich and extended responses. They have given detailed descriptions of their morning routine, their favorite morning of the week, and their desire to change their routine in the future. They could enhance the richness of their responses by providing more specific examples or anecdotes.\n\nLexical Resource: The test taker has used a variety of words and phrases, such as \"peel myself out of bed\", \"blend my daily smoothies\", and \"lie-in\". However, they could improve their vocabulary by using more precise and descriptive words. For example, instead of saying \"I get a bit tired\", they could say \"I feel fatigued\" or \"I experience lethargy\".\n\nGrammatical Range and Accuracy: The test taker has demonstrated a good command of English grammar. Their sentences are generally well-structured and accurate. However, there are a few minor errors, such as the use of \"lie-in\" instead of \"sleep in\". They could improve their grammar by reviewing common English idioms and expressions.\n\nScore: 7 - Good user. The test taker has operational command of the language, though with occasional inaccuracies, inappropriate usage, and misunderstandings in some situations. They generally handle complex language well and understand detailed reasoning. They could improve their score by expanding their vocabulary, providing more specific examples in their responses, and reviewing common English idioms and expressions.\n\nRewrite the IELTS Speaking responses into a version that would receive a score of 8. Exclude any additional notes or comments."
    #     ],
    #     inputs=textbox,
    #     outputs=[textbox, chatbot],
    #     fn=process_example4,
    #     cache_examples=True,
    # )

    textbox.submit(
        fn=clear_and_save_textbox,
        inputs=textbox,
        outputs=[textbox, saved_input],
        api_name=False,
        queue=False,
    ).then(
        fn=display_input,
        inputs=[saved_input, chatbot],
        outputs=chatbot,
        api_name=False,
        queue=False,
    ).then(
        fn=check_input_token_length,
        inputs=[saved_input, chatbot, system_prompt],
        api_name=False,
        queue=False,
    ).success(
        fn=generate,
        inputs=[
            saved_input,
            chatbot,
            system_prompt,
            max_new_tokens,
            temperature,
            top_p,
            top_k,
        ],
        outputs=chatbot,
        api_name=False,
    )

    button_event_preprocess = (
        # submit_button.click(
        #     fn=clear_and_save_textbox,
        #     inputs=textbox,
        #     outputs=[textbox, saved_input],
        #     api_name=False,
        #     queue=False,
        # )
        # .then(
        #     fn=display_input,
        #     inputs=[saved_input, chatbot],
        #     outputs=chatbot,
        #     api_name=False,
        #     queue=False,
        # )
        # .then(
        #     fn=check_input_token_length,
        #     inputs=[saved_input, chatbot, system_prompt],
        #     api_name=False,
        #     queue=False,
        # )
        # .success(
        #     fn=generate,
        #     inputs=[
        #         saved_input,
        #         chatbot,
        #         system_prompt,
        #         max_new_tokens,
        #         temperature,
        #         top_p,
        #         top_k,
        #     ],
        #     outputs=chatbot,
        #     api_name=False,
        # ),
        button1.click(
            fn=clear_and_save_textbox,
            inputs=textbox,
            outputs=[textbox, saved_input],
            api_name=False,
            queue=False,
        )
        .then(
            fn=display_input,
            inputs=[saved_input, chatbot],
            outputs=chatbot,
            api_name=False,
            queue=False,
        )
        .then(
            fn=check_input_token_length,
            inputs=[saved_input, chatbot, system_prompt],
            api_name=False,
            queue=False,
        )
        .success(
            fn=generate,
            inputs=[
                saved_input,
                chatbot,
                system_prompt,
                max_new_tokens,
                temperature,
                top_p,
                top_k,
            ],
            outputs=chatbot,
            api_name=False,
        ),
        button2.click(
            fn=clear_and_save_textbox,
            inputs=textbox,
            outputs=[textbox, saved_input],
            api_name=False,
            queue=False,
        )
        .then(
            fn=display_input,
            inputs=[saved_input, chatbot],
            outputs=chatbot,
            api_name=False,
            queue=False,
        )
        .then(
            fn=check_input_token_length,
            inputs=[saved_input, chatbot, system_prompt],
            api_name=False,
            queue=False,
        )
        .success(
            fn=generate,
            inputs=[
                saved_input,
                chatbot,
                system_prompt,
                max_new_tokens,
                temperature,
                top_p,
                top_k,
            ],
            outputs=chatbot,
            api_name=False,
        ),
        button3.click(
            fn=clear_and_save_textbox,
            inputs=textbox,
            outputs=[textbox, saved_input],
            api_name=False,
            queue=False,
        )
        .then(
            fn=display_input,
            inputs=[saved_input, chatbot],
            outputs=chatbot,
            api_name=False,
            queue=False,
        )
        .then(
            fn=check_input_token_length,
            inputs=[saved_input, chatbot, system_prompt],
            api_name=False,
            queue=False,
        )
        .success(
            fn=generate,
            inputs=[
                saved_input,
                chatbot,
                system_prompt,
                max_new_tokens,
                temperature,
                top_p,
                top_k,
            ],
            outputs=chatbot,
            api_name=False,
        ),
        button4.click(
            fn=clear_and_save_textbox,
            inputs=textbox,
            outputs=[textbox, saved_input],
            api_name=False,
            queue=False,
        )
        .then(
            fn=display_input,
            inputs=[saved_input, chatbot],
            outputs=chatbot,
            api_name=False,
            queue=False,
        )
        .then(
            fn=check_input_token_length,
            inputs=[saved_input, chatbot, system_prompt],
            api_name=False,
            queue=False,
        )
        .success(
            fn=generate,
            inputs=[
                saved_input,
                chatbot,
                system_prompt,
                max_new_tokens,
                temperature,
                top_p,
                top_k,
            ],
            outputs=chatbot,
            api_name=False,
        )
    )

    retry_button.click(
        fn=delete_prev_fn,
        inputs=chatbot,
        outputs=[chatbot, saved_input],
        api_name=False,
        queue=False,
    ).then(
        fn=display_input,
        inputs=[saved_input, chatbot],
        outputs=chatbot,
        api_name=False,
        queue=False,
    ).then(
        fn=generate,
        inputs=[
            saved_input,
            chatbot,
            system_prompt,
            max_new_tokens,
            temperature,
            top_p,
            top_k,
        ],
        outputs=chatbot,
        api_name=False,
    )

    undo_button.click(
        fn=delete_prev_fn,
        inputs=chatbot,
        outputs=[chatbot, saved_input],
        api_name=False,
        queue=False,
    ).then(
        fn=lambda x: x,
        inputs=[saved_input],
        outputs=textbox,
        api_name=False,
        queue=False,
    )

    clear_button.click(
        fn=lambda: ([], ""),
        outputs=[chatbot, saved_input],
        queue=False,
        api_name=False,
    )

demo.queue(max_size=20).launch(
    server_name='0.0.0.0',
    server_port=7861,
    show_api=False,
    share=True,
    inbrowser=False)
