import Header from "../../../components/header";
import Footer from "../../../components/footer";
import {
  Box,
  Center,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/layout";
import Image from "next/image";
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode";
import { Stat, StatLabel, StatNumber, StatHelpText } from "@chakra-ui/stat";
import { Button } from "@chakra-ui/button";
import { GiCancel, GiCardRandom } from "react-icons/gi";
import Icon from "@chakra-ui/icon";
import { AiOutlineTrophy, AiOutlineWhatsApp } from "react-icons/ai";
import { FaCalendar, FaEdit } from "react-icons/fa";
import { IoMdImage } from "react-icons/io";

export default function AdminRaffles() {
  const { colorMode } = useColorMode();

  return (
    <>
      <Header />
      <Container maxW="6xl" mt={10}>
        <Heading fontSize="2xl" mb={10}>
          Rifa nº: 1
        </Heading>
        <Grid
          templateColumns={[
            "1fr",
            "300px 1fr",
            "300px 1fr",
            "300px 1fr",
            "300px 1fr",
          ]}
          gap={10}
          justifyContent="center"
          justifyItems={"center"}
        >
          <Box
            rounded="xl"
            overflow="hidden"
            borderWidth="1px"
            shadow="lg"
            h="min-content"
            w="300px"
          >
            <Box>
              <Image
                width={300}
                height={300}
                src="https://img.freepik.com/psd-gratuitas/postagem-de-sorteio-no-instagram_442085-152.jpg?size=338&ext=jpg"
                layout="responsive"
                alt="PA Rifas, rifas online"
              />
            </Box>

            <Box p={4}>
              <Heading
                fontSize="2xl"
                color={colorMode === "light" ? "green.500" : "green.200"}
              >
                TÍTULO DO SORTEIO
              </Heading>
              <Text fontSize="md" mt={3}>
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout
              </Text>

              <HStack mt={3}>
                <Stat>
                  <StatLabel>Valor</StatLabel>
                  <StatNumber>R$ 10,00</StatNumber>
                </Stat>

                <Stat>
                  <StatLabel>Sorteio</StatLabel>
                  <StatNumber>11/11/1111</StatNumber>
                </Stat>
              </HStack>
            </Box>
          </Box>

          <Box w="100%">
            <Grid
              templateColumns="repeat(auto-fit, minmax(180px, 180px))"
              gap={5}
              justifyContent="center"
            >
              <Box
                rounded="xl"
                shadow="lg"
                pt={2}
                pl={4}
                bg={useColorModeValue("orange.500", "orange.200")}
              >
                <Stat color={useColorModeValue("gray.100", "gray.800")}>
                  <StatLabel>Total Reservados</StatLabel>
                  <StatNumber>R$ 0.00</StatNumber>
                  <StatHelpText fontSize="xs">
                    Atualizado em 08/11/2021
                  </StatHelpText>
                </Stat>
              </Box>
              <Box
                rounded="xl"
                shadow="lg"
                pt={2}
                pl={4}
                bg={useColorModeValue("blue.500", "blue.200")}
              >
                <Stat color={useColorModeValue("gray.100", "gray.800")}>
                  <StatLabel>Total Arrecadado</StatLabel>
                  <StatNumber>R$ 0.00</StatNumber>
                  <StatHelpText fontSize="xs">
                    Atualizado em 08/11/2021
                  </StatHelpText>
                </Stat>
              </Box>
              <Box
                rounded="xl"
                shadow="lg"
                pt={2}
                pl={4}
                bg={useColorModeValue("red.500", "red.200")}
              >
                <Stat color={useColorModeValue("gray.100", "gray.800")}>
                  <StatLabel>Total Bloqueado</StatLabel>
                  <StatNumber>R$ 0.00</StatNumber>
                  <StatHelpText fontSize="xs">
                    Atualizado em 08/11/2021
                  </StatHelpText>
                </Stat>
              </Box>
              <Box
                rounded="xl"
                shadow="lg"
                pt={2}
                pl={4}
                bg={useColorModeValue("green.500", "green.200")}
              >
                <Stat color={useColorModeValue("gray.100", "gray.800")}>
                  <StatLabel>Total Liberado</StatLabel>
                  <StatNumber>R$ 0.00</StatNumber>
                  <StatHelpText fontSize="xs">
                    Atualizado em 08/11/2021
                  </StatHelpText>
                </Stat>
              </Box>
            </Grid>

            <Divider mt={5} mb={5} />

            <Heading
              fontSize="2xl"
              color={useColorModeValue("green.500", "green.200")}
            >
              PREMIAÇÃO
            </Heading>
            <Box
              bgGradient={
                colorMode === "light"
                  ? "linear(to-r, green.500, orange.500)"
                  : "linear(to-r, green.200, orange.200)"
              }
              w="135px"
              h="3px"
              mt={1}
            />

            <Grid
              templateColumns="repeat(auto-fit, minmax(140px, 140px))"
              gap={5}
              mt={5}
              justifyContent="center"
            >
              <Flex
                rounded="xl"
                shadow="lg"
                borderWidth="1px"
                direction="column"
                justify="center"
                align="center"
                h="min-content"
              >
                <Flex align="center">
                  <Icon as={AiOutlineTrophy} />
                  <Heading fontSize="sm" textAlign="center" p={2} w="100%">
                    1º PRÊMIO
                  </Heading>
                </Flex>
                <Divider />
                <Text fontSize="sm" p={2}>
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                </Text>
              </Flex>

              <Flex
                rounded="xl"
                shadow="lg"
                borderWidth="1px"
                direction="column"
                justify="center"
                align="center"
                h="min-content"
              >
                <Flex align="center">
                  <Icon as={AiOutlineTrophy} />
                  <Heading fontSize="sm" textAlign="center" p={2} w="100%">
                    2º PRÊMIO
                  </Heading>
                </Flex>
                <Divider />
                <Text fontSize="sm" p={2}>
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                </Text>
              </Flex>

              <Flex
                rounded="xl"
                shadow="lg"
                borderWidth="1px"
                direction="column"
                justify="center"
                align="center"
                h="min-content"
              >
                <Flex align="center">
                  <Icon as={AiOutlineTrophy} />
                  <Heading fontSize="sm" textAlign="center" p={2} w="100%">
                    3º PRÊMIO
                  </Heading>
                </Flex>
                <Divider />
                <Text fontSize="sm" p={2}>
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                </Text>
              </Flex>

              <Flex
                rounded="xl"
                shadow="lg"
                borderWidth="1px"
                direction="column"
                justify="center"
                align="center"
                h="min-content"
              >
                <Flex align="center">
                  <Icon as={AiOutlineTrophy} />
                  <Heading fontSize="sm" textAlign="center" p={2} w="100%">
                    4º PRÊMIO
                  </Heading>
                </Flex>
                <Divider />
                <Text fontSize="sm" p={2}>
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                </Text>
              </Flex>
              <Flex
                rounded="xl"
                shadow="lg"
                borderWidth="1px"
                direction="column"
                justify="center"
                align="center"
                h="min-content"
              >
                <Flex align="center">
                  <Icon as={AiOutlineTrophy} />
                  <Heading fontSize="sm" textAlign="center" p={2} w="100%">
                    5º PRÊMIO
                  </Heading>
                </Flex>
                <Divider />
                <Text fontSize="sm" p={2}>
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                </Text>
              </Flex>
            </Grid>

            <Button colorScheme="orange" leftIcon={<FaEdit />} mt={5}>
              Editar Premiação
            </Button>
          </Box>
        </Grid>

        <Divider mt={5} mb={5} />

        <Heading
          fontSize="2xl"
          color={useColorModeValue("green.500", "green.200")}
        >
          OPÇÕES
        </Heading>
        <Box
          bgGradient={
            colorMode === "light"
              ? "linear(to-r, green.500, orange.500)"
              : "linear(to-r, green.200, orange.200)"
          }
          w="90px"
          h="3px"
          mt={1}
        />

        <Grid
          mt={5}
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(2, 1fr)",
            "repeat(3, 1fr)",
            "repeat(3, 1fr)",
            "repeat(3, 1fr)",
          ]}
          gap={5}
        >
          <Button size="lg" leftIcon={<IoMdImage />}>
            Alterar Imagem
          </Button>
          <Button size="lg" leftIcon={<FaEdit />}>
            Alterar Informação
          </Button>
          <Button size="lg" leftIcon={<FaCalendar />}>
            Alterar Data e Hora
          </Button>
          <Button
            isFullWidth
            colorScheme="red"
            size="lg"
            leftIcon={<GiCancel />}
          >
            Cancelar Rifa
          </Button>
          <Button size="lg" colorScheme="green" leftIcon={<GiCardRandom />}>
            Realizar Sorteio
          </Button>
          <Button
            size="lg"
            colorScheme="whatsapp"
            leftIcon={<AiOutlineWhatsApp />}
          >
            Contato PA Rifas
          </Button>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
