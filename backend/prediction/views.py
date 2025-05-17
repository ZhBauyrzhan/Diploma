from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from utils.model_operations import predict, train_cat_model


@api_view(["POST"])
@permission_classes([AllowAny])
def make_prediction(request):
    try:
        result = predict(request.data)
        print(result)
        return Response(status=HTTP_200_OK, data=result)
    except Exception as e:
        return Response(status=HTTP_400_BAD_REQUEST, data=e)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def retrain_model(request):
    try:
        result = train_cat_model()
        return Response(status=HTTP_200_OK, data={"result": result})
    except Exception as e:
        return Response(status=HTTP_400_BAD_REQUEST, data=e)
