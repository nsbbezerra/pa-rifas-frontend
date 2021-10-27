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
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  InputGroup,
  Input,
  InputRightElement,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  PopoverFooter,
  HStack,
  Spinner,
  useToast,
  Select,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  LinkOverlay,
} from "@chakra-ui/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  FaWhatsapp,
  FaUserAlt,
  FaArrowUp,
  FaTrash,
  FaCalendarAlt,
  FaExchangeAlt,
  FaSortNumericDown,
  FaUnlock,
  FaSearch,
} from "react-icons/fa";
import DatePicker, { registerLocale } from "react-datepicker";
import pt_br from "date-fns/locale/pt-BR";
import Link from "next/link";
import { format } from "date-fns";
import useFetch from "../hooks/useFetch";
import api from "../configs/axios";
import { mutate as mutateGlobal } from "swr";

import Slot from "../assets/slot.json";
import Congrat from "../assets/congrat.json";
import Lottie from "../components/lottie";

registerLocale("pt_br", pt_br);

export default function Admin({ info, url, configs }) {
  const { data, error, mutate } = useFetch(`/findRafflesAdmin/${info}`);
  const toast = useToast();

  const [modalCancel, setModalCancel] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);

  const [raffles, setRaffles] = useState([]);
  const [id, setId] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [modalNumbers, setModalNumbers] = useState(false);
  const [loadingNumber, setLoadingNumber] = useState(false);

  const [numbers, setNumbers] = useState([]);
  const [numbersFind, setNumbersFind] = useState([]);
  const [search, setSearch] = useState("all");
  const [text, setText] = useState("");
  const [justification, setJustification] = useState("");
  const [loadingJustify, setLoadingJustify] = useState(false);
  const [modalSlot, setModalSlot] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const [alert, setAlert] = useState(false);
  const [drawnNumber, setDrawnNumbers] = useState({});

  useEffect(() => {
    if (data !== undefined) {
      setRaffles(data);
    }
  }, [data]);

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
    });
  }

  if (error) {
    if (error.message === "Network Error") {
      alert(
        "Sem conexão com o servidor, verifique sua conexão com a internet."
      );
    } else {
      showToast("Ocorreu um erro inesperado", "error", "Erro");
    }
  }

  const CustomInputPicker = ({ value, onClick }) => (
    <InputGroup>
      <Input
        focusBorderColor="purple.400"
        defaultValue={value}
        onClick={onClick}
        w="265px"
      />
      <InputRightElement pointerEvents="none" children={<FaCalendarAlt />} />
    </InputGroup>
  );

  function handleUpdate(id, date) {
    setId(id);
    setStartDate(new Date(date));
    setModalEdit(true);
  }

  async function updateDate() {
    setLoading(true);
    try {
      const response = await api.put(`/updateDate/${id}`, {
        draw_date: startDate,
      });
      const updated = await data.map((dat) => {
        if (dat.id === id) {
          return { ...dat, draw_date: response.data.date[0].draw_date };
        }
        return dat;
      });
      mutate(updated, false);
      mutateGlobal(`/updateDate/${id}`, {
        id: id,
        draw_date: response.data.date[0].draw_date,
      });
      showToast(response.data.message, "success", "Sucesso");
      setModalEdit(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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

  async function findNumbers(id) {
    setId(id);
    try {
      const response = await api.get(`/numbersAdmin/${id}`);
      setNumbers(response.data);
      setNumbersFind(response.data);
      setModalNumbers(true);
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

  async function finderBySource() {
    if (search === "all") {
      setNumbersFind(numbers);
    }
    if (search === "name") {
      let termos = await text.split(" ");
      let frasesFiltradas = await numbers.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name.includes(termoBuscado);
        }, true);
      });
      await setNumbersFind(frasesFiltradas);
    }
    if (search === "number") {
      const result = await numbers.filter(
        (obj) => obj.number === parseInt(text)
      );
      setNumbersFind(result);
    }
  }

  async function activateNumber(id) {
    setLoadingNumber(true);
    try {
      const response = await api.put(`/numbersActive/${id}`);
      setNumbers(response.data.numbers);
      setNumbersFind(response.data.numbers);
      setText("");
      setSearch("all");
      showToast(response.data.message, "success", "Sucesso");
      setLoadingNumber(false);
    } catch (error) {
      setLoadingNumber(false);
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

  function handleJustification(id) {
    setId(id);
    setModalCancel(true);
  }

  async function sendCancel() {
    if (justification === "") {
      showToast("Insira uma justificativa", "warning", "Atenção");
      return false;
    }
    setLoadingJustify(true);
    try {
      const response = await api.put(`/blockRaffle/${id}`, {
        justify: justification,
      });
      const updated = await data.map((raf) => {
        if (raf.id === id) {
          return {
            ...raf,
            justify: response.data.raffle[0].justify,
            status: response.data.raffle[0].status,
          };
        }
        return raf;
      });
      mutate(updated, false);
      mutateGlobal(`/blockRaffle/${id}`, {
        id: id,
        justify: response.data.raffle[0].justify,
        status: response.data.raffle[0].status,
      });
      showToast(response.data.message, "success", "Sucesso");
      setJustification("");
      setModalCancel(false);
      setLoadingJustify(false);
    } catch (error) {
      setLoadingJustify(false);
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

  function handleCloseDrawn() {
    setDrawn(true);
    setModalSlot(false);
    setDrawnNumbers({});
  }

  function handleDrawn(id) {
    setId(id);
    setAlert(true);
  }

  async function sendDrawn() {
    setAlert(false);
    setModalSlot(true);
    setDrawn(true);
    try {
      const response = await api.put(`/drawn/${id}`);
      setTimeout(() => {
        setDrawn(false);
        setDrawnNumbers(response.data.random);
      }, 10000);
      const updated = await data.map((raf) => {
        if (raf.id === id) {
          return {
            ...raf,
            status: response.data.newRaffle[0].status,
            client_drawn: response.data.newRaffle[0].client_drawn,
            number_drawn: response.data.newRaffle[0].number_drawn,
          };
        }
        return raf;
      });
      mutate(updated, false);
      mutateGlobal(`/drawn/${id}`, {
        id: id,
        status: response.data.newRaffle[0].status,
        client_drawn: response.data.newRaffle[0].client_drawn,
        number_drawn: response.data.newRaffle[0].number_drawn,
      });
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
                          { locale: pt_br }
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
                      onClick={() => handleDrawn(raf.id)}
                    >
                      Realizar Sorteio
                    </MenuItem>
                    <MenuItem
                      _active={{ bg: "purple.100", color: "white" }}
                      _focus={{ bg: "transparent" }}
                      _hover={{ bg: "purple.100", color: "white" }}
                      onClick={() => findNumbers(raf.id)}
                    >
                      Gerenciar Números
                    </MenuItem>
                    <MenuItem
                      _active={{ bg: "purple.100", color: "white" }}
                      _focus={{ bg: "transparent" }}
                      _hover={{ bg: "purple.100", color: "white" }}
                      onClick={() => handleUpdate(raf.id, raf.draw_date)}
                    >
                      Alterar Data e Hora
                    </MenuItem>
                    <MenuItem
                      _active={{ bg: "purple.100", color: "white" }}
                      _focus={{ bg: "transparent" }}
                      _hover={{ bg: "purple.100", color: "white" }}
                      onClick={() => handleJustification(raf.id)}
                    >
                      Cancelar Sorteio
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>
            ))}
          </>
        )}
      </Grid>

      <Modal
        isOpen={modalNumbers}
        onClose={() => setModalNumbers(false)}
        size="3xl"
      >
        <ModalOverlay />
        <ModalContent borderWidth="3px" borderColor="green.400">
          <ModalHeader>
            <Flex align="center">
              <Icon as={FaSortNumericDown} />
              <Text ml={3}>Gerenciar Números</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={5}>
            <Grid
              templateColumns={[
                "repeat(1, 1fr)",
                "1fr 2fr 1fr",
                "1fr 2fr 1fr",
                "1fr 2fr 1fr",
                "1fr 2fr 1fr",
              ]}
              gap="15px"
            >
              <FormControl>
                <Select
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  focusBorderColor="purple.400"
                  size="sm"
                >
                  <option value="number">Buscar por Número</option>
                  <option value="name">Buscar por Nome</option>
                  <option value="all">Todos os Números</option>
                </Select>
              </FormControl>
              <FormControl>
                <Input
                  focusBorderColor="purple.400"
                  placeholder="Busca por nome"
                  size="sm"
                  value={text}
                  onChange={(e) => setText(e.target.value.toUpperCase())}
                  isDisabled={search === "all" ? true : false}
                />
              </FormControl>
              <FormControl>
                <Button
                  isFullWidth
                  colorScheme="purple"
                  variant="outline"
                  leftIcon={<FaSearch />}
                  size="sm"
                  onClick={() => finderBySource()}
                >
                  Buscar
                </Button>
              </FormControl>
            </Grid>
            <Divider mt={3} mb={3} />
            <Grid
              templateColumns="repeat(auto-fit, minmax(80px, 80px))"
              gap="20px"
              justifyContent="center"
              justifyItems="center"
            >
              {numbersFind.length === 0 ? (
                <Spinner colorScheme="purple" size="lg" />
              ) : (
                <>
                  {numbersFind.map((num) => (
                    <Popover key={num.id} placement="auto">
                      <PopoverTrigger>
                        <Button
                          isFullWidth
                          colorScheme={handleColor(num.status)}
                          h="40px"
                          shadow="md"
                        >
                          {num.number}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent _focus={{ outline: "none" }} shadow="lg">
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>
                          {num.status === "paid_out"
                            ? "Número Ativado"
                            : "Ativar Número"}
                        </PopoverHeader>
                        <PopoverBody>
                          {num.status === "paid_out" ? (
                            <Text>
                              Cliente: <strong>{num.name}</strong>
                            </Text>
                          ) : (
                            <>
                              <Text>
                                Cliente: <strong>{num.name}</strong>
                              </Text>

                              <Text mt={5}>Deseja ativar este número?</Text>
                            </>
                          )}
                        </PopoverBody>
                        {num.status === "paid_out" ? (
                          ""
                        ) : (
                          <PopoverFooter d="flex" justifyContent="flex-end">
                            <Button
                              colorScheme="green"
                              size="sm"
                              leftIcon={<FaUnlock />}
                              isLoading={loadingNumber}
                              onClick={() => activateNumber(num.id)}
                            >
                              Ativar
                            </Button>
                          </PopoverFooter>
                        )}
                      </PopoverContent>
                    </Popover>
                  ))}
                </>
              )}
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalCancel}
        onClose={() => setModalCancel(false)}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent borderWidth="3px" borderColor="green.400">
          <ModalHeader>
            <Flex align="center">
              <Icon as={FaTrash} />
              <Text ml={3}>Cancelar Sorteio</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Justificativa</FormLabel>
              <Textarea
                focusBorderColor="purple.400"
                rows={6}
                resize="none"
                value={justification}
                onChange={(e) => setJustification(e.target.value.toUpperCase())}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="purple"
              leftIcon={<FaTrash />}
              isLoading={loadingJustify}
              onClick={() => sendCancel()}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={modalEdit} onClose={() => setModalEdit(false)} size="xs">
        <ModalOverlay />
        <ModalContent borderWidth="3px" borderColor="green.400">
          <ModalHeader>
            <Flex align="center">
              <Icon as={FaCalendarAlt} />
              <Text ml={3}>Alterar Data e Hora</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Data do Sorteio</FormLabel>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                customInput={<CustomInputPicker />}
                locale="pt_br"
                dateFormat="dd/MM/yyyy"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Hora do Sorteio</FormLabel>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                customInput={<CustomInputPicker />}
                locale="pt_br"
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Horário"
                dateFormat="h:mm aa"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="purple"
              leftIcon={<FaExchangeAlt />}
              isLoading={loading}
              onClick={() => updateDate()}
            >
              Alterar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={modalSlot} onClose={() => handleCloseDrawn()} size="lg">
        <ModalOverlay />
        <ModalContent borderWidth="3px" borderColor="green.400">
          <ModalHeader>Realizando Sorteio</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={5}>
            {drawn === true ? (
              <>
                <Lottie animation={Slot} width="50%" />
                <Flex direction="column" justify="center" align="center">
                  <Spinner size="xl" colorScheme="purple" />
                  <Text mt={2}>Sorteando...</Text>
                </Flex>
              </>
            ) : (
              <>
                <Lottie animation={Congrat} width="70%" />
                <Flex direction="column" justify="center" align="center">
                  {JSON.stringify(drawnNumber) !== "{}" ? (
                    <>
                      <Text mt={10} fontSize="xl">
                        Número Sorteado: <strong>{drawnNumber.number}</strong>
                      </Text>
                      <Text mt={1} fontSize="md" textAlign="center">
                        Cliente: <strong>{drawnNumber.name_client}</strong>
                      </Text>
                      <Text mt={1} fontSize="md" textAlign="center">
                        Telefone: <strong>{drawnNumber.phone_client}</strong>
                      </Text>
                      <Text mt={1} fontSize="md" textAlign="center">
                        Email: <strong>{drawnNumber.email_client}</strong>
                      </Text>
                    </>
                  ) : (
                    ""
                  )}
                </Flex>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <AlertDialog isOpen={alert} onClose={() => setAlert(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Realizar Sorteio
            </AlertDialogHeader>

            <AlertDialogBody>Deseja realizar este sorteio?</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                onClick={() => setAlert(false)}
                colorScheme="green"
                variant="outline"
              >
                Não
              </Button>
              <Button colorScheme="green" onClick={() => sendDrawn()} ml={3}>
                Sim
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
