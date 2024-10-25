'use client'
import { Box, VStack, HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input, useDisclosure, Tooltip } from "@chakra-ui/react";
import { Phase } from "./components/Phase";
import { SprintLabel } from "./components/SprintLabel";
import { useState } from "react";

export default function Home() {
  const [phases, setPhases] = useState([
    { title: "Discovery", description: "Understanding the product.", start: 0, duration: 1, color: "Pink" },
    { title: "Development", description: "Building the product.", start: 1, duration: 1, color: "Green" },
    { title: "QA", description: "Testing the product.", start: 2, duration: 1, color: "Red" },
    { title: "Client Testing", description: "Validating the product.", start: 3, duration: 1, color: "Yellow" },
  ]);
  const [totalSprints, setTotalSprints] = useState(4);
  const [newPhase, setNewPhase] = useState({ title: "", description: "", start: 0, duration: 1, color: "" });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const sprintsLabel = Array.from({ length: totalSprints }, (_, i) => `Sprint ${i + 1}`);

  const handleAddPhase = () => {
    setPhases([...phases, newPhase]);
    setNewPhase({ title: "", description: "", start: 0, duration: 1, color: "" });
    onClose();
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setNewPhase((prev) => ({ ...prev, [name]: value }));
  };

  const increaseSprints = () => setTotalSprints(totalSprints + 1);
  const decreaseSprints = () => setTotalSprints(Math.max(1, totalSprints - 1));

  return (
    <Box p={8} bg="white" minH="100vh">
      <VStack spacing={4} align="stretch" maxW="1200px" mx="auto">
        <HStack mb={2}>
          {sprintsLabel.map((label, index) => (
            <SprintLabel key={index} label={label} totalSprints={totalSprints} />
          ))}
        </HStack>
        {phases.map((phase, index) => (
          <Phase key={index} totalSprints={totalSprints} phase={phase} index={index + 1}/>
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

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Agregar Nueva Fase</ModalHeader>
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
              <Input
                placeholder="Duración"
                name="duration"
                type="number"
                value={newPhase.duration}
                onChange={handleChange}
                mb={3}
              />
              <Input
                placeholder="Color"
                name="color"
                value={newPhase.color}
                onChange={handleChange}
                mb={3}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleAddPhase}>
                Guardar Fase
              </Button>
              <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
}