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
import Image from "next/image";
import { useRouter } from "next/router";

export default function FooterApp() {
  const { colorMode } = useColorMode();
  const { push } = useRouter();
  return (
    <Box mt={20}>
      <Box
        bg={colorMode === "light" ? "blackAlpha.100" : "whiteAlpha.200"}
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
              <Text textAlign="center">
                Esta plataforma é um produto da empresa NK Informática.
              </Text>
              <Text textAlign="center">
                © 2021 - PA Rifas, Todos os Direitos Reservados!
              </Text>
              <Flex mt={5} align="center" justify="center">
                <Box
                  w="40px"
                  h="40px"
                  rounded="full"
                  overflow="hidden"
                  bg="white"
                  p={1}
                >
                  <Image
                    src="/img/visa.svg"
                    width={250}
                    height={250}
                    layout="responsive"
                    objectFit="contain"
                  />
                </Box>
                <Box
                  w="40px"
                  h="40px"
                  rounded="full"
                  overflow="hidden"
                  ml={3}
                  p={1}
                  bg="white"
                >
                  <Image
                    src="/img/mastercard.svg"
                    width={250}
                    height={250}
                    layout="responsive"
                    objectFit="contain"
                  />
                </Box>
                <Box
                  w="40px"
                  h="40px"
                  rounded="full"
                  overflow="hidden"
                  ml={3}
                  p={0}
                  bg="black"
                >
                  <Image
                    src="/img/elo.svg"
                    width={250}
                    height={250}
                    layout="responsive"
                    objectFit="contain"
                  />
                </Box>
                <Box
                  w="40px"
                  h="40px"
                  rounded="full"
                  bg="white"
                  overflow="hidden"
                  ml={3}
                  p={0.5}
                >
                  <Image
                    src="/img/hipercard.svg"
                    width={250}
                    height={250}
                    layout="responsive"
                    objectFit="contain"
                  />
                </Box>
                <Box
                  w="40px"
                  h="40px"
                  rounded="full"
                  overflow="hidden"
                  ml={3}
                  p={0.5}
                  bg="white"
                >
                  <Image
                    src="/img/pix.svg"
                    width={250}
                    height={250}
                    layout="responsive"
                    objectFit="contain"
                  />
                </Box>
              </Flex>

              <Button
                leftIcon={<AiOutlineWhatsApp />}
                colorScheme="green"
                isFullWidth
                size="lg"
                mt={10}
                variant="outline"
                onClick={() => push("/faleconosco")}
              >
                FALE CONOSCO
              </Button>
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
                  colorScheme="green"
                  size="lg"
                  _hover={{ textDecor: "none" }}
                >
                  RIFAS
                </Button>
                <Button
                  variant="link"
                  colorScheme="green"
                  size="lg"
                  _hover={{ textDecor: "none" }}
                >
                  REEMBOLSO
                </Button>
                <Button
                  variant="link"
                  colorScheme="green"
                  size="lg"
                  _hover={{ textDecor: "none" }}
                >
                  FALE CONOSCO
                </Button>
                <Button
                  variant="link"
                  colorScheme="green"
                  size="lg"
                  _hover={{ textDecor: "none" }}
                >
                  CRIAR RIFA
                </Button>
                <Button
                  variant="link"
                  colorScheme="green"
                  size="lg"
                  _hover={{ textDecor: "none" }}
                >
                  CONDIÇÕES DE USO
                </Button>
              </Stack>

              <Flex justify="center" align="center" mt={5}>
                <IconButton
                  icon={<AiOutlineInstagram />}
                  size="lg"
                  fontSize="2xl"
                  colorScheme="orange"
                  variant="outline"
                />
                <IconButton
                  icon={<AiOutlineFacebook />}
                  size="lg"
                  fontSize="2xl"
                  colorScheme="orange"
                  variant="outline"
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
        bg={colorMode === "light" ? "green.500" : "green.800"}
        color="gray.100"
        fontSize={"sm"}
      >
        Desenvolvido por: NK Informática, Responsável: Natanael Bezerra (63)
        99971-1716
      </Box>
    </Box>
  );
}
