import {
  Box,
  Flex,
  Grid,
  Heading,
  LinkBox,
  Text,
  HStack,
} from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import Image from "next/image";
import { format } from "date-fns";
import pt_br from "date-fns/locale/pt-BR";
import { FaToolbox } from "react-icons/fa";
import configs from "../configs";
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode";
import { Tag } from "@chakra-ui/tag";
import Lottie from "./lottie";
import EmptyAnimation from "../assets/empty.json";
import { useRouter } from "next/router";

export default function ShowRaffles({ raffle, destination }) {
  const { colorMode } = useColorMode();
  const { push } = useRouter();

  return (
    <>
      {raffle.length === 0 || !raffle ? (
        <Flex direction="column" justify="center" align="center">
          <Lottie animation={EmptyAnimation} width="50%" />
          <Text
            textAlign="center"
            fontSize="2xl"
            color={useColorModeValue("gray.700", "gray.200")}
            mt={5}
          >
            Nenhuma Rifa encontrada!
          </Text>
        </Flex>
      ) : (
        <Grid
          templateColumns="repeat(auto-fit, minmax(250px, 250px))"
          gap={5}
          justifyItems="center"
          justifyContent="center"
          mt={10}
        >
          {raffle.map((raf) => (
            <LinkBox
              rounded="xl"
              overflow="hidden"
              w="250px"
              shadow="lg"
              key={raf.id}
              borderWidth="1px"
              h="min-content"
            >
              {raf.status === "drawn" && (
                <Flex
                  bg={useColorModeValue("green.500", "green.200")}
                  p={2}
                  justify="center"
                  align="center"
                  color={useColorModeValue("white", "gray.700")}
                  pos="absolute"
                  zIndex={1000}
                  transform="rotate(-40deg)"
                  w="250px"
                  left="-70px"
                  top="25px"
                  shadow="lg"
                  fontWeight="bold"
                  fontSize="lg"
                >
                  FINALIZADA
                </Flex>
              )}
              {raf.status === "cancel" && (
                <Flex
                  bg={useColorModeValue("red.500", "red.200")}
                  p={2}
                  justify="center"
                  align="center"
                  color={useColorModeValue("white", "gray.700")}
                  pos="absolute"
                  zIndex={1000}
                  transform="rotate(-40deg)"
                  w="250px"
                  left="-70px"
                  top="25px"
                  shadow="lg"
                  fontWeight="bold"
                  fontSize="lg"
                >
                  CANCELADA
                </Flex>
              )}
              <Box w="250px" h="250px">
                <Image
                  src={`${configs.url}/img/${raf.thumbnail}`}
                  width={260}
                  height={260}
                  layout="responsive"
                  objectFit="cover"
                  alt="PA Rifas, rifas online"
                />
              </Box>
              <Box p={3} mt="-12px">
                <Tag
                  pos="absolute"
                  right={2}
                  top={2}
                  shadow="md"
                  bg={useColorModeValue("green.400", "green.200")}
                  color={useColorModeValue("gray.100", "gray.700")}
                  fontWeight="semibold"
                >
                  Nº {raf.id}
                </Tag>
                <Heading
                  color={colorMode === "light" ? "green.500" : "green.200"}
                  fontSize="md"
                  noOfLines={2}
                  mt={5}
                >
                  {raf.name}
                </Heading>
                <Text noOfLines={3} fontSize="xs" textAlign="justify" mt={1}>
                  {raf.description}
                </Text>

                <Text fontSize="xs" mt={2} noOfLines={1}>
                  Sorteio:{" "}
                  <strong>
                    {format(
                      new Date(raf.draw_date),
                      "dd 'de' MMMM', às ' HH:mm'h'",
                      { locale: pt_br }
                    )}
                  </strong>{" "}
                </Text>

                <Flex
                  align="center"
                  mt={1}
                  justify="space-between"
                  fontSize="xl"
                  mt={3}
                >
                  <Button
                    leftIcon={<FaToolbox />}
                    colorScheme="green"
                    onClick={() => push(`/${destination}/${raf.identify}`)}
                  >
                    Gerenciar
                  </Button>
                  <HStack>
                    <Text fontWeight="300">R$</Text>
                    <Text fontWeight="800">
                      {parseFloat(raf.raffle_value).toLocaleString("pt-br", {
                        minimumFractionDigits: 2,
                      })}
                    </Text>
                  </HStack>
                </Flex>
              </Box>
            </LinkBox>
          ))}
        </Grid>
      )}
    </>
  );
}
