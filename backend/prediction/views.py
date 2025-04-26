import keras
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST

from .serializers import DriverProfileSerializer

model = keras.models.load_model("prediction/ml_model.keras")
model.compile()


@api_view(["POST"])
def make_prediction(request):
    try:
        print(request.data)
        serializer = DriverProfileSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        data = serializer.to_np_array()
        print(data)
        result = model.predict(data)[0][0]
        result = 1 if result >= 0.5 else 0
        return Response(status=HTTP_200_OK, data={"prediction": result})
    except Exception as e:
        return Response(status=HTTP_400_BAD_REQUEST, data=e)
