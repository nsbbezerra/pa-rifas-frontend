import {
  Box,
  Divider,
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
import Icon from "@chakra-ui/icon";
import { FaShoppingCart, FaUserAlt } from "react-icons/fa";
import configs from "../configs";
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode";
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/slider";
import { Tag } from "@chakra-ui/tag";
import Lottie from "./lottie";
import EmptyAnimation from "../assets/empty.json";
import { useRouter } from "next/router";
import { GiArcheryTarget } from "react-icons/gi";
import { Tooltip } from "@chakra-ui/tooltip";

export default function ShowRaffles({ raffle, destination, numbers }) {
  const { colorMode } = useColorMode();
  const { push } = useRouter();
  function calcPercent(raff) {
    const result = numbers.find((obj) => obj.raffle_id === raff.id);
    if (result) {
      let totalNumbers = raff.qtd_numbers;
      let numberSale = result.count;
      let firstCalc = 100 * numberSale;
      let finalCalc = firstCalc / totalNumbers;
      return parseInt(finalCalc);
    }
  }

  return (
    <>
      {raffle.length === 0 || !raffle ? (
        <Flex direction="column" justify="center" align="center" mt={10}>
          <Lottie animation={EmptyAnimation} width="40%" />
          <Text
            textAlign="center"
            fontSize="lg"
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
                  zIndex={800}
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
                  zIndex={800}
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
              {calcPercent(raf) < parseFloat(raf.goal) ? (
                <Slider
                  aria-label="slider-ex-4"
                  defaultValue={calcPercent(raf)}
                  size="lg"
                  mt="-15px"
                  isReadOnly
                >
                  <SliderTrack
                    bg={useColorModeValue("red.100", "red.100")}
                    h="10px"
                    rounded="none"
                  >
                    <SliderFilledTrack
                      bg={useColorModeValue("red.500", "red.300")}
                    />
                  </SliderTrack>
                  <SliderThumb
                    boxSize={9}
                    borderWidth="1px"
                    borderColor="red.100"
                  >
                    <Flex
                      justify="center"
                      align="center"
                      fontSize="xs"
                      fontWeight="bold"
                      color="red.500"
                    >
                      {calcPercent(raf)}%
                    </Flex>
                  </SliderThumb>
                </Slider>
              ) : (
                <Slider
                  aria-label="slider-ex-4"
                  defaultValue={calcPercent(raf)}
                  size="lg"
                  mt="-15px"
                  isReadOnly
                >
                  <SliderTrack
                    bg={useColorModeValue("green.100", "green.100")}
                    h="10px"
                    rounded="none"
                  >
                    <SliderFilledTrack
                      bg={useColorModeValue("green.500", "green.300")}
                    />
                  </SliderTrack>
                  <SliderThumb
                    boxSize={9}
                    borderWidth="1px"
                    borderColor="green.100"
                  >
                    <Flex
                      justify="center"
                      align="center"
                      fontSize="xs"
                      fontWeight="bold"
                      color="green.500"
                    >
                      {calcPercent(raf)}%
                    </Flex>
                  </SliderThumb>
                </Slider>
              )}

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
                >
                  {raf.name}
                </Heading>
                <Text noOfLines={3} fontSize="xs" textAlign="justify" mt={1}>
                  {raf.description}
                </Text>

                <Flex align="center" justify="space-between" mt={2}>
                  <Text fontSize="xs" noOfLines={1}>
                    Sorteio:{" "}
                    <strong>
                      {format(
                        new Date(raf.draw_date),
                        "dd 'de' MMMM', às ' HH:mm'h'",
                        { locale: pt_br }
                      )}
                    </strong>{" "}
                  </Text>

                  <Tooltip hasArrow label="Meta">
                    <HStack spacing={0.5}>
                      <Icon as={GiArcheryTarget} />
                      <Text fontSize={"sm"}>{raf.goal}%</Text>
                    </HStack>
                  </Tooltip>
                </Flex>

                <Flex
                  align="center"
                  mt={1}
                  justify="space-between"
                  fontSize="xl"
                  mt={3}
                  mb={3}
                >
                  <Button
                    leftIcon={<FaShoppingCart />}
                    colorScheme="green"
                    onClick={() => push(`/${destination}/${raf.identify}`)}
                  >
                    Participar
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
                <Divider mt={3} mb={3} />
                <Flex align="center" fontSize="xs" justify="center">
                  <Icon as={FaUserAlt} mr={2} />
                  <Text noOfLines={1}>{raf.name_client}</Text>
                </Flex>
              </Box>
            </LinkBox>
          ))}
        </Grid>
      )}
    </>
  );
}
