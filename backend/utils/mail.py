import os
from email.mime.image import MIMEImage

from back.settings import MODEL_DIR
from django.core.mail import EmailMultiAlternatives


def send_model_results(accuracy, user_email):
    subject = "Model Training Completed"
    text_content = f"Training finished successfully. Accuracy: {accuracy}"
    html_content = f"""
    <html>
        <body>
            <p>Training finished successfully. Accuracy: {accuracy}</p>
            <img src="cid:img1" alt="Confusion Matrix"/>
            <img src="cid:img2" alt="ROC Curve"/>
            <img src="cid:img3" alt="SHAP Summary"/>
        </body>
    </html>
    """

    email = EmailMultiAlternatives(
        subject,
        text_content,
        None,
        [user_email],
    )
    email.attach_alternative(html_content, "text/html")

    image_files = [
        ("CatBoost-confusion-matrix.png", "img1"),
        ("CatBoost-ROC.png", "img2"),
        ("shap_summary_plot.png", "img3"),
    ]

    for filename, content_id in image_files:
        file_path = os.path.join(MODEL_DIR, filename)

        with open(file_path, "rb") as img_file:
            img_data = img_file.read()

        mime_img = MIMEImage(img_data)
        mime_img.add_header("Content-ID", f"<{content_id}>")
        mime_img.add_header("Content-Disposition", "inline", filename=filename)

        email.attach(mime_img)

    email.send(fail_silently=False)
