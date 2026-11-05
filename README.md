# GEPAA 2026 — Sistema de Avaliação das Atividades
### SENAI Carlos Tannhauser | Santa Cruz do Sul — RS

## Apresentação

O Sistema de Avaliação das Atividades GEPAA 2026 foi desenvolvido com a finalidade de digitalizar a coleta, a organização e a análise das avaliações relacionadas às ações do **Grupo Educacional de Prevenção de Acidentes e Assédio (GEPAA)** do SENAI Carlos Tannhauser, em Santa Cruz do Sul, Rio Grande do Sul.

A plataforma será utilizada para registrar as percepções de alunos, instrutores e colaboradores sobre as atividades educativas, ciclos temáticos, visitas técnicas, eventos e capacitações promovidas pelo grupo.

Sua utilização também está prevista para o **Mundo SENAI**, permitindo que os participantes acessem o formulário por meio de um QR Code e registrem suas avaliações diretamente em seus dispositivos.

## Objetivos

O sistema tem como principais objetivos:

- Digitalizar o processo de avaliação das atividades desenvolvidas pelo GEPAA.
- Centralizar e organizar as respostas dos participantes.
- Contabilizar os formulários efetivamente enviados e as alternativas selecionadas em cada questão.
- Identificar percepções sobre segurança, prevenção de acidentes, prevenção ao assédio e bem-estar.
- Consolidar os resultados das ações educativas e capacitações.
- Facilitar a interpretação dos dados por meio de indicadores e gráficos.
- Disponibilizar relatórios para apoiar a análise e o planejamento das próximas atividades do GEPAA.

## Formulário de avaliação

O formulário digital mantém como referência o documento institucional **Formulário de Avaliação das Atividades GEPAA 2026**, preservando sua organização temática e seus cinco blocos de avaliação.

**Bloco 1 — Identificação do Respondente**

Registro do perfil do participante, curso ou área de atuação e turno.

**Bloco 2 — Avaliação dos Ciclos de Conversas Seguras**

Avaliação geral dos critérios de clareza, didática, relevância, dinâmica, engajamento e duração das abordagens, além da avaliação dos ciclos temáticos:

- Esse Lance é Seguro;
- Alunos Novos;
- Vale Dar um Jeitinho?;
- Jogo Limpo da Segurança;
- Cuide de Você.

**Bloco 3 — Visitas Técnicas, Eventos e Capacitações**

Registro das avaliações referentes às atividades de Estatísticas de Segurança, Cultura de Segurança do Trabalho, CVV, Segurança Digital e Primeiros Socorros.

**Bloco 4 — Percepção de Mudança de Comportamento e Cultura**

Identificação da percepção dos participantes sobre mudanças nas práticas de segurança, a proposta gamificada Copa da Segurança 2026 e as abordagens relacionadas à prevenção ao assédio e à comunicação respeitosa.

**Bloco 5 — Sugestões, Elogios e Críticas**

Coleta de comentários e contribuições sobre as ações realizadas em 2026 e propostas para o próximo ciclo de atividades.

## Registro e contabilização das avaliações

Cada formulário enviado com sucesso é registrado individualmente no banco de dados da plataforma.

O sistema permite consolidar informações como:

- Total de avaliações recebidas;
- Distribuição dos perfis dos participantes;
- Distribuição por curso, área e turno;
- Médias das avaliações gerais, considerando a escala de 1 a 5;
- Quantidade de respostas por alternativa nos ciclos temáticos;
- Resultados das avaliações das visitas, eventos e capacitações;
- Percepção dos participantes sobre mudanças de comportamento;
- Sugestões, elogios e comentários registrados.

A contabilização das alternativas considera as marcações efetivamente registradas em cada questão. Nos grupos que permitem múltiplas seleções, a soma das marcações poderá ser superior ao total de formulários recebidos.

**Critério de contabilização:** o número total de avaliações representa a quantidade de envios registrados com sucesso, não a quantidade de pessoas que acessaram o site ou escanearam o QR Code.

## Painel administrativo e análise dos resultados

A plataforma disponibiliza uma área administrativa destinada aos responsáveis autorizados pelo acompanhamento das avaliações.

Por meio desse ambiente, é possível consultar os indicadores consolidados, visualizar gráficos, acompanhar as respostas individuais e realizar a exportação dos dados.

O painel contempla:

- Indicadores quantitativos das avaliações;
- Médias e distribuições das notas;
- Gráficos dos ciclos temáticos;
- Resultados das atividades e capacitações;
- Consulta às respostas individuais;
- Acesso às sugestões, elogios e críticas.

O acesso administrativo é protegido por autenticação e autorização específica no banco de dados.

## Exportação de relatórios

Para facilitar a análise e a documentação dos resultados, o sistema disponibiliza duas modalidades de exportação:

**Relatório DOCX — Microsoft Word**

Geração de um documento consolidado contendo informações estatísticas, tabelas, gráficos e respostas abertas, permitindo a elaboração de registros e apresentações dos resultados das ações GEPAA.

**Exportação CSV**

Geração de um arquivo com os registros individuais das avaliações, permitindo a abertura em programas de planilhas eletrônicas e a realização de análises complementares.

Os documentos podem ser utilizados como material de apoio para a equipe responsável pelo acompanhamento e planejamento das atividades.

## Tecnologias e serviços utilizados

A plataforma utiliza tecnologias de desenvolvimento web e serviços de infraestrutura:

- **HTML5:** estruturação do formulário e do painel administrativo.
- **CSS3:** apresentação visual, identidade gráfica e adaptação a diferentes dispositivos.
- **JavaScript:** validação, processamento, comunicação com o banco de dados e geração dos relatórios.
- **GitHub Pages:** hospedagem da aplicação web.
- **Supabase:** armazenamento das avaliações e gerenciamento de autenticação.
- **PostgreSQL:** gerenciamento dos registros armazenados.
- **Chart.js:** representação gráfica dos resultados.
- **docx:** geração de documentos compatíveis com Microsoft Word.

## Privacidade e segurança das informações

O repositório público contém os arquivos necessários para a disponibilização da aplicação, mas não é utilizado para armazenar as avaliações dos participantes.

Os registros são armazenados separadamente no banco de dados Supabase, com políticas de segurança em nível de linha (Row Level Security — RLS).

A consulta às respostas é restrita aos usuários administrativos devidamente autenticados e autorizados.

O formulário não solicita identificação nominal dos participantes. Entretanto, recomenda-se não inserir informações pessoais, matrículas, telefones ou outros dados identificáveis nos campos destinados a comentários.

As informações coletadas devem ser utilizadas exclusivamente para as finalidades educativas e institucionais autorizadas, observando as orientações de privacidade e proteção de dados aplicáveis ao SENAI-RS.

## Utilização durante o Mundo SENAI

Durante o Mundo SENAI, em Santa Cruz do Sul, o formulário poderá ser disponibilizado por meio de QR Code, facilitando o acesso dos participantes à avaliação digital.

Para assegurar a qualidade da coleta, recomenda-se:

- Disponibilizar o QR Code em local visível e de fácil acesso;
- Orientar os participantes sobre a finalidade da avaliação;
- Solicitar que cada participante envie apenas um formulário;
- Confirmar a mensagem de recebimento após o envio;
- Acompanhar a contabilização pelo painel administrativo;
- Verificar periodicamente o funcionamento do formulário e da conexão com o banco de dados.

Após o encerramento da coleta, os resultados poderão ser consolidados e exportados para documentação e análise pela equipe responsável.

---

## Desenvolvimento e responsabilidade pelo projeto

**Desenvolvido por Arthur Santos Lopes**

Representante do Grupo Educacional de Prevenção de Acidentes e Assédio (GEPAA) da turma do curso **Programador Full-Stack**, no SENAI Carlos Tannhauser, em Santa Cruz do Sul — RS.

O desenvolvimento da plataforma tem como propósito contribuir para a organização, o acompanhamento e a avaliação das atividades do GEPAA, utilizando recursos de tecnologia e desenvolvimento de software para facilitar a coleta e a interpretação das percepções da comunidade escolar.

**Projeto:** Sistema de Avaliação das Atividades GEPAA 2026  
**Unidade:** SENAI Carlos Tannhauser  
**Município:** Santa Cruz do Sul — Rio Grande do Sul  
**Evento de utilização:** Mundo SENAI 2026

---

*Documento de apresentação e referência do sistema de avaliação GEPAA 2026.*
