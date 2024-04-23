from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import spacy

app = Flask(__name__)
CORS(app)

# Cargar el modelo lingüístico de spaCy
nlp = spacy.load("es_core_news_sm")

@app.route('/openai', methods=['POST', 'OPTIONS'])
def openai():
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        return response

    try:
        data = request.json
        
        # Procesar el contenido del usuario con spaCy
        user_content = data.get("content")
        doc = nlp(user_content)
        
        # Obtener el texto procesado por spaCy
        processed_content = " ".join([token.lemma_ for token in doc])
        
        requestData = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": "Eres un asistente especializado en temas de Python únicamente."},
                {"role": "user", "content": processed_content}
            ],
            "temperature": 0.7
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer "  
        }

        response = requests.post("https://api.openai.com/v1/chat/completions", json=requestData, headers=headers)
        
        if response.status_code == 200:
            responseData = response.json()
            return jsonify(responseData), 200
        else:
            return jsonify({"error": "Error en la solicitud al API de OpenAI"}), response.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8800)
