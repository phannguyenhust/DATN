import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';

const NewsScreen = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://newsapi.org/v2/top-headlines', {
          params: {
            country: 'us', // Thay đổi thành quốc gia của bạn nếu cần
            apiKey: 'fbaab164d1f44f429c232b5c8d8d3791' // Thay YOUR_API_KEY bằng key API của bạn
          }
        });
        setNews(response.data.articles);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading news...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={news}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.newsItem}
          onPress={() => alert('Article selected: ' + item.title)}
        >
          {item.urlToImage && (
            <Image source={{ uri: item.urlToImage }} style={styles.newsImage} />
          )}
          <View style={styles.newsContent}>
            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text style={styles.newsDescription}>{item.description}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
    margin: 10,
    borderRadius: 10,
  },
  newsImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  newsDescription: {
    fontSize: 16,
  },
});

export default NewsScreen;