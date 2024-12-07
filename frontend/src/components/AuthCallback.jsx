import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spinner, Center, useToast } from "@chakra-ui/react";
import { validateAuth } from "../services/api";
function AuthCallback({ refetch }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const processedRef = useRef(false);

  const handleCallback = async () => {
    if (processedRef.current) return;
    processedRef.current = true;

    try {
      const code = searchParams.get("code");
      if (!code) {
        throw new Error("No authorization code received");
      }
      await validateAuth(code);
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
};

AuthCallback.propTypes = {
  refetch: PropTypes.func.isRequired,
};

export default AuthCallback;
