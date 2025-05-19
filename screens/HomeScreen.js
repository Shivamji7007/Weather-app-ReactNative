import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const API_KEY = '4ca645f9217c482b9c193858251905'; 

export default function HomeScreen({ navigation }) {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchWeather = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=7&aqi=no&alerts=no`
      );
      const data = await response.json();
      if (data && data.location) {
        setWeather(data);
        setForecast(data.forecast.forecastday);
      } else {
        Alert.alert('Error', 'City not found');
        setWeather(null);
        setForecast([]);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
    setLoading(false);
  };

  // Load Lucknow weather on app start
  useEffect(() => {
    fetchWeather('Lucknow');
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <ImageBackground
        source={require('../assets/images/background.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Back Button */}
          {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity> */}

          {/* Search Bar */}
          <View style={styles.searchWrapper}>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
              <TextInput
                placeholder="Search city"
                placeholderTextColor="gray"
                style={styles.input}
                value={city}
                onChangeText={setCity}
                onSubmitEditing={() => fetchWeather(city)}
              />
              <TouchableOpacity onPress={() => fetchWeather(city)}>
                <Ionicons name="arrow-forward" size={20} color="gray" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Weather Info */}
          <View style={styles.content}>
            {loading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : weather ? (
              <>
                <Text style={styles.city}>{weather.location.name}, {weather.location.country}</Text>
                <Text style={styles.temperature}>{weather.current.temp_c}°C</Text>
                <Image
                  source={{ uri: `https:${weather.current.condition.icon}` }}
                  style={styles.currentIcon}
                />
                <Text style={styles.condition}>{weather.current.condition.text}</Text>
                <View style={styles.details}>
                  <Text style={styles.detailText}>Humidity: {weather.current.humidity}%</Text>
                  <Text style={styles.detailText}>Wind: {weather.current.wind_kph} km/h</Text>
                </View>

                {/* 7-Day Forecast */}
                <Text style={styles.forecastTitle}>7-Day Forecast</Text>
                <FlatList
                  data={forecast}
                  horizontal
                  keyExtractor={(item) => item.date}
                  contentContainerStyle={styles.forecastList}
                  renderItem={({ item }) => (
                    <View style={styles.forecastItem}>
                      <Text style={styles.forecastDate}>{item.date}</Text>
                      <Image
                        source={{ uri: `https:${item.day.condition.icon}` }}
                        style={styles.forecastIcon}
                      />
                      <Text style={styles.forecastTemp}>{item.day.avgtemp_c}°C</Text>
                      <Text style={styles.forecastCondition}>{item.day.condition.text}</Text>
                    </View>
                  )}
                />
              </>
            ) : (
              <Text style={styles.welcome}>Search for a city</Text>
            )}
          </View>
        </SafeAreaView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1 },
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', borderColor: 'red', justifyContent: 'space-around'  },
  backBtn: {
    marginLeft: 16,
    marginTop: 10,
  },
  searchWrapper: { marginHorizontal: 16, marginTop: 10 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 16, color: '#000' },
  content: {display: 'flex', justifyContent: 'center', alignItems: 'center' },
  temperature: { fontSize: 64, color: '#fff', fontWeight: 'bold' },
  city: {fontSize: 34, color: '#fff', fontWeight: 'bold', marginBottom: 15, textAlign: 'center'},
  currentIcon: { width: 80, height: 80, marginVertical: 10 },
  condition: { fontSize: 24, color: '#fff', marginBottom: 8 },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 10,
  },
  detailText: { fontSize: 16, color: '#fff' },
  welcome: { color: '#fff', fontSize: 18 },
  forecastTitle: {
    color: '#fff',
    fontSize: 20,
    marginTop: 24,
    marginBottom: 8,
    fontWeight: '600',
  },
  forecastList: { paddingHorizontal: 10 },
  forecastItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    width: 120,
    height :120,
  },
  forecastDate: { color: '#fff', marginBottom: 4 },
  forecastIcon: { width: 40, height: 40 },
  forecastTemp: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  forecastCondition: { color: '#fff', fontSize: 12, textAlign: 'center', marginTop: 4 },
});
