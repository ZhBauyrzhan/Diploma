from os import path

import matplotlib.pyplot as plt
import numpy as np
import shap
from back.settings import MODEL_DIR
from sklearn.metrics import (
    ConfusionMatrixDisplay,
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    roc_auc_score,
    roc_curve,
    zero_one_loss,
)


def _get_path(title):
    return path.join(MODEL_DIR, title)


def _plot_confusion_matrix(title, f1, conf_mat):
    displ = ConfusionMatrixDisplay(confusion_matrix=conf_mat)
    displ.plot()
    plt.title(f"Confusion Matrix of {title} (F1 Score: {f1:.2f})")
    plt.savefig(
        _get_path("confusion_matrix.pdf"),
        bbox_inches="tight",
        dpi=300,
        transparent=True,
        facecolor="white",
    )


def _convert_for_prediction(arr):
    arr = (arr > 0.5).astype(int)
    return arr


def _confusion_matrix(model, X_test, y_test, title):
    predicted = model.predict(X_test)
    actual = np.array(y_test)
    actual = _convert_for_prediction(actual)
    predicted = _convert_for_prediction(predicted)
    conf_mat = confusion_matrix(actual, predicted)
    f1 = f1_score(actual, predicted)
    _plot_confusion_matrix(title, f1, conf_mat)
    plt.savefig(_get_path(f"{title}-confusion-matrix.png"))


def _roc_graph(model, X_test, y_test, title):
    y_pred = model.predict(X_test)
    fpr, tpr, thresholds = roc_curve(y_test, y_pred)
    auc_score = roc_auc_score(y_test, y_pred)

    plt.figure(figsize=(8, 6))
    plt.plot(
        fpr, tpr, color="darkorange", lw=2, label=f"ROC curve (AUC = {auc_score:.2f})"
    )
    plt.plot([0, 1], [0, 1], color="navy", lw=2, linestyle="--", label="Random Guess")
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel("False Positive Rate (FPR)")
    plt.ylabel("True Positive Rate (TPR)")
    plt.title("ROC Curve of " + title)
    plt.legend(loc="lower right")
    plt.grid(True)
    plt.savefig(_get_path(title) + "-ROC.png")


def _shap_plot(model, X_test):
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X_test)
    shap.summary_plot(shap_values, X_test, show=False)
    plt.savefig(_get_path("shap_summary_plot.png"), bbox_inches="tight")
    plt.close()


def make_classification_report(model, X_test, y_test, title):
    _confusion_matrix(model, X_test, y_test, title)
    _roc_graph(model, X_test, y_test, title)
    _shap_plot(model, X_test)
    try:
        y_pred = model.predict(X_test)
        zol = zero_one_loss(y_test, y_pred)
        accuracy = accuracy_score(y_test, y_pred)
        classification_rep = classification_report(y_test, y_pred, output_dict=True)
        return {
            "Zero One Loss": zol,
            "Accuracy": accuracy,
            "Classification Report": classification_rep,
        }
    except Exception as e:
        print(e)
        return "Could not print some parameters"
