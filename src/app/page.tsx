"use client";
import {
  Box,
  VStack,
  HStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { Phase } from "./components/Phase";
import { SprintLabel } from "./components/SprintLabel";
import { useState } from "react";
import { ChromePicker } from "react-color";

export default function Home() {
  const [phases, setPhases] = useState([
    {
      title: "Discovery",
      description: "Understanding the product.",
      start: 0,
      duration: 1,
      color: "pink.400",
    },
    {
      title: "Development",
      description: "Building the product.",
      start: 1,
      duration: 1,
      color: "green.400",
    },
    {
      title: "QA",
      description: "Testing the product.",
      start: 2,
      duration: 1,
      color: "red.400",
    },
    {
      title: "Client Testing",
      description: "Validating the product.",
      start: 3,
      duration: 1,
      color: "yellow.400",
    },
  ]);

  const [totalSprints, setTotalSprints] = useState(4);
  const [newPhase, setNewPhase] = useState({
    title: "",
    description: "",
    start: 0,
    duration: 1,
    color: "blue.400",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showColorPicker, setShowColorPicker] = useState(false);

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBgColor = useColorModeValue("white", "gray.700");

  const sprintsLabel = Array.from(
    { length: totalSprints },
    (_, i) => `Sprint ${i + 1}`
  );

  const handleAddPhase = () => {
    setPhases([...phases, newPhase]);
    setNewPhase({
      title: "",
      description: "",
      start: 0,
      duration: Number(1),
      color: "blue.400",
    });
    onClose();
  };

  const handleUpdatePhase = (index, updatedPhase) => {
    const updatedPhases = phases.map((phase, i) =>
      i === index ? { ...phase, ...updatedPhase } : phase
    );
    setPhases(updatedPhases);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPhase((prev) => ({ ...prev, [name]: value }));
  };

  const handleDurationChange = (value) => {
    setNewPhase((prev) => ({ ...prev, duration: parseFloat(value) }));
  };

  const handleDeletePhase = (index) => {
    setPhases((prevPhases) => prevPhases.filter((_, i) => i !== index));
  };

  const handleColorChange = (color) => {
    setNewPhase((prev) => ({ ...prev, color: color.hex }));
  };

  const increaseSprints = () => setTotalSprints(totalSprints + 1);
  const decreaseSprints = () => setTotalSprints(Math.max(1, totalSprints - 1));

  return (
    <Box p={8} bg={bgColor} minH="100vh">
      <VStack spacing={4} align="stretch" maxW="1200px" mx="auto">
        <HStack mb={2}>
          {sprintsLabel.map((label, index) => (
            <SprintLabel
              key={index}
              label={label}
              totalSprints={totalSprints}
            />
          ))}
        </HStack>

        {phases.map((phase, index) => (
          <Phase
            key={index}
            totalSprints={totalSprints}
            phase={phase}
            index={index}
            handleDeletePhase={handleDeletePhase}
            onUpdatePhase={handleUpdatePhase}
          />
        ))}

        <HStack spacing={4} mt={4}>
          <Button colorScheme="teal" onClick={onOpen}>
            Agregar Fase
          </Button>
          <Button colorScheme="blue" onClick={increaseSprints}>
            Aumentar Sprints
          </Button>
          <Button colorScheme="red" onClick={decreaseSprints}>
            Disminuir Sprints
          </Button>
        </HStack>

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent bg={cardBgColor}>
            <ModalHeader>Agregar Nueva Fase</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Título</FormLabel>
                  <Input
                    placeholder="Ej: Desarrollo"
                    name="title"
                    value={newPhase.title}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Descripción</FormLabel>
                  <Textarea
                    placeholder="Breve descripción de la fase"
                    name="description"
                    value={newPhase.description}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Sprint de inicio</FormLabel>
                  <NumberInput
                    min={0}
                    max={totalSprints - 1}
                    value={Number(newPhase.start)}
                    onChange={(value) =>
                      setNewPhase((prev) => ({
                        ...prev,
                        start: parseInt(value),
                      }))
                    }
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Duración (en sprints)</FormLabel>
                  <Slider
                    min={0.25}
                    max={totalSprints}
                    step={0.25}
                    value={Number(newPhase.duration)}
                    onChange={handleDurationChange}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <Tooltip label={newPhase.duration} placement="top" isOpen>
                      <SliderThumb />
                    </Tooltip>
                  </Slider>
                </FormControl>

                <FormControl>
                  <FormLabel>Color</FormLabel>
                  <Button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    bg={newPhase.color}
                    color={newPhase.color === "#FFFFFF" ? "black" : "white"}
                  >
                    {showColorPicker ? "Cerrar" : "Elegir Color"}
                  </Button>
                  {showColorPicker && (
                    <ChromePicker
                      color={newPhase.color}
                      onChangeComplete={handleColorChange}
                    />
                  )}
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleAddPhase}>
                Agregar Fase
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
}
