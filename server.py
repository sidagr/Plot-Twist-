from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

# Initialize the Flask application
app = Flask(__name__)
CORS(app) # allows requests

@app.route('/chat', methods=['POST'])
def chat():
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
        if 'feedback' in response_data:
            return jsonify({'reply': response_data['feedback']})
        else:
            return jsonify({'reply': 'Error: No feedback received'})
    except Exception as e:
        print(f"Error contacting Jupyter server: {str(e)}")
        return jsonify({"error": f"Error contacting Jupyter server: {str(e)}"}), 500

# Run the app
if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
