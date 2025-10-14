# 🔐 Configuração de Acesso via SSH para o Repositório

## 📌 Objetivo
Este guia tem como objetivo padronizar o acesso ao repositório da **Organization `CareerFlow-Inc`** utilizando **SSH**, garantindo maior segurança e praticidade para todos os times de desenvolvimento.

---

## 🚀 1. Verificar se já possui uma chave SSH configurada

Abra o terminal e execute:
```bash
ls -al ~/.ssh
```
Se aparecerem arquivos como `id_rsa` e `id_rsa.pub`, você já possui uma chave SSH configurada.

Se **não houver**, siga para o próximo passo.

---

## 🗝️ 2. Gerar uma nova chave SSH

Execute o comando abaixo (substitua pelo seu e-mail do GitHub):
```bash
ssh-keygen -t ed25519 -C "seu_email@exemplo.com"
```
Se o seu sistema não suportar **ed25519**, use:
```bash
ssh-keygen -t rsa -b 4096 -C "seu_email@exemplo.com"
```

Quando for solicitado o caminho de armazenamento, apenas pressione **Enter** para usar o padrão.

Você pode definir uma **passphrase** (senha) para mais segurança, mas não é obrigatório.

---

## 📋 3. Adicionar a chave SSH ao agente

Inicie o agente SSH:
```bash
eval "$(ssh-agent -s)"
```

Adicione sua chave privada ao agente:
```bash
ssh-add ~/.ssh/id_ed25519
```

---

## 🔗 4. Copiar a chave pública

Execute o comando:
```bash
cat ~/.ssh/id_ed25519.pub
```

Copie a saída do terminal (toda a linha que começa com `ssh-ed25519` ou `ssh-rsa`).

---

## 🧩 5. Adicionar a chave SSH ao GitHub

1. Acesse o GitHub.  
2. Vá em **Settings > SSH and GPG Keys**.  
3. Clique em **New SSH key**.  
4. Cole sua chave no campo e salve.

---

## 🧠 6. Testar a conexão

Verifique se a autenticação está funcionando:
```bash
ssh -T git@github.com
```

Você deve ver algo como:
```
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## 📁 7. Configurar o repositório remoto com SSH

Se você já clonou o repositório com HTTPS, altere para SSH com:

```bash
git remote set-url origin git@github.com:CareerFlow-Inc/CareerFlow.git
```

Para confirmar a alteração:
```bash
git remote -v
```

O retorno deve ser algo como:
```
origin  git@github.com:CareerFlow-Inc/CareerFlow.git (fetch)
origin  git@github.com:CareerFlow-Inc/CareerFlow.git (push)
```

---

## 🧩 8. Clonar o repositório diretamente com SSH (opcional)

Se ainda não tiver clonado:
```bash
git clone git@github.com:CareerFlow-Inc/CareerFlow.git
```

---

## ✅ Conclusão

Agora todos os desenvolvedores poderão contribuir de forma segura e padronizada utilizando **SSH**.
