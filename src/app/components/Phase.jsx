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
  Grid,
  Divider,
} from "@chakra-ui/react";
import { EditIcon, CloseIcon } from "@chakra-ui/icons";
import { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import React from "react";

const roundToNearestQuarter = (value) => {
  return Math.round(value * 4) / 4;
};

export const Phase = ({
  totalSprints,
  phase,
  index,
  onUpdatePhase,
  handleDeletePhase,
}) => {
  const [isOpen, setOpen] = useState(false);
  const [newPhase, setNewPhase] = useState(phase);
  const containerRef = useRef(null);

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
    onUpdatePhase(index, newPhase);
    setOpen(false);
  };

  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, []);

  return (
    <Grid
      ref={containerRef}
      className="sprint-container"
      position="relative"
      width="100%"
      height="120px"
      bg="gray.100"
      borderRadius="md"
      overflow="visible"
      boxShadow="md"
      border="1px solid rgba(0, 0, 0, 0.1)"
      templateColumns={`repeat(${totalSprints}, 1fr)`}
    >
      {Array.from({ length: totalSprints }).map(
        (_, index) =>
          index < totalSprints && (
            <Divider
              key={index}
              orientation="vertical"
              borderColor="gray.300"
            />
          )
      )}

      <Rnd
        size={{
          width: `${(phase.duration / totalSprints) * 100}%`,
          height: "100%",
        }}
        position={{
          x: (phase.start / totalSprints) * containerWidth,
          y: 0,
        }}
        style={{ borderRadius: "0.375rem" }}
        onDragStop={(e, d) => {
          let newStart = (d.x / d.node.parentNode.clientWidth) * totalSprints;

          newStart = roundToNearestQuarter(newStart);

          const validStart = Math.max(
            0,
            Math.min(newStart, totalSprints - newPhase.duration)
          );

          setNewPhase((prev) => ({ ...prev, start: validStart }));
          onUpdatePhase(index, { ...newPhase, start: validStart });
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
          onUpdatePhase(index, { ...newPhase, duration: validDuration });
        }}
        bounds="parent"
      >
        <Box
          position="absolute"
          top="2px"
          right="2px"
          display="flex"
          zIndex={1}
        >
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
            onClick={() => handleDeletePhase(index)}
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
            <Text fontWeight="bold">{`${index + 1}. ${phase.title}`}</Text>
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
    </Grid>
  );
};
