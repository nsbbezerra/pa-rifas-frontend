import {
  Box,
  Container,
  Grid,
  useColorMode,
  Text,
  Button,
  Stack,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import {
  AiOutlineWhatsApp,
  AiOutlineInstagram,
  AiOutlineFacebook,
} from "react-icons/ai";

export default function FooterApp() {
  const { colorMode } = useColorMode();
  return (
    <Box mt={20}>
      <Box
        bg={colorMode === "light" ? "green.500" : "green.800"}
        pt={10}
        pb={10}
      >
        <Container maxW="4xl">
          <Grid
            templateColumns={[
              "1fr",
              "1fr 1fr",
              "1fr 1fr",
              "1fr 1fr",
              "1fr 1fr",
            ]}
            gap={20}
          >
            <Box w="100%">
              <Box bg="whiteAlpha.300" p={8} rounded="xl">
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  textAlign="center"
                  color="gray.100"
                >
                  ENTRE EM CONTATO CONOSCO
                </Text>

                <Button
                  leftIcon={<AiOutlineWhatsApp />}
                  colorScheme="orange"
                  isFullWidth
                  size="lg"
                  mt={5}
                >
                  WHATSAPP
                </Button>
              </Box>
              <Text
                fontWeight="bold"
                textAlign="center"
                mt={10}
                color="gray.100"
              >
                © 2021 - PA Rifas, Todos os Direitos Reservados!
              </Text>
            </Box>
            <Box>
              <Text
                fontSize="xl"
                fontWeight="bold"
                textAlign="center"
                color={colorMode === "light" ? "orange.500" : "orange.200"}
              >
                PÁGINAS
              </Text>

              <Stack mt={5} spacing={4}>
                <Button
                  variant="link"
                  colorScheme="whiteAlpha"
                  size="lg"
                  _hover={{ textDecor: "none" }}
                  color="whiteAlpha.900"
                >
                  RIFAS
                </Button>
                <Button
                  variant="link"
                  colorScheme="whiteAlpha"
                  size="lg"
                  _hover={{ textDecor: "none" }}
                  color="whiteAlpha.900"
                >
                  FALE CONOSCO
                </Button>
                <Button
                  variant="link"
                  colorScheme="whiteAlpha"
                  size="lg"
                  _hover={{ textDecor: "none" }}
                  color="whiteAlpha.900"
                >
                  CRIAR RIFA
                </Button>
                <Button
                  variant="link"
                  colorScheme="whiteAlpha"
                  size="lg"
                  _hover={{ textDecor: "none" }}
                  color="whiteAlpha.900"
                >
                  CONDIÇÕES DE USO
                </Button>
              </Stack>

              <Flex justify="center" align="center" mt={5}>
                <IconButton
                  icon={<AiOutlineInstagram />}
                  size="lg"
                  fontSize="2xl"
                  colorScheme="whiteAlpha"
                  color={"gray.100"}
                />
                <IconButton
                  icon={<AiOutlineFacebook />}
                  size="lg"
                  fontSize="2xl"
                  colorScheme="whiteAlpha"
                  color={"gray.100"}
                  ml={5}
                />
              </Flex>
            </Box>
          </Grid>
        </Container>
      </Box>
      <Box
        textAlign="center"
        p={4}
        bg={colorMode === "light" ? "orange.500" : "orange.800"}
        color="gray.100"
        fontSize={"sm"}
      >
        Desenvolvido por: NK Informática, Responsável: Natanael Bezerra (63)
        99971-1716
      </Box>
    </Box>
  );
}
