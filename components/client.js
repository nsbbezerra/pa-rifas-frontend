import {
  Box,
  Grid,
  Flex,
  Text,
  Button,
  Divider,
  Heading,
  Icon,
  LinkBox,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Spinner,
  HStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  LinkOverlay,
} from "@chakra-ui/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  FaWhatsapp,
  FaUserAlt,
  FaArrowUp,
  FaSortNumericDown,
} from "react-icons/fa";
import Link from "next/link";
import useFetch from "../hooks/useFetch";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import api from "../configs/axios";

export default function Client({ info, url }) {
  const { data, error } = useFetch(`/findRafflesClient/${info}`);

  const [modalCancel, setModalCancel] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [raffles, setRaffles] = useState([]);

  const [phone, setPhone] = useState("");
  const [numbers, setNumbers] = useState([]);

  useEffect(() => {
    if (data !== undefined) {
      setRaffles(data);
    }
  }, [data]);

  function handlePhone(value) {
    setPhone(value);
    setModalCancel(true);
  }

  function handleColor(status) {
    switch (status) {
      case "reserved":
        return "orange";
      case "paid_out":
        return "green";
      default:
        return "orange";
    }
  }

  async function findNumbers(id, raf) {
    try {
      const response = await api.get(`/numbersClient/${id}/raffle/${raf}`);
      setNumbers(response.data);
      setModalEdit(true);
    } catch (error) {
      if (error.message === "Network Error") {
        alert(
          "Sem conexão com o servidor, verifique sua conexão com a internet."
        );
        return false;
      }
      let mess = !error.response.data
        ? "Erro no cadastro do cliente"
        : error.response.data.message;
      showToast(mess, "error", "Erro");
    }
  }

  return (
    <>
      <Grid
        templateColumns="repeat(auto-fit, minmax(220px, 220px))"
        gap="30px"
        justifyContent="center"
      >
        {raffles.length === 0 ? (
          <Flex align="center" justify="center">
            <Heading fontSize="md" textAlign="center">
              Nenhum sorteio para mostrar
            </Heading>
          </Flex>
        ) : (
          <>
            {raffles.map((raf) => (
              <Box w="220px" key={raf.id}>
                <LinkBox
                  rounded="lg"
                  overflow="hidden"
                  w="220px"
                  bg="white"
                  shadow="lg"
                  borderWidth="1px"
                >
                  {raf.status === "drawn" && (
                    <Flex
                      bg="blackAlpha.700"
                      position="absolute"
                      w="220px"
                      h="100%"
                      zIndex={1000}
                      justify="center"
                      align="center"
                    >
                      <Box
                        w="100%"
                        bg="green.600"
                        p={3}
                        textAlign="center"
                        fontWeight="700"
                        color="white"
                      >
                        <Text>FINALIZADA</Text>
                        <HStack justify="center" mt={2}>
                          <Text>Nº Sorteado:</Text>
                          <Text
                            p={2}
                            bg="white"
                            borderWidth="1px"
                            borderColor="purple.400"
                            rounded="md"
                            color="purple.400"
                            shadow="md"
                          >
                            {raf.number_drawn ? raf.number_drawn : 0}
                          </Text>
                        </HStack>
                        <Text fontSize="xs" textAlign="center">
                          Cliente:{" "}
                          <strong>{raf.client_drawn.name_client}</strong>
                        </Text>
                        <Text fontSize="xs" textAlign="center">
                          Tel: <strong>{raf.client_drawn.phone_client}</strong>
                        </Text>
                      </Box>
                    </Flex>
                  )}
                  {raf.status === "cancel" && (
                    <Flex
                      bg="blackAlpha.700"
                      position="absolute"
                      w="220px"
                      h="100%"
                      zIndex={1000}
                      justify="center"
                      align="center"
                    >
                      <Box
                        w="100%"
                        bg="red.600"
                        p={3}
                        textAlign="center"
                        fontWeight="700"
                      >
                        <Text mb={2} color="white">
                          CANCELADA
                        </Text>

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
                  {raf.status === "refused" && (
                    <Flex
                      bg="blackAlpha.700"
                      position="absolute"
                      w="220px"
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
                          RECUSADA
                        </Text>

                        <Text fontSize="sm" color="white">
                          Administrador:
                        </Text>
                        <Link
                          href={`https://wa.me/+55${configs.admin_phone.replace(
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
                              {configs.admin_phone}
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
                  {raf.status === "waiting" && (
                    <Flex
                      bg="blackAlpha.700"
                      position="absolute"
                      w="220px"
                      h="100%"
                      zIndex={1000}
                      justify="center"
                      align="center"
                    >
                      <Box
                        w="100%"
                        bg="orange.400"
                        p={3}
                        textAlign="center"
                        fontWeight="700"
                      >
                        <Text mb={2} color="white" textAlign="center">
                          AGUARDANDO LIBERAÇÃO
                        </Text>

                        <Text fontSize="sm" color="white">
                          Administrador:
                        </Text>
                        <Link
                          href={`https://wa.me/+55${configs.admin_phone.replace(
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
                              {configs.admin_phone}
                            </Button>
                          </a>
                        </Link>
                      </Box>
                    </Flex>
                  )}
                  <Box w="220px" h="220px">
                    <Image
                      src={`${url}/${raf.thumbnail}`}
                      width={260}
                      height={260}
                      layout="responsive"
                      objectFit="cover"
                      alt="PMW Rifas, rifas online"
                    />
                  </Box>
                  <Box p={2} w="260px">
                    <Link href={`/sorteio/${raf.identify}`} passHref>
                      <LinkOverlay>
                        <Heading
                          color="purple.400"
                          fontSize="md"
                          isTruncated
                          noOfLines={1}
                          w="200px"
                        >
                          {raf.name}
                        </Heading>
                      </LinkOverlay>
                    </Link>
                    <Text fontSize="xs" mt={2}>
                      Sorteio:{" "}
                      <strong>
                        {format(
                          new Date(raf.draw_date),
                          "dd 'de' MMMM', às ' HH:mm'h'",
                          { locale: ptBR }
                        )}
                      </strong>
                    </Text>
                    <Flex align="center" mt={1}>
                      <Text fontWeight="300" mr={2}>
                        R$
                      </Text>
                      <Text fontWeight="800">
                        {parseFloat(raf.raffle_value).toLocaleString("pt-br", {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                    </Flex>
                    <Divider mt={1} mb={1} />
                    <Flex align="center" fontSize="xs">
                      <Icon as={FaUserAlt} mr={2} />
                      <Text w="180px" isTruncated noOfLines={1}>
                        {raf.name_client}
                      </Text>
                    </Flex>
                  </Box>
                </LinkBox>
                <Menu placement="top">
                  <MenuButton
                    as={Button}
                    rightIcon={<FaArrowUp />}
                    colorScheme="purple"
                    isFullWidth
                    mt={2}
                    size="sm"
                    isDisabled={raf.status === "open" ? false : true}
                  >
                    Opções
                  </MenuButton>
                  <MenuList
                    zIndex={2000}
                    shadow="lg"
                    borderWidth="2px"
                    borderColor="green.400"
                  >
                    <MenuItem
                      _active={{ bg: "purple.100", color: "white" }}
                      _focus={{ bg: "transparent" }}
                      _hover={{ bg: "purple.100", color: "white" }}
                      onClick={() => findNumbers(raf.id_client, raf.id)}
                    >
                      Ver Meus Números
                    </MenuItem>
                    <MenuItem
                      _active={{ bg: "purple.100", color: "white" }}
                      _focus={{ bg: "transparent" }}
                      _hover={{ bg: "purple.100", color: "white" }}
                      onClick={() => handlePhone(raf.phone_client)}
                    >
                      Contato do Administrador
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>
            ))}
          </>
        )}
      </Grid>

      <Modal
        isOpen={modalCancel}
        onClose={() => setModalCancel(false)}
        size="sm"
        scrollBehavior="outside"
      >
        <ModalOverlay />
        <ModalContent borderWidth="3px" borderColor="green.400">
          <ModalHeader>
            <Flex align="center">
              <Icon as={FaWhatsapp} />
              <Text ml={3}>Contato do Administrador</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={5}>
            <Flex justify="center" align="center">
              <Link
                href={`https://wa.me/+55${phone.replace(
                  /([\u0300-\u036f]|[^0-9a-zA-Z])/g,
                  ""
                )}`}
                passHref
              >
                <a target="_blank">
                  <Button
                    colorScheme="whatsapp"
                    size="lg"
                    leftIcon={<FaWhatsapp />}
                  >
                    {phone}
                  </Button>
                </a>
              </Link>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={modalEdit} onClose={() => setModalEdit(false)} size="3xl">
        <ModalOverlay />
        <ModalContent borderWidth="3px" borderColor="green.400">
          <ModalHeader>
            <Flex align="center">
              <Icon as={FaSortNumericDown} />
              <Text ml={3}>Meus Números</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={5}>
            <HStack spacing="20px">
              <Flex w="150px">
                <Box w="40px" h="20px" bg="orange.400" rounded="md" />
                <Text fontSize="sm" ml={3}>
                  Aguardando
                </Text>
              </Flex>
              <Flex w="150px">
                <Box w="40px" h="20px" bg="green.400" rounded="md" />
                <Text fontSize="sm" ml={3}>
                  Pago
                </Text>
              </Flex>
            </HStack>
            <Divider mt={3} mb={3} />
            <Grid
              templateColumns="repeat(auto-fit, minmax(80px, 80px))"
              gap="20px"
              justifyContent="center"
              justifyItems="center"
            >
              {numbers.length === 0 ? (
                <Spinner colorScheme="purple" size="lg" />
              ) : (
                <>
                  {numbers.map((num) => (
                    <Button
                      isFullWidth
                      colorScheme={handleColor(num.status)}
                      h="40px"
                      shadow="md"
                    >
                      {num.number}
                    </Button>
                  ))}
                </>
              )}
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
