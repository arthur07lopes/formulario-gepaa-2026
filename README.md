# GEPAA 2026 — SENAI Carlos Tannhauser

Formulário público + painel administrativo com Supabase + exportação de relatórios DOCX e CSV.

## Estrutura

```text
formulario-gepaa-2026/
├── index.html
├── styles.css
├── script.js
├── admin.html
├── admin.css
├── admin.js
├── database/
│   └── supabase.js
├── reports/
│   └── gerar-relatorio.js
├── assets/
│   ├── gepaa-logo.png
│   ├── unidade-senai-aerea.jpg
│   └── unidade-senai-fachada.jpg
└── supabase/
    └── schema.sql
```

## Antes de publicar

1. Crie um projeto no Supabase.
2. Abra **SQL Editor** e execute o conteúdo completo de `supabase/schema.sql`.
3. No Supabase, abra **Project Settings → API Keys** e copie a **Project URL** e a **Publishable key** (`sb_publishable_...`).
4. Cole esses dois valores em `database/supabase.js`, nos campos `projectUrl` e `publishableKey`.
5. Não copie a **Secret key** (`sb_secret_...`) nem a antiga `service_role` para arquivos do site. O repositório será público.
6. Em **Authentication → Settings**, desative o cadastro público de usuários (Sign-ups), se a opção estiver habilitada. Isso não impede o login de contas convidadas.
7. Defina a URL principal em **Authentication → URL Configuration** como o endereço GitHub Pages e inclua-a nas URLs de redirecionamento permitidas.
8. Convide a professora pelo Supabase Dashboard: **Authentication → Users → Add user → Send invitation**. Ela deverá concluir o convite e definir a própria senha.
9. No SQL Editor, autorize a conta da professora. Substitua o e-mail de exemplo pelo e-mail exato:

```sql
insert into public.gepaa_admins (user_id, email)
select id, email
from auth.users
where lower(email) = lower('professora@exemplo.com')
on conflict (user_id) do update set email = excluded.email;
```

10. Publique a raiz do projeto no GitHub Pages. O formulário fica em `/` e a administração em `/admin.html`.
11. Teste primeiro uma avaliação fictícia. Depois entre em `/admin.html` com a conta autorizada e confira os dados e a exportação.

## O que cada página faz

- `index.html`: formulário dos participantes. As perguntas e alternativas seguem o PDF GEPAA 2026 fornecido. A opção de turno **Noite** foi incluída para corresponder ao documento.
- `admin.html`: área administrativa com login, indicadores, gráficos, respostas individuais, exportação DOCX e CSV.
- `database/supabase.js`: inicializa o cliente Supabase no navegador.
- `supabase/schema.sql`: cria tabelas, privilégios e políticas RLS.
- `reports/gerar-relatorio.js`: monta o relatório Word e incorpora imagens dos gráficos.

## Segurança — leia antes de tornar público

- O repositório GitHub Pages é público: todo HTML, CSS e JavaScript pode ser visto.
- A **Publishable key** é usada no navegador e pode ficar pública somente porque as tabelas têm RLS e privilégios restritos.
- Nunca publique `sb_secret_...`, `service_role`, senha de banco, senha da professora ou tokens privados.
- A tabela `gepaa_responses` permite ao visitante anônimo somente inserir uma avaliação. Não há política pública de leitura, alteração ou exclusão.
- Somente contas cujo `user_id` esteja em `gepaa_admins` podem consultar as respostas. O painel verifica a autorização e o banco reforça a mesma regra com RLS.
- O painel não oferece cadastro aberto. Contas são criadas/convidadas pelo Dashboard do Supabase.
- O acesso público à inserção pode receber spam ou envios falsos. Para divulgação ampla, considere configurar CAPTCHA/bot detection ou uma Edge Function com validação server-side e limitação de taxa.
- Defina com a instituição a finalidade, prazo de retenção, responsáveis e política de tratamento dos dados. Evite pedir nomes, matrícula ou informações que identifiquem participantes.

## Limites importantes

- O painel carrega até 5.000 registros por consulta. Para um volume maior, será necessário adicionar paginação.
- A geração DOCX ocorre no navegador da pessoa autenticada. Os gráficos são incorporados como imagens PNG no Word.
- As bibliotecas Supabase, Chart.js e docx são carregadas de CDNs. O navegador precisa de conexão com a internet.
- Não há notificação automática por e-mail nesta versão; o foco é consultar e exportar dados no painel.
- GitHub Pages não executa backend. O armazenamento e o controle de acesso são executados pelo Supabase.

## Fontes técnicas

- Supabase JS no CDN: https://supabase.com/docs/reference/javascript/installing
- Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Convite de usuários: https://supabase.com/docs/guides/auth/users
- Chart.js CDN e uso: https://www.chartjs.org/docs/latest/getting-started/installation
- docx para navegador: https://docx.js.org/api/
