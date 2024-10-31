import { Grid, Divider } from "@chakra-ui/react";
import React from "react";

export const Row = ({ totalSprints, children, containerRef }) => {
  return (
    <Grid
      className="sprint-container"
      position="relative"
      width="100%"
      height="120px"
      bg="gray.100"
      borderRadius="md"
      overflow="visible"
      boxShadow="md"
      ref={containerRef}
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
      {children}
    </Grid>
  );
};
