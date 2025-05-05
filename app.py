from flask import Flask, render_template, request, jsonify
import os
import requests
import dotenv

dotenv.load_dotenv()

app = Flask(__name__)

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
CLAUDE_ENDPOINT = "https://api.anthropic.com/v1/messages"

def simplify_text(text, level="5th grade"):
    prompt = f"Please rewrite the following text at a {level} reading level:\n\n{text}"
    response = requests.post(
        CLAUDE_ENDPOINT,
        headers={
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json"
        },
        json={
            "model": "claude-3-opus-20240229",
            "max_tokens": 1024,
            "system": "You simplify complex text into plain language for accessibility.",
            "messages": [{"role": "user", "content": prompt}]
        }
    )
    return response.json()["content"][0]["text"]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process', methods=['POST'])
def process():
    text = request.form.get('inputText')
    level = request.form.get('readingLevel')
    simplified = simplify_text(text, level)
    return jsonify({"simplified": simplified})

if __name__ == '__main__':
    app.run(debug=True)
