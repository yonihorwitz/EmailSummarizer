import React, { useState } from "react";
import { Button, useToast } from "@chakra-ui/react";
import { syncEmails } from "../services/api";

function SyncButton() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSync = async () => {
    setLoading(true);
    try {
      await syncEmails();
      toast({
        title: "Sync initiated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Sync failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Button colorScheme="blue" onClick={handleSync} loading={loading} loadingText="Syncing...">
      Sync Emails
    </Button>
  );
}

export default SyncButton; 