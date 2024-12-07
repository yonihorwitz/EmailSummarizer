import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider, Container, VStack, Stack } from "@chakra-ui/react";

import Header from "./components/Header";
import EmailList from "./components/EmailList";
import Toolbar from "./components/Toolbar";
import AuthCallback from "./components/AuthCallback";
import Login from "./components/Login";
import EmailPieChart from "./components/EmailPieChart";

import { getCurrentUser, getEmails, logout } from "./services/api";

export const AuthContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    const data = await getCurrentUser();
    setUser(data);
    await fetchEmails();
  };

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const data = await getEmails();
      setEmails(data.emails);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch emails");
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setEmails([]);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      <ChakraProvider>
        <BrowserRouter>
          <Container maxW="container.xl" py={5}>
            <Routes>
              <Route path="/auth/callback" element={<AuthCallback refetch={fetchUser} />} />
              <Route
                path="/"
                element={
                  <VStack spacing={8}>
                    <Header />
                    {user ? (
                      <>
                        <Toolbar fetchUser={fetchUser} onLogout={handleLogout} user={user} />
                        <Stack direction="row">
                          <EmailList emails={emails} loading={loading} error={error} />
                          <EmailPieChart emails={emails} />
                        </Stack>
                      </>
                    ) : (
                      <Login />
                    )}
                  </VStack>
                }
              />
            </Routes>
          </Container>
        </BrowserRouter>
      </ChakraProvider>
    </AuthContext.Provider>
  );
}

export default App;
