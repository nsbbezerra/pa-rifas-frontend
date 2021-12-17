import {
  Select,
  Grid,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { RiMailSendLine } from "react-icons/ri";
import api from "../configs/axios";

export default function Messages() {
  const toast = useToast();
  const [option, setOption] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
    });
  }

  async function Save() {
    setLoading(true);

    try {
      const response = await api.post("/message", {
        mode: option,
        name,
        text: message,
      });
      showToast(response.data.message, "success", "Sucesso");
      setLoading(false);
      setOption("");
      setName("");
      setMessage("");
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

  return (
    <>
      <Grid
        mt={10}
        templateColumns={["1fr", "1fr 3fr", "1fr 3fr", "1fr 3fr", "1fr 3fr"]}
        gap={5}
      >
        <FormControl>
          <FormLabel>Selecione uma Opção</FormLabel>
          <Select
            focusBorderColor="green.500"
            placeholder="Selecione uma Opção"
            value={option}
            onChange={(e) => setOption(e.target.value)}
          >
            <option value="suggestion">Sugestão</option>
            <option value="criticism">Crítica</option>
            <option value="praise">Elogio</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Insira seu Nome</FormLabel>
          <Input
            focusBorderColor="green.500"
            placeholder="Insira seu Nome"
            value={name}
            onChange={(e) => setName(e.target.value.toUpperCase())}
          />
        </FormControl>
      </Grid>
      <FormControl mt={5}>
        <FormLabel>Insira uma Mensagem</FormLabel>
        <Textarea
          focusBorderColor="green.500"
          placeholder="Insira uma Mensagem"
          rows={5}
          resize="none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </FormControl>

      <Button
        leftIcon={<RiMailSendLine />}
        colorScheme="green"
        size="lg"
        mt={5}
        isLoading={loading}
        onClick={() => Save()}
      >
        Enviar Mensagem
      </Button>
    </>
  );
}
