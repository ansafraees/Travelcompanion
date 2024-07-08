import requests
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet, UserUtteranceReverted


class ActionSearchHotel(Action):

    def name(self):
        return "action_search_hotels"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        location = tracker.get_slot('location')

        # If location is not provided in the user message, use metadata
        if not location:
            metadata = tracker.latest_message.get('metadata', {})
            if 'locations' in metadata:
                latitude = metadata['locations'].get('latitude')
                longitude = metadata['locations'].get('longitude')
                coordinates={latitude,longitude}
                #if latitude and longitude:
                    # Fetch location name using reverse geocoding (optional)
                    #location = self.geocode_location(latitude, longitude)
                #else:
                    #dispatcher.utter_message(response="utter_ask_location_restaurant")
                   # return []
        
        if location:          
            coordinates = self.geocode_location(location)
            print(coordinates)

        if not coordinates:
            dispatcher.utter_message(text="Sorry, I couldn't find the coordinates for the provided location.")
            return []

        latitude,longitude=coordinates
        api_key = 'AIzaSyCp-bjbm99Gd3LzoYzPFKB-bFpP0NjCypU'
        search_url = f'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={latitude},{longitude}&radius=5000&type=lodging&key={api_key}'
        
        response = requests.get(search_url)
        results = response.json().get('results', [])

        if not results:
            dispatcher.utter_message(text="I couldn't find any restaurants nearby.")
            return []

        results.sort(key=lambda x: ((x.get('rating', 0))*(x.get('user_ratings_total', 0)/7)) , reverse=True)

        restaurants = []
        for result in results[:5]:  # Limit to 5 results
            name = result.get('name')
            rating = result.get('rating', 0)
            user_ratings_total= result.get('user_ratings_total', 0)
            vicinity = result.get('vicinity')
            latitude= result.get('geometry', {}).get('location', {}).get('lat')
            latitude= result.get('geometry', {}).get('location', {}).get('lng')
            place_id= result.get('place_id')
            types =result.get('types')
            photo_reference = result.get('photos', [{}])[0].get('photo_reference')
            photo_url = f'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={api_key}' if photo_reference else None
            
            content_info = {
                'name': name,
                'rating': rating,
                'user_ratings_total': user_ratings_total,
                'vicinity': vicinity,
                'photo_url': photo_url,
                'latitude': latitude,
                'longitude': longitude,
                'place_id': place_id,
            }
            restaurants.append(content_info)

        dispatcher.utter_message(json_message={"content": restaurants})
        print(content_info)
        return []
    
    def geocode_location(self, location):
        # Geocode the location (city name) using Google Maps Geocoding API
        api_key = 'AIzaSyCp-bjbm99Gd3LzoYzPFKB-bFpP0NjCypU'
        geocode_url = f'https://maps.googleapis.com/maps/api/geocode/json?address={location}&key={api_key}'

        response = requests.get(geocode_url)
        if response.status_code == 200:
            data = response.json()
            if data['results']:
                latitude = data['results'][0]['geometry']['location']['lat']
                longitude = data['results'][0]['geometry']['location']['lng']
                return latitude, longitude
            else:
                return None
        else:
            return None


class ActionSearchAttraction(Action):

    def name(self):
        return "action_search_attractions"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        location = tracker.get_slot('location')

        # If location is not provided in the user message, use metadata
        if not location:
            metadata = tracker.latest_message.get('metadata', {})
            if 'locations' in metadata:
                latitude = metadata['locations'].get('latitude')
                longitude = metadata['locations'].get('longitude')
                coordinates={latitude,longitude}
                #if latitude and longitude:
                    # Fetch location name using reverse geocoding (optional)
                    #location = self.geocode_location(latitude, longitude)
                #else:
                    #dispatcher.utter_message(response="utter_ask_location_restaurant")
                   # return []
        
        if location:          
            coordinates = self.geocode_location(location)
            print(coordinates)

        if not coordinates:
            dispatcher.utter_message(text="Sorry, I couldn't find the coordinates for the provided location.")
            return []

        latitude,longitude=coordinates
        api_key = 'AIzaSyCp-bjbm99Gd3LzoYzPFKB-bFpP0NjCypU'
        search_url = f'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={latitude},{longitude}&radius=5000&type=tourist_attraction&key={api_key}'
        
        response = requests.get(search_url)
        results = response.json().get('results', [])

        if not results:
            dispatcher.utter_message(text="Sorry, I couldn't find any hotels .")
            return []

        results.sort(key=lambda x: ((x.get('rating', 0))*(x.get('user_ratings_total', 0)/7)) , reverse=True)

        restaurants = []
        for result in results[:5]:  # Limit to 5 results
            name = result.get('name')
            rating = result.get('rating', 0)
            user_ratings_total= result.get('user_ratings_total', 0)
            vicinity = result.get('vicinity')
            latitude= result.get('geometry', {}).get('location', {}).get('lat')
            latitude= result.get('geometry', {}).get('location', {}).get('lng')
            place_id= result.get('place_id')
            types =result.get('types')
            photo_reference = result.get('photos', [{}])[0].get('photo_reference')
            photo_url = f'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={api_key}' if photo_reference else None
            
            content_info = {
                'name': name,
                'rating': rating,
                'user_ratings_total': user_ratings_total,
                'vicinity': vicinity,
                'photo_url': photo_url,
                'latitude': latitude,
                'longitude': longitude,
                'place_id': place_id,
            }
            restaurants.append(content_info)

        dispatcher.utter_message(json_message={"content": restaurants})
        print(content_info)
        return []
    
    def geocode_location(self, location):
        # Geocode the location (city name) using Google Maps Geocoding API
        api_key = 'AIzaSyCp-bjbm99Gd3LzoYzPFKB-bFpP0NjCypU'
        geocode_url = f'https://maps.googleapis.com/maps/api/geocode/json?address={location}&key={api_key}'

        response = requests.get(geocode_url)
        if response.status_code == 200:
            data = response.json()
            if data['results']:
                latitude = data['results'][0]['geometry']['location']['lat']
                longitude = data['results'][0]['geometry']['location']['lng']
                return latitude, longitude
            else:
                return None
        else:
            return None



class ActionSearchRestaurants(Action):

    def name(self):
        return "action_search_restaurants"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        location = tracker.get_slot('location')

        # If location is not provided in the user message, use metadata
        if not location:
            metadata = tracker.latest_message.get('metadata', {})
            if 'locations' in metadata:
                latitude = metadata['locations'].get('latitude')
                longitude = metadata['locations'].get('longitude')
                coordinates={latitude,longitude}
                #if latitude and longitude:
                    # Fetch location name using reverse geocoding (optional)
                    #location = self.geocode_location(latitude, longitude)
                #else:
                    #dispatcher.utter_message(response="utter_ask_location_restaurant")
                   # return []
        
        if location:          
            coordinates = self.geocode_location(location)
            print(coordinates)

        if not coordinates:
            dispatcher.utter_message(text="Sorry, I couldn't find the coordinates for the provided location.")
            return []

        latitude,longitude=coordinates
        api_key = 'AIzaSyCp-bjbm99Gd3LzoYzPFKB-bFpP0NjCypU'
        search_url = f'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={latitude},{longitude}&radius=5000&type=restaurant&key={api_key}'
        
        response = requests.get(search_url)
        results = response.json().get('results', [])

        if not results:
            dispatcher.utter_message(text="I couldn't find any restaurants nearby.")
            return []

        results.sort(key=lambda x: ((x.get('rating', 0))*(x.get('user_ratings_total', 0)/7)) , reverse=True)

        restaurants = []
        for result in results[:5]:  # Limit to 5 results
            name = result.get('name')
            rating = result.get('rating', 0)
            user_ratings_total= result.get('user_ratings_total', 0)
            vicinity = result.get('vicinity')
            latitude= result.get('geometry', {}).get('location', {}).get('lat')
            latitude= result.get('geometry', {}).get('location', {}).get('lng')
            place_id= result.get('place_id')
            types =result.get('types')
            photo_reference = result.get('photos', [{}])[0].get('photo_reference')
            photo_url = f'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={api_key}' if photo_reference else None
            
            content_info = {
                'name': name,
                'rating': rating,
                'user_ratings_total': user_ratings_total,
                'vicinity': vicinity,
                'photo_url': photo_url,
                'latitude': latitude,
                'longitude': longitude,
                'place_id': place_id,
            }
            restaurants.append(content_info)

        dispatcher.utter_message(json_message={"content": restaurants})
        print(content_info)
        return []
    
    def geocode_location(self, location):
        # Geocode the location (city name) using Google Maps Geocoding API
        api_key = 'AIzaSyCp-bjbm99Gd3LzoYzPFKB-bFpP0NjCypU'
        geocode_url = f'https://maps.googleapis.com/maps/api/geocode/json?address={location}&key={api_key}'

        response = requests.get(geocode_url)
        if response.status_code == 200:
            data = response.json()
            if data['results']:
                latitude = data['results'][0]['geometry']['location']['lat']
                longitude = data['results'][0]['geometry']['location']['lng']
                return latitude, longitude
            else:
                return None
        else:
            return None

class ActionDefaultFallback(Action):
    def name(self):
        return "action_default_fallback"

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message(response="utter_default")
        return [UserUtteranceReverted()]

class ActionWeather(Action):

    def name(self) -> Text:
        return "action_weather"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        location = tracker.get_slot('location')

        # If location is not provided in the user message, use metadata
        if not location:
            metadata = tracker.latest_message.get('metadata', {})
            if 'locations' in metadata:
                latitude = metadata['locations'].get('latitude')
                longitude = metadata['locations'].get('longitude')
                if latitude and longitude:
                    # Fetch location name using reverse geocoding (optional)
                    location = self.reverse_geocode(latitude, longitude)
                else:
                    dispatcher.utter_message(response="utter_ask_location_weather")
                    return []

        if not location:
            dispatcher.utter_message(response="utter_ask_location_weather")
            return []

        # API key for OpenWeather
        api_key = "3beaaaef2c2d0678dcd53021e09a25ff"
        
        # URL to fetch weather details
        url = f"http://api.openweathermap.org/data/2.5/weather?q={location}&appid={api_key}&units=metric"

        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            temp = data['main']['temp']
            description = data['weather'][0]['description']
            dispatcher.utter_message(text=f"The temperature in {location} is {temp}°C with {description}.")
        else:
            dispatcher.utter_message(text=f"Sorry, I couldn't fetch the weather for {location}. Please try again.")

        return [SlotSet("location", None)]

    def reverse_geocode(self, latitude, longitude):
        api_key = "pk.090a733971d8aae888e128ec912c4be2"
        url = f"https://us1.locationiq.com/v1/reverse.php?key={api_key}&lat={latitude}&lon={longitude}&format=json"

        try:
            print(f"lat & long: {latitude,longitude}")
            response = requests.get(url)
            data = response.json()
            if 'display_name' in data:
                print(f"city: {data}")
                data=data['address']
                return data['city']
            else:
                return None
        except Exception as e:
            print(f"Error in reverse geocoding: {e}")
            return None

