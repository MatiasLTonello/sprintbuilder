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
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import { Row } from "./components/Row";
import { SprintLabel } from "./components/SprintLabel";
import { useState, useEffect, useRef } from "react";
import { Phase } from "@/app/components/Phase";
import { ChromePicker } from "react-color";
import {
  AddIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";

interface Phase {
  id: number;
  title: string;
  description: string;
  start: number;
  duration: number;
  color: string;
  row: number;
}

export default function Home() {
  const [phases, setPhases] = useState([
    {
      id: 1,
      title: "Discovery",
      description: "Understanding the product.",
      start: 0,
      duration: 1,
      color: "pink.400",
      row: 2,
    },
    {
      id: 2,
      title: "Development",
      description: "Building the product.",
      start: 1,
      duration: 1,
      color: "green.400",
      row: 1,
    },
    {
      id: 3,
      title: "QA",
      description: "Testing the product.",
      start: 2,
      duration: 1,
      color: "red.400",
      row: 2,
    },
    {
      id: 4,
      title: "Client Testing",
      description: "Validating the product.",
      start: 3,
      duration: 1,
      color: "yellow.400",
      row: 4,
    },
  ]);

  const [totalSprints, setTotalSprints] = useState(4);
  const [newPhase, setNewPhase] = useState({
    id: phases.length + 1,
    title: "",
    description: "",
    start: 0,
    duration: 1,
    color: "blue.400",
    row: 1,
  });
  const [containerWidth, setContainerWidth] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isUserView, setIsUserView] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const maxRow = Math.max(...phases.map((phase) => phase.row));
  const [rows, setRows] = useState(maxRow);

  const containerRef = useRef<HTMLDivElement>(null);
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBgColor = useColorModeValue("white", "gray.700");

  const sprintsLabel = Array.from(
    { length: totalSprints },
    (_, i) => `Sprint ${i + 1}`
  );

  const handleAddPhase = () => {
    setPhases([...phases, { ...newPhase, row: rows }]);
    setNewPhase({
      id: phases.length + 2,
      title: "",
      description: "",
      start: 0,
      duration: 1,
      color: "blue.400",
      row: rows + 1,
    });
    onClose();
  };

  const handleUpdatePhase = (updatedPhase: Phase) => {
    setPhases((prevPhases) =>
      prevPhases.map((phase) =>
        phase.id === updatedPhase.id ? { ...phase, ...updatedPhase } : phase
      )
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewPhase((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeletePhase = (id: number) => {
    setPhases((prevPhases) => prevPhases.filter((phase) => phase.id !== id));
  };

  const handleColorChange = (color: { hex: string }) => {
    setNewPhase((prev) => ({ ...prev, color: color.hex }));
  };

  const increaseSprints = () => setTotalSprints(totalSprints + 1);
  const decreaseSprints = () => setTotalSprints(Math.max(1, totalSprints - 1));
  const increaseRows = () => setRows((prev) => prev + 1);
  const decreaseRows = () => setRows((prev) => Math.max(1, prev - 1));

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, []);

  const isFormComplete = ["title", "description"].every(
    (field) => newPhase[field].trim() !== ""
  );
  return (
    <Box p={8} bg={bgColor} minH="100vh">
      <VStack spacing={4} align="stretch" maxW="1200px" mx="auto">
        <IconButton
          css={{ position: "absolute", top: "20px", right: "50px" }}
          colorScheme="blue"
          aria-label="Search database"
          icon={isUserView ? <ViewIcon /> : <ViewOffIcon />}
          onClick={() => setIsUserView(!isUserView)}
        />
        <HStack mb={2}>
          {sprintsLabel.map((label, index) => (
            <SprintLabel
              key={index}
              label={label}
              totalSprints={totalSprints}
            />
          ))}
        </HStack>
        {Array.from({ length: rows }, (_, rowIndex) => (
          <Row
            containerRef={containerRef}
            key={rowIndex}
            totalSprints={totalSprints}
          >
            {phases
              .filter((phase) => phase.row === rowIndex + 1)
              .map((phase) => (
                <Phase
                  totalSprints={totalSprints}
                  handleDeletePhase={handleDeletePhase}
                  phase={phase}
                  key={phase.id}
                  onUpdatePhase={handleUpdatePhase}
                  containerWidth={containerWidth}
                  totalRows={rows}
                  isUserView={isUserView}
                />
              ))}
          </Row>
        ))}

        {!isUserView && (
          <>
            <HStack spacing={4} mt={4} alignItems={"baseline"}>
              <Button colorScheme="teal" onClick={onOpen}>
                <AddIcon mr={2} /> Agregar Fase
              </Button>
              <VStack>
                <Button colorScheme="blue" onClick={increaseSprints}>
                  <ChevronUpIcon mr={2} /> Aumentar Sprints
                </Button>
                <Button colorScheme="red" onClick={decreaseSprints}>
                  <ChevronDownIcon mr={2} /> Disminuir Sprints
                </Button>
              </VStack>
              <VStack>
                <Button colorScheme="blue" onClick={increaseRows}>
                  <ChevronUpIcon mr={2} /> Aumentar Rows
                </Button>
                <Button colorScheme="red" onClick={decreaseRows}>
                  <ChevronDownIcon mr={2} /> Disminuir Rows
                </Button>
              </VStack>
            </HStack>
            <Modal isOpen={isOpen} onClose={onClose} size="sm">
              <ModalOverlay />
              <ModalContent bg={cardBgColor || "#f0f4f8"}>
                <ModalHeader>Agregar Nueva Fase</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Título</FormLabel>
                      <Input
                        required
                        placeholder="Ej: Desarrollo"
                        name="title"
                        value={newPhase.title}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Descripción</FormLabel>
                      <Textarea
                        required
                        placeholder="Breve descripción de la fase"
                        name="description"
                        value={newPhase.description}
                        onChange={handleChange}
                      />
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
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={handleAddPhase}
                    disabled={!isFormComplete}
                  >
                    Agregar Fase
                  </Button>
                  <Button variant="ghost" onClick={onClose}>
                    Cancelar
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
        )}
      </VStack>
    </Box>
  );
}
