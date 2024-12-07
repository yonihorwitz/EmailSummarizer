import React, { createContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider, Container, VStack } from "@chakra-ui/react";
import useAxios from "axios-hooks";

import Header from "./components/Header";
import EmailList from "./components/EmailList";
import SyncButton from "./components/SyncButton";
import AuthCallback from "./components/AuthCallback";
import Login from "./components/Login";

export const AuthContext = createContext(null);

function App() {
  const [{ data: user }, refetch] = useAxios("/api/current_user");

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
                        <SyncButton />
                        <EmailList />
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
