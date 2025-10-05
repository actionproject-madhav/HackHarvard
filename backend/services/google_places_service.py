"""
Google Places API Service
Find nearby hospitals, clinics, and medical facilities
"""

import requests
from config import Config

class GooglePlacesService:
    """Service for finding nearby medical facilities using Google Places API"""
    
    BASE_URL = "https://maps.googleapis.com/maps/api/place"
    
    @staticmethod
    def find_nearby_hospitals(latitude, longitude, radius=5000, keyword="hospital"):
        """
        Find nearby hospitals using Google Places API
        
        Args:
            latitude: User's latitude
            longitude: User's longitude
            radius: Search radius in meters (default 5km)
            keyword: Search keyword (hospital, clinic, emergency room, etc.)
        
        Returns:
            List of nearby medical facilities with details
        """
        try:
            # Nearby Search API
            url = f"{GooglePlacesService.BASE_URL}/nearbysearch/json"
            
            params = {
                'location': f"{latitude},{longitude}",
                'radius': radius,
                'type': 'hospital',
                'keyword': keyword,
                'key': Config.GOOGLE_MAPS_API_KEY
            }
            
            response = requests.get(url, params=params)
            data = response.json()
            
            if data.get('status') != 'OK':
                print(f"Google Places API error: {data.get('status')}")
                return []
            
            facilities = []
            for place in data.get('results', [])[:10]:  # Limit to top 10
                facility = {
                    'place_id': place.get('place_id'),
                    'name': place.get('name'),
                    'address': place.get('vicinity'),
                    'location': {
                        'lat': place.get('geometry', {}).get('location', {}).get('lat'),
                        'lng': place.get('geometry', {}).get('location', {}).get('lng')
                    },
                    'rating': place.get('rating'),
                    'user_ratings_total': place.get('user_ratings_total'),
                    'open_now': place.get('opening_hours', {}).get('open_now'),
                    'types': place.get('types', []),
                    'distance': None  # Will be calculated
                }
                
                # Calculate distance
                facility['distance'] = GooglePlacesService._calculate_distance(
                    latitude, longitude,
                    facility['location']['lat'], facility['location']['lng']
                )
                
                facilities.append(facility)
            
            # Sort by distance
            facilities.sort(key=lambda x: x.get('distance', float('inf')))
            
            return facilities
            
        except Exception as e:
            print(f"Error fetching nearby hospitals: {str(e)}")
            return []
    
    @staticmethod
    def get_place_details(place_id):
        """
        Get detailed information about a specific place
        
        Args:
            place_id: Google Place ID
        
        Returns:
            Detailed place information
        """
        try:
            url = f"{GooglePlacesService.BASE_URL}/details/json"
            
            params = {
                'place_id': place_id,
                'fields': 'name,formatted_address,formatted_phone_number,opening_hours,website,rating,reviews',
                'key': Config.GOOGLE_MAPS_API_KEY
            }
            
            response = requests.get(url, params=params)
            data = response.json()
            
            if data.get('status') == 'OK':
                return data.get('result', {})
            
            return {}
            
        except Exception as e:
            print(f"Error fetching place details: {str(e)}")
            return {}
    
    @staticmethod
    def _calculate_distance(lat1, lon1, lat2, lon2):
        """Calculate distance between two coordinates in kilometers"""
        import math
        
        if not all([lat1, lon1, lat2, lon2]):
            return float('inf')
        
        R = 6371  # Earth's radius in km
        
        lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        
        return round(R * c, 2)  # Distance in km, rounded to 2 decimals
    
    @staticmethod
    def find_specialized_facilities(latitude, longitude, specialization, radius=10000):
        """
        Find medical facilities based on specialization
        
        Args:
            latitude: User's latitude
            longitude: User's longitude
            specialization: Medical specialization (cardiology, neurology, etc.)
            radius: Search radius in meters
        
        Returns:
            List of specialized medical facilities
        """
        keywords_map = {
            'Cardiology': 'cardiology heart center',
            'Neurology': 'neurology brain center',
            'Orthopedics': 'orthopedic bone joint',
            'Pediatrics': 'pediatric children hospital',
            'Emergency': 'emergency room urgent care',
            'General Practice': 'clinic medical center'
        }
        
        keyword = keywords_map.get(specialization, 'medical center')
        
        return GooglePlacesService.find_nearby_hospitals(
            latitude, longitude, radius, keyword
        )
