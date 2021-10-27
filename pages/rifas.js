import { useEffect, useState } from "react";
import HeaderApp from "../components/header";
import FooterApp from "../components/footer";
import {
  Container,
  Grid,
  LinkBox,
  LinkOverlay,
  Box,
  Text,
  Heading,
  Flex,
  Divider,
  HStack,
  Center,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Select,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  useColorMode,
  Tag,
} from "@chakra-ui/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "../components/sliders";
import Link from "next/link";
import { FaSearch, FaUserAlt, FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import configsGlobal from "../configs/index";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Sorteios({ raffles }) {
  const { colorMode } = useColorMode();
  const [raffle, setRaffle] = useState([]);
  const [url, setUrl] = useState("");
  const [search, setSearch] = useState("all");
  const [text, setText] = useState("");

  useEffect(() => {
    if (raffles !== null) {
      setRaffle(raffles.raffles);
      setUrl(raffles.url);
    }
  }, [raffles]);

  async function finderBySource() {
    if (search === "all") {
      await setRaffle(raffles.raffles);
      setText("");
    }
    if (search === "user") {
      let termos = await text.split(" ");
      let frasesFiltradas = await raffles.raffles.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name_client.includes(termoBuscado);
        }, true);
      });
      await setRaffle(frasesFiltradas);
      setText("");
    }
    if (search === "title") {
      let termos = await text.split(" ");
      let frasesFiltradas = await raffles.raffles.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name.includes(termoBuscado);
        }, true);
      });
      await setRaffle(frasesFiltradas);
      setText("");
    }
  }

  return (
    <>
      <HeaderApp />

      <Container maxW="6xl" mt={10}>
        <Breadcrumb fontSize={["xx-small", "md", "md", "md", "md"]} mb={10}>
          <BreadcrumbItem>
            <Link href="/" passHref>
              <a>
                <BreadcrumbLink>Início</BreadcrumbLink>
              </a>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <Link passHref href="/sorteios">
              <a>
                <BreadcrumbLink>Sorteios</BreadcrumbLink>
              </a>
            </Link>
          </BreadcrumbItem>
        </Breadcrumb>

        <Grid templateColumns="270px 1fr" gap={7}>
          <Box rounded="xl" borderWidth="1px" p={3} shadow="lg" h="min-content">
            <FormControl>
              <FormLabel>Selecione uma opção:</FormLabel>
              <Select
                placeholder="Selecione uma opção"
                focusBorderColor="green.500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              >
                <option value="all">Todos os Sorteios</option>
                <option value="user">Nome do usuário</option>
                <option value="title">Título do Sorteio</option>
              </Select>
            </FormControl>
            <FormControl mt={5}>
              <FormLabel>Digite para buscar</FormLabel>
              <Input
                focusBorderColor="green.500"
                placeholder="Digite para buscar"
                value={text}
                onChange={(e) => setText(e.target.value.toUpperCase())}
                isDisabled={search === "all" ? true : false}
              />
            </FormControl>
            <Button
              mt={8}
              isFullWidth
              leftIcon={<FaSearch />}
              colorScheme="green"
              onClick={() => finderBySource()}
            >
              Buscar
            </Button>
          </Box>

          <Box w="100%">
            {raffle.length === 0 ? (
              <Center>
                <Heading fontSize="2xl">Nenhum sorteio para mostrar</Heading>
              </Center>
            ) : (
              <Grid
                templateColumns="repeat(auto-fit, minmax(250px, 250px))"
                gap={5}
                justifyContent="center"
              >
                {raffle.map((raf) => (
                  <LinkBox
                    rounded="lg"
                    overflow="hidden"
                    w="250px"
                    bg="white"
                    shadow="lg"
                    borderWidth="1px"
                    key={raf.id}
                  >
                    {raf.status === "drawn" && (
                      <Box
                        pos="absolute"
                        zIndex={900}
                        fontWeight="bold"
                        ml={3}
                        mt={3}
                        shadow="md"
                        bg="green.500"
                        color="white"
                        rounded="lg"
                        p={2}
                      >
                        FINALIZADA
                      </Box>
                    )}
                    {raf.status === "cancel" && (
                      <Box
                        pos="absolute"
                        zIndex={900}
                        fontWeight="bold"
                        ml={3}
                        mt={3}
                        shadow="md"
                        bg="red.500"
                        color="white"
                        rounded="lg"
                        p={2}
                      >
                        CANCELADA
                      </Box>
                    )}

                    {raf.status === "refused" && (
                      <Flex
                        bg="blackAlpha.700"
                        position="absolute"
                        w="250px"
                        h="100%"
                        zIndex={1000}
                        justify="center"
                        align="center"
                      >
                        <Box
                          w="100%"
                          bg="gray.800"
                          p={3}
                          textAlign="center"
                          fontWeight="700"
                        >
                          <Text mb={2} color="white">
                            BLOQUEADA
                          </Text>

                          <Text fontSize="sm" color="white">
                            Administrador:
                          </Text>
                          <Link
                            href={`https://wa.me/+55${raf.phone_client.replace(
                              /([\u0300-\u036f]|[^0-9a-zA-Z])/g,
                              ""
                            )}`}
                            passHref
                          >
                            <a target="_blank">
                              <Button
                                colorScheme="whatsapp"
                                leftIcon={<FaWhatsapp />}
                                size="sm"
                                w="160px"
                              >
                                {raf.phone_client}
                              </Button>
                            </a>
                          </Link>
                          <Popover>
                            <PopoverTrigger>
                              <Button
                                colorScheme="gray"
                                size="sm"
                                w="160px"
                                mt={2}
                              >
                                Justificativa
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent _focus={{ outline: "none" }}>
                              <PopoverArrow />
                              <PopoverCloseButton />
                              <PopoverHeader fontSize="xs">
                                Justificativa
                              </PopoverHeader>
                              <PopoverBody fontSize="xs" fontWeight="normal">
                                {raf.justify}
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                        </Box>
                      </Flex>
                    )}

                    <Box w="250px" h="250px">
                      <Image
                        src={`${url}/${raf.thumbnail}`}
                        width={260}
                        height={260}
                        layout="responsive"
                        objectFit="cover"
                        alt="PA Rifas, rifas online"
                      />
                    </Box>
                    <Box p={4}>
                      <Link href={`/rifa/${raf.identify}`} passHref>
                        <LinkOverlay>
                          <Heading
                            color={
                              colorMode === "light" ? "green.500" : "green.200"
                            }
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
                          {parseFloat(raf.raffle_value).toLocaleString(
                            "pt-br",
                            {
                              minimumFractionDigits: 2,
                            }
                          )}
                        </Text>
                      </Flex>
                      <Text
                        fontSize="xs"
                        mt={2}
                        noOfLines={1}
                        textAlign="center"
                      >
                        Sorteio:{" "}
                        <strong>
                          {format(
                            new Date(raf.draw_date),
                            "dd 'de' MMMM', às ' HH:mm'h'",
                            { locale: ptBR }
                          )}
                        </strong>
                      </Text>
                      <Divider mt={3} mb={3} />
                      <Flex align="center" fontSize="xs" justify="center">
                        <Icon as={FaUserAlt} mr={2} />
                        <Text isTruncated noOfLines={1}>
                          {raf.name_client}
                        </Text>
                      </Flex>
                    </Box>
                  </LinkBox>
                ))}
              </Grid>
            )}
          </Box>
        </Grid>
      </Container>

      <FooterApp />
    </>
  );
}

export const getStaticProps = async () => {
  const response = await fetch(`${configsGlobal.url}/showRaffles`);
  const data = await response.json();
  let raffles = !data ? null : data;
  return {
    props: {
      raffles,
    },
    revalidate: 10,
  };
};
