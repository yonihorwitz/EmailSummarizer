import React, { useEffect, useContext, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spinner, Center, useToast } from "@chakra-ui/react";
import { AuthContext } from "../App";
import { validateAuth } from "../services/api";

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { refetch } = useContext(AuthContext);
  const processedRef = useRef(false);

  const handleCallback = async () => {
    if (processedRef.current) return;
    processedRef.current = true;

    try {
      const code = searchParams.get("code");
      if (!code) {
        throw new Error("No authorization code received");
      }
      const resp = await validateAuth(code);
      refetch();

      toast({
        title: "Login successful",
        status: "success",
        duration: 3000,
      });

      navigate("/");
    } catch (error) {
      console.error("Auth callback error:", error);
      toast({
        title: "Authentication failed",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    handleCallback();
  }, []);

  return (
    <Center h="100vh">
      <Spinner size="xl" />
    </Center>
  );
}

export default AuthCallback;
