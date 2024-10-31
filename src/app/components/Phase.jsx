import { useState } from "react";
import {
  Box,
  Text,
  Tooltip,
  IconButton,
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
import { EditIcon, CloseIcon } from "@chakra-ui/icons";
import { Rnd } from "react-rnd";

const roundToNearestQuarter = (value) => {
  return Math.round(value * 4) / 4;
};

export const Phase = ({
  totalSprints,
  phase,
  onUpdatePhase,
  handleDeletePhase,
  containerWidth,
  rowHeight = 100, // Altura de cada fila
  totalRows, // Número total de filas
}) => {
  const [isOpen, setOpen] = useState(false);
  const [newPhase, setNewPhase] = useState(phase);

  const onClose = () => setOpen(false);
  const handleChange = (e) => {
    let { name, value } = e.target;

    value = roundToNearestQuarter(parseFloat(value) || 0);

    value = Math.max(0.25, Math.min(value, totalSprints));

    setNewPhase((prev) => ({ ...prev, [name]: value }));
  };

  const handleDurationChange = (value) => {
    const roundedValue = roundToNearestQuarter(value);
    setNewPhase((prev) => ({ ...prev, duration: roundedValue }));
  };

  const handleSave = () => {
    onUpdatePhase(newPhase);
    setOpen(false);
  };

  return (
    <Rnd
      enableResizing={{
        bottom: false,
        bottomLeft: false,
        bottomRight: false,
        top: false,
        topLeft: false,
        topRight: false,
      }}
      size={{
        width: `${(phase.duration / totalSprints) * 100}%`,
        height: "100%",
      }}
      position={{
        x: (phase.start / totalSprints) * containerWidth,
        y: (newPhase.row - 1) * (rowHeight + 16),
      }}
      style={{
        borderRadius: "0.375rem",
        display: phase.start >= totalSprints && "none",
      }}
      onDragStop={(e, d) => {
        console.log("Valor de d.y:", d.y);
        console.log("rowHeight:", rowHeight);
        console.log(totalRows);
        const newRow = Math.min(
          totalRows,
          Math.max(1, Math.round(d.y / rowHeight) + 1)
        );

        console.log("newRow:", newRow);

        let newStart = (d.x / d.node.parentNode.clientWidth) * totalSprints;
        newStart = roundToNearestQuarter(newStart);
        const validStart = Math.max(
          0,
          Math.min(newStart, totalSprints - newPhase.duration)
        );
        console.log(newRow);
        if (newPhase.row !== newRow) {
          setNewPhase((prev) => ({ ...prev, start: validStart, row: newRow }));
          onUpdatePhase({ ...newPhase, start: validStart, row: newRow });
        } else {
          setNewPhase((prev) => ({ ...prev, start: validStart }));
          onUpdatePhase({ ...newPhase, start: validStart });
        }
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        let newDuration =
          (ref.offsetWidth / ref.parentNode.clientWidth) * totalSprints;

        newDuration = roundToNearestQuarter(newDuration);

        const validDuration = Math.max(
          0.25,
          Math.min(newDuration, totalSprints - newPhase.start)
        );

        setNewPhase((prev) => ({ ...prev, duration: validDuration }));
        onUpdatePhase({ ...newPhase, duration: validDuration });
      }}
    >
      <Box position="absolute" top="2px" right="2px" display="flex" zIndex={1}>
        <IconButton
          icon={<EditIcon />}
          size="sm"
          colorScheme="blue"
          onClick={() => setOpen(true)}
          mr={2}
        />
        <IconButton
          icon={<CloseIcon />}
          size="sm"
          colorScheme="red"
          onClick={() => handleDeletePhase(phase.id)}
        />
      </Box>

      <Tooltip
        label={
          <Box>
            <Text fontWeight="bold">{phase.title}</Text>
            <Text>{phase.description}</Text>
          </Box>
        }
        placement="top"
        hasArrow
      >
        <Box
          position="absolute"
          top={0}
          height="100%"
          bg={phase.color}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="md"
          transition="all 0.2s"
          width={"100%"}
          _hover={{ filter: "brightness(1.1)" }}
        >
          <Text fontWeight="bold">{phase.title}</Text>
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
              value={newPhase.duration}
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
            <Text>{`Duración: ${newPhase.duration} Sprint(s)`}</Text>
            <Input
              placeholder="Color"
              name="color"
              value={newPhase.color}
              onChange={handleChange}
              mt={3}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSave} mr={3}>
              Guardar Fase
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Rnd>
  );
};
