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
  rowHeight = 120,
  totalRows,
  isUserView,
}) => {
  const [isOpen, setOpen] = useState(false);
  const [tempPhase, setTempPhase] = useState({ ...phase });
  const [newPhase, setNewPhase] = useState(phase);

  const onClose = () => {
    setOpen(false);
    setTempPhase({ ...phase });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempPhase((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdatePhase(tempPhase);
    setOpen(false);
  };

  return (
    <Rnd
      disableDragging={isUserView}
      enableResizing={
        !isUserView
          ? {
              bottom: false,
              bottomLeft: false,
              bottomRight: false,
              top: false,
              topLeft: false,
              topRight: false,
            }
          : false
      }
      size={{
        width: `${(phase.duration / totalSprints) * 100}%`,
        height: "100%",
      }}
      position={{
        x: (phase.start / totalSprints) * containerWidth,
        y: phase.row,
      }}
      style={{
        borderRadius: "0.375rem",
        display: phase.start >= totalSprints && "none",
        zIndex: 9,
      }}
      onDragStop={(e, d) => {
        const actualRow = newPhase.row;
        const newRow = Math.min(
          totalRows,
          Math.max(
            1,
            Math.round((d.y + rowHeight * (actualRow - 1)) / rowHeight) + 1
          )
        );

        let newStart = (d.x / d.node.parentNode.clientWidth) * totalSprints;
        newStart = roundToNearestQuarter(newStart);
        const validStart = Math.max(
          0,
          Math.min(newStart, totalSprints - newPhase.duration)
        );
        if (newPhase.row !== newRow) {
          setNewPhase((prev) => ({ ...prev, start: validStart, row: newRow }));
          onUpdatePhase({ ...newPhase, start: validStart, row: newRow });
        } else {
          setNewPhase((prev) => ({ ...prev, start: validStart }));
          onUpdatePhase({ ...newPhase, start: validStart });
        }
      }}
      onResizeStop={(e, direction, ref) => {
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
      {!isUserView && (
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
            onClick={() => handleDeletePhase(phase.id)}
          />
        </Box>
      )}
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
          <Text fontWeight="bold">{`${phase.id}   ${phase.title}`}</Text>
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
              value={tempPhase.title}
              onChange={handleChange}
              mb={3}
            />
            <Input
              placeholder="Descripción"
              name="description"
              value={tempPhase.description}
              onChange={handleChange}
              mb={3}
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
