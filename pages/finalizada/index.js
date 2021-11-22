import Header from '../../components/header';
import Footer from '../../components/footer';
import {
  Container,
  Box,
  Flex,
  Grid,
  useColorModeValue,
  Tag,
  Text,
  Heading,
  Center,
  Divider,
  Icon,
  Button,
} from '@chakra-ui/react';
import Image from 'next/image';
import {
  AiOutlineTrophy,
  AiOutlineUser,
  AiOutlineWhatsApp,
} from 'react-icons/ai';

export default function Finalizadas() {
  return (
    <>
      <Header />
      <Container mt={10} maxW="5xl">
        <Tag colorScheme="green" size="lg" fontWeight="bold" mb={10}>
          RIFA Nº 1
        </Tag>

        <Grid
          templateColumns={[
            '1fr',
            '1fr',
            '300px 1fr',
            '300px 1fr',
            '300px 1fr',
          ]}
          gap={10}
          justifyContent="center"
          justifyItems="center">
          <Box
            w="300px"
            rounded="xl"
            overflow="hidden"
            shadow="lg"
            borderWidth="1px"
            h="min-content">
            <Image
              width={300}
              height={300}
              src="https://img.freepik.com/psd-gratuitas/postagem-de-sorteio-no-instagram_442085-152.jpg?size=338&ext=jpg"
              layout="responsive"
              alt="PA Rifas, rifas online"
            />
          </Box>

          <Box>
            <Heading color={useColorModeValue('green.500', 'green.200')}>
              TÍTULO DA RIFA
            </Heading>

            <Text mt={5}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </Text>

            <Flex mt={10} align="center" fontSize="xl">
              <Icon
                as={AiOutlineUser}
                color={useColorModeValue('green.500', 'green.200')}
                fontSize="3xl"
                mr={5}
              />
              <Text>NATANAEL DOS SANTOS BEZERRA</Text>
            </Flex>

            <Grid templateColumns="repeat(2, 1fr)" gap={10} mt={5}>
              <Button
                leftIcon={<AiOutlineWhatsApp />}
                colorScheme="whatsapp"
                size="lg">
                Contactar Usuário
              </Button>{' '}
              <Button
                leftIcon={<AiOutlineWhatsApp />}
                colorScheme="whatsapp"
                size="lg">
                Contactar PA Rifas
              </Button>
            </Grid>

            <Flex
              mt={10}
              bg={useColorModeValue('red.500', 'red.200')}
              color={useColorModeValue('gray.100', 'gray.800')}
              justify="center"
              align="center"
              h="50px"
              rounded="xl"
              fontSize="lg">
              <Text>ESTADO ATUAL DA RIFA:</Text>
              <Text ml={5} fontWeight="bold">
                CANCELADA
              </Text>
            </Flex>
          </Box>
        </Grid>

        <Box rounded="xl" borderWidth="1px" shadow="lg" mt={10}>
          <Center p={3}>
            <Text textAlign="center" fontSize="lg" fontWeight="bold">
              JUSTIFICATIVA DO CANCELAMENTO
            </Text>
          </Center>
          <Divider />
          <Text p={3}>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here, content
            here', making it look like readable English.
          </Text>
        </Box>

        <Grid
          mt={10}
          templateColumns={[
            'repeat(1, 1fr)',
            'repeat(2, 1fr)',
            'repeat(3, 1fr)',
            'repeat(3, 1fr)',
            'repeat(3, 1fr)',
          ]}
          gap={5}
          justifyContent="center"
          justifyItems="center">
          <Box
            rounded="xl"
            bg={useColorModeValue('green.500', 'green.200')}
            shadow="lg">
            <Flex
              justify="center"
              align="center"
              color={useColorModeValue('gray.100', 'gray.800')}
              fontSize="xl"
              fontWeight="bold"
              p={2}>
              <Icon as={AiOutlineTrophy} />
              <Text>1º Prêmio</Text>
            </Flex>
            <Box pr={3} pl={3} pb={3}>
              <Flex
                bg={useColorModeValue('white', 'gray.800')}
                rounded="xl"
                p={3}
                justify="center"
                align="center"
                direction="column">
                <Text textAlign="center" fontSize="5xl">
                  <strong>300</strong>
                </Text>

                <Flex justify="center" align="center">
                  <Icon as={AiOutlineUser} mr={3} />
                  <Text fontWeight="semibold">NATANAEL DOS SANTOS BEZERRA</Text>
                </Flex>
              </Flex>
            </Box>
          </Box>
          <Box
            rounded="xl"
            bg={useColorModeValue('green.500', 'green.200')}
            shadow="lg">
            <Flex
              justify="center"
              align="center"
              color={useColorModeValue('gray.100', 'gray.800')}
              fontSize="xl"
              fontWeight="bold"
              p={2}>
              <Icon as={AiOutlineTrophy} />
              <Text>1º Prêmio</Text>
            </Flex>
            <Box pr={3} pl={3} pb={3}>
              <Flex
                bg={useColorModeValue('white', 'gray.800')}
                rounded="xl"
                p={3}
                justify="center"
                align="center"
                direction="column">
                <Text textAlign="center" fontSize="5xl">
                  <strong>300</strong>
                </Text>

                <Flex justify="center" align="center">
                  <Icon as={AiOutlineUser} mr={3} />
                  <Text fontWeight="semibold">NATANAEL DOS SANTOS BEZERRA</Text>
                </Flex>
              </Flex>
            </Box>
          </Box>
          <Box
            rounded="xl"
            bg={useColorModeValue('green.500', 'green.200')}
            shadow="lg">
            <Flex
              justify="center"
              align="center"
              color={useColorModeValue('gray.100', 'gray.800')}
              fontSize="xl"
              fontWeight="bold"
              p={2}>
              <Icon as={AiOutlineTrophy} />
              <Text>1º Prêmio</Text>
            </Flex>
            <Box pr={3} pl={3} pb={3}>
              <Flex
                bg={useColorModeValue('white', 'gray.800')}
                rounded="xl"
                p={3}
                justify="center"
                align="center"
                direction="column">
                <Text textAlign="center" fontSize="5xl">
                  <strong>300</strong>
                </Text>

                <Flex justify="center" align="center">
                  <Icon as={AiOutlineUser} mr={3} />
                  <Text fontWeight="semibold">NATANAEL DOS SANTOS BEZERRA</Text>
                </Flex>
              </Flex>
            </Box>
          </Box>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
