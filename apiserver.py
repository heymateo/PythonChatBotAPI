from flask import Flask, request, jsonify
import openai

app = Flask(__name__)

openai.api_key = ''

@app.route('/chat', methods=['POST'])
def chat():
    # Obtén el mensaje del usuario desde la solicitud POST
    user_message = request.json['message']

    # Envía el mensaje del usuario a la API de OpenAI para completado de chat
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=user_message,
        max_tokens=100
    )

    chatbot_reply = response.choices[0].text.strip()

    return jsonify({'reply': chatbot_reply})

if __name__ == '__main__':
    app.run(debug=True)
