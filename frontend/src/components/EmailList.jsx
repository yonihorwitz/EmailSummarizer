import React from "react";
import PropTypes from "prop-types";
import { Box, VStack, Text, Spinner } from "@chakra-ui/react";

const EmailList = ({ emails, loading, error }) => {

  if (loading) return <Spinner />;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <VStack spacing={4} align="stretch" w="100%">
      {emails.map((email, index) => (
        <Box key={index} p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
          <Box borderBottom="1px" borderColor="gray.200" pb={3}>
            <Text fontSize="lg" fontWeight="bold">{email.subject}</Text>
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Text color="gray.600" fontSize="sm">
                {new Date(email.created_at).toLocaleDateString()}
              </Text>
              <Text color="blue.600" fontSize="sm">
                {email.category}
              </Text>
            </Box>
          </Box>
          <Text mt={3} color="gray.700">
            {email.summary}
          </Text>
        </Box>
      ))}
    </VStack>
  );
};

EmailList.propTypes = {
  emails: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

export default EmailList; 