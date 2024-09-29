from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from xhtml2pdf import pisa
from io import BytesIO



SMTP_HOST = "localhost"
SMTP_PORT = 1025
SENDER_EMAIL = 'library@email.com'
SENDER_PASSWORD = 'Admin'



def send_mail(to, subject, content_body):
    message = MIMEMultipart("alternative")  # Use "alternative" to support multiple formats
    message["To"] = to
    message["Subject"] = subject
    message["From"] = SENDER_EMAIL

    message.attach(MIMEText(content_body, 'html'))

    with SMTP(host=SMTP_HOST, port=SMTP_PORT) as client:
        client.send_message(msg=message)
    

def send_pdf_mail(to, subject, content_body, file_name):
    pdf_file = BytesIO()
    pisa_status = pisa.CreatePDF(BytesIO(content_body.encode("UTF-8")), dest=pdf_file)
    if pisa_status.err:
        print(f"Failed to generate PDF for user")
    pdf_file.seek(0)
    pdf_data = pdf_file.read()

    pdf_attachment = MIMEApplication(pdf_data, _subtype="pdf")
    pdf_attachment.add_header(
        'Content-Disposition', 'attachment', filename=file_name
    )

    message = MIMEMultipart("alternative") 
    message["To"] = to
    message["Subject"] = subject
    message["From"] = SENDER_EMAIL

    message.attach(MIMEText(content_body, 'html'))
    message.attach(pdf_attachment)

    with SMTP(host=SMTP_HOST, port=SMTP_PORT) as client:
        client.send_message(msg=message)
    