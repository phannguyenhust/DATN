// import React from 'react';
// import { View, Text } from 'react-native';
// import { useNavigation } from '@react-navigation/native'; // Import hook useNavigation
// import Background from '../components/Background';
// import BackButton from '../components/BackButton';
// import { Navigation } from '../types';

// type Props = {
//     navigation: Navigation;
// };

// const DetectScreen = ({ navigation }: Props) => {
//     const nav = useNavigation(); // Sử dụng hook useNavigation

//     return (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//             <BackButton goBack={() => nav.goBack()} />
//             <View >
//                 <Text style = {{color: 'black'}}>Detect Screen</Text>
//             </View>
//         </View>
//     );
// };

// export default DetectScreen;

import React, { useCallback, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import hook useNavigation
import MonitorBackground from '../components/MonitorBackground';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import { Navigation } from '../types';
import BackButton from '../components/BackButton';
import { ScrollView } from 'react-native-gesture-handler';



type Props = {
    navigation: Navigation;
};

function DetectScreen({ navigation }: Props) {
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const nav = useNavigation(); // Sử dụng hook useNavigation


  const openImagePicker = useCallback(() => {
    setPrediction(null);
    setImageSource(null);
    const options = {
      title: 'Select Image',
      selectionLimit: 1,
      mediaType: 'photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchImageLibrary(options as any, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        setImageSource(selectedImage.uri as any);
        sendImage(selectedImage.uri as any);
      }
    });
  }, []);

  const deleteImage = () => {
    setImageSource(null);
    setPrediction(null);
  };

  const sendImage = async (imageUri: string) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: imageUri.split('/').pop(),
      });

      const response = await axios.post('http://3.0.183.86:8000/predict/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 10000, // Set timeout to 10 seconds
      });

      if (response.data && response.data.prediction) {
        setPrediction(response.data.prediction);
      } else {
        Alert.alert('Error', 'Không nhận được phản hồi.');
      }
    } catch (error) {
    let errorMessage = 'An unknown error occurred.';
    if (error.response) {
      errorMessage = `Server responded with status ${error.response.status}: ${error.response.data}`;
    } else if (error.request) {
      if (error.request._hasError) {
        errorMessage = `Network error occurred: ${error.request._response}`;
      } else {
        errorMessage = 'Network request was made but no response received';
      }
    } else {
      errorMessage = `An error occurred: ${error.message}`;
    }

    Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const openCamera = useCallback(() => {
    setImageSource(null);
    setPrediction(null);
    
    const options = {
      title: 'Take Picture',
      mediaType: 'photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchCamera(options as any, (response) => {
      if (response.didCancel) {
        console.log('User cancelled taking picture');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        if (response.assets && response.assets.length > 0) {
          const selectedImage = response.assets[0];
          setImageSource(selectedImage.uri as any);
          sendImage(selectedImage.uri as any);
        }
      }
    });
  }, []);

  const getPredictionText = (prediction: string | null): JSX.Element | null => {
    switch (prediction) {
      case 'Tomato Bacterial spot':
        return (
          <>
            <Text style={styles.contentTitle}>Bệnh đốm vi khuẩn cà chua</Text>
            <Text style={styles.content}>
              <Text style={styles.bold}>Nguyên nhân:</Text> Đây là một loại bệnh gây ra bởi vi khuẩn và thường xuất hiện khi thời tiết ẩm ướt.
              <Text style={styles.bold}>Cách khắc phục:</Text> Sử dụng phân hữu cơ và chế biến cây một cách cẩn thận để ngăn chặn sự lây lan. Bón phân có chứa Nitrogen (N) để thúc đẩy sự phát triển của cây.
            </Text>
          </>
        );
      case 'Tomato Early blight':
        return (
          <>
            <Text style={styles.contentTitle}>Bệnh bạc lá sớm cà chua</Text>
            <Text style={styles.content}>
              <Text style={styles.bold}>Nguyên nhân:</Text> Bệnh này thường được gây ra bởi nấm Alternaria solani và thường phát triển trong điều kiện ẩm ướt, nhiệt độ ấm áp.
              <Text style={styles.bold}>Cách khắc phục:</Text> Loại bỏ lá cây bị nhiễm bệnh và cỏ dại xung quanh vùng trồng. Tránh tưới nước lên lá cây và hạn chế độ ẩm trong không khí bằng cách tránh chậu dưới, cắt tỉa để tăng thông gió. Sử dụng thuốc phòng và phân hóa học phù hợp để ngăn chặn sự lây lan của bệnh.
              <Text style={styles.bold}>Bón phân:</Text> Sử dụng phân hữu cơ hoặc phân hợp chất, giàu Phosphorus (P) và Potassium (K), để cung cấp dưỡng chất cần thiết cho cây và giúp tăng cường hệ miễn dịch.
            </Text>
          </>
        );
      case 'Tomato Late blight':
        return (
          <>
            <Text style={styles.contentTitle}>Bệnh mốc sương cà chua</Text>
            <Text style={styles.content}>
              <Text style={styles.bold}>Nguyên nhân:</Text> Bệnh mốc sương do nấm Phytophthora infestans gây ra và thường phát triển trong điều kiện ẩm ướt và lạnh.
              <Text style={styles.bold}>Cách khắc phục:</Text> Loại bỏ lá cây bị nhiễm bệnh và các phần cây bị nhiễm bệnh, cỏ dại xung quanh vùng trồng. Tránh tưới nước lên lá cây và giữ vùng trồng thoáng đãng. Sử dụng thuốc phòng và phân hóa học phù hợp để ngăn chặn sự lây lan của bệnh.
              <Text style={styles.bold}>Bón phân:</Text> Sử dụng phân hữu cơ hoặc phân hợp chất, giàu Phosphorus (P) và Potassium (K), để cung cấp dưỡng chất cần thiết cho cây và giúp tăng cường hệ miễn dịch.
            </Text>
          </>
        );
      case 'Tomato Leaf Mold':
        return (
          <>
            <Text style={styles.contentTitle}>Bệnh khuôn lá cà chua</Text>
            <Text style={styles.content}>
              <Text style={styles.bold}>Nguyên nhân:</Text> Bệnh khuôn lá cà chua thường do nấm Fulvia fulva  gây ra và phát triển trong môi trường ẩm ướt, ít ánh sáng và thông thoáng kém.
              <Text style={styles.bold}>Cách khắc phục:</Text> Loại bỏ lá cây bị nhiễm bệnh và các phần cây bị nhiễm bệnh, cỏ dại xung quanh vùng trồng. Tránh tưới nước lên lá cây và giữ vùng trồng thoáng đãng. Sử dụng thuốc phòng và phân hóa học phù hợp để ngăn chặn sự lây lan của bệnh.
              <Text style={styles.bold}>Bón phân:</Text> Sử dụng phân hữu cơ hoặc phân hợp chất, giàu Phosphorus (P) và Potassium (K), để cung cấp dưỡng chất cần thiết cho cây và giúp tăng cường hệ miễn dịch.
            </Text>
          </>
        );
      case 'Tomato Septoria leaf spot':
        return (
          <>
            <Text style={styles.contentTitle}>Bệnh vách ngăn cà chua</Text>
            <Text style={styles.content}>
              <Text style={styles.bold}>Nguyên nhân:</Text> Bệnh vách ngăn cà chua thường do nấm Septoria lycopersici gây ra và phát triển trong điều kiện ẩm ướt, độ ẩm cao và thông thoáng kém.
              <Text style={styles.bold}>Cách khắc phục:</Text> Loại bỏ lá cây bị nhiễm bệnh và các phần cây bị nhiễm bệnh, cỏ dại xung quanh vùng trồng. Tránh tưới nước lên lá cây và giữ vùng trồng thoáng đãng. Sử dụng thuốc phòng và phân hóa học phù hợp để ngăn chặn sự lây lan của bệnh.
              <Text style={styles.bold}>Bón phân:</Text> Sử dụng phân hữu cơ hoặc phân hợp chất, giàu Nitrogen (N), Phosphorus (P) và Potassium (K), để cung cấp dưỡng chất cần thiết cho cây và giúp tăng cường hệ miễn dịch.
            </Text>
          </>
        );
      case 'Tomato Spider mites Two spotted spider mite':
        return (
          <>
            <Text style={styles.contentTitle}>Bệnh nhện đốm trên lá cà chua</Text>
            <Text style={styles.content}>
              <Text style={styles.bold}>Nguyên nhân:</Text> Bệnh nhện đốm trên lá cà chua thường do côn trùng Tetranychus urticae gây ra. Côn trùng này là loài sâu bệnh thường sống trên lá cây và gây ra những vết đốm nhỏ trên bề mặt lá.
              <Text style={styles.bold}>Cách khắc phục:</Text> Sử dụng thuốc phun để tiêu diệt côn trùng và ngăn chặn sự lây lan của bệnh. Thực hiện vệ sinh định kỳ để loại bỏ các lá cây đã nhiễm bệnh.
              <Text style={styles.bold}>Bón phân:</Text> Sử dụng phân hữu cơ hoặc phân hợp chất, giàu Nitrogen (N), Phosphorus (P) và Potassium (K), để cung cấp dưỡng chất cần thiết cho cây và giúp tăng cường hệ miễn dịch.
            </Text>
          </>
        );
      case 'Tomato Target Spot':
        return (
          <>
            <Text style={styles.contentTitle}>Bệnh đốm điểm trên lá cà chua</Text>
            <Text style={styles.content}>
              <Text style={styles.bold}>Nguyên nhân:</Text> Bệnh đốm điểm trên lá cà chua thường do nấm Corynespora cassiicola gây ra. Bệnh này thường phát triển trong điều kiện ẩm ướt và nhiệt độ ấm áp.
              <Text style={styles.bold}>Cách khắc phục:</Text> Loại bỏ lá cây bị nhiễm bệnh và cỏ dại xung quanh vùng trồng. Tránh tưới nước lên lá cây và giữ vùng trồng thoáng đãng. Sử dụng thuốc phòng và phân hóa học phù hợp để ngăn chặn sự lây lan của bệnh.
              <Text style={styles.bold}>Bón phân:</Text> Sử dụng phân hữu cơ hoặc phân hợp chất, giàu Nitrogen (N), Phosphorus (P) và Potassium (K), để cung cấp dưỡng chất cần thiết cho cây và giúp tăng cường hệ miễn dịch.
            </Text>
          </>
        );
      case 'Tomato Tomato Yellow Leaf Curl Virus':
        return (
          <>
            <Text style={styles.contentTitle}>Bệnh vàng lá cà chua do virus</Text>
            <Text style={styles.content}>
              <Text style={styles.bold}>Nguyên nhân:</Text> Bệnh vàng lá cà chua do virus thường được truyền qua côn trùng như cánh côn trùng trắng (Bemisia tabaci) và sâu cuốn lá (Thrips). Các triệu chứng bao gồm lá cây biến màu và g curl.
              <Text style={styles.bold}>Cách khắc phục:</Text> Loại bỏ và tiêu diệt côn trùng vận chuyển virus để ngăn chặn sự lây lan của bệnh. Sử dụng thuốc phòng và phân hóa học phù hợp để kiểm soát côn trùng. Đảm bảo vệ sinh trong vườn và phân biệt giữa cây cà chua bị nhiễm bệnh và cây khỏe mạnh.
              <Text style={styles.bold}>Bón phân:</Text> Sử dụng phân hữu cơ hoặc phân hợp chất, giàu Nitrogen (N) và Potassium (K), để cung cấp dưỡng chất cần thiết cho cây và giúp tăng cường hệ miễn dịch.
            </Text>
          </>
        );
      case 'Tomato Tomato mosaic virus':
        return (
          <>
            <Text style={styles.contentTitle}>Bệnh virus khảm trên cà chua</Text>
            <Text style={styles.content}>
              <Text style={styles.bold}>Nguyên nhân:</Text> Bệnh virus khảm trên cà chua thường được truyền qua tiếp xúc giữa cây đã nhiễm bệnh và cây khỏe mạnh, hoặc qua các công cụ trồng cây bị nhiễm bệnh. Triệu chứng bao gồm các vết mốc trắng, mảng màu vàng hoặc xanh lá cây không đều trên lá cây.
              <Text style={styles.bold}>Cách khắc phục:</Text> Loại bỏ và tiêu diệt các cây bị nhiễm bệnh để ngăn chặn sự lây lan của virus. Giữ vườn cây sạch sẽ và tránh tiếp xúc giữa cây đã nhiễm bệnh và cây khỏe mạnh. Sử dụng thuốc phòng và phân hóa học phù hợp để kiểm soát sự lây lan của virus.
              <Text style={styles.bold}>Bón phân:</Text> Sử dụng phân hữu cơ hoặc phân hợp chất, giàu Nitrogen (N) và Phosphorus (P), để cung cấp dưỡng chất cần thiết cho cây và giúp tăng cường hệ miễn dịch.
            </Text>
          </>
        );
              

      case 'Tomato healthy':
        return (
          <>
            <Text style={styles.contentTitle}>Cây khỏe mạnh</Text>
            <Text style={styles.content}>
              <Text style={styles.bold}>Lời khuyên chăm sóc:</Text> Hãy thường xuyên chăm sóc cây để cây có năng suất tốt nhé. Đảm bảo cung cấp đủ ánh sáng và nước cho cây.
              <Text style={styles.bold}>Bón phân:</Text> Sử dụng phân hữu cơ hoặc phân hợp chất, giàu Nitrogen (N), Phosphorus (P), và Potassium (K), để cung cấp dưỡng chất cần thiết cho cây.
            </Text>
          </>
        );
      default:
        return null;
    }
  };
  
  const getColorForPrediction = (prediction) => {
    switch (prediction) {
      case 'Tomato Bacterial spot':
      case 'Tomato Early blight':
      case 'Tomato Late blight':
      case 'Tomato Leaf Mold':
      case 'Tomato Septoria leaf spot':
      case 'Tomato Spider mites Two spotted spider mite':
      case 'Tomato Target Spot':
      case 'Tomato Tomato Yellow Leaf Curl Virus':
        return 'blue'; // Example color
      case 'Tomato Tomato mosaic virus':
        return 'green'; // Example color
      case 'Tomato healthy':
        return 'green'; // Example color
      default:
        return 'black'; // Default color
    }
  };

  return (
    <MonitorBackground>
      <BackButton goBack={() => nav.goBack()} />
      <ScrollView>
        <View style={styles.container}>
      {imageSource == null ? (
        <View>
          <Text style={styles.title}>Nhận diện</Text>
          <TouchableOpacity onPress={openImagePicker}>
            <View style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, marginBottom: 10 }}>
              <Text style={{ color: 'white' }}>Lấy ảnh từ thư viện</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={openCamera}>
            <View style={{ backgroundColor: 'green', padding: 10, borderRadius: 5 }}>
              <Text style={{ color: 'white' }}>Mở máy ảnh</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.viewLoad}>
          <Image source={{ uri: imageSource }} style={styles.image} />
          <TouchableOpacity onPress={deleteImage} style={styles.buttonDelete}>
            <Text style={{ color: 'white', margin: 10 }}>Delete image</Text>
          </TouchableOpacity>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            prediction && (
              <View style={styles.predictionContainer}>
                <Text style={[styles.predictionText, { color: getColorForPrediction(prediction) }]}>
                  {getPredictionText(prediction)}
                </Text>
              </View>
            )
          )}
        </View>
      )}
    </View>
      </ScrollView>
    
    </MonitorBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  viewLoad: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    justifyContent: 'center',
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '80%',
  },
  buttonDelete: {
    marginTop: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  buttonText: {
    fontSize: 15,
    color: '#fff',
  },
  button: {
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    width: 200,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginTop: 20,
  },
  predictionContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 5,
    alignItems: 'center',
  },
  predictionText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'blue', // Màu chữ
    fontStyle: 'italic', // Kiểu chữ chạy
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
    color: 'black', // Màu chữ
    fontStyle: 'italic', // Kiểu chữ chạy
  },
  bold: {
    fontWeight: 'bold',
    fontStyle: 'italic', // Kiểu chữ chạy
  },
});

export default DetectScreen;
