import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, useToast } from "@chakra-ui/react";
import { syncEmails } from "../services/api";

const SyncButton = ({ fetchEmails }) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSync = async () => {
    setLoading(true);
    setTimeout(async () => {
      await fetchEmails();
      setLoading(false);
    }, 5000);
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
    <Button colorScheme="blue" onClick={handleSync} isLoading={loading} loadingText="Syncing...">
      Sync Emails
    </Button>
  );
};

SyncButton.propTypes = {
  fetchEmails: PropTypes.func.isRequired,
};

export default SyncButton;
