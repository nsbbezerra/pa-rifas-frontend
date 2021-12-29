import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  useToast,
} from "@chakra-ui/react";
import { Form } from "@unform/web";
import { AiFillSave } from "react-icons/ai";
import Input from "./input";
import MaskedInput from "./maskInput";
import Select from "./select";
import * as Yup from "yup";
import api from "../configs/axios";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Register({ raffle }) {
  const toast = useToast();
  const { push } = useRouter();

  const [loading, setLoading] = useState(false);

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
    });
  }

  async function handleSubmit(data) {
    setLoading(true);
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Insira seu nome"),
        cpf: Yup.string().required("Insira seu CPF"),
        phone: Yup.string().required("Insira seu Telefone"),
        email: Yup.string()
          .email("Insira um email válido")
          .required("Insira seu email"),
        street: Yup.string().required("Insira o nome da rua"),
        number: Yup.string().required("Insira o número da residência"),
        district: Yup.string().required("Insira o Bairro"),
        cep: Yup.string().required("Insira seu CEP"),
        city: Yup.string().required("Insira sua Cidade"),
        state: Yup.string().required("Insira seu Estado"),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const response = await api.post("/clients", {
        name: data.name,
        cpf: data.cpf,
        phone: data.phone,
        email: data.email,
        street: data.street,
        number: data.number,
        comp: data.comp,
        district: data.district,
        cep: data.cep,
        city: data.city,
        state: data.state,
      });
      showToast(response.data.message, "success", "Sucesso");
      setLoading(false);
      if (raffle) {
        push(`/rifa/${raffle}`);
      }
    } catch (error) {
      setLoading(false);
      if (error instanceof Yup.ValidationError) {
        showToast(error.errors, "warning", "Atenção");
      }
    }
  }

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel mb={0}>Nome Completo</FormLabel>
          <Input name={"name"} type="text" placeholder="Nome Completo" />
        </FormControl>

        <Grid
          templateColumns={[
            "1fr",
            "repeat(2, 1fr)",
            "repeat(2, 1fr)",
            "repeat(2, 1fr)",
            "repeat(2, 1fr)",
          ]}
          gap={4}
          mt={4}
        >
          <FormControl isRequired>
            <FormLabel mb={0}>CPF</FormLabel>
            <MaskedInput name={"cpf"} placeholder="CPF" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel mb={0}>Telefone</FormLabel>
            <MaskedInput name={"phone"} placeholder="Telefone" />
          </FormControl>
        </Grid>

        <FormControl isRequired mt={4}>
          <FormLabel mb={0}>Email</FormLabel>
          <Input name={"email"} type="text" placeholder="Email" />
        </FormControl>

        <Grid
          templateColumns={["1fr", "3fr 1fr", "3fr 1fr", "3fr 1fr", "3fr 1fr"]}
          gap={4}
          mt={4}
        >
          <FormControl isRequired>
            <FormLabel mb={0}>
              Logradouro - Rua, Avenida, Alameda, etc...
            </FormLabel>
            <Input
              name={"street"}
              type="text"
              placeholder="Logradouro - Rua, Avenida, Alameda, etc..."
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel mb={0}>Número</FormLabel>
            <Input name={"number"} type="text" placeholder="Número" />
          </FormControl>
        </Grid>

        <Grid
          templateColumns={["1fr", "1fr 1fr", "1fr 1fr", "1fr 1fr", "1fr 1fr"]}
          gap={4}
          mt={4}
        >
          <FormControl>
            <FormLabel mb={0}>Referência</FormLabel>
            <Input name={"comp"} type="text" placeholder="Referência" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel mb={0}>Bairro</FormLabel>
            <Input name={"district"} type="text" placeholder="Bairro" />
          </FormControl>
        </Grid>

        <Grid
          templateColumns={[
            "1fr",
            "1fr 2fr 1fr",
            "1fr 2fr 1fr",
            "1fr 2fr 1fr",
            "1fr 2fr 1fr",
          ]}
          gap={4}
          mt={4}
        >
          <FormControl isRequired>
            <FormLabel mb={0}>CEP</FormLabel>
            <MaskedInput name={"cep"} placeholder="CEP" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel mb={0}>Cidade</FormLabel>
            <Input name={"city"} type="text" placeholder="Cidade" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel mb={0}>Estado</FormLabel>
            <Select name={"state"} type="text" placeholder="Estado" />
          </FormControl>
        </Grid>

        <Button
          type="submit"
          leftIcon={<AiFillSave />}
          colorScheme={"green"}
          mt={10}
          isLoading={loading}
          size={"lg"}
        >
          Cadastrar
        </Button>
      </Form>
    </>
  );
}
