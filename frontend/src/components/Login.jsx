import React, { useState } from "react";
import { Button, useToast } from "@chakra-ui/react";
import { login } from "../services/api";

function Login() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login();
    } catch (error) {
      console.error(error);
      toast({
        title: "Login redirect failed",
        description: error.message || "Something went wrong",
        status: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="submit"
      colorScheme="teal"
      width="100%"
      isLoading={isLoading}
      onClick={handleClick}
    >
      Login
    </Button>
  );
}

export default Login;
