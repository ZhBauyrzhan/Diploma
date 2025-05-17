import os
import pickle

import numpy as np
import pandas as pd
from catboost import CatBoostClassifier
from category_encoders import TargetEncoder
from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from sklearn.impute import KNNImputer
from sklearn.model_selection import RandomizedSearchCV, train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.utils import class_weight

from .db import get_driver_collection
from .plotting import make_classification_report


@shared_task
def async_train_and_notify(user_email):
    print("Starting async train and notify")
    try:
        result = train_cat_model()
        accuracy = result["Accuracy"]
        send_mail(
            "Model Training Completed",
            f"Training finished successfully. Accuracy: {accuracy}",
            None,
            [user_email],
            fail_silently=False,
        )
    except Exception as e:
        send_mail(
            "Model Training Failed",
            f"Training failed with error: {str(e)}",
            None,
            [user_email],
            fail_silently=False,
        )
        raise


def predict(data):
    try:
        df = pd.DataFrame([data])
        df = _preprocess_input(df)
        model = CatBoostClassifier()
        model.load_model(os.path.join(settings.MODEL_DIR, "catboostmodel.cbm"))
        prediction = model.predict(df)
        probability = model.predict_proba(df)[:, 1]
        return {
            "prediction": int(prediction[0]),
            "probability": float(probability[0]),
            "status": "success",
        }

    except Exception as e:
        return {"error": str(e), "status": "error"}


def train_cat_model():
    try:
        collection = get_driver_collection()
        data = list(collection.find({}))
        df = _data_preprocessing(pd.DataFrame(data))

        X = df.drop(["ID", "OUTCOME", "CSV_ROW", "_ID", "FILE_NAME"], axis=1)
        print(X.columns)
        df["OUTCOME"] = pd.to_numeric(df["OUTCOME"], errors="coerce")
        y = df["OUTCOME"]
        X = _scale(pd.get_dummies(X))
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=37
        )
        classes = np.unique(y)
        class_weights = class_weight.compute_class_weight(
            "balanced", classes=classes, y=y
        )
        class_weights = dict(enumerate(class_weights))
        best_model = _get_best_model(X_train, y_train, class_weights)
        _save_model(best_model, "catboost")
        return make_classification_report(best_model, X_test, y_test, title="CatBoost")
    except Exception as e:
        print(e)
        return "Could not train CatBoost"


def _save_model(model, name=""):
    model.save_model(os.path.join(settings.MODEL_DIR, name + "model.cbm"))


def _data_preprocessing(df):
    df.columns = df.columns.str.upper()
    df["CREDIT_MISSING"] = df["CREDIT_SCORE"].isnull().astype(int)
    df["MILEAGE_MISSING"] = df["ANNUAL_MILEAGE"].isnull().astype(int)
    imputer = KNNImputer(n_neighbors=5)
    df[["CREDIT_SCORE", "ANNUAL_MILEAGE"]] = imputer.fit_transform(
        df[["CREDIT_SCORE", "ANNUAL_MILEAGE"]]
    )
    with open(os.path.join(settings.MODEL_DIR, "imputer.pkl"), "wb") as f:
        pickle.dump(imputer, f)
    try:
        encoder = TargetEncoder(cols=["POSTAL_CODE"], smoothing=10)
        encoder.fit(df["POSTAL_CODE"], df["OUTCOME"])
        df["POSTAL_CODE_ENCODED"] = encoder.transform(df["POSTAL_CODE"])
        df.drop("POSTAL_CODE", axis=1, inplace=True)
        with open(os.path.join(settings.MODEL_DIR, "target_encoder.pkl"), "wb") as f:
            pickle.dump(encoder, f)
    except Exception as e:
        print(e)
    credit_bins = [
        df["CREDIT_SCORE"].min(),
        df["CREDIT_SCORE"].quantile(0.25),
        df["CREDIT_SCORE"].quantile(0.75),
        df["CREDIT_SCORE"].max(),
    ]

    with open(os.path.join(settings.MODEL_DIR, "credit_bins.pkl"), "wb") as f:
        pickle.dump(credit_bins, f)
    credit_labels = ["Low", "Mid", "Good"]
    df["SPEEDING_VIOLATIONS"] = pd.to_numeric(
        df["SPEEDING_VIOLATIONS"], errors="coerce"
    )
    df["DUIS"] = pd.to_numeric(df["DUIS"], errors="coerce")
    df["PAST_ACCIDENTS"] = pd.to_numeric(df["PAST_ACCIDENTS"], errors="coerce")
    df["CREDIT_TIER"] = pd.cut(
        df["CREDIT_SCORE"], bins=credit_bins, labels=credit_labels, include_lowest=True
    )
    df["RISK_SCORE"] = (
        0.5 * df["SPEEDING_VIOLATIONS"] + 1.0 * df["DUIS"] + 1.2 * df["PAST_ACCIDENTS"]
    )
    return df


def _scale(X):
    sc = StandardScaler()
    X_scaled = sc.fit_transform(X)
    X = pd.DataFrame(X_scaled, columns=X.columns)
    with open(os.path.join(settings.MODEL_DIR, "scaler.pkl"), "wb") as f:
        pickle.dump(sc, f)
    with open(os.path.join(settings.MODEL_DIR, "training_columns.txt"), "w") as f:
        f.write(",".join(X.columns))
    return X


def _get_best_model(X_train, y_train, class_weights):
    param_grid = {
        "max_depth": [4, 6, 8],
        "learning_rate": [0.01, 0.05, 0.1],
        "subsample": [0.8, 1.0],
        "rsm": [0.6, 0.7],
        "l2_leaf_reg": [1, 3],
    }
    cat_model = CatBoostClassifier(
        verbose=1,
        class_weights=class_weights,
        n_estimators=500,
        early_stopping_rounds=50,
        bootstrap_type="Bernoulli",
    )
    grid_search = RandomizedSearchCV(
        estimator=cat_model,
        param_distributions=param_grid,
        n_iter=15,
        cv=3,
        scoring="f1",
        n_jobs=-1,
        verbose=2,
        refit=True,
    )
    grid_search.fit(X_train, y_train)
    return grid_search.best_estimator_


def _preprocess_input(df):
    with open(os.path.join(settings.MODEL_DIR, "imputer.pkl"), "rb") as f:
        imputer = pickle.load(f)
    with open(os.path.join(settings.MODEL_DIR, "scaler.pkl"), "rb") as f:
        scaler = pickle.load(f)
    with open(os.path.join(settings.MODEL_DIR, "credit_bins.pkl"), "rb") as f:
        credit_bins = pickle.load(f)
    with open(os.path.join(settings.MODEL_DIR, "training_columns.txt"), "r") as f:
        training_columns = f.read().strip().split(",")
    df.columns = df.columns.str.upper()
    df["CREDIT_MISSING"] = df["CREDIT_SCORE"].isnull().astype(int)
    df["MILEAGE_MISSING"] = df["ANNUAL_MILEAGE"].isnull().astype(int)
    df[["CREDIT_SCORE", "ANNUAL_MILEAGE"]] = imputer.transform(
        df[["CREDIT_SCORE", "ANNUAL_MILEAGE"]]
    )
    try:
        with open(os.path.join(settings.MODEL_DIR, "target_encoder.pkl"), "rb") as f:
            encoder = pickle.load(f)
        if "POSTAL_CODE" in df.columns:
            df["POSTAL_CODE_ENCODED"] = encoder.transform(df["POSTAL_CODE"])
            df.drop("POSTAL_CODE", axis=1, inplace=True)
    except Exception as e:
        print(e)
    credit_labels = ["Low", "Mid", "Good"]
    df["CREDIT_TIER"] = pd.cut(
        df["CREDIT_SCORE"], bins=credit_bins, labels=credit_labels, include_lowest=True
    )
    numeric_cols = ["SPEEDING_VIOLATIONS", "DUIS", "PAST_ACCIDENTS"]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)
    df["RISK_SCORE"] = (
        0.5 * df["SPEEDING_VIOLATIONS"] + 1.0 * df["DUIS"] + 1.2 * df["PAST_ACCIDENTS"]
    )
    df = pd.get_dummies(df)
    missing_cols = set(training_columns) - set(df.columns)
    for col in missing_cols:
        df[col] = 0
    df = df[training_columns]
    df_scaled = scaler.transform(df)
    return pd.DataFrame(df_scaled, columns=df.columns)
