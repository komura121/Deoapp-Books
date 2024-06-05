import React from "react";
import { Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, useSteps, Box } from "@chakra-ui/react";

function Steppers() {
  const steps = [
    { title: "Create Project", description: "Project Name" },
    { title: "Fill Form", description: "Description" },
    { title: "Make the Chapter", description: "Fill Chapter" },
  ];

  const { activeStep } = useSteps({
    index: 1, // Change the starting step if needed
    count: steps.length,
  });

  return (
    <>
      <Box>
        <Stepper index={activeStep} ml={{ base: "35%", md: "20%", lg: "15%" }} mr={{ base: "20%", md: "20%", lg: "11%" }} fontSize={{ base: "8px", md: "14px" }}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
              </StepIndicator>

              <Box flexShrink="0" display={{ base: "none", md: "flow", lg: "grid" }}>
                <StepTitle fontSize={{ base: "10px", md: "12px", lg: "16px" }}>{step.title}</StepTitle>
                <StepDescription fontSize={{ base: "10px", md: "12px", lg: "16px" }}>{step.description}</StepDescription>
              </Box>
              {index < steps.length - 1 && <StepSeparator />}
            </Step>
          ))}
        </Stepper>
      </Box>
    </>
  );
}

export default Steppers;
