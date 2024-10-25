import React from "react";
import { Text } from "@chakra-ui/react";

export const SprintLabel = ({ label, totalSprints }) => {
    const calculateWidth = (duration) => `${(duration / totalSprints) * 100}%`;

    return (
      <Text fontWeight="bold" color="gray.600" fontSize="sm"  width={calculateWidth(1)} textAlign={'center'}>
        {label}
      </Text>
    );
  };
