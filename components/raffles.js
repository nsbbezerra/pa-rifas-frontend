import {
  Box,
  Divider,
  Flex,
  Grid,
  Heading,
  LinkBox,
  LinkOverlay,
  Text,
} from "@chakra-ui/layout";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import pt_br from "date-fns/locale/pt-BR";
import Icon from "@chakra-ui/icon";
import { FaUserAlt } from "react-icons/fa";
import configs from "../configs";
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode";
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/slider";
import { Tag } from "@chakra-ui/tag";

export default function ShowRaffles({ raffle, destination }) {
  const { colorMode } = useColorMode();
  return (
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
          <Slider
            aria-label="slider-ex-4"
            defaultValue={30}
            size="lg"
            mt="-12px"
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
            <SliderThumb boxSize={9} borderWidth="1px" borderColor="green.100">
              <Flex
                justify="center"
                align="center"
                fontSize="xs"
                fontWeight="bold"
                color="green.500"
              >
                30%
              </Flex>
            </SliderThumb>
          </Slider>
          <Box p={4} mt="-12px">
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
            <Link href={`/${destination}/${raf.identify}`} passHref>
              <LinkOverlay>
                <Heading
                  color={colorMode === "light" ? "green.500" : "green.200"}
                  fontSize="md"
                  noOfLines={2}
                  textAlign="center"
                >
                  {raf.name}
                </Heading>
              </LinkOverlay>
            </Link>

            <Flex
              align="center"
              mt={1}
              justify="center"
              fontSize="xl"
              mt={3}
              mb={3}
            >
              <Text fontWeight="300" mr={2}>
                R$
              </Text>
              <Text fontWeight="800">
                {parseFloat(raf.raffle_value).toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </Flex>

            <Text fontSize="xs" mt={2} noOfLines={1} textAlign="center">
              Sorteio:{" "}
              <strong>
                {format(
                  new Date(raf.draw_date),
                  "dd 'de' MMMM', às ' HH:mm'h'",
                  { locale: pt_br }
                )}
              </strong>{" "}
            </Text>
            <Divider mt={3} mb={3} />
            <Flex align="center" fontSize="xs" justify="center">
              <Icon as={FaUserAlt} mr={2} />
              <Text noOfLines={1}>{raf.name_client}</Text>
            </Flex>
          </Box>
        </LinkBox>
      ))}
    </Grid>
  );
}
