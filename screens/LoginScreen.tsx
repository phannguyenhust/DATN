// // LoginScreen.tsx
// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, ScrollView } from 'react-native';

// export default function LoginScreen({ navigation }) {
//   const [username, setUsername] = useState('admin'); // Đặt giá trị mặc định cho username
//   const [password, setPassword] = useState('123'); // Đặt giá trị mặc định cho password

//   const handleLogin = () => {
//     // So sánh username và password với "admin" và "123"
//     if (username === 'admin' && password === '123') {
//       // Nếu đăng nhập thành công, chuyển đến màn hình Home
//       navigation.navigate('Home');
//     } else {
//       // Nếu đăng nhập không thành công, hiển thị thông báo lỗi
//       alert('Invalid username or password');
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text>Login</Text>
//         <TextInput
//           style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 10, padding: 5 }}
//           placeholder="Username"
//           onChangeText={text => setUsername(text)}
//           value={username}
//         />
//         <TextInput
//           style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 10, padding: 5 }}
//           placeholder="Password"
//           onChangeText={text => setPassword(text)}
//           value={password}
//           secureTextEntry
//         />
//         <Button title="Login" onPress={handleLogin} />
//       </View>
//     </ScrollView>
//   );
// }