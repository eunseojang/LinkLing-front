import { Button } from "@chakra-ui/react";

interface SelectionButtonProps {
  onClick: () => void;
  isSelected: boolean;
  label: string;
}

const SelectionButton = ({
  onClick,
  isSelected,
  label,
}: SelectionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      border={"solid 1px #73DA95"}
      bg={isSelected ? "#73DA95" : "white"}
      color={isSelected ? "white" : "#73DA95"}
    >
      {label}
    </Button>
  );
};

export default SelectionButton;
