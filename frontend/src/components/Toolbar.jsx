import React from "react";
import PropTypes from "prop-types";
import { Stack, Button, Text } from "@chakra-ui/react";
import SyncButton from "./SyncButton";

function Toolbar({ fetchUser, onLogout, user }) {
  return (
    <Stack 
      direction="row" 
      w="100%" 
      p={4} 
      bg="gray.50" 
      borderRadius="md" 
      justify="space-between"
      align="center"
    >
      <Stack direction="row" spacing={4} align="center">
        <Text fontSize="lg" color="gray.800">User: {user.email}</Text>
        <Text fontSize="lg" color="gray.800">
          Last sync: {user.last_sync ? new Date(user.last_sync).toLocaleString() : "Never"}
        </Text>
      </Stack>
      <Stack direction="row" spacing={4} align="center">
        <SyncButton fetchUser={fetchUser} />
        <Button onClick={onLogout} colorScheme="red" variant="outline">
          Logout
        </Button>
      </Stack>
    </Stack>
  );
};

Toolbar.propTypes = {
  fetchUser: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default Toolbar; 