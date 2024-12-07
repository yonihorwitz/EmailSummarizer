import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider, Container, VStack } from "@chakra-ui/react";
import useAxios from "axios-hooks";

import Header from "./components/Header";
import EmailList from "./components/EmailList";
import SyncButton from "./components/SyncButton";
import AuthCallback from "./components/AuthCallback";
import Login from "./components/Login";
import EmailPieChart from "./components/EmailPieChart";

import { getEmails } from "./services/api";

export const AuthContext = createContext(null);

function App() {
  const [{ data: user }, refetch] = useAxios("/api/current_user");
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const data = await getEmails();
      setEmails(data.emails);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch emails");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <AuthContext.Provider value={{ user, refetch }}>
      <ChakraProvider>
        <BrowserRouter>
          <Container maxW="container.xl" py={5}>
            <Routes>
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route
                path="/"
                element={
                  <VStack spacing={8}>
                    <Header />
                    {user ? (
                      <>
                        <SyncButton fetchEmails={fetchEmails} />
                        <EmailPieChart emails={emails} />
                        <EmailList emails={emails} loading={loading} error={error} />
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
