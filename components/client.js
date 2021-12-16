import { Flex, Heading } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";

import ShowRaffles from "../components/rafflesAdmin";

export default function Client({ info }) {
  const { data } = useFetch(`/findRafflesClient/${info}`);
  const [raffles, setRaffles] = useState([]);

  useEffect(() => {
    if (data !== undefined) {
      setRaffles(data);
    }
  }, [data]);

  return (
    <>
      <ShowRaffles raffle={raffles} destination="gerenciar/participante" />
    </>
  );
}
