from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

# Initialize the Flask application
app = Flask(__name__)
CORS(app) # allows requests

dict = None

@app.route('/generate-images', methods=['POST'])
def generate_image_from_scenario():
    try:
        user_message = request.json.get('message')
        IMAGE_URL = 'http://127.0.0.1:5002/jupyter-images'
        jupyter_url = 'http://127.0.0.1:5001/trigger-scenario'
        first_response = requests.post(
            jupyter_url,
            json={"answer": user_message},
            headers={'Content-Type': 'application/json'}
        )
        scenarios = first_response.json().get('scenarios')
        if not scenarios:
            raise ValueError("Jupyter server returned no scenarios.")
        response = requests.post(
            IMAGE_URL,
            json={"contents": scenarios},
            headers={'Content-Type': 'application/json'}
        )
        
        response_data = response.json()
        print("Image Generation Response JSON:", response_data, flush=True)

        if 'results' not in response_data or not response_data['results']:
            raise ValueError("Image microservice returned no results.")

        return jsonify(response_data['results'])

    except Exception as e:
        print(f"Error in image generation: {str(e)}")
        return {
            "image_base64": None,
            "width": None,
            "height": None,
            "aspect_ratio": None,
            "scenario": None,
            "error": str(e)
        }

@app.route('/chat', methods=['POST'])
def chat():
    global dict
    user_message = request.json.get('message')
    print("message is", user_message)
    jupyter_url = 'http://127.0.0.1:5001/trigger-feedback'
    try:
        response = requests.post(
            jupyter_url,
            json={"answer": user_message},
            headers={'Content-Type': 'application/json'}
        )
        response_data = response.json()  # Parse the JSON response first
        if 'feedback' in response_data and 'filled' in response_data:
            print("filled is", response_data['filled'])
            dict = response_data['dict']
            return jsonify({'reply': response_data['feedback'], 'filled': response_data['filled']})
        else:
            return jsonify({'reply': 'Error: No feedback received'})
    except Exception as e:
        print(f"Error contacting Jupyter server: {str(e)}")
        return jsonify({"error": f"Error contacting Jupyter server: {str(e)}"}), 500

# Run the app
if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
