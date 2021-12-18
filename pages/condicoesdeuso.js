import {
  Container,
  Box,
  Text,
  Heading,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import HeaderApp from "../components/header";
import FooterApp from "../components/footer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "../components/sliders";
import Link from "next/link";

export default function TermosdeUso() {
  return (
    <>
      <HeaderApp />

      <Container maxW="5xl" mt={10}>
        <Breadcrumb mb={10} fontSize={["xx-small", "md", "md", "md", "md"]}>
          <BreadcrumbItem>
            <Link href="/" passHref>
              <a>
                <BreadcrumbLink>Início</BreadcrumbLink>
              </a>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <Link passHref href="/condicoesdeuso">
              <a>
                <BreadcrumbLink>Condições de Uso</BreadcrumbLink>
              </a>
            </Link>
          </BreadcrumbItem>
        </Breadcrumb>
        <Box borderWidth={"1px"} rounded="lg" p={20}>
          <Flex justify={"center"} align={"center"} direction={"column"}>
            <Heading fontSize={["3xl", "4xl", "4xl", "4xl", "4xl"]}>
              Condições de Uso
            </Heading>
            <Box
              bgGradient={useColorModeValue(
                "linear(to-r, green.500, orange.500)",
                "linear(to-r, green.200, orange.200)"
              )}
              w="200px"
              h="5px"
              mt={3}
              mb={3}
            />
          </Flex>

          <Box p={3} mt={10}>
            <Text textAlign="justify" mb={2}>
              O termo a seguir é um contrato aceito aos seus utilizadores,
              estando assim de acordo com as regras descritas no mesmo.
            </Text>
            <Text textAlign="justify" mb={2}>
              Ao utilizar o sistema PA Rifas, você declara-se de acordo com as
              regras vigentes.
            </Text>
            <Text textAlign="justify" mb={2}>
              Aos organizadores e usuários declaram-se integralmente
              responsáveis por todos os atos praticados ao utilizar o sistema PA
              Rifas, sendo também responsável pela veracidade das informações
              fornecidas.
            </Text>

            <Text textAlign="justify" mb={2}>
              Reservamo-nos o direito de efetuar o bloqueio, desativação ou
              exclusão no caso de descumprimento das regras impostas no presente
              termo.
            </Text>
            <Heading
              fontSize="2xl"
              color={useColorModeValue("green.500", "green.200")}
              mb={3}
              mt={10}
            >
              2. SOBRE O SERVIÇO
            </Heading>

            <Text textAlign="justify" mb={2}>
              O sistema PA Rifas foi desenvolvido a fim de possibilitar a
              criação de campanhas de arrecadações beneficiárias.
            </Text>
            <Text textAlign="justify" mb={2}>
              O sistema PA Rifas não se enquadra em uma plataforma de jogos. Os
              seus usuários e organizadores se conscientizam de que qualquer
              pagamento realizado é feito de forma espontânea e voluntária, não
              caracterizando relação com jogos de azar. A política de
              cancelamentos e reembolsos cabe à análise exclusiva da plataforma,
              isentando assim o criador da rifa.
            </Text>
            <Text textAlign="justify" mb={2}>
              Caso haja algum caso de reembolso ou cancelamento de rifas, a
              plataforma aplicará suas próprias políticas de ressarcimento.
            </Text>

            <Heading
              fontSize="2xl"
              color={useColorModeValue("green.500", "green.200")}
              mb={3}
              mt={10}
            >
              3. CONDIÇÕES GERAIS DE USO
            </Heading>
            <Text textAlign="justify" mb={2}>
              Aceite. Reconhece e concorda que ao utilizar o sistema PA Rifas,
              você estará de acordo independentemente de qualquer outro
              procedimento de aceitação a concordância total das regras
              descritas, em caso de não aceitação dos itens, diretrizes e
              condições previstas neste TERMO DE USO, você declara que não fará
              a utilização do sistema.
            </Text>
            <Text textAlign="justify" mb={2}>
              Responsabilidade. Reconhece e concorda que a utilização do sistema
              é feito por sua conta exclusiva, riscos e responsabilidades e se
              compromete a utilizar o sistema e todas as suas ferramentas de
              acordo com a legislação vigente e este TERMO DE USO, abstendo-se
              ao seu uso indevido para práticas de atividades ilícitas ou que de
              qualquer forma esteja em desacordo com os direitos de terceiros.
            </Text>
            <Text textAlign="justify" mb={2}>
              Usabilidade. Afirma que suas informações sigilosas de acesso ao
              sistema se manterão em segredo sendo assim de forma única e
              exclusiva a sua própria utilização, isentando o sistema PA Rifas
              de qualquer responsabilidade pelo uso indevido do sistema.
            </Text>

            <Heading
              fontSize="2xl"
              color={useColorModeValue("green.500", "green.200")}
              mb={3}
              mt={10}
            >
              4. CRIAÇÃO DAS ARRECADAÇÕES VOLUNTÁRIAS
            </Heading>

            <Text textAlign="justify" mb={2}>
              Ao criar uma arrecadação voluntária o organizador declara que
              todas as informações fornecidas, incluindo, informações pessoais e
              bancárias e outras informações confidenciais descritas de sua
              propriedade ou relacionadas são verdadeiras, bem como qualquer
              atualização de seus dados devem ser expressamente ajustados no
              sistema.
            </Text>
            <Text textAlign="justify" mb={2}>
              O uso do sistema é exclusivo para usuários e organizadores com 18
              anos ou mais.
            </Text>
            <Text textAlign="justify" mb={2}>
              Após criar a arrecadação não será possível editar todos os dados,
              a fim de garantir a coerência das informações e garantindo que não
              haverá troca de prêmios ou valores. No entanto o organizador
              poderá alterar fotos, datas e algumas outras informações que não
              ocasionará divergências da proposta descrita inicialmente,
              mediante petição à equipe do PA Rifas.
            </Text>
            <Text textAlign="justify" mb={2}>
              A criação da rifa terá uma comissão arrecadada pela plataforma,
              taxa de pagamentos bancários, todas estas taxas estão
              estabelecidas na seção de criação de Rifa.
            </Text>
            <Text textAlign="justify" mb={2}>
              O Valor arrecadado permanecerá bloqueado até o criador da Rifa
              confirmar o sorteio e indicar tanto por parte dele mesmo quanto
              por parte do sorteado a entrega e o recebimento do prêmio, esta
              confirmação se dará por fotos e vídeos, dependendo do que a equipe
              da PA Rifas requerer.
            </Text>

            <Heading
              fontSize="2xl"
              color={useColorModeValue("green.500", "green.200")}
              mb={3}
              mt={10}
            >
              5. CRÉDITOS DO ORGANIZADOR
            </Heading>

            <Text textAlign="justify" mb={2}>
              O organizador responsável poderá consultar seus créditos a
              qualquer momento, através das ferramentas disponíveis em nosso
              sistema ou outros meios que venhamos a disponibilizar.
            </Text>
            <Text textAlign="justify" mb={2}>
              Os créditos arrecadados pelo organizador não sofrerão qualquer
              tipo de correção monetária, acréscimo de juros ou qualquer tipo de
              atualização financeira, permanecendo inalterados pelo tempo que
              for necessário. O PA Rifas não terá responsabilidade pela
              desvalorização ou desatualização monetária dos créditos de
              arrecadação mantidos.
            </Text>
            <Text textAlign="justify" mb={2}>
              Aos organizadores fica de inteira responsabilidade sob o
              recebimento e confirmação dos números adquiridos pelos usuários, o
              nosso sistema é responsável por toda a transação ocorrida nas
              vendas das cotas.
            </Text>

            <Heading
              fontSize="2xl"
              color={useColorModeValue("green.500", "green.200")}
              mb={3}
              mt={10}
            >
              6. PARTICIPAÇÃO DOS USUÁRIOS VOLUNTÁRIOS
            </Heading>

            <Text textAlign="justify" mb={2}>
              O PA Rifas recomenda aos seus usuários que participem apenas das
              ações de usuários que ele conheça e tenha uma relação de
              confiança. O PA Rifas, apenas oferece o sistema como um serviço
              para criação e gestão das campanhas não cabendo-nos qualquer tipo
              de responsabilidade sobre as ações realizadas por terceiros, sendo
              elas de total responsabilidade de seus organizadores.
            </Text>
            <Text textAlign="justify" mb={2}>
              Responsabilidade pelos pagamentos. PIX, CARTÃO DE CRÉDITO E DÉBITO
              você concorda e reconhece que ao apoiar qualquer arrecadação, será
              feita de forma consciente e voluntária e de responsabilidade
              direta com os organizadores, portanto você é o único responsável
              pela referida doação que será efetuada de acordo com as
              informações fornecidas pelos organizadores.
            </Text>
            <Text textAlign="justify" mb={2}>
              Por isso, antes de efetuar uma doação o usuário deve procurar
              obter todas as informações junto ao organizador buscando a
              veracidade das informações, origem e procedência dos produtos,
              devendo avaliar possíveis risco por sua conta no caso de
              prosseguir com a transação.
            </Text>

            <Heading
              fontSize="2xl"
              color={useColorModeValue("green.500", "green.200")}
              mb={3}
              mt={10}
            >
              7. PROIBIÇÕES
            </Heading>

            <Text textAlign="justify" mb={2}>
              Não é permitido aos usuários e organizadores a utilização de
              contas fakes (falsas) com o intuito de prejudicar, enganar ou
              criar falsas expectativas aos usuários e organizadores.
            </Text>
            <Text textAlign="justify" mb={2}>
              Não serão permitidas ações que ofereçam premiações com os itens:
              Serviços e produtos eróticos ou de conteúdo explícito, explosivos,
              armas de fogo, armas brancas, simulacros, medicamentos, produtos
              químicos ou de quaisquer outras origens que a administração julgue
              inapropriado, bem como produtos sem nota fiscal.
            </Text>
            <Text textAlign="justify" mb={2}>
              Comprometimento. Compromete-se ao organizador a não transmitir,
              introduzir, difundir ou colocar à disposição de terceiros qualquer
              tipo de material ou informação (fotos, preços, mensagens, arquivos
              etc.) que sejam contrários a legislação e ao presente termo de
              uso.
            </Text>
            <Text textAlign="justify" mb={2}>
              Não será permitido qualquer tipo de preconceito ou informações de
              cunho preconceituoso, ofensivo, ou violento na descrição das
              ações.
            </Text>

            <Heading
              fontSize="2xl"
              color={useColorModeValue("green.500", "green.200")}
              mb={3}
              mt={10}
            >
              8. DIREITOS PA Rifas
            </Heading>
            <Text textAlign="justify" mb={2}>
              Remoção. O seu exclusivo critério, as ações que não estejam de
              acordo com este TERMO DE USO e as leis vigentes, reservando-se ao
              direito de exclusão, bloqueio ou desativação do usuário ou
              organizador infrator.
            </Text>
            <Text textAlign="justify" mb={2}>
              Validação. Com intuito de atender de melhor forma possível os
              requisitos de transparência e zelar pelo bom funcionamento do
              sistema, garantindo também a segurança de todos usuários e
              organizadores do sistema, podendo também executar a verificação e
              validação dos dados fornecidos a qualquer instante, essas
              validações não acarretam em qualquer compromisso, garantia,
              obrigação ou responsabilidade da PA Rifas, quanto a veracidade
              destas informações, que continuam sendo de responsabilidade de
              seus organizadores.
            </Text>
            <Text textAlign="justify" mb={2}>
              Disponibilidade de informações. O PA Rifas não obriga-se a
              disponibilizar informações ou backup das ações que já foram
              realizadas, expiradas ou desativadas por qualquer motivo.
            </Text>

            <Heading
              fontSize="2xl"
              color={useColorModeValue("green.500", "green.200")}
              mb={3}
              mt={10}
            >
              9. CUSTOS DE CRIAÇÃO, MANUTENÇÃO, GESTÃO E CANCELAMENTOS
            </Heading>
            <Text textAlign="justify" mb={2}>
              A criação, manutenção e gestão das ações possuem um preço fixo
              determinado para cada sorteio a ser ativado. Incluindo tarifas
              sobre pagamentos online conforme abaixo:
            </Text>
            <Text textAlign="justify" mb={2}>
              Todas as ações a serem ativadas terão uma comissão pré
              estabelecida pelo plataforma sobre o sorteio, que incidirá no
              valor arrecadado.
            </Text>
            <Text textAlign="justify" mb={2}>
              Cancelamentos. No caso de cancelamento por motivos do organizador
              não será repassado nenhum valor ao mesmo, porém, será sorteado um
              número de acordo com a Loteria Federal na data pré estabelecida
              pelo antigo organizador, o prêmio será 60% do valor arrecadado até
              o momento, o sorteio será realizado pela equipe da PA Rifas nas
              suas redes sociais.
            </Text>
            <Text textAlign="justify" mb={2}>
              Desativados. No caso de desativação por descumprimento das regras
              ou qualquer outro motivo que venha a prejudicar as partes
              envolvidas, fica de inteira responsabilidade da PA Rifas,
              continuar o sorteio sendo que o prêmio passará a ser 60% do valor
              arrecadado até o momento do sorteio, o número ganhador será
              sorteado pela Loteria Federal.
            </Text>
            <Text textAlign="justify" mb={2}>
              Qualquer ação que venha a ser cancelada ou desativada não haverá
              repasse do valor arrecadado até o momento do cancelamento ou
              desativação.
            </Text>

            <Heading
              fontSize="2xl"
              color={useColorModeValue("green.500", "green.200")}
              mb={3}
              mt={10}
            >
              10. TRANSFERÊNCIA DOS VALORES ARRECADADOS
            </Heading>

            <Text textAlign="justify" mb={2}>
              Após a conclusão do sorteio, o PA Rifas entrará em contato com o
              ganhador para confirmar o recebimento do prêmio, assim como com o
              organizador.
            </Text>
            <Text textAlign="justify" mb={2}>
              O ganhador terá 5 dias para manifestar-se sobre o recebimento do
              prêmio ou qualquer irregularidade. Caso o ganhador não se
              manifeste-se entende-se que não houve desacordos e ele concorda
              com o prêmio recebido.
            </Text>

            <Heading
              fontSize="2xl"
              color={useColorModeValue("green.500", "green.200")}
              mb={3}
              mt={10}
            >
              11. GARANTIAS E RESPONSABILIDADES
            </Heading>

            <Text textAlign="justify" mb={2}>
              Disponibilidade de Nosso Atendimento. Nosso sistema depende de
              fatores externos que fogem ao nosso controle, tais como conexão de
              internet dos utilizadores, dispositivo utilizado para acesso.
              Dessa forma, o PA Rifas não garante a disponibilidade, acesso e
              continuidade das funcionalidades do sistema, não sendo responsável
              por nenhum dano ou prejuízo causado aos utilizadores em caso de
              indisponibilidade.
            </Text>
            <Text textAlign="justify" mb={2}>
              Conduta dos utilizadores. O PA Rifas não garante que os seus
              utilizadores utilizem o sistema em conformidade com a lei e ao
              presente termo do mesmo modo não garantimos a veracidade e
              exatidão, esgotamento ou autenticidades dos dados disponibilizados
              pelos seus utilizadores. O mau uso da plataforma é de total
              responsabilidade de seus utilizadores, sob pena de lei e aos
              termos descritos.
            </Text>
            <Text textAlign="justify" mb={2}>
              O PA Rifas não tem vínculo com nenhum de seus utilizadores, sendo
              assim a PA Rifas não se responsabilidade pelos negócios realizados
              entre seus usuários e organizadores, ambas as partes são
              responsáveis pelas próprias ações ou emissões, bem como qualquer
              erro, ou fraude.
            </Text>
            <Text textAlign="justify" mb={2}>
              Tributação. Cada organizador e usuário são responsáveis pelas
              obrigações tributárias decorrentes de suas ações, respondendo a PA
              Rifas apenas pelas atividades desenvolvidas por si própria,
              observando os limites legais.
            </Text>
            <Text textAlign="justify" mb={2}>
              Você concorda e reconhece que estão protegidos por direitos de
              propriedade intelectual do PA Rifas ou de terceiros e totalidade.
            </Text>

            <Heading
              fontSize="2xl"
              color={useColorModeValue("green.500", "green.200")}
              mb={3}
              mt={10}
            >
              12. DISPOSIÇÕES GERAIS
            </Heading>
            <Text textAlign="justify" mb={2}>
              O termo de uso apresentado rege a relação entre usuários e
              organizadores do sistema PA Rifas, que poderá ser atualizado junto
              as demais regras vigentes nesse termo e as demais políticas
              relacionadas ao sistema PA Rifas. Havendo alterações das regras,
              ferramentas ou utilidades tais alterações entrarão em vigor
              imediatamente, sendo de responsabilidade de seus utilizadores a
              verificação de atualizações informadas no sistema.
            </Text>
            <Text textAlign="justify" mb={2}>
              Direito de exclusão e solicitação de documentos. O sistema PA
              Rifas reserva o direito de recusar, alterar ou desativar o acesso
              ao sistema de qualquer utilizador que descumpra os termos sem a
              necessidade de um aviso prévio, bem como a solicitação de
              atualização de documentos e solicitação de documentos
              complementares, quando entender-se necessário para manutenção do
              cadastro dos seus utilizadores.
            </Text>
            <Text textAlign="justify" mb={2}>
              Em caso de remoção do sistema e/ou suspensão ou cancelamentos por
              descumprimentos as regras vigentes ao presente termo de uso,
              eventuais valores ou taxas pagas não serão reembolsadas.
            </Text>
            <Text textAlign="justify" mb={2}>
              Menores de idade. O uso do sistema fica restrito aos utilizadores
              com idade igual ou superior a 18 anos de idade.
            </Text>
            <Text textAlign="justify" mb={2}>
              Prazo de utilização. A utilização do sistema PA Rifas fica
              definida por tempo indeterminado aos organizadores sem prejuízo as
              disposições anteriores, o PA Rifas reserva-se o direito de decidir
              sobre o encerramento, suspensão ou interrupção das ferramentas
              fornecidas, podendo fazê-lo unilateralmente e a qualquer momento
              sem obrigatoriedade de aviso prévio aos utilizadores.
            </Text>
            <Text textAlign="justify" mb={2}>
              Renúncia ou desacordo das disposições. Qualquer omissão ou
              tolerância na exigência do fiel cumprimento do presente termo de
              uso ou das prerrogativas dele decorrentes, não constituirá novação
              ou renúncia, nem afetará o direito do PA Rifas em exercê-lo a
              qualquer instante. A renúncia ou desacordo desses direitos somente
              será válida se formalizada por escrito, bem como a nulidade ou
              invalidez de qualquer previsão desse termo de uso não prejudicarão
              a validade e eficácia das demais disposições.
            </Text>
          </Box>
        </Box>
      </Container>

      <FooterApp />
    </>
  );
}
