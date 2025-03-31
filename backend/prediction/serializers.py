from rest_framework import serializers
from .models import DriverProfile
import numpy as np

class DriverProfileSerializer(serializers.ModelSerializer):
    
    normilized_order = [
        'CREDIT_SCORE', 
        'VEHICLE_OWNERSHIP', 
        'MARRIED', 
        'CHILDREN', 
        'ANNUAL_MILEAGE', 
        'SPEEDING_VIOLATIONS', 
        'DUIS', 
        'PAST_ACCIDENTS', 
        '65+', 
        '16-25', 
        '26-39', 
        '40-64', 
        'female', 
        'male', 
        'majority', 
        'minority', 
        '0-9y', 
        '10-19y', 
        '20-29y', 
        '30y+', 
        'upper class', 
        'poverty', 
        'working class', 
        'middle class', 
        'high school', 
        'none', 
        'university', 
        'after 2015', 
        'before 2015', 
        'sedan', 
        'sports car'
    ]
    class Meta:
        model = DriverProfile
        fields = '__all__'
        extra_kwargs = {
            'CREDIT_SCORE': {'min_value': 0.0, 'max_value': 1.0},
            'ANNUAL_MILEAGE': {'min_value': 0},
            'SPEEDING_VIOLATIONS': {'min_value': 0},
            'DUIS': {'min_value': 0},
            'PAST_ACCIDENTS': {'min_value': 0}
        }
    
    def _normilize_mileage(self, mileage):
        mu = 11693.459320161983 
        std = 2822.178292665545
        return (mileage - mu) / std

    def to_np_array(self):
        data = self.validated_data
        features = {}
        
        features['CREDIT_SCORE'] = float(data.get('CREDIT_SCORE'))
        for f in ['VEHICLE_OWNERSHIP', 'MARRIED', 'CHILDREN']:
            features[f] = 1 if data.get(f) else 0
        for f in ['16-25', '26-39', '40-64', '65+']:
            features[f] = 1 if f == data.get('AGE') else 0
        features['ANNUAL_MILEAGE'] = self._normilize_mileage(float(data.get('ANNUAL_MILEAGE')))
        for f in ['SPEEDING_VIOLATIONS', 'DUIS', 'PAST_ACCIDENTS']:
            features[f] = data.get(f)
        for f in ['female', 'male']:
            features[f] = 1 if f == data.get('GENDER') else 0
        for f in ['majority', 'minority']:
            features[f] = 1 if f == data.get('RACE') else 0
        for f in ['0-9y', '10-19y', '20-29y', '30y+']:
            features[f] = 1 if f == data.get('DRIVING_EXPERIENCE') else 0
        for f in [ 'high school', 'none', 'university']:
            features[f] = 1 if f == data.get('EDUCATION') else 0
        for f in ['upper class', 'poverty', 'working class', 'middle class']:
            features[f] = 1 if f == data.get('INCOME') else 0
        for f in ['after 2015', 'before 2015']:
            features[f] = 1 if f == data.get('VEHICLE_YEAR') else 0
        for f in ['sedan', 'sports car']:
            features[f] = 1 if f == data.get('VEHICLE_TYPE') else 0
        arr = [features[f] for f in self.normilized_order]
        # print(f'{arr=}')
        arr = np.array([arr], dtype=np.float32)
        # print(f'{arr=}')
        return arr