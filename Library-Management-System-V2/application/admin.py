from flask import request, jsonify, send_file
from flask import current_app as app
from flask_security import auth_required, roles_required
from celery.result import AsyncResult
from application.model import *
from application.tasks import *



@app.route('/download-csv', methods=["GET"])
@auth_required('token')
@roles_required("admin")
def download_csv():
    task = create_csv.delay()
    return jsonify({"task-id": task.id})


@app.route('/get-csv/<task_id>', methods=["GET"])
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        return send_file(filename, as_attachment=True)
    else:
        return jsonify({"message": "Task Pending!"}), 404





