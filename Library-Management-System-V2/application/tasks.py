from celery import shared_task
import flask_excel as excel
import datetime as d
from jinja2 import Template
from application.model import *
from application.mail_services import *




@shared_task(ignore_result=False)
def create_csv():
    book_issue = Book_Issued.query.all()

    result = []
    for book in book_issue:
        result.append({
            'issued_date': book.issue_date,
            'return_date': book.return_date,
            'user_id': book.user_id,
            'username': book.user_issue.username,
            'ebook_id': book.ebook_id,
            'title': book.ebook_issue.title,
            'authors': book.ebook_issue.authors_name
        })

    csv_output = excel.make_response_from_records(
        result, "csv"
    )
    
    filename = "book_issued.csv"
    with open(filename, 'wb') as f:
        f.write(csv_output.data)

    return filename



@shared_task(ignore_result=True)
def automatic_return_n_reminder():
    issued_books = Book_Issued.query.all()
    with open('./templates/reminder.html', 'r') as file:
        template = Template(file.read())

    for book in issued_books:
        if book.return_date < str(d.date.today()):
            returned = Return_List(
                ebook_id = book.ebook_id,
                user_id = book.user_id,
                issue_date = book.issue_date,
                return_date = str(d.date.today())
            )
            db.session.delete(book)
            db.session.add(returned)

        else:
            date1 = d.datetime.strptime(book.return_date, "%Y-%m-%d")
            date2 = d.datetime.strptime(str(d.date.today()), "%Y-%m-%d")
            difference = date1 - date2
            if difference.days <= 5:
                email_body = template.render(
                    title=book.ebook_issue.title,
                    username=book.user_issue.username,
                    return_date=book.return_date
                )
                send_mail(book.user_issue.email, 'Reminder: Return eBook', email_body)
    
    db.session.commit()

    
    return "eBooks Returned and Reminders Sent Successfully!"



@shared_task(ignore_result=True)
def monthly_report_user():
    users = User.query.filter(User.username!="root").all()
    with open('./templates/monthly_report.html', 'r') as file:
        template = Template(file.read())
    
    for user in users:
        s = "%"+str(d.date.today())[4:8]+"%"
        issued_books = Book_Issued.query.filter_by(user_id=user.id).filter(Book_Issued.issue_date.like(s)).all()
        returned_books = Return_List.query.filter_by(user_id=user.id).filter(Return_List.return_date.like(s)).all()
        purchased_books = Purchase.query.filter_by(user_id=user.id).filter(Purchase.date.like(s)).all()

        email_body = template.render(
            issued_books=issued_books,
            returned_books=returned_books,
            purchased_books=purchased_books
        )

        send_pdf_mail(user.email, 'Library: Monthly Report', email_body, f'monthly_report_{user.username}.pdf')
    
    return "Monthly Report sent to users Successfully!"



@shared_task(ignore_result=True)
def monthly_report_admin():
    with open('./templates/monthly_report.html', 'r') as file:
        template = Template(file.read())
    
    
    s = "%"+str(d.date.today())[4:8]+"%"
    issued_books = Book_Issued.query.filter(Book_Issued.issue_date.like(s)).all()
    returned_books = Return_List.query.filter(Return_List.return_date.like(s)).all()
    purchased_books = Purchase.query.filter(Purchase.date.like(s)).all()

    email_body = template.render(
        issued_books=issued_books,
        returned_books=returned_books,
        purchased_books=purchased_books
    )
    send_mail('admin@email.com', 'Library: Monthly Report', email_body)
    
    return "Monthly Report sent to admin Successfully!"



            




