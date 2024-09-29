from flask import Flask
from flask_security import Security
import flask_excel as excel
from config import DevelopmentConfig
from celery.schedules import crontab

from application.model import *
from application.api import api
from application.worker import celery_init_app
from application.tasks import *





def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    excel.init_excel(app)
    app.security = Security(app, datastore)
    cache.init_app(app)
    with app.app_context():
        import application.login
        import application.admin
        import application.user
        import application.adminuser

    return app



# create app
app  = create_app()
celery_app = celery_init_app(app)


@celery_app.on_after_configure.connect
def backend_jobs(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=0, minute=13),
        automatic_return_n_reminder.s(),
    )
    sender.add_periodic_task(
        # crontab(hour=0, minute=1, day_of_month=1),
        crontab(hour=0, minute=13),
        monthly_report_user.s(),
    )
    sender.add_periodic_task(
        # crontab(hour=0, minute=1, day_of_month=1),
        crontab(hour=0, minute=13),
        monthly_report_admin.s(),
    )


if __name__ == '__main__':
    app.run(debug=True)
    
