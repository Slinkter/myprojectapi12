import { LockClosedIcon } from "@radix-ui/react-icons";
import { Flex, Text } from "@radix-ui/themes";
import { useLogLifecycle } from "@/shared/hooks";

const SecurityBadge = () => {
  useLogLifecycle("SecurityBadge");
  return (
    <Flex align="center" justify="center" gap="1" style={{ color: "var(--gray-11)" }}>
      <LockClosedIcon width="14" height="14" />
      <Text size="1">Transacción segura encriptada</Text>
    </Flex>
  );
};

export default SecurityBadge;
