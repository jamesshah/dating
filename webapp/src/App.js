import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import NotFoundScreen from "./screens/NotFoundScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SignUpScreen from "./screens/SignUpScreen";
import UserScreen from "./screens/UserScreen";
import MatchesScreen from "./screens/MatchesScreen";
import NotificationScreen from "./screens/NotificationScreen";
import ChatScreen from "./screens/ChatScreen";

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomeScreen />} exact />
          <Route path="/chat" element={<ChatScreen />} exact />
          <Route path="/matches" element={<MatchesScreen />} exact />
          <Route path="/login" element={<LoginScreen />} exact />
          <Route path="/signup" element={<SignUpScreen />} exact />
          <Route path="/profile" element={<ProfileScreen />} exact />
          <Route path="/notifications" element={<NotificationScreen />} exact />
          <Route path="/user/:username" element={<UserScreen />} />
          <Route path="/*" element={<NotFoundScreen />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
  //  <div className="App">Hello World</div>;
}

export default App;
