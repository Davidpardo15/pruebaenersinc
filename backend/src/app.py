
from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS

from bson import ObjectId

app= Flask(__name__) 
app.config['MONGO_URI']='mongodb://localhost/pythonreactdb'
mongo= PyMongo(app)

CORS(app)

db= mongo.db.users

@app.route('/users',methods=['POST'])
def createUsers():
    id = db.insert_one({
        'documentType': request.json['documentType'],
        'document': request.json['document'],
        'name': request.json['name'],
        'lastname': request.json['lastname'],
        'hobbie': request.json['hobbie'],
    })
    print(id)
    return str(ObjectId(id))


    
@app.route('/users',methods=['GET'])
def getUsers():
    users = []
    for doc in db.find():
        users.append({
            '_id':str(ObjectId(doc['_id'])),
            "documentType" : doc['documentType'],
            "document" : doc['document'],
            "name" : doc['name'],
            "lastname" : doc['lastname'],
            "hobbie" :doc['hobbie']
        })
    return jsonify(users)
    
@app.route('/user/<id>',methods=['GET'])
def getUser(id):
    user = db.find_one({'_id':ObjectId(id)})
    print(user)
    return jsonify({
        '_id':str(ObjectId(user['_id'])),
        'documentType' : user['documentType'],
        'document' : user['document'],
        'name' : user['name'],
        'lastname' : user['lastname'],
        'hobbie' :user['hobbie']
    })

@app.route('/users/<id>',methods=['DELETE'])
def deleteUser(id):
    db.delete_one({'_id':ObjectId(id)})
    return jsonify({'msg':'usuario eliminado'})

@app.route('/users/<id>',methods=['PUT'])
def updateUser(id):
    db.update_one({'_id':ObjectId(id)},{'$set':{
        'documentType' : request.json['documentType'],
        'document' : request.json['document'],
        'name' : request.json['name'],
        'lastname' : request.json['lastname'],
        'hobbie' :request.json['hobbie']
    }})
    return jsonify({'msg':'informacion actualizada'})

if __name__ == "__main__":
    app.run(debug=True)
