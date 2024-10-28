import {
  Box,
  Text,
  Tooltip,
  VStack,
  IconButton,
  Flex,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import { SmallCloseIcon, EditIcon } from "@chakra-ui/icons";
import { useState } from "react";

export const Phase = ({
  totalSprints,
  phase,
  index,
  onUpdatePhase,
  handleDeletePhase,
}) => {
  const [isOpen, setOpen] = useState(false);
  const [newPhase, setNewPhase] = useState(phase);

  const calculateWidth = (duration) => `${(duration / totalSprints) * 100}%`;
  const calculateLeft = (start) => `${(start / totalSprints) * 100}%`;

  const bgColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  const onClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPhase((prev) => ({ ...prev, [name]: value }));
  };

  const handleDurationChange = (value) => {
    setNewPhase((prev) => ({ ...prev, duration: value }));
  };

  const handleSave = () => {
    onUpdatePhase(index, newPhase);
    setOpen(false);
  };

  return (
    <Box
      position="relative"
      h="120px"
      bg={bgColor}
      borderRadius="lg"
      overflow="visible"
      boxShadow="lg"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
    >
      <Flex
        position="absolute"
        top="2px"
        left={`calc(${calculateLeft(phase.start)} + ${calculateWidth(
          phase.duration
        )} - 74px)`}
        zIndex="1"
      >
        <IconButton
          colorScheme="blue"
          borderRadius="full"
          aria-label="Edit phase"
          icon={<EditIcon />}
          size="sm"
          mr={2}
          border="1px solid white"
          onClick={() => setOpen(true)}
        />
        <IconButton
          colorScheme="red"
          borderRadius="full"
          aria-label="Delete phase"
          icon={<SmallCloseIcon />}
          size="sm"
          border="1px solid black"
          display={phase.start >= totalSprints ? "none" : "flex"}
          onClick={() => handleDeletePhase(index)}
        />
      </Flex>

      <Tooltip
        label={
          <VStack align="start" spacing={2} p={4}>
            <Text fontWeight="bold" fontSize="lg" maxWidth="100%" isTruncated>
              {phase.title}
            </Text>
            <Text fontSize="sm" maxWidth="100%" isTruncated>
              {phase.description}
            </Text>
          </VStack>
        }
        placement="bottom"
        bg="white"
        color="black"
        borderRadius="md"
        boxShadow="lg"
        hasArrow
      >
        <Box
          position="absolute"
          top="0"
          left={calculateLeft(phase.start)}
          width={calculateWidth(phase.duration)}
          height="100%"
          bg={phase.color}
          p={4}
          color={textColor}
          borderRadius="lg"
          display={phase.start >= totalSprints ? "none" : "flex"}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          transition="all 0.3s"
          _hover={{ filter: "brightness(1.1)" }}
        >
          <Text
            fontWeight="bold"
            fontSize="lg"
            textAlign="center"
            isTruncated
            width="100%"
          >
            {index}. {phase.title}
          </Text>
        </Box>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Fase</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Título"
              name="title"
              value={newPhase.title}
              onChange={handleChange}
              mb={3}
            />
            <Input
              placeholder="Descripción"
              name="description"
              value={newPhase.description}
              onChange={handleChange}
              mb={3}
            />
            <Input
              placeholder="Inicio"
              name="start"
              type="number"
              value={newPhase.start}
              onChange={handleChange}
              mb={3}
            />
            <Slider
              defaultValue={phase.duration}
              min={0.25}
              max={totalSprints}
              step={0.25}
              onChange={handleDurationChange}
              mb={3}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Text mb={3}>Duración: {newPhase.duration} Sprint(s)</Text>
            <Input
              placeholder="Color"
              name="color"
              value={newPhase.color}
              onChange={handleChange}
              mb={3}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
              Guardar Fase
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
