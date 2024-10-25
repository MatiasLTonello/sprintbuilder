import { Box, Text, Tooltip, VStack } from "@chakra-ui/react";
import React from "react";

export const Phase = ({ totalSprints, phase, index}) => {
  const calculateWidth = (duration) => `${(duration / totalSprints) * 100}%`;
  const calculateLeft = (start) => `${(start / totalSprints) * 100}%`;

  return (
      <Box
        position="relative"
        h="100px"
        bg="gray.400"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="md"
      >
        <Tooltip label={
    <VStack align="start" spacing={1} justifyContent={'space-around'} gap={4} p={8}>
      <Text fontWeight="bold" fontSize="lg">{phase.title}</Text>
      <Text fontSize="sm">{phase.description}</Text>
    </VStack>
  } placement="bottom" bg='white' color={'black'} borderRadius={4} boxShadow={'0px 10px 30px rgba(0, 0, 0, 0.5)'}>
        <Box
          position="absolute"
          top="0"
          left={calculateLeft(phase.start)}
          width={calculateWidth(phase.duration)}
          height="100%"
          bg={phase.color}
          p={4}
          color="white"
          borderRadius="lg"
        >
          <VStack>
          <Text fontWeight="bold" fontSize="lg" mb={2} textAlign={'center'}>
            {index} {phase.title}
          </Text> 
          </VStack>
        
        </Box>
        </Tooltip>
      </Box>
  );
}