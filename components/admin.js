import { Flex, Heading } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";

import ShowRaffles from "../components/raffles";

export default function Admin({ info }) {
  const { data } = useFetch(`/findRafflesAdmin/${info}`);

  const [raffles, setRaffles] = useState([]);

  useEffect(() => {
    if (data !== undefined) {
      setRaffles(data);
    }
  }, [data]);

  return (
    <>
      {raffles.length === 0 ? (
        <Flex align="center" justify="center">
          <Heading fontSize="md" textAlign="center">
            Nenhum sorteio para mostrar
          </Heading>
        </Flex>
      ) : (
        <ShowRaffles raffle={raffles} destination="gerenciar/administrador" />
      )}
    </>
  );
}
