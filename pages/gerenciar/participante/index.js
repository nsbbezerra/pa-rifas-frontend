import Header from '../../../components/header';
import Footer from '../../../components/footer';
import {
  Button,
  Container,
  Box,
  Flex,
  Grid,
  Heading,
  HStack,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  useColorMode,
  Tag,
  useColorModeValue,
  Icon,
  Divider,
  Center,
} from '@chakra-ui/react';
import Image from 'next/image';
import {AiOutlineTrophy} from 'react-icons/ai';

export default function GerenciarPartitipante() {
  const {colorMode} = useColorMode();

  return (
    <>
      <Header />

      <Container maxW="6xl" mt={10}>
        <Tag colorScheme="green" size="lg" fontWeight="bold" mb={10}>
          RIFA Nº 1
        </Tag>

        <Grid
          templateColumns={[
            '1fr',
            '300px 1fr',
            '300px 1fr',
            '300px 1fr',
            '300px 1fr',
          ]}
          gap={'10'}>
          <Box
            rounded="xl"
            overflow="hidden"
            borderWidth="1px"
            shadow="lg"
            h="min-content"
            w="300px">
            <Box>
              <Image
                width={300}
                height={300}
                src="https://img.freepik.com/psd-gratuitas/postagem-de-sorteio-no-instagram_442085-152.jpg?size=338&ext=jpg"
                layout="responsive"
                alt="PA Rifas, rifas online"
              />
            </Box>

            <Box p={4}>
              <Heading
                fontSize="2xl"
                color={colorMode === 'light' ? 'green.500' : 'green.200'}>
                TÍTULO DO SORTEIO
              </Heading>
              <Text fontSize="md" mt={3}>
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout
              </Text>

              <HStack mt={3}>
                <Stat>
                  <StatLabel>Valor</StatLabel>
                  <StatNumber>R$ 10,00</StatNumber>
                </Stat>

                <Stat>
                  <StatLabel>Sorteio</StatLabel>
                  <StatNumber>11/11/1111</StatNumber>
                </Stat>
              </HStack>
            </Box>
          </Box>

          <Box>
            <Heading
              fontSize="2xl"
              color={useColorModeValue('green.500', 'green.200')}>
              PREMIAÇÃO
            </Heading>
            <Box
              bgGradient={
                colorMode === 'light'
                  ? 'linear(to-r, green.500, orange.500)'
                  : 'linear(to-r, green.200, orange.200)'
              }
              w="135px"
              h="3px"
              mt={1}
            />

            <Grid
              templateColumns={[
                'repeat(2, 1fr)',
                'repeat(3, 1fr)',
                'repeat(3, 1fr)',
                'repeat(4, 1fr)',
                'repeat(5, 1fr)',
              ]}
              gap={5}
              mt={5}
              justifyContent="center">
              <Flex
                rounded="xl"
                shadow="lg"
                borderWidth="1px"
                direction="column"
                justify="center"
                align="center"
                h="min-content">
                <Flex align="center">
                  <Icon as={AiOutlineTrophy} />
                  <Heading fontSize="sm" textAlign="center" p={2} w="100%">
                    1º PRÊMIO
                  </Heading>
                </Flex>
                <Divider />
                <Text fontSize="sm" p={2}>
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                </Text>
              </Flex>

              <Flex
                rounded="xl"
                shadow="lg"
                borderWidth="1px"
                direction="column"
                justify="center"
                align="center"
                h="min-content">
                <Flex align="center">
                  <Icon as={AiOutlineTrophy} />
                  <Heading fontSize="sm" textAlign="center" p={2} w="100%">
                    2º PRÊMIO
                  </Heading>
                </Flex>
                <Divider />
                <Text fontSize="sm" p={2}>
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                </Text>
              </Flex>

              <Flex
                rounded="xl"
                shadow="lg"
                borderWidth="1px"
                direction="column"
                justify="center"
                align="center"
                h="min-content">
                <Flex align="center">
                  <Icon as={AiOutlineTrophy} />
                  <Heading fontSize="sm" textAlign="center" p={2} w="100%">
                    3º PRÊMIO
                  </Heading>
                </Flex>
                <Divider />
                <Text fontSize="sm" p={2}>
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                </Text>
              </Flex>

              <Flex
                rounded="xl"
                shadow="lg"
                borderWidth="1px"
                direction="column"
                justify="center"
                align="center"
                h="min-content">
                <Flex align="center">
                  <Icon as={AiOutlineTrophy} />
                  <Heading fontSize="sm" textAlign="center" p={2} w="100%">
                    4º PRÊMIO
                  </Heading>
                </Flex>
                <Divider />
                <Text fontSize="sm" p={2}>
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                </Text>
              </Flex>
              <Flex
                rounded="xl"
                shadow="lg"
                borderWidth="1px"
                direction="column"
                justify="center"
                align="center"
                h="min-content">
                <Flex align="center">
                  <Icon as={AiOutlineTrophy} />
                  <Heading fontSize="sm" textAlign="center" p={2} w="100%">
                    5º PRÊMIO
                  </Heading>
                </Flex>
                <Divider />
                <Text fontSize="sm" p={2}>
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                </Text>
              </Flex>
            </Grid>

            <Heading
              fontSize="2xl"
              color={useColorModeValue('green.500', 'green.200')}
              mt={10}>
              MEUS NÚMEROS
            </Heading>
            <Box
              bgGradient={
                colorMode === 'light'
                  ? 'linear(to-r, green.500, orange.500)'
                  : 'linear(to-r, green.200, orange.200)'
              }
              w="185px"
              h="3px"
              mt={1}
            />

            <Grid
              templateColumns={[
                'repeat(1, 1fr)',
                'repeat(2, 1fr)',
                'repeat(2, 1fr)',
                'repeat(2, 1fr)',
                'repeat(3, 1fr)',
              ]}
              gap={5}
              mt={5}
              justifyContent="center">
              <Box
                rounded="xl"
                shadow="lg"
                borderWidth="1px"
                bg={useColorModeValue('green.500', 'green.200')}>
                <Center p={2}>
                  <Text color={useColorModeValue('gray.100', 'gray.800')}>
                    COMPRA NÚMERO: <strong>1</strong>
                  </Text>
                </Center>
                <Box pr={2} pl={2} pb={2}>
                  <Grid
                    bg={useColorModeValue('white', 'gray.800')}
                    rounded="xl"
                    p={3}
                    templateColumns="repeat(3, 1fr)"
                    gap={2}>
                    <Flex
                      w="100%"
                      h="40px"
                      rounded="xl"
                      justify="center"
                      align="center"
                      bg={useColorModeValue('orange.500', 'orange.200')}
                      color={useColorModeValue('gray.100', 'gray.800')}
                      fontWeight="700">
                      300
                    </Flex>
                    <Flex
                      w="100%"
                      h="40px"
                      rounded="xl"
                      justify="center"
                      align="center"
                      bg={useColorModeValue('orange.500', 'orange.200')}
                      color={useColorModeValue('gray.100', 'gray.800')}
                      fontWeight="700">
                      300
                    </Flex>
                    <Flex
                      w="100%"
                      h="40px"
                      rounded="xl"
                      justify="center"
                      align="center"
                      bg={useColorModeValue('orange.500', 'orange.200')}
                      color={useColorModeValue('gray.100', 'gray.800')}
                      fontWeight="700">
                      300
                    </Flex>
                  </Grid>
                </Box>
                <Flex
                  justify="space-between"
                  align="center"
                  pr={3}
                  pl={3}
                  pb={2}
                  color={useColorModeValue('gray.100', 'gray.800')}>
                  <Text>Valor da Compra</Text>
                  <Text fontWeight="bold">R$ 300,00</Text>
                </Flex>
              </Box>
              <Box
                rounded="xl"
                shadow="lg"
                borderWidth="1px"
                bg={useColorModeValue('green.500', 'green.200')}>
                <Center p={2}>
                  <Text color={useColorModeValue('gray.100', 'gray.800')}>
                    COMPRA NÚMERO: <strong>1</strong>
                  </Text>
                </Center>
                <Box pr={2} pl={2} pb={2}>
                  <Grid
                    bg={useColorModeValue('white', 'gray.800')}
                    rounded="xl"
                    p={3}
                    templateColumns="repeat(3, 1fr)"
                    gap={2}>
                    <Flex
                      w="100%"
                      h="40px"
                      rounded="xl"
                      justify="center"
                      align="center"
                      bg={useColorModeValue('orange.500', 'orange.200')}
                      color={useColorModeValue('gray.100', 'gray.800')}
                      fontWeight="700">
                      300
                    </Flex>
                    <Flex
                      w="100%"
                      h="40px"
                      rounded="xl"
                      justify="center"
                      align="center"
                      bg={useColorModeValue('orange.500', 'orange.200')}
                      color={useColorModeValue('gray.100', 'gray.800')}
                      fontWeight="700">
                      300
                    </Flex>
                    <Flex
                      w="100%"
                      h="40px"
                      rounded="xl"
                      justify="center"
                      align="center"
                      bg={useColorModeValue('orange.500', 'orange.200')}
                      color={useColorModeValue('gray.100', 'gray.800')}
                      fontWeight="700">
                      300
                    </Flex>
                  </Grid>
                </Box>
                <Flex
                  justify="space-between"
                  align="center"
                  pr={3}
                  pl={3}
                  pb={2}
                  color={useColorModeValue('gray.100', 'gray.800')}>
                  <Text>Valor da Compra</Text>
                  <Text fontWeight="bold">R$ 300,00</Text>
                </Flex>
              </Box>
              <Box
                rounded="xl"
                shadow="lg"
                borderWidth="1px"
                bg={useColorModeValue('green.500', 'green.200')}>
                <Center p={2}>
                  <Text color={useColorModeValue('gray.100', 'gray.800')}>
                    COMPRA NÚMERO: <strong>1</strong>
                  </Text>
                </Center>
                <Box pr={2} pl={2} pb={2}>
                  <Grid
                    bg={useColorModeValue('white', 'gray.800')}
                    rounded="xl"
                    p={3}
                    templateColumns="repeat(3, 1fr)"
                    gap={2}>
                    <Flex
                      w="100%"
                      h="40px"
                      rounded="xl"
                      justify="center"
                      align="center"
                      bg={useColorModeValue('orange.500', 'orange.200')}
                      color={useColorModeValue('gray.100', 'gray.800')}
                      fontWeight="700">
                      300
                    </Flex>
                    <Flex
                      w="100%"
                      h="40px"
                      rounded="xl"
                      justify="center"
                      align="center"
                      bg={useColorModeValue('orange.500', 'orange.200')}
                      color={useColorModeValue('gray.100', 'gray.800')}
                      fontWeight="700">
                      300
                    </Flex>
                    <Flex
                      w="100%"
                      h="40px"
                      rounded="xl"
                      justify="center"
                      align="center"
                      bg={useColorModeValue('orange.500', 'orange.200')}
                      color={useColorModeValue('gray.100', 'gray.800')}
                      fontWeight="700">
                      300
                    </Flex>
                  </Grid>
                </Box>
                <Flex
                  justify="space-between"
                  align="center"
                  pr={3}
                  pl={3}
                  pb={2}
                  color={useColorModeValue('gray.100', 'gray.800')}>
                  <Text>Valor da Compra</Text>
                  <Text fontWeight="bold">R$ 300,00</Text>
                </Flex>
              </Box>
            </Grid>
          </Box>
        </Grid>
      </Container>

      <Footer />
    </>
  );
}
