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
import Icon from "@chakra-ui/icon";
import { FaShoppingCart, FaUserAlt } from "react-icons/fa";
import configs from "../configs";
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode";
import { Tag } from "@chakra-ui/tag";
import Lottie from "./lottie";
import EmptyAnimation from "../assets/empty.json";
import { useRouter } from "next/router";
import { GiArcheryTarget } from "react-icons/gi";
import { Tooltip } from "@chakra-ui/tooltip";

export default function ShowRaffles({ raffle, destination }) {
  const { colorMode } = useColorMode();
  const { push } = useRouter();

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

              <Box p={3}>
                <Tag
                  pos="absolute"
                  right={"60px"}
                  top={2}
                  shadow="md"
                  bg={useColorModeValue("red.500", "red.200")}
                  color={useColorModeValue("gray.100", "gray.700")}
                  fontWeight="semibold"
                >
                  PRORROGADO
                </Tag>
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

                <Button
                  leftIcon={<FaShoppingCart />}
                  colorScheme="green"
                  onClick={() => push(`/${destination}/${raf.identify}`)}
                  isFullWidth
                  mt={3}
                >
                  Participar com R${" "}
                  {parseFloat(raf.raffle_value).toLocaleString("pt-br", {
                    minimumFractionDigits: 2,
                  })}
                </Button>
              </Box>
            </LinkBox>
          ))}
        </Grid>
      )}
    </>
  );
}
