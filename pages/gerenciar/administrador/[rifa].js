import Header from "../../../components/header";
import Footer from "../../../components/footer";
import {
  Box,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  Text,
} from "@chakra-ui/layout";
import Image from "next/image";
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode";
import { Stat, StatLabel, StatNumber, StatHelpText } from "@chakra-ui/stat";
import { Button } from "@chakra-ui/button";
import { GiCardRandom } from "react-icons/gi";
import Icon from "@chakra-ui/icon";
import { AiOutlineTrophy, AiOutlineWhatsApp } from "react-icons/ai";
import { FaRegEdit, FaEdit } from "react-icons/fa";
import { IoImagesOutline, IoCalendarOutline } from "react-icons/io5";
import { ImCancelCircle } from "react-icons/im";
import { Tag } from "@chakra-ui/tag";

export default function AdminRaffles() {
  const { colorMode } = useColorMode();

  return (
    <>
      <Header />
      <Container maxW="6xl" mt={10}>
        <Tag colorScheme="green" size="lg" fontWeight="bold" mb={10}>
          RIFA Nº 1
        </Tag>
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
              templateColumns={[
                "repeat(2, 1fr)",
                "repeat(2, 1fr)",
                "repeat(3, 1fr)",
                "repeat(4, 1fr)",
                "repeat(4, 1fr)",
              ]}
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
                    * Já descontado as taxas
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
                    * Já descontado as taxas
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
                    * Já descontado as taxas
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
                    * Já descontado as taxas
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
              templateColumns={[
                "repeat(2, 1fr)",
                "repeat(3, 1fr)",
                "repeat(3, 1fr)",
                "repeat(4, 1fr)",
                "repeat(5, 1fr)",
              ]}
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
            "repeat(2, 1fr)",
            "repeat(2, 1fr)",
            "repeat(3, 1fr)",
            "repeat(4, 1fr)",
            "repeat(6, 1fr)",
          ]}
          gap={5}
        >
          <Button size="md" rounded="xl" h="90px">
            <Flex justify="center" align="center" direction="column">
              <Icon as={IoImagesOutline} fontSize="5xl" />
              <Text mt={2}>Alterar Imagem</Text>
            </Flex>
          </Button>
          <Button size="md" rounded="xl" h="90px">
            <Flex justify="center" align="center" direction="column">
              <Icon as={FaRegEdit} fontSize="5xl" />
              <Text mt={2}>Alterar Informação</Text>
            </Flex>
          </Button>
          <Button size="md" rounded="xl" h="90px">
            <Flex justify="center" align="center" direction="column">
              <Icon as={IoCalendarOutline} fontSize="5xl" />
              <Text mt={2}>Alterar Data e Hora</Text>
            </Flex>
          </Button>
          <Button isFullWidth colorScheme="red" size="md" rounded="xl" h="90px">
            <Flex justify="center" align="center" direction="column">
              <Icon as={ImCancelCircle} fontSize="5xl" />
              <Text mt={2}>Cancelar Rifa</Text>
            </Flex>
          </Button>
          <Button size="md" rounded="xl" h="90px" colorScheme="green">
            <Flex justify="center" align="center" direction="column">
              <Icon as={GiCardRandom} fontSize="5xl" />
              <Text mt={2}>Realizar Sorteio</Text>
            </Flex>
          </Button>
          <Button size="md" rounded="xl" h="90px" colorScheme="whatsapp">
            <Flex justify="center" align="center" direction="column">
              <Icon as={AiOutlineWhatsApp} fontSize="5xl" />
              <Text mt={2}>Contato PA Rifas</Text>
            </Flex>
          </Button>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
