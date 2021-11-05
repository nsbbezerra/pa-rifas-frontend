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
import { useColorMode } from "@chakra-ui/color-mode";

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
          <Box p={4}>
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
