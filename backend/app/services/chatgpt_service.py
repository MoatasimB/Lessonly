from openai import  OpenAI
import json
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)

def generate_lesson_plan(topic: str, grade_level: str, model="gpt-3.5-turbo"):
    """
    Generates a lesson plan for a given topic and grade level in JSON format using ChatGPT.

    Args:
        topic (str): The topic for the lesson plan.
        grade_level (str): The grade level for the lesson plan.
        model (str): The GPT model to use (default is "gpt-4").

    Returns:
        tuple: A tuple containing a success flag (bool) and the structured lesson plan (dict) or error message.
    """
    try:
        # Define the system and user messages
        messages = [
            {"role": "system", "content": "You are an expert lesson planner. Always return the lesson plan in JSON format."},
            {
                "role": "user",
                "content": (
                    f"Create a detailed lesson plan for the topic '{topic}' for grade level '{grade_level}'. "
                    "Include the following fields: grade_level, subject, topic, lesson_objective, materials, "
                    "lesson_duration, lesson_steps (broken into introduction, guided_practice, independent_practice, closure), "
                    "and assessment. Return the response as a Valid JSON object."
                )
            }
        ]

        # Make the API call
        completion = client.chat.completions.create(
            model=model,
            messages=messages
        )

        # Parse the assistant's reply as JSON
        lesson_plan = completion.choices[0].message.content
        structured_lesson_plan = json.loads(lesson_plan)

        print(structured_lesson_plan)

        return True, structured_lesson_plan
    except json.JSONDecodeError:
        return False, "Failed to decode the response into JSON. Please check the prompt or response."
    except Exception as e:
        return False, f"An error occurred: {e}"
