import { Box, Button, ButtonProps } from "@chakra-ui/react";

interface SocialLoginButtonProps extends ButtonProps {
  icon: React.ElementType;
  text: string;
  onClick?: () => void;
}

const SocialLoginButton = ({
  icon,
  text,
  onClick,
  ...props
}: SocialLoginButtonProps) => (
  <Button position="relative" onClick={onClick} {...props}>
    <Box
      as={icon}
      position="absolute"
      left="20px"
      top="50%"
      transform="translateY(-50%)"
    />
    {text}
  </Button>
);

export default SocialLoginButton;
