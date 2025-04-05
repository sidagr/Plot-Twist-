from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize the Flask application
app = Flask(__name__)
CORS(app) # allows requests

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    print(user_message)
    bot_response = "This is a bot response"  # Your bot logic goes here
    return jsonify({'reply': bot_response})

# Run the app
if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
